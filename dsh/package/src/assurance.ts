import type {
  AssuranceObligation,
  AssuranceResult,
  AssuranceViolation,
  InformationAuthority,
} from './contract.js'

const AUTHORITY_RANK: Record<InformationAuthority, number> = {
  AUTHORITATIVE: 4,
  DERIVED: 3,
  INFERRED: 2,
  ADVISORY: 1,
}

/**
 * Check typed semantic obligations without adding world information.
 * @param obligations - proposal-local mechanical checks.
 * @returns the aggregate assurance verdict and any violations.
 */
export function assessObligations(obligations: readonly AssuranceObligation[]): AssuranceResult {
  const violations: AssuranceViolation[] = []
  obligations.forEach((obligation, index) => {
    const message = violationMessage(obligation)
    if (message !== undefined) {
      violations.push({ index, kind: obligation.kind, label: obligation.label, message })
    }
  })
  return {
    verdict: violations.length === 0 ? 'PASS' : 'FAIL',
    checked: obligations.length,
    violations,
  }
}

function violationMessage(obligation: AssuranceObligation): string | undefined {
  switch (obligation.kind) {
    case 'PRESERVE_UNKNOWN':
      return obligation.inputs.includes('UNKNOWN') && obligation.conclusion !== 'UNKNOWN'
        ? 'A conclusion that still depends on UNKNOWN must remain UNKNOWN.'
        : undefined
    case 'REQUIRE_TRUE_GUARD':
      return obligation.decision === 'EXECUTE' && obligation.guard !== 'TRUE'
        ? 'A protected action requires a guard known to be TRUE.'
        : undefined
    case 'DISTINGUISH_ABSENCE':
      return obligation.observed === 'UNKNOWN' && obligation.asserted === 'KNOWN_ABSENT'
        ? 'UNKNOWN cannot be asserted as KNOWN_ABSENT.'
        : undefined
    case 'PRESERVE_AUTHORITY':
      return AUTHORITY_RANK[obligation.assertedAuthority] > AUTHORITY_RANK[obligation.sourceAuthority]
        ? `${obligation.sourceAuthority} information cannot be promoted to ${obligation.assertedAuthority}.`
        : undefined
    case 'PROTECT_FRAME':
      return obligation.changed && !obligation.approved
        ? 'A protected-frame change requires explicit approval.'
        : undefined
  }
}
