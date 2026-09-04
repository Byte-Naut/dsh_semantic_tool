import {
  assessObligations,
  knownValue,
  unknown,
} from '../../dsh/package/lib/src/index.js'

const slice = {
  targetBinding: knownValue('provider-v2'),
  committedBinding: unknown('the committed binding domain is not observed'),
}

const unsafe = assessObligations([
  {
    kind: 'PRESERVE_UNKNOWN',
    label: 'transitioning',
    inputs: [slice.targetBinding.status, slice.committedBinding.status],
    conclusion: 'TRUE',
  },
  {
    kind: 'REQUIRE_TRUE_GUARD',
    label: 'replace provider',
    guard: 'UNKNOWN',
    decision: 'EXECUTE',
  },
])

const safe = assessObligations([
  {
    kind: 'PRESERVE_UNKNOWN',
    label: 'transitioning',
    inputs: [slice.targetBinding.status, slice.committedBinding.status],
    conclusion: 'UNKNOWN',
  },
  {
    kind: 'REQUIRE_TRUE_GUARD',
    label: 'replace provider',
    guard: 'UNKNOWN',
    decision: 'DEFER',
  },
])

if (unsafe.verdict !== 'FAIL' || safe.verdict !== 'PASS') {
  throw new Error('semantic assurance demo failed')
}

process.stdout.write(`${JSON.stringify({ slice, unsafe, safe }, null, 2)}\n`)
