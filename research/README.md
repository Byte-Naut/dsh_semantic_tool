# Research and Evidence Index

This directory preserves the project's empirical record and design provenance. Frozen reports and raw artifacts remain unchanged. Active product specifications live outside this directory.

## Frozen conclusions

| Evidence question | Current conclusion |
|---|---|
| Does normalization reduce reconstruction burden? | Supported and held-out replicated within the tested task family |
| Does interface-first access convert that into trajectory efficiency? | Supported and held-out replicated within the tested task family |
| Does the typed checker improve Agent capability or correctness? | Not established; bounded Soft ceiling observed |
| Does the semantic interface move the correctness failure boundary? | Not established |

See [`claims/evidence-summary.md`](claims/evidence-summary.md) and [`claims/claim-evidence-map.md`](claims/claim-evidence-map.md).

## Directory roles

- `experiments/`: frozen human-readable reports grouped by E1/E2, E3, and E4;
- `frozen-sources/`: immutable v0.3 Cordis reification and semantic-mirror design sources;
- `original-artifacts/`: byte-preserved ZIP/JSON evidence and legacy checksum files;
- `checksums/`: one unified SHA-256 manifest for the complete package;
- `history/specifications/`: superseded prompts and experiment design;
- `history/semantic-mirror/`: superseded v0.1/v0.2 reification and mirror design history;
- `history/context/`: contextual project rationale with lower authority than frozen evidence and the active contract.

Individual archives are intentionally absent from the primary user flow. Researchers can verify them with:

```sh
npm run verify:integrity
```
