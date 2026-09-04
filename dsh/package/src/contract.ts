/** Framework-independent records projected from the active semantic contract. */

/** Active semantic contract version implemented by these records. */
export const CONTRACT_VERSION = '1.0.0' as const
/** dsh adapter version that produced a slice. */
export const ADAPTER_VERSION = '0.1.0' as const

/** Whether an observer established a value, established absence, or lacks evidence. */
export type EpistemicStatus = 'KNOWN_VALUE' | 'KNOWN_ABSENT' | 'UNKNOWN'
/** How completely one observer covers a declared domain and scope. */
export type CoverageStatus = 'COMPLETE' | 'PARTIAL' | 'UNAVAILABLE'
/** Responsibility class attached to one fact or judgment. */
export type InformationAuthority = 'AUTHORITATIVE' | 'DERIVED' | 'INFERRED' | 'ADVISORY'
/** Three-valued conclusion used by typed obligations. */
export type TruthStatus = 'TRUE' | 'FALSE' | 'UNKNOWN'

/** A value whose presence and absence remain explicit. */
export type Knowledge<T> =
  | { status: 'KNOWN_VALUE'; value: T }
  | { status: 'KNOWN_ABSENT' }
  | { status: 'UNKNOWN'; reason: string }

/** Declare one observer domain and the scope in which absence is meaningful. */
export interface DomainCoverage {
  domain: string
  status: CoverageStatus
  scope: string
  reason?: string
}

/** Trace a normalized record to one Host observation. */
export interface ProvenanceRecord {
  id: string
  authority: InformationAuthority
  sourceKind: 'RUNTIME' | 'DERIVATION' | 'ORACLE'
  source: string
  snapshotId: string
  coverageDomain: string
}

/** One live or binding-retained Cordis component. */
export interface ComponentRecord {
  id: string
  name: string
  kind: 'ROOT' | 'PLUGIN'
  state: string
  liveness: 'LIVE' | 'RETAINED_TOMBSTONE'
  parentId: Knowledge<string>
  provenanceId: string
}

/** One required service edge from a consumer to its target provider. */
export interface DependencyRecord {
  consumerId: string
  service: string
  required: true
  targetProviderId: Knowledge<string>
  provenanceId: string
}

/** Independent target and committed bindings for one declared injection. */
export interface BindingRecord {
  consumerId: string
  service: string
  target: Knowledge<string>
  committed: Knowledge<string>
  provenanceId: string
}

/** One service implementation and its current registration and visibility. */
export interface ServiceRecord {
  id: string
  key: string
  providerId: string
  registered: boolean
  visible: boolean
  provenanceId: string
}

/** One currently registered Cordis effect and its owner. */
export interface EffectRecord {
  id: string
  ownerId: string
  label: string
  parentId: Knowledge<string>
  status: 'REGISTERED'
  provenanceId: string
}

/** Source-free metadata for one immutable dynamic package. */
export interface DynamicPackageRecord {
  packageId: string
  name: string
  purpose: string
  hasHostHalf: boolean
  hasClientHalf: boolean
}

/** Independent version pointers, run, and latest attempt for one dynamic plugin. */
export interface DynamicPluginRecord {
  pluginId: string
  packages: DynamicPackageRecord[]
  lastSuccessfulPackage: Knowledge<string>
  nextTargetPackage: Knowledge<string>
  activeRun: Knowledge<{ runId: string; packageId: string }>
  latestAttempt: Knowledge<{
    runId: string
    packageId: string
    status: string
    hostStatus: string
    clientStatus: string
  }>
  provenanceId: string
}

/** Canonical output of the dsh Host adapter. It contains state, not a diagnosis. */
export interface SemanticSlice {
  contractVersion: typeof CONTRACT_VERSION
  adapterVersion: typeof ADAPTER_VERSION
  runtimeId: string
  snapshotId: string
  sequence: number
  phase: 'COMMITTED' | 'IN_FLIGHT' | 'UNKNOWN'
  selection: { focus: string | null; matched: boolean }
  coverage: DomainCoverage[]
  components: ComponentRecord[]
  dependencies: DependencyRecord[]
  bindings: BindingRecord[]
  services: ServiceRecord[]
  effects: EffectRecord[]
  dynamicPlugins: DynamicPluginRecord[]
  provenance: ProvenanceRecord[]
}

/** Closed mechanical checks accepted by the reference assurance tool. */
export type AssuranceObligation =
  | {
    kind: 'PRESERVE_UNKNOWN'
    label: string
    inputs: EpistemicStatus[]
    conclusion: TruthStatus
  }
  | {
    kind: 'REQUIRE_TRUE_GUARD'
    label: string
    guard: TruthStatus
    decision: 'EXECUTE' | 'DEFER'
  }
  | {
    kind: 'DISTINGUISH_ABSENCE'
    label: string
    observed: EpistemicStatus
    asserted: EpistemicStatus
  }
  | {
    kind: 'PRESERVE_AUTHORITY'
    label: string
    sourceAuthority: InformationAuthority
    assertedAuthority: InformationAuthority
  }
  | {
    kind: 'PROTECT_FRAME'
    label: string
    changed: boolean
    approved: boolean
  }

/** One failed mechanical obligation. */
export interface AssuranceViolation {
  index: number
  kind: AssuranceObligation['kind']
  label: string
  message: string
}

/** Aggregate result from a pure assurance pass. */
export interface AssuranceResult {
  verdict: 'PASS' | 'FAIL'
  checked: number
  violations: AssuranceViolation[]
}

/**
 * Construct a known value without erasing its epistemic status.
 * @param value - value established by the observer.
 * @returns a known-value carrier.
 */
export function knownValue<T>(value: T): Knowledge<T> {
  return { status: 'KNOWN_VALUE', value }
}

/**
 * Construct strong absence within complete coverage.
 * @returns a known-absence carrier.
 */
export function knownAbsent<T>(): Knowledge<T> {
  return { status: 'KNOWN_ABSENT' }
}

/**
 * Construct an observation gap with a concrete reason.
 * @param reason - why value and absence could not be established.
 * @returns an unknown carrier.
 */
export function unknown<T>(reason: string): Knowledge<T> {
  return { status: 'UNKNOWN', reason }
}
