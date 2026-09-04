import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const authoredRoots = [
  'README.md',
  'STATUS.md',
  'spec',
  'portable',
  'dsh',
  'examples',
  'docs',
  'delivery',
  'research/README.md',
  'research/claims',
]

const markdownFiles = []
for (const entry of authoredRoots) {
  const path = resolve(root, entry)
  if (extname(path) === '.md') markdownFiles.push(path)
  else markdownFiles.push(...await collectMarkdown(path))
}

for (const path of markdownFiles) {
  const text = await readFile(path, 'utf8')
  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const rawTarget = match[1]
    if (rawTarget === undefined || /^(?:https?:|mailto:|#)/.test(rawTarget)) continue
    const target = rawTarget.split('#', 1)[0]
    if (target === undefined || target.length === 0) continue
    try {
      await access(resolve(dirname(path), target))
    } catch {
      throw new Error(`${relative(root, path)}: broken link ${rawTarget}`)
    }
  }
}

const manifest = JSON.parse(await readFile(resolve(root, 'research/MANIFEST.json'), 'utf8'))
if (manifest.activeSourceOfTruth !== 'spec/semantic-contract.md') {
  throw new Error('research manifest does not name the canonical semantic contract')
}

const productText = await Promise.all(markdownFiles.map(path => readFile(path, 'utf8')))
const primaryText = await readFile(resolve(root, 'README.md'), 'utf8')
if (/research\/original-artifacts\/[^)\s]+\.zip/.test(primaryText)) {
  throw new Error('primary README exposes a per-experiment archive')
}
for (const forbidden of [
  'proven capability enhancer',
  'proven correctness enhancer',
  'semantic interface moves the correctness capability boundary',
  'Cordis replacement is implemented',
]) {
  if (productText.some(text => text.toLowerCase().includes(forbidden.toLowerCase()))) {
    throw new Error(`stale product claim: ${forbidden}`)
  }
}

const pluginSource = await readFile(resolve(root, 'dsh/package/src/index.ts'), 'utf8')
if (/export\s+default/.test(pluginSource)) throw new Error('dsh function plugin must not default-export')
for (const namedExport of ['name', 'inject', 'apply']) {
  if (!new RegExp(`export const ${namedExport}|export function ${namedExport}`).test(pluginSource)) {
    throw new Error(`dsh function plugin is missing named export ${namedExport}`)
  }
}

const requiredRaw = [
  'cordis-semantic-mirror-poc-v0.1.zip',
  'cordis-semantic-mirror-poc-v0.2.zip',
  'cordis-agent-interface-ab-pilot-v0.1.zip',
  'cordis-agent-interface-benchmark-v2-results.zip',
  'cordis-agent-interface-benchmark-v2.1-results.zip',
  'cordis-agent-interface-heldout-replication-v2.1-results.zip',
  'cordis-agent-semantic-discipline-e3-v0.1-results.zip',
  'cordis-agent-semantic-discipline-e3-v0.2-results.zip',
  'cordis-agent-semantic-discipline-e3-depth-v0.3-results.zip',
  'cordis-agent-capability-boundary-e4-v0.1.zip',
  'final-analysis.json',
]
for (const name of requiredRaw) await access(resolve(root, 'research/original-artifacts', name))

process.stdout.write(`validated ${markdownFiles.length} authored Markdown files, product claims, package exports, and ${requiredRaw.length} raw artifacts\n`)

async function collectMarkdown(directory) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'lib') continue
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) output.push(...await collectMarkdown(path))
    else if (entry.isFile() && entry.name.endsWith('.md')) output.push(path)
  }
  return output
}
