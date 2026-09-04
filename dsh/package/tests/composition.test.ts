import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import { parse } from 'yaml'

interface EntryRecord {
  id: string
  name: string
  config?: unknown
}

test('loads the built function plugin through a real Cordis Loader composition', async () => {
  const here = dirname(fileURLToPath(import.meta.url))
  const configPath = resolve(here, 'fixtures/cordis.yml')
  const rows = parse(await readFile(configPath, 'utf8')) as EntryRecord[]
  const root = new Context()
  await root.plugin(Loader, { baseUrl: pathToFileURL(configPath).href })
  for (const row of rows) await root.loader.create(row)
  await root.loader.await()

  const assembly = await root.systemPrompt.assemble()
  assert.ok(assembly.tools.some(tool => tool.name === 'software_semantic_slice'))
  assert.ok(assembly.tools.some(tool => tool.name === 'software_semantic_assure'))
  assert.ok(assembly.sections.some(section => section.name === 'tool:software-semantic'))

  const result = await root.tools.execute({
    callId: 'composition-call' as never,
    name: 'software_semantic_slice',
    arguments: {},
    signal: AbortSignal.timeout(5_000),
  })
  if (result.isError) throw new Error(result.content.map(block => block.type === 'text' ? block.text : '').join('\n'))
  assert.equal(result.isError, false)
  const value = result.value as Record<string, unknown>
  assert.equal(value.contractVersion, '1.0.0')
  assert.ok(Array.isArray(value.coverage))

  await root.fiber.dispose()
})
