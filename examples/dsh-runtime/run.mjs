import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import { parse } from 'yaml'

const here = dirname(fileURLToPath(import.meta.url))
const configPath = resolve(here, 'cordis.yml')
const rows = parse(await readFile(configPath, 'utf8'))
const root = new Context()
await root.plugin(Loader, { baseUrl: pathToFileURL(configPath).href })
for (const row of rows) await root.loader.create(row)
await root.loader.await()

const provider = root.plugin({
  name: 'demo-provider',
  apply(ctx) {
    ctx.provide('demoService', Object.freeze({ version: 'v1' }))
    ctx.effect(() => () => {}, 'demo-provider-effect')
  },
})
await provider
const consumer = root.plugin({
  name: 'demo-consumer',
  inject: ['demoService'],
  apply(ctx) {
    void ctx.demoService
    ctx.effect(() => () => {}, 'demo-consumer-effect')
  },
})
await consumer

const result = await root.tools.execute({
  callId: 'demo-call',
  name: 'software_semantic_slice',
  arguments: { focus: 'demoService' },
  signal: AbortSignal.timeout(5_000),
})
if (result.isError) throw new Error(result.error.message)
const value = result.value
if (!value.selection.matched || value.components.length !== 2 || value.bindings.length !== 1) {
  throw new Error('dsh semantic slice did not match the external runtime fixture')
}

process.stdout.write(`${JSON.stringify({
  status: 'PASS',
  contractVersion: value.contractVersion,
  phase: value.phase,
  components: value.components.map(component => component.name),
  binding: value.bindings[0],
  dynamicPackageCoverage: value.coverage.find(entry => entry.domain === 'dynamic_packages'),
}, null, 2)}\n`)

await consumer.dispose()
await provider.dispose()
await root.fiber.dispose()
