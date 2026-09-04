# Semantic Contract Card

This card is a generated operational projection of [`../../../spec/semantic-contract.md`](../../../spec/semantic-contract.md). The specification remains authoritative.

## Epistemic carrier

| Status | Meaning |
|---|---|
| `KNOWN_VALUE(value)` | A value was established within declared coverage |
| `KNOWN_ABSENT` | Absence was established within complete relevant coverage |
| `UNKNOWN(reason)` | Neither value nor absence was established |

Never substitute `UNKNOWN` for `KNOWN_ABSENT` or collapse target and committed state.

## Information authority

`AUTHORITATIVE` → `DERIVED` → `INFERRED` → `ADVISORY` is not a promotion ladder. Only the owner or a new authoritative observation can raise authority.

## Mechanical obligations

- `PRESERVE_UNKNOWN`
- `REQUIRE_TRUE_GUARD`
- `DISTINGUISH_ABSENCE`
- `PRESERVE_AUTHORITY`
- `PROTECT_FRAME`
- `CONFORM_DELTA`

## Review outcomes

- `SPEC_GAP`
- `UNKNOWN / INSUFFICIENT_EVIDENCE`
- `DESIGN_VIOLATION`
- `SEMANTIC_REGRESSION`
- `IMPLEMENTATION_DEVIATION`
- `PASS`
