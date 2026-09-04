# @software-space/dsh-semantic

This opt-in dsh function plugin exposes a normalized Host-side view of Cordis/dsh state and a pure typed-obligation checker.

## Tools

- `software_semantic_slice` returns canonical identities, dependency edges, target and committed bindings, services, current effects, current-Agent package/run state, coverage, and provenance. It does not return a root cause or repair.
- `software_semantic_assure` checks proposed obligation records. It supplies no runtime facts.

## Install

From the repository root, build and pack the plugin, then install the generated archive in the dsh deployment:

```sh
npm install
npm run build
npm pack --workspace @software-space/dsh-semantic
```

Install the resulting `.tgz` so `@software-space/dsh-semantic` resolves from the dsh profile, then apply [`../profile/semantic-interface.patch.yml`](../profile/semantic-interface.patch.yml). Install the companion Skill under a scanned dsh Skill root.

## Runtime ownership

The plugin runs on the Host. It reads Cordis state without taking lifecycle authority. Agent-scoped dynamic package state is included when `@deepseek-ai/dsh-cordis-host-runner` is mounted. Without that service, the domain is reported `UNAVAILABLE`.

Target-binding inspection is pinned to Cordis `4.0.2`. If the target store cannot be observed, the tool returns `UNKNOWN` and downgrades binding coverage. Package source and external-effect truth remain explicit oracle gaps.

## Development

```sh
npm run typecheck
npm run test
npm run test:composition
```

The package follows dsh revision `49a606bc5b5934603f22a26957a07dc799ab0291`: named function-plugin exports, effect-owned registrations, Host ownership, ESM, and Node `^22.19 || >=24`.
