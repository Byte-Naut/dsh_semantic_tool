import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { DynamicCordisSnapshotRow } from '@deepseek-ai/dsh-cordis-host-runner'
import type {
  BindingRecord,
  ComponentRecord,
  DependencyRecord,
  DomainCoverage,
  DynamicPluginRecord,
  EffectRecord,
  Knowledge,
  ProvenanceRecord,
  SemanticSlice,
  ServiceRecord,
} from './contract.js'
import { ADAPTER_VERSION, CONTRACT_VERSION, knownAbsent, knownValue, unknown } from './contract.js'

interface FiberLike {
  uid: number | null
  name: string
  state: number
  inertia?: unknown
  ctx: Context & { agent?: Agent }
  parent?: { fiber?: FiberLike }
  inject?: Record<string, unknown>
  store?: Record<string, unknown>
  _store?: Record<string, unknown>
  getEffects(): EffectLike[]
}

interface EffectLike {
  label: string
  children: EffectLike[]
}

interface ServiceImplementationLike {
  name?: string
  fiber?: FiberLike
}

interface ObservedService {
  name: string
  provider: FiberLike
  registered: boolean
  provenance: 'cordis-services' | 'cordis-bindings'
}

interface RuntimeLike {
  name?: string
  fibers: Iterable<FiberLike>
}

interface RootLike {
  fiber: FiberLike
  registry: { entries(): Iterable<[object, RuntimeLike]> }
  reflect: { store: Record<PropertyKey, unknown> }
}

interface DynamicRunnerLike {
  snapshot(agent: Agent): DynamicCordisSnapshotRow[]
}

const IN_FLIGHT_STATES = new Set(['awaiting-approval', 'starting-host', 'client-pending'])

/** Process-local semantic observer with stable object identities across captures. */
export class SemanticObserver {
  readonly #ctx: Context
  readonly #runtimeId: string
  readonly #ids = new WeakMap<object, string>()
  #nextId = 1
  #sequence = 0

  constructor(ctx: Context, runtimeId = `runtime:${process.pid}:${randomUUID()}`) {
    this.#ctx = ctx
    this.#runtimeId = runtimeId
  }

  /**
   * Capture one current-Agent semantic slice.
   * @param agent - optional Agent identity used to scope dynamic state.
   * @param focus - optional identity or service text used to select a connected slice.
   * @returns a source-free semantic state snapshot.
   */
  capture(agent?: Agent, focus?: string): SemanticSlice {
    const sequence = ++this.#sequence
    const snapshotId = `snapshot:${this.#runtimeId}:${sequence}`
    const root = this.#ctx.root as unknown as RootLike
    const provenance = provenanceRecords(snapshotId)
    const components: ComponentRecord[] = []
    const dependencies: DependencyRecord[] = []
    const bindings: BindingRecord[] = []
    const services: ServiceRecord[] = []
    const effects: EffectRecord[] = []
    const liveFibers = this.#liveFibers(root, agent)
    const liveFiberSet = new Set(liveFibers)
    const serviceImplementations = this.#serviceImplementations(root, liveFibers)
    let bindingsObservable = true

    for (const fiber of liveFibers) {
      const componentId = this.#fiberId(fiber)
      components.push({
        id: componentId,
        name: fiber.name,
        kind: fiber === root.fiber ? 'ROOT' : 'PLUGIN',
        state: stateName(fiber.state),
        liveness: 'LIVE',
        parentId: fiber.parent?.fiber === undefined || fiber.parent.fiber === fiber
          ? knownAbsent()
          : knownValue(this.#fiberId(fiber.parent.fiber)),
        provenanceId: `${snapshotId}:cordis-fibers`,
      })

      const targetStore = recordOrUndefined(fiber._store)
      const committedStore = recordOrUndefined(fiber.store)
      const injectedServices = Object.keys(fiber.inject ?? {})
      if (injectedServices.length > 0 && (targetStore === undefined || committedStore === undefined)) {
        bindingsObservable = false
      }
      for (const service of injectedServices) {
        const target = bindingKnowledge(
          targetStore,
          service,
          value => this.#rememberService(value, service, false, serviceImplementations),
        )
        const committed = bindingKnowledge(
          committedStore,
          service,
          value => this.#rememberService(value, service, false, serviceImplementations),
        )
        bindings.push({
          consumerId: componentId,
          service,
          target,
          committed,
          provenanceId: `${snapshotId}:cordis-bindings`,
        })
        dependencies.push({
          consumerId: componentId,
          service,
          required: true,
          targetProviderId: target.status === 'KNOWN_VALUE'
            ? providerKnowledge(serviceImplementations.get(target.value), provider => this.#fiberId(provider))
            : target,
          provenanceId: `${snapshotId}:cordis-bindings`,
        })
      }

      this.#collectEffects(fiber, componentId, snapshotId, effects)
    }

    const componentIds = new Set(components.map(component => component.id))
    for (const data of serviceImplementations.values()) {
      if (liveFiberSet.has(data.provider)) continue
      const id = this.#fiberId(data.provider)
      if (componentIds.has(id)) continue
      componentIds.add(id)
      components.push({
        id,
        name: data.provider.name,
        kind: 'PLUGIN',
        state: stateName(data.provider.state),
        liveness: 'RETAINED_TOMBSTONE',
        parentId: data.provider.parent?.fiber === undefined || data.provider.parent.fiber === data.provider
          ? knownAbsent()
          : knownValue(this.#fiberId(data.provider.parent.fiber)),
        provenanceId: `${snapshotId}:cordis-bindings`,
      })
    }

    for (const [implementationId, data] of serviceImplementations.entries()) {
      services.push({
        id: implementationId,
        key: data.name,
        providerId: this.#fiberId(data.provider),
        registered: data.registered,
        visible: data.registered && stateName(data.provider.state) === 'ACTIVE',
        provenanceId: `${snapshotId}:${data.provenance}`,
      })
    }

    const dynamic = this.#dynamicPlugins(agent, snapshotId)
    if (dynamic.available) {
      provenance.push({
        id: `${snapshotId}:dynamic-packages`,
        authority: 'AUTHORITATIVE',
        sourceKind: 'RUNTIME',
        source: 'dsh DynamicCordisRunner.snapshot(agent)',
        snapshotId,
        coverageDomain: 'dynamic_packages',
      })
    }
    const coverage = coverageRecords(bindingsObservable, dynamic.available)
    const inFlight = liveFibers.some(fiber => fiber.inertia !== undefined)
      || dynamic.rows.some(row => IN_FLIGHT_STATES.has(row.latestAttempt.status === 'KNOWN_VALUE'
        ? row.latestAttempt.value.status
        : ''))

    const full: SemanticSlice = {
      contractVersion: CONTRACT_VERSION,
      adapterVersion: ADAPTER_VERSION,
      runtimeId: this.#runtimeId,
      snapshotId,
      sequence,
      phase: inFlight ? 'IN_FLIGHT' : 'COMMITTED',
      selection: { focus: focus ?? null, matched: focus === undefined },
      coverage,
      components: sortById(components),
      dependencies: sortDependencies(dependencies),
      bindings: sortBindings(bindings),
      services: sortById(services),
      effects: sortById(effects),
      dynamicPlugins: [...dynamic.rows].sort((a, b) => compare(a.pluginId, b.pluginId)),
      provenance,
    }
    return focus === undefined ? full : selectFocus(full, focus)
  }

  #liveFibers(root: RootLike, agent: Agent | undefined): FiberLike[] {
    const fibers = new Set<FiberLike>([root.fiber])
    for (const [, runtime] of root.registry.entries()) {
      for (const fiber of runtime.fibers) {
        const owner = contextAgent(fiber.ctx)
        if (owner === undefined || (agent !== undefined && owner === agent)) fibers.add(fiber)
      }
    }
    return [...fibers]
  }

  #serviceImplementations(
    root: RootLike,
    visibleFibers: readonly FiberLike[],
  ): Map<string, ObservedService> {
    const visible = new Set(visibleFibers)
    const implementations = new Map<string, ObservedService>()
    for (const key of Reflect.ownKeys(root.reflect.store)) {
      const raw = root.reflect.store[key]
      if (!isObject(raw)) continue
      const candidate = raw as ServiceImplementationLike
      if (candidate.fiber === undefined || !visible.has(candidate.fiber)) continue
      this.#rememberService(raw, typeof candidate.name === 'string' ? candidate.name : String(key), true, implementations)
    }
    return implementations
  }

  #dynamicPlugins(
    agent: Agent | undefined,
    snapshotId: string,
  ): { available: boolean; rows: DynamicPluginRecord[] } {
    const runner = this.#ctx.get('dynamicCordisRunner') as DynamicRunnerLike | undefined
    if (runner === undefined || agent === undefined) return { available: false, rows: [] }
    const rows = runner.snapshot(agent).map(row => ({
      pluginId: String(row.pluginId),
      packages: row.packages.map(pkg => ({
        packageId: String(pkg.packageId),
        name: pkg.name,
        purpose: pkg.purpose,
        hasHostHalf: pkg.hasHostHalf,
        hasClientHalf: pkg.hasClientHalf,
      })),
      lastSuccessfulPackage: row.currentPackageId === undefined
        ? knownAbsent<string>()
        : knownValue(String(row.currentPackageId)),
      nextTargetPackage: row.nextPackageId === undefined
        ? knownAbsent<string>()
        : knownValue(String(row.nextPackageId)),
      activeRun: row.activeRun === undefined
        ? knownAbsent<{ runId: string; packageId: string }>()
        : knownValue({ runId: String(row.activeRun.pluginRunId), packageId: String(row.activeRun.packageId) }),
      latestAttempt: row.latestRun === undefined
        ? knownAbsent<{
          runId: string
          packageId: string
          status: string
          hostStatus: string
          clientStatus: string
        }>()
        : knownValue({
          runId: String(row.latestRun.pluginRunId),
          packageId: String(row.latestRun.packageId),
          status: row.latestRun.status,
          hostStatus: row.latestRun.host.status,
          clientStatus: row.latestRun.client.status,
        }),
      provenanceId: `${snapshotId}:dynamic-packages`,
    }))
    return { available: true, rows }
  }

  #collectEffects(fiber: FiberLike, ownerId: string, snapshotId: string, output: EffectRecord[]): void {
    const walk = (effect: EffectLike, parentId?: string): void => {
      const id = this.#objectId(effect, 'effect')
      output.push({
        id,
        ownerId,
        label: effect.label,
        parentId: parentId === undefined ? knownAbsent() : knownValue(parentId),
        status: 'REGISTERED',
        provenanceId: `${snapshotId}:cordis-effects`,
      })
      for (const child of effect.children) walk(child, id)
    }
    for (const effect of fiber.getEffects()) walk(effect)
  }

  #fiberId(fiber: FiberLike): string {
    const existing = this.#ids.get(fiber as object)
    if (existing !== undefined) return existing
    const id = fiber.uid === null
      ? this.#mint('fiber')
      : `fiber:${this.#runtimeId}:${fiber.uid}`
    this.#ids.set(fiber as object, id)
    return id
  }

  #serviceId(value: unknown): string {
    if (!isObject(value)) throw new TypeError('Cordis binding did not contain a service implementation object')
    return this.#objectId(value, 'service')
  }

  #rememberService(
    value: unknown,
    fallbackName: string,
    registered: boolean,
    implementations: Map<string, ObservedService>,
  ): string {
    if (!isObject(value)) throw new TypeError('Cordis binding did not contain a service implementation object')
    const implementation = value as ServiceImplementationLike
    if (implementation.fiber === undefined) {
      throw new TypeError('Cordis service implementation did not expose its provider fiber')
    }
    const id = this.#serviceId(value)
    const existing = implementations.get(id)
    implementations.set(id, {
      name: typeof implementation.name === 'string' ? implementation.name : existing?.name ?? fallbackName,
      provider: implementation.fiber,
      registered: registered || existing?.registered === true,
      provenance: registered ? 'cordis-services' : existing?.provenance ?? 'cordis-bindings',
    })
    return id
  }

  #objectId(value: object, kind: string): string {
    const existing = this.#ids.get(value)
    if (existing !== undefined) return existing
    const id = this.#mint(kind)
    this.#ids.set(value, id)
    return id
  }

  #mint(kind: string): string {
    return `${kind}:${this.#runtimeId}:${this.#nextId++}`
  }
}

function bindingKnowledge(
  store: Record<string, unknown> | undefined,
  service: string,
  identity: (value: unknown) => string,
): Knowledge<string> {
  if (store === undefined) return unknown('binding store is not observable at the pinned Cordis seam')
  const value = store[service]
  if (value === undefined) return knownAbsent()
  try {
    return knownValue(identity(value))
  } catch (error: unknown) {
    return unknown(error instanceof Error ? error.message : 'service implementation identity is not observable')
  }
}

function providerKnowledge(
  implementation: { provider: FiberLike } | undefined,
  identity: (provider: FiberLike) => string,
): Knowledge<string> {
  if (implementation === undefined) {
    return unknown('binding identity was observed but its provider was outside the visible service scope')
  }
  return knownValue(identity(implementation.provider))
}

function stateName(state: number): string {
  const names = ['PENDING', 'LOADING', 'ACTIVE', 'FAILED', 'DISPOSED', 'UNLOADING']
  return names[state] ?? `UNKNOWN_${String(state)}`
}

function provenanceRecords(snapshotId: string): ProvenanceRecord[] {
  const sources = [
    ['cordis-fibers', 'cordis Registry/Fiber', 'registry_fibers'],
    ['cordis-bindings', 'cordis Fiber injection stores', 'fiber_bindings'],
    ['cordis-services', 'cordis Reflect store', 'reflect_services'],
    ['cordis-effects', 'cordis Fiber.getEffects()', 'tracked_effects'],
  ] as const
  return sources.map(([suffix, source, coverageDomain]) => ({
    id: `${snapshotId}:${suffix}`,
    authority: 'AUTHORITATIVE',
    sourceKind: 'RUNTIME',
    source,
    snapshotId,
    coverageDomain,
  }))
}

function coverageRecords(bindingsObservable: boolean, dynamicAvailable: boolean): DomainCoverage[] {
  return [
    { domain: 'registry_fibers', status: 'COMPLETE', scope: 'current process, excluding other Agent-owned dynamic fibers' },
    { domain: 'reflect_services', status: 'COMPLETE', scope: 'visible fibers in the current process and Agent scope' },
    bindingsObservable
      ? { domain: 'fiber_bindings', status: 'COMPLETE', scope: 'declared injections on visible live fibers' }
      : {
          domain: 'fiber_bindings',
          status: 'PARTIAL',
          scope: 'declared injections on visible live fibers',
          reason: 'target or committed binding store is unavailable for at least one fiber',
        },
    { domain: 'tracked_effects', status: 'COMPLETE', scope: 'currently registered Cordis effects on visible live fibers' },
    { domain: 'effect_tombstones', status: 'UNAVAILABLE', scope: 'disposed effects', reason: 'the product adapter retains no disposed-effect objects' },
    dynamicAvailable
      ? { domain: 'dynamic_packages', status: 'COMPLETE', scope: 'current Agent session' }
      : { domain: 'dynamic_packages', status: 'UNAVAILABLE', scope: 'current Agent session', reason: 'Host runner or Agent identity is unavailable' },
    { domain: 'package_source', status: 'UNAVAILABLE', scope: 'dynamic package source', reason: 'semantic slice is source-free' },
    { domain: 'external_effect_truth', status: 'UNAVAILABLE', scope: 'external systems', reason: 'requires an explicit oracle' },
  ]
}

function selectFocus(slice: SemanticSlice, focus: string): SemanticSlice {
  const needle = focus.toLowerCase()
  const componentIds = new Set(
    slice.components
      .filter(component => matches(component.id, needle) || matches(component.name, needle))
      .map(component => component.id),
  )
  const serviceIds = new Set(
    slice.services
      .filter(service => matches(service.id, needle) || matches(service.key, needle))
      .map(service => service.id),
  )
  for (const service of slice.services) {
    if (serviceIds.has(service.id)) componentIds.add(service.providerId)
  }
  for (const binding of slice.bindings) {
    if (matches(binding.service, needle)
      || (binding.target.status === 'KNOWN_VALUE' && serviceIds.has(binding.target.value))
      || (binding.committed.status === 'KNOWN_VALUE' && serviceIds.has(binding.committed.value))) {
      componentIds.add(binding.consumerId)
    }
  }

  let changed = true
  while (changed) {
    changed = false
    for (const dependency of slice.dependencies) {
      const provider = dependency.targetProviderId.status === 'KNOWN_VALUE'
        ? dependency.targetProviderId.value
        : undefined
      if (componentIds.has(dependency.consumerId) || (provider !== undefined && componentIds.has(provider))) {
        if (!componentIds.has(dependency.consumerId)) {
          componentIds.add(dependency.consumerId)
          changed = true
        }
        if (provider !== undefined && !componentIds.has(provider)) {
          componentIds.add(provider)
          changed = true
        }
      }
    }
  }

  const dynamicPlugins = slice.dynamicPlugins.filter(plugin =>
    matches(plugin.pluginId, needle)
    || plugin.packages.some(pkg => matches(pkg.packageId, needle) || matches(pkg.name, needle)),
  )
  const matched = componentIds.size > 0 || dynamicPlugins.length > 0 || serviceIds.size > 0
  return {
    ...slice,
    selection: { focus, matched },
    components: slice.components.filter(component => componentIds.has(component.id)),
    dependencies: slice.dependencies.filter(dependency => componentIds.has(dependency.consumerId)),
    bindings: slice.bindings.filter(binding => componentIds.has(binding.consumerId)),
    services: slice.services.filter(service =>
      componentIds.has(service.providerId) || serviceIds.has(service.id) || matches(service.key, needle)),
    effects: slice.effects.filter(effect => componentIds.has(effect.ownerId)),
    dynamicPlugins,
  }
}

function recordOrUndefined(value: unknown): Record<string, unknown> | undefined {
  return isObject(value) ? value as Record<string, unknown> : undefined
}

function contextAgent(ctx: Context): Agent | undefined {
  let cursor: object | null = ctx
  while (cursor !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(cursor, 'agent')
    if (descriptor !== undefined && 'value' in descriptor) return descriptor.value as Agent | undefined
    cursor = Object.getPrototypeOf(cursor) as object | null
  }
  return undefined
}

function isObject(value: unknown): value is object {
  return (typeof value === 'object' && value !== null) || typeof value === 'function'
}

function matches(value: string, needle: string): boolean {
  return value.toLowerCase().includes(needle)
}

function compare(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function sortById<T extends { id: string }>(values: T[]): T[] {
  return values.sort((left, right) => compare(left.id, right.id))
}

function sortBindings(values: BindingRecord[]): BindingRecord[] {
  return values.sort((left, right) =>
    compare(left.consumerId, right.consumerId) || compare(left.service, right.service))
}

function sortDependencies(values: DependencyRecord[]): DependencyRecord[] {
  return values.sort((left, right) =>
    compare(left.consumerId, right.consumerId) || compare(left.service, right.service))
}
