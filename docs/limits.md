# Limits

## Evidence limits

- E1 and E2 are replicated within one Cordis/dsh lifecycle task family.
- The evidence does not establish general Agent correctness improvement.
- E3 observed a bounded Soft ceiling through three local transformation depths. The checker provides mechanical assurance; its capability effect is unproven.
- E4 did not establish a correctness capability-boundary shift.
- Cross-task, cross-model, and real-Issue generalization remain open.

## Implementation limits

- The dsh adapter is a process-local semantic shadow.
- Cordis/dsh retains execution authority.
- Target-binding observation uses a pinned Cordis implementation seam and reports `UNKNOWN` if that seam is unavailable.
- Current tracked effects are observable; disposed-effect tombstones are not retained by the product adapter.
- Arbitrary JavaScript continuation state is outside the slice.
- External effects require a separate oracle.
- Client-only runtime truth is unavailable unless a Host provider reports it.
- Package source is excluded from the semantic slice and remains an explicit native inspection need.
- No persistent semantic database or UI is included.

## Operational limits

The profile is opt-in and pinned to the versions in [`STATUS.md`](../STATUS.md). Revalidate against a new dsh or Cordis revision before deployment. Treat a reported coverage gap as a fact about the observer, not as evidence that the underlying object is absent.
