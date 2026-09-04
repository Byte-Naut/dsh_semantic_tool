# Phase 1 Artifact Inventory

Inventory date: 2026-09-04  
Disposition rule: frozen and historical inputs are copied without content edits.

## Formal and research sources

| Artifact | Classification | Authority | Disposition |
|---|---|---|---|
| `software-space-ctdd-3.md` | `FORMAL_FOUNDATION` | Frozen formal | Preserve under `foundation/formal` |
| `software-space-joint-canonicity-companion.md` | `FORMAL_FOUNDATION` | Frozen formal | Preserve under `foundation/formal` |
| `cordis-relational-reification-v0.3.md` | `FROZEN_EVIDENCE` | Frozen research | Preserve under `research/frozen-sources` |
| `cordis-semantic-mirror-design-v0.3.md` | `FROZEN_EVIDENCE` | Frozen research | Preserve under `research/frozen-sources` |
| Pilot, v2, v2.1, held-out, E3, and E4 reports | `FROZEN_EVIDENCE` | Frozen research | Preserve under `research/experiments` |
| 10 experiment/PoC ZIPs and `final-analysis.json` | `FROZEN_EVIDENCE` | Raw evidence | Preserve original bytes under `research/original-artifacts` |

## Specifications and prompts

| Artifact | Classification | Disposition |
|---|---|---|
| Minimal normalization reference v1.0 | `HISTORICAL` | Preserve; derive the active contract |
| Issue, design, and artifact prompts | `HISTORICAL` | Preserve; replace in product path with a short Skill workflow |
| A/B evaluation design v0.1 | `HISTORICAL` | Preserve as protocol provenance |
| Reification v0.1/v0.2 and design v0.2 | `HISTORICAL` | Preserve as semantic-mirror evolution |
| `spec/semantic-contract.md` | `ACTIVE_SPEC` | New sole normative source |

## Implementations

| Artifact | Classification | Disposition |
|---|---|---|
| Semantic mirror PoC | `REFERENCE`, `FROZEN_EVIDENCE` | Preserve in the two PoC archives; derive a maintained package |
| Experiment harness source/results | `GENERATED`, `FROZEN_EVIDENCE` | Canonical raw copies are the frozen archives; do not place in product path |
| `portable/software-semantic-protocol` | `PORTABLE_PRODUCT` | New framework-independent Skill projection |
| `dsh/package` | `DSH_NATIVE_PRODUCT` | New opt-in Host-side reference plugin |
| `dsh/skill` | `DSH_NATIVE_PRODUCT` | New thin workflow adapter |
| `dsh/profile` | `DSH_NATIVE_PRODUCT` | New opt-in composition patch |
| `examples` | `PORTABLE_PRODUCT`, `DSH_NATIVE_PRODUCT` | New keyless runnable examples |

## References and context

| Artifact | Classification | Authority | Disposition |
|---|---|---|---|
| `elements-of-style.md` | `REFERENCE` | Editorial | Preserve under `references/editorial` |
| Cordis paper and notes | `REFERENCE` | Upstream/research | Preserve under `references/cordis` |
| dsh `config-catalog.md` | `REFERENCE` | Upstream at pinned revision | Preserve under revision-named path |
| `six-turn-chat-dialog.md` | `HISTORICAL` | Contextual rationale | Preserve under `research/history/context` |

## Deprecated active patterns

The following patterns remain visible only in historical sources:

- dynamic truth embedded in a long prompt;
- combined REIFY/DESIGN/IMPLEMENT output;
- Native plus Relational as the default treatment;
- unqualified `currentPackageId` as live-state truth;
- `UNKNOWN` collapsed into ordinary absence;
- typed checker described as an Agent capability enhancer;
- E4 evidence/provenance closure loss described as correctness failure;
- semantic mirror described as runtime authority.

No frozen or provenance artifact was deleted.
