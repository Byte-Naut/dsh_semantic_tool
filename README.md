# Software Space Semantic Harness

A formally grounded semantic interface for software and agent-runtime state. It gives strong agents a compact, auditable view of software state and supports contract-driven design search without repeated reconstruction across native runtime domains.

The repository contains one framework-independent semantic contract, a portable Skill projection, and an opt-in dsh reference implementation. The research archive records why the interface exists and the limits of the current evidence.

## Start here

Requirements:

- Node.js 24 or Node.js 22.19+
- npm 10+

```sh
npm install
npm run check
npm run demo
```

The demo builds a normalized software-state slice, preserves `KNOWN_VALUE`, `KNOWN_ABSENT`, and `UNKNOWN`, and checks a proposed action guard without contacting a model.

### Integration with dsh

First, build and add the plugin package to your target dsh profile (e.g. `web`):

```sh
npm install
npm run build
npm pack --workspace @software-space/dsh-semantic
dsh plugin --profile web add ./software-space-dsh-semantic-*.tgz
```

Then configure the capability using one of two options:

#### Option A: Isolated Agent Preset (Recommended)

Copy the pre-packaged preset into your dsh user presets root:

- **Linux / macOS**:
  ```sh
  cp -r dsh/.agent-presets/semantic ~/.dsh/.agent-presets/semantic
  ```
- **Windows PowerShell**:
  ```powershell
  Copy-Item -Recurse -Force "dsh\.agent-presets\semantic" "$HOME\.dsh\.agent-presets\semantic"
  ```

Launch or select the preset via `dsh web --preset semantic`. The semantic tools, prompt policy, and companion skill are active only in sessions using this preset, leaving `standard`, `minimal`, and other presets completely unpolluted.

#### Option B: Profile-wide Patch

To enable the tools across all presets in a profile:

1. Apply [`dsh/profile/semantic-interface.patch.yml`](dsh/profile/semantic-interface.patch.yml) to your profile's `cordis.patch.yml`.
2. Place [`dsh/skill/software-semantic-design`](dsh/skill/software-semantic-design/SKILL.md) into a scanned Skill root (e.g. `~/.dsh/skills/`).

Once configured, ask the Agent to inspect the task with `software_semantic_slice`, use native inspection only for domains reported as `UNKNOWN` or unavailable, and call `software_semantic_assure` before a state-changing proposal.

The Portable Skill at [`portable/software-semantic-protocol`](portable/software-semantic-protocol/SKILL.md) supports the same workflow when no native semantic runtime exists.

## Product surface

| Entry | Audience | Purpose |
|---|---|---|
| [`spec/semantic-contract.md`](spec/semantic-contract.md) | Implementers | Sole normative semantic source |
| [`portable/software-semantic-protocol/SKILL.md`](portable/software-semantic-protocol/SKILL.md) | Agents and framework integrators | Portable `CONTRACT → OBSERVE → SEARCH → ASSURE → DELTA` workflow |
| [`dsh/package`](dsh/package/README.md) | dsh and Cordis engineers | Host-side reference plugin and typed assurance tool |
| [`dsh/preset/semantic`](dsh/preset/semantic/README.md) | dsh users and agents | Ready-to-copy isolated Agent preset bundle |
| [`docs/user-guide.md`](docs/user-guide.md) | Users | Setup, use, outputs, and limits |
| [`research/README.md`](research/README.md) | Researchers | Frozen reports, raw artifacts, and claim provenance |

## Status

Within the tested Cordis/dsh lifecycle task family, held-out paired replication supports two mechanisms: normalized state reduces reconstruction burden, and an interface-first policy turns that reduction into shorter Agent trajectories. E3 found a bounded Soft ceiling; the checker remains a mechanical assurance layer. E4 did not establish a correctness capability-boundary shift.

See [`STATUS.md`](STATUS.md) for the claim ledger and [`docs/limits.md`](docs/limits.md) for current boundaries.

## Repository map

```text
spec/          canonical semantic contract
portable/      framework-independent Skill projection
dsh/           opt-in Host-side reference implementation
examples/      keyless runnable examples
docs/          user and engineering guidance
foundation/    frozen formal sources
research/      frozen evidence and project history
references/    editorial, Cordis, and pinned upstream material
delivery/      consolidation inventory and audits
scripts/       integrity and product validation
```

Frozen research artifacts remain byte-identical to their inputs. The primary user path does not expose individual experiment archives.
