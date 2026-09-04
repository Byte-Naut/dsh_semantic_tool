import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const checksumPath = resolve(root, 'research/checksums/SHA256SUMS.txt')
const checksumText = await readFile(checksumPath, 'utf8')
const lines = checksumText.trimEnd().split('\n').filter(Boolean)

for (const [index, line] of lines.entries()) {
  const match = /^([0-9a-f]{64})  (.+)$/.exec(line)
  if (match === null) throw new Error(`invalid checksum line ${index + 1}`)
  const [, expected, relativePath] = match
  const actual = createHash('sha256').update(await readFile(resolve(root, relativePath))).digest('hex')
  if (actual !== expected) throw new Error(`checksum mismatch: ${relativePath}`)
}

const researchManifest = JSON.parse(await readFile(resolve(root, 'research/MANIFEST.json'), 'utf8'))
for (const record of [
  ...researchManifest.formalSources,
  ...researchManifest.researchSources,
  ...researchManifest.rawEvidence,
  researchManifest.context,
]) {
  const actual = createHash('sha256').update(await readFile(resolve(root, record.path))).digest('hex')
  if (actual !== record.sha256) throw new Error(`frozen source mismatch: ${record.path}`)
}

process.stdout.write(`verified ${lines.length} package files and ${researchManifest.rawEvidence.length} raw evidence files\n`)
