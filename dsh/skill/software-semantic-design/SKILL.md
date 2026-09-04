---
name: software-semantic-design
description: Use dsh semantic-state tools to diagnose lifecycle and dependency issues, search under an explicit contract, assure typed obligations, and implement a bounded semantic delta.
---

# Software Semantic Design for dsh

Use this Skill for Cordis/dsh diagnosis or modification involving services, fibers, bindings, effects, packages, runs, coverage, or uncertain runtime state.

Follow `CONTRACT → OBSERVE → SEARCH → ASSURE → DELTA`.

1. Form the task contract from the user request. Keep user-owned requirements authoritative and your additions advisory.
2. Call `software_semantic_slice` before reconstructing runtime state from native domains.
3. For a domain reported `COMPLETE`, use the slice as the primary observation. Inspect native state only for a reported coverage gap or a source-level detail the slice declares unavailable. Record each escape.
4. Reason over the returned graph and typed carriers. The tool does not identify the root cause or choose a repair.
5. Before a state-changing proposal, call `software_semantic_assure` for the applicable obligations. Defer an action whose guard is `UNKNOWN`.
6. State the semantic delta, protected frame, validation, and recovery. Implement only after the task grants mutation authority.
7. Re-observe the affected slice and verify the runtime or external world.

Never infer an active run from `lastSuccessfulPackage`. Never collapse target and committed bindings. Never treat `UNKNOWN` as known absence.
