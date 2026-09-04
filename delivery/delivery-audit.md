# Phase 6 Delivery Audit

## 1. Repository map

- `README.md` and `STATUS.md`: primary product entry and claim ledger.
- `spec/`: canonical semantic contract.
- `portable/`: framework-independent Skill.
- `dsh/`: Host plugin, dsh-native Skill, and opt-in profile.
- `examples/`: minimal carrier/checker example and real Loader composition.
- `docs/`: architecture, user, engineer, and limits guides.
- `foundation/`: frozen formal texts.
- `research/`: frozen reports, raw artifacts, checksums, and history.
- `references/`: editorial, Cordis, and pinned dsh material.
- `delivery/`: inventory, conflict audit, role matrix, and this audit.
- `scripts/`: link, source-of-truth, claim, package, and integrity checks.

## 2. Artifact roles

[`artifact-role-matrix.md`](artifact-role-matrix.md) identifies every product and evidence area, its authority, mutability, and audience.

## 3. Active product architecture

[`../spec/semantic-contract.md`](../spec/semantic-contract.md) is the sole normative source. The Portable Skill projects the contract into a framework-independent workflow. The dsh implementation puts dynamic truth in a Host tool, static discipline in a short Skill/policy, and assurance in a pure checker. Cordis/dsh retains execution authority.

## 4. Frozen claims and evidence

- E1: held-out replicated within the tested task family.
- E2: held-out replicated within the tested task family.
- E3: bounded Soft ceiling; checker retained for assurance.
- E4: capability-boundary shift not established.

The full map is [`../research/claims/claim-evidence-map.md`](../research/claims/claim-evidence-map.md). Frozen files remain unchanged and are covered by the unified checksum manifest.

## 5. User quick-start

```sh
npm install
npm run check
```

Use the Portable Skill directly, or compose the dsh profile and install the dsh-native Skill. Start with `software_semantic_slice`; use native inspection only for reported gaps; assure applicable obligations before mutation; validate the post-state.

## 6. dsh engineer quick-start

```sh
npm install
npm run typecheck
npm run test
npm run test:composition
npm run demo:dsh
```

Review [`../docs/dsh-engineer-guide.md`](../docs/dsh-engineer-guide.md), then apply the opt-in profile patch. The package is pinned to dsh revision `49a606b`, Cordis `4.0.2`, and dsh packages `0.1.2-alpha.5`.

## 7. Research provenance

[`../research/README.md`](../research/README.md) indexes every frozen report, raw archive, historical specification, mirror document, and contextual source. [`../research/MANIFEST.json`](../research/MANIFEST.json) records raw evidence hashes and authority. [`../research/checksums/SHA256SUMS.txt`](../research/checksums/SHA256SUMS.txt) covers the delivery tree, excluding itself and generated dependency/build directories.

## 8. Remaining open questions

- Does the E1/E2 mechanism generalize to a real, independently selected dsh Issue?
- Does it generalize across task families and models?
- Which additional observation domains have a current product consumer?
- Which assurance obligations merit permanent mechanical enforcement?
- How should a future adapter log richer semantic snapshots without duplicating session state?

## 9. Explicitly deferred work

- New E1–E4 experiments or synthetic ladders
- Runtime authority, executor replacement, or Cordis fork
- Persistent semantic database
- Full theorem prover
- UI
- Multiple divergent semantic protocols
- General correctness or capability-boundary claims
- Model continuity or compaction redesign

## Acceptance status

Status: `PASS` for all constituent product checks.

| Check | Result |
|---|---|
| Standard Skill validation | 2 valid Skills |
| TypeScript strict typecheck | Pass |
| Unit and real-runtime tests | 6 passed, 0 failed |
| Real Cordis Loader composition | 1 passed, 0 failed |
| Minimal and dsh runtime demos | Pass |
| Clean `npm ci` reproduction | Pass with the same 7 tests and 2 demos |
| Authored Markdown links | Pass |
| Single source of truth and stale-claim guard | Pass |
| Required raw artifacts | 11 present |
| Original-byte comparison | Pass |
| Frozen ZIP structural integrity | 10 passed |
| Unified SHA-256 verification | Pass |
| Active-text credential scan | No key material found |

The managed execution environment declined the composite `npm run check` wrapper under its network-command policy. Every command that wrapper invokes was run directly and passed. This environment result does not change the shipped command or the product test outcomes.
