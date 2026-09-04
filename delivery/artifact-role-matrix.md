# Artifact Role Matrix

| Path | Role | Source of truth? | Mutable? | Primary audience |
|---|---|---:|---:|---|
| `spec/semantic-contract.md` | `ACTIVE_SPEC` | Yes | Yes, by reviewed version change | Implementers |
| `portable/software-semantic-protocol/` | `PORTABLE_PRODUCT` | Projection | Yes | Agents and integrators |
| `dsh/package/` | `DSH_NATIVE_PRODUCT` | Implementation | Yes | dsh/Cordis engineers |
| `dsh/skill/` | `DSH_NATIVE_PRODUCT` | Projection | Yes | dsh Agents |
| `dsh/profile/` | `DSH_NATIVE_PRODUCT` | Composition | Yes | dsh operators |
| `examples/` | `GENERATED`, product examples | No | Yes | Users and engineers |
| `foundation/formal/` | `FORMAL_FOUNDATION` | Frozen formal source | No | Researchers |
| `research/experiments/` | `FROZEN_EVIDENCE` | Frozen outcome source | No | Researchers and reviewers |
| `research/frozen-sources/` | `FROZEN_EVIDENCE` | Frozen research source | No | Researchers and implementers |
| `research/original-artifacts/` | `FROZEN_EVIDENCE` | Raw evidence | No | Reproducers |
| `research/claims/` | Evidence index | No | Yes, without rewriting evidence | Reviewers |
| `research/history/specifications/` | `HISTORICAL` | No | No | Project historians |
| `research/history/semantic-mirror/` | `HISTORICAL` | No | No | Researchers |
| `research/history/context/` | `HISTORICAL` | No | No | Project historians |
| `references/editorial/` | `REFERENCE` | Editorial only | No | Maintainers |
| `references/cordis/` | `REFERENCE` | Upstream/research | No | Engineers and researchers |
| `references/upstream/dsh-49a606bc/` | `REFERENCE` | Pinned upstream snapshot | No | dsh engineers |
| `delivery/` | Consolidation audit | No | Yes | Reviewers |
| `scripts/` | Validation | Mechanical checks | Yes | Maintainers |

No other file may redefine the core carrier, coverage, authority, responsibility, obligation, or result taxonomy. Projections link back to the active contract.
