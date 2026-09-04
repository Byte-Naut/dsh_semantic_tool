import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parse } from 'yaml'

const skills = [
  ['portable/software-semantic-protocol/SKILL.md', 'software-semantic-protocol'],
  ['dsh/skill/software-semantic-design/SKILL.md', 'software-semantic-design'],
]

for (const [path, expectedName] of skills) {
  const text = await readFile(resolve(path), 'utf8')
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text)
  if (match === null) throw new Error(`${path}: missing YAML frontmatter`)
  const frontmatter = parse(match[1])
  if (frontmatter.name !== expectedName) throw new Error(`${path}: expected name ${expectedName}`)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name)) throw new Error(`${path}: invalid skill name`)
  if (typeof frontmatter.description !== 'string' || frontmatter.description.trim().length < 20) {
    throw new Error(`${path}: description is missing or too vague`)
  }
  if (text.includes('TODO') || text.includes('<skill-name>')) throw new Error(`${path}: unfinished scaffold marker`)
}

process.stdout.write(`validated ${skills.length} Skills\n`)
