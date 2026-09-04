import assert from 'node:assert/strict'
import test from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import DynamicCordisRunnerService from '@deepseek-ai/dsh-cordis-host-runner'
import { SemanticObserver } from '../src/collector.js'

test('projects service, binding, dependency, and effect state from a real Cordis runtime', async () => {
  const root = new Context()
  const provider = root.plugin({
    name: 'clock-provider',
    apply(ctx) {
      ctx.provide('clock', Object.freeze({ now: () => 42 }))
      ctx.effect(() => () => {}, 'provider-audit')
    },
  })
  await provider
  const consumer = root.plugin({
    name: 'clock-consumer',
    inject: ['clock'],
    apply(ctx) {
      void (ctx as unknown as { clock: unknown }).clock
      ctx.effect(() => () => {}, 'consumer-loop')
    },
  })
  await consumer

  const observer = new SemanticObserver(root, 'runtime:test')
  const slice = observer.capture(undefined, 'clock')
  const consumerRecord = slice.components.find(component => component.name === 'clock-consumer')
  const providerRecord = slice.components.find(component => component.name === 'clock-provider')
  assert.ok(consumerRecord)
  assert.ok(providerRecord)
  assert.equal(slice.selection.matched, true)

  const binding = slice.bindings.find(candidate =>
    candidate.consumerId === consumerRecord.id && candidate.service === 'clock')
  assert.ok(binding)
  assert.equal(binding.target.status, 'KNOWN_VALUE')
  assert.equal(binding.committed.status, 'KNOWN_VALUE')
  assert.deepEqual(binding.target, binding.committed)

  const dependency = slice.dependencies.find(candidate =>
    candidate.consumerId === consumerRecord.id && candidate.service === 'clock')
  assert.ok(dependency)
  assert.deepEqual(dependency.targetProviderId, { status: 'KNOWN_VALUE', value: providerRecord.id })

  const service = slice.services.find(candidate => candidate.key === 'clock')
  assert.ok(service)
  assert.equal(service.providerId, providerRecord.id)
  assert.equal(service.visible, true)
  assert.ok(slice.effects.some(effect => effect.ownerId === consumerRecord.id && effect.label === 'consumer-loop'))
  assert.equal(slice.coverage.find(entry => entry.domain === 'dynamic_packages')?.status, 'UNAVAILABLE')

  await consumer.dispose()
  await provider.dispose()
  await root.fiber.dispose()
})

test('returns an empty, explicit selection for an unmatched focus', async () => {
  const root = new Context()
  const slice = new SemanticObserver(root, 'runtime:test-unmatched').capture(undefined, 'missing-component')
  assert.deepEqual(slice.selection, { focus: 'missing-component', matched: false })
  assert.equal(slice.components.length, 0)
  assert.ok(slice.coverage.length > 0)
  await root.fiber.dispose()
})

test('keeps last-successful package, failed target, and active run independent', async () => {
  const root = new Context()
  const disposeTools = root.provide('tools', Object.freeze({}))
  const runnerFiber = root.plugin(DynamicCordisRunnerService)
  await runnerFiber
  const agent = Object.freeze({
    id: 'session:semantic-test',
    steer() {},
    inject() {},
  }) as unknown as Agent

  const first = root.dynamicCordisRunner.define({
    sessionId: agent.id,
    plugin: { kind: 'new', idPrefix: 'sem' },
    name: 'v1',
    purpose: 'semantic package-state test',
    code: { host: 'return { apply() {} }' },
  })
  const firstRun = await root.dynamicCordisRunner.run(agent, first.pluginId, first.packageId, 'run')
  assert.equal(firstRun.ok, true)

  const second = root.dynamicCordisRunner.define({
    sessionId: agent.id,
    plugin: { kind: 'existing', pluginId: first.pluginId },
    name: 'v2',
    purpose: 'semantic package-state test',
    code: { host: 'throw new Error("expected activation failure")' },
  })
  const failed = await root.dynamicCordisRunner.run(agent, first.pluginId, second.packageId, 'update')
  assert.equal(failed.ok, false)

  const slice = new SemanticObserver(root, 'runtime:dynamic-test').capture(agent, String(first.pluginId))
  assert.equal(slice.selection.matched, true)
  assert.equal(slice.dynamicPlugins.length, 1)
  const plugin = slice.dynamicPlugins[0]
  assert.ok(plugin)
  assert.deepEqual(plugin.lastSuccessfulPackage, { status: 'KNOWN_VALUE', value: String(first.packageId) })
  assert.deepEqual(plugin.nextTargetPackage, { status: 'KNOWN_VALUE', value: String(second.packageId) })
  assert.deepEqual(plugin.activeRun, { status: 'KNOWN_ABSENT' })
  assert.equal(plugin.latestAttempt.status, 'KNOWN_VALUE')
  if (plugin.latestAttempt.status === 'KNOWN_VALUE') assert.equal(plugin.latestAttempt.value.status, 'failed')

  await runnerFiber.dispose()
  disposeTools()
  await root.fiber.dispose()
})

test('preserves target and committed bindings during a real LOADING replacement', async () => {
  const root = new Context()
  const started = Promise.withResolvers<void>()
  const release = Promise.withResolvers<void>()
  const providerPlugin = (version: string) => ({
    name: `replace-provider-${version}`,
    apply(ctx: Context) {
      ctx.provide('replaceable', Object.freeze({ version }))
    },
  })

  const providerV1 = root.plugin(providerPlugin('v1'))
  await providerV1
  const consumer = root.plugin({
    name: 'loading-consumer',
    inject: ['replaceable'],
    async apply(ctx) {
      void (ctx as unknown as { replaceable: unknown }).replaceable
      started.resolve()
      await release.promise
    },
  })
  await started.promise

  const providerV1Disposal = providerV1.dispose()
  await waitFor(() => root.reflect._getImpl('replaceable', false) === undefined)
  const providerV2 = root.plugin(providerPlugin('v2'))
  await providerV2

  const slice = new SemanticObserver(root, 'runtime:replacement-test').capture(undefined, 'replaceable')
  const consumerRecord = slice.components.find(component => component.name === 'loading-consumer')
  assert.ok(consumerRecord)
  assert.equal(consumerRecord.state, 'LOADING')
  const binding = slice.bindings.find(candidate => candidate.consumerId === consumerRecord.id)
  assert.ok(binding)
  assert.equal(binding.target.status, 'KNOWN_VALUE')
  assert.equal(binding.committed.status, 'KNOWN_VALUE')
  if (binding.target.status === 'KNOWN_VALUE' && binding.committed.status === 'KNOWN_VALUE') {
    assert.notEqual(binding.target.value, binding.committed.value)
  }
  assert.ok(slice.components.some(component =>
    component.name === 'replace-provider-v1' && component.liveness === 'RETAINED_TOMBSTONE'))
  assert.ok(slice.components.some(component =>
    component.name === 'replace-provider-v2' && component.liveness === 'LIVE'))

  release.resolve()
  await Promise.all([consumer.await(), providerV1Disposal])
  await consumer.dispose()
  await providerV2.dispose()
  await root.fiber.dispose()
})

async function waitFor(predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (predicate()) return
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  throw new Error('timed out waiting for Cordis lifecycle state')
}
