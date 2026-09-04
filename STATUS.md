# Project Status

## Product position

The active product is an auditable semantic interface over software and Agent-runtime state. The dsh package is its primary reference implementation. The Portable Skill is a degraded, framework-independent protocol projection.

## Claim ledger

| Claim | Status | Product consequence |
|---|---|---|
| E1: normalization reduces software-state reconstruction burden | Held-out replicated within the tested task family | Expose compact, provenance-bearing state slices |
| E2: interface-first access converts earlier closure into trajectory efficiency | Held-out replicated within the tested task family | Prefer semantic tools for covered domains; use explicit oracle escape for gaps |
| Runtime correctness retention | No loss observed in the referenced runtime runs; one frozen primary score was affected by a scorer defect | Keep runtime tests separate from wording-based scoring |
| E3: typed semantic discipline improves Agent capability | Not established; bounded Soft ceiling observed | Keep the checker as low-cost mechanical assurance |
| E4: semantic normalization moves the correctness capability boundary | Not established | Treat boundary shift as a future hypothesis |
| Cross-task, cross-model, and real-Issue generalization | Not established | Evaluate only after real product use supplies suitable tasks |

## Compatibility baseline

- dsh repository revision: `49a606bc5b5934603f22a26957a07dc799ab0291`
- `@deepseek-ai/cordis`: `4.0.2`
- dsh packages: `0.1.2-alpha.5`
- Node.js: `^22.19 || >=24`

The collector uses one revision-pinned Cordis inspection seam for target bindings. When that seam is unavailable, it reports `UNKNOWN` instead of guessing.

## Deferred

- Runtime authority or executor replacement
- Persistent semantic database
- General-purpose theorem prover
- UI
- New E1–E4 experiments or synthetic complexity ladders
- Capability-boundary claims
- General software-engineering claims
- A real dsh Issue evaluation, pending an independently selected task
