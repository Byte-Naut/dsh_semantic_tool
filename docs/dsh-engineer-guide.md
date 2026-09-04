# dsh and Cordis Engineer Guide

## Why this package exists

Strong Agents can reconstruct Cordis/dsh lifecycle truth from native interfaces. Held-out experiments in one task family show that they repeatedly pay for the same joins. The reference package moves those joins into a small Host-owned observation surface while preserving source identity, coverage, and uncertainty.

## Integration shape

The package is out-of-tree and opt-in. It uses existing dsh extension points:

- Cordis function plugin lifecycle;
- `ctx.tools` for two model-facing tools;
- `ctx.systemPrompt` for a short stable policy;
- `ctx.get('dynamicCordisRunner')` for an optional Agent-scoped package/run observation;
- the filesystem Skill provider for the workflow;
- a profile patch for composition.

It does not modify `agent-loop`, create a second plugin framework, or take lifecycle authority.

## Host ownership

The collector runs on the Host. It observes process-local Cordis state and filters Agent-owned dynamic fibers by Agent identity. The current adapter reads:

- `Registry` and live fibers;
- declared injections;
- target and committed binding stores;
- `Reflect` service implementations and visibility;
- current Cordis-tracked effects;
- current Agent dynamic package/run snapshots when the Host runner is present.

The target binding store is a revision-pinned Cordis inspection seam. A missing seam yields `UNKNOWN` and downgraded coverage. The adapter never substitutes the committed store.

## Model-facing surface

`software_semantic_slice` returns canonical state, not an answer. A focus value limits the result to matching identities, names, service keys, packages, and their connected dependency component. The Agent still identifies violations and selects a repair.

`software_semantic_assure` evaluates pure obligation records. It detects unknown collapse, action execution under a non-true guard, absence confusion, authority promotion, and protected-frame change. It does not inspect the runtime.

## Composition

The profile patch inserts the Host runner and the semantic plugin. Deployments that already mount the runner should remove the duplicate insert and retain the semantic row. Keep the Skill in a scanned root rather than embedding its body in the system prompt.

## Validation

```sh
npm install
npm run typecheck
npm run test
npm run test:composition
npm pack --workspace @software-space/dsh-semantic
npm run demo
```

The composition test loads a real Cordis configuration, verifies named plugin exports, assembles the model-visible tools and policy, and executes a keyless semantic observation. Unit tests cover carrier and assurance behavior. The demo verifies the external result rather than an Agent self-report.

## Integration points

Future work may add framework-specific observers, a session-log event for richer durable replay, or selected assurance obligations. Each addition needs a current consumer and must preserve the canonical contract. UI, a persistent semantic database, and runtime authority remain deferred.
