---
name: software-semantic-protocol
description: Diagnose or design software changes from a compact semantic contract and auditable state slice, preserving coverage, provenance, UNKNOWN, and the approved change boundary.
---

# Software Semantic Protocol

Use this Skill for lifecycle, dependency, runtime-state, failure-recovery, or cross-component change tasks where repeated native inspection could obscure identity, time, ownership, or absence.

Use this workflow for the current issue only:

```text
CONTRACT → OBSERVE → SEARCH → ASSURE → DELTA
```

## CONTRACT

Extract the user's intent, authoritative requirements, hard constraints, protected frame, non-goals, objectives, and acceptance evidence. Mark a missing authoritative decision as `SPEC_GAP`. Keep your suggested constraints advisory until the user or upstream owner accepts them.

## OBSERVE

Prefer a native semantic-state tool when one exists. Treat a domain marked `COMPLETE` as the primary observation source. Use native inspection only for a domain reported `PARTIAL`, `UNAVAILABLE`, or `UNKNOWN`; record that oracle escape and its evidence.

Without a semantic tool, construct the smallest issue-centered slice from available evidence. Assign stable identities, provenance, domain coverage, and an epistemic status to every value whose absence matters. Do not write project-specific Horn rules.

Read [references/contract-card.md](references/contract-card.md) when you need the carrier, authority, obligation, or outcome vocabulary.

## SEARCH

Separate observed facts, assumptions, and advisory judgments. Compare viable proposals against the same hard constraints and protected frame. Do not treat a semantic slice as a root-cause answer; reason over its identities, edges, lifecycle states, bindings, ownership, and time.

## ASSURE

Use an available checker for supported mechanical obligations. In particular, preserve `UNKNOWN`, require a known-true action guard, distinguish known absence from unknown, preserve authority, and protect the approved frame. A checker validates a candidate; it does not provide missing world facts.

## DELTA

Before mutation, state the exact target identities, preconditions, expected relation changes, preserved relations, validation, and behavior under uncertainty. Make only the approved change. Re-observe the affected slice and verify the external result where possible.

Report one outcome: `SPEC_GAP`, `UNKNOWN / INSUFFICIENT_EVIDENCE`, `DESIGN_VIOLATION`, `SEMANTIC_REGRESSION`, `IMPLEMENTATION_DEVIATION`, or `PASS`.
