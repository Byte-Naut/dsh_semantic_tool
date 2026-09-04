import assert from 'node:assert/strict'
import test from 'node:test'
import { assessObligations } from '../src/assurance.js'

test('rejects each typed semantic violation without supplying new facts', () => {
  const result = assessObligations([
    {
      kind: 'PRESERVE_UNKNOWN',
      label: 'transitioning',
      inputs: ['KNOWN_VALUE', 'UNKNOWN'],
      conclusion: 'TRUE',
    },
    {
      kind: 'REQUIRE_TRUE_GUARD',
      label: 'replace provider',
      guard: 'UNKNOWN',
      decision: 'EXECUTE',
    },
    {
      kind: 'DISTINGUISH_ABSENCE',
      label: 'active run',
      observed: 'UNKNOWN',
      asserted: 'KNOWN_ABSENT',
    },
    {
      kind: 'PRESERVE_AUTHORITY',
      label: 'suggested constraint',
      sourceAuthority: 'ADVISORY',
      assertedAuthority: 'AUTHORITATIVE',
    },
    {
      kind: 'PROTECT_FRAME',
      label: 'auxiliary consumer',
      changed: true,
      approved: false,
    },
  ])

  assert.equal(result.verdict, 'FAIL')
  assert.equal(result.checked, 5)
  assert.deepEqual(result.violations.map(violation => violation.kind), [
    'PRESERVE_UNKNOWN',
    'REQUIRE_TRUE_GUARD',
    'DISTINGUISH_ABSENCE',
    'PRESERVE_AUTHORITY',
    'PROTECT_FRAME',
  ])
})

test('accepts a proposal that preserves uncertainty, authority, and frame', () => {
  const result = assessObligations([
    {
      kind: 'PRESERVE_UNKNOWN',
      label: 'transitioning',
      inputs: ['KNOWN_VALUE', 'UNKNOWN'],
      conclusion: 'UNKNOWN',
    },
    {
      kind: 'REQUIRE_TRUE_GUARD',
      label: 'replace provider',
      guard: 'UNKNOWN',
      decision: 'DEFER',
    },
    {
      kind: 'DISTINGUISH_ABSENCE',
      label: 'active run',
      observed: 'UNKNOWN',
      asserted: 'UNKNOWN',
    },
    {
      kind: 'PRESERVE_AUTHORITY',
      label: 'suggested constraint',
      sourceAuthority: 'ADVISORY',
      assertedAuthority: 'ADVISORY',
    },
    {
      kind: 'PROTECT_FRAME',
      label: 'auxiliary consumer',
      changed: false,
      approved: false,
    },
  ])

  assert.deepEqual(result, { verdict: 'PASS', checked: 5, violations: [] })
})
