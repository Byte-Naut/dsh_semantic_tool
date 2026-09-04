# User Guide

## What the interface does

The interface gives an Agent a compact view of identities, dependencies, lifecycle state, bindings, effects, packages, runs, coverage, and provenance. It reduces repeated joins across native Cordis/dsh state domains.

## Keyless local demo

```sh
npm install
npm run demo
```

Expected output includes:

- one normalized semantic slice;
- a target binding known as `provider-v2`;
- a committed binding reported as `UNKNOWN`;
- an assurance failure when a proposal turns that uncertainty into a definite `true` action guard;
- an assurance pass after the proposal defers the action.

## Portable workflow

Copy `portable/software-semantic-protocol` into a supported Skill root. Ask the Agent to diagnose or design the change. The Skill guides it through:

1. an explicit task contract;
2. an issue-centered observation;
3. candidate search;
4. mechanical assurance where available;
5. a bounded semantic delta and post-change validation.

When no semantic runtime exists, the Agent constructs a small slice from available source and runtime evidence. It must report observation gaps as `UNKNOWN`.

## dsh workflow

Build and pack the reference package from `dsh/package` and install the resulting archive so the dsh profile can resolve `@software-space/dsh-semantic`.

To use the capability:

- **Isolated Preset (recommended)**: Copy `dsh/.agent-presets/semantic` to `~/.dsh/.agent-presets/semantic` and start the session with `dsh web --preset semantic`. This scopes the tools, system prompt policy, and companion skill strictly to that preset without altering other agent configurations.
- **Profile-wide Patch**: Apply `dsh/profile/semantic-interface.patch.yml` to your profile's `cordis.patch.yml` and copy `dsh/skill/software-semantic-design` into `<project>/.dsh/skills/` or another configured Skill root.

A typical request is:

```text
Diagnose why the current consumer did not commit its target provider. Preserve the auxiliary consumer and all unrelated effects. Use the software semantic workflow, show the evidence gap if a binding is unknown, and propose the smallest safe delta.
```

The Agent should call `software_semantic_slice` first. It may use native inspection only for a domain that the slice marks partial, unavailable, or unknown. Before mutation, it should submit applicable obligations to `software_semantic_assure`.

## Reading results

| Field | Use |
|---|---|
| `coverage` | Decides whether absence is knowable |
| `target` / `committed` | Preserves in-flight binding differences |
| `lastSuccessfulPackage` | Names the last committed package version |
| `activeRun` | States what is live now, if anything |
| `authority` | Separates observation from inference and advice |
| `provenance` | Traces a claim to its observer and snapshot |

## Limits

The interface covers what its adapter reports. It does not capture arbitrary JavaScript control state, external effects without an oracle, or model continuity state. The dsh implementation is a read-only semantic substrate plus a pure checker; Cordis/dsh remains the executor.
