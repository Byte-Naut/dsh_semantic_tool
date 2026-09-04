import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = resolve(root, 'research/checksums/SHA256SUMS.txt')
const excludedDirectories = new Set(['.git', 'node_modules', 'lib'])

const files = await collect(root)
const lines = []
for (const path of files) {
  if (path === manifestPath) continue
  const hash = createHash('sha256').update(await readFile(path)).digest('hex')
  lines.push(`${hash}  ${relative(root, path).replaceAll('\\', '/')}`)
}
await writeFile(manifestPath, `${lines.sort().join('\n')}\n`)
process.stdout.write(`wrote ${lines.length} checksums\n`)

async function collect(directory) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) output.push(...await collect(path))
    else if (entry.isFile()) output.push(path)
  }
  return output
}
