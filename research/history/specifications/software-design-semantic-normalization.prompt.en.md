# Prompt: Relational Semantic Normalization for Software Design

## Use

Use this prompt for architectures, state machines, protocols, service boundaries, data flows, control flows, or lifecycle designs. Deliver a reviewable semantic design and its delta, not a source patch.

## Semantic Discipline

Before starting, read `software-space-llm-normalization-minimal-reference-v1.0.en.md`. Use its world model, ground facts, lifecycle semantics, provenance classes, and relational delta format. Do not restate the shared definitions.

For the current task \(T\), construct:

\[
M_T=(D_T,H_T,J_T,R_T,A_T,N_T).
\]

- \(D_T\): the smallest sufficient Software-Space slice.
- \(H_T\): hard constraints.
- \(J_T\): preferences, quality attributes, and optimization objectives.
- \(R_T\): regularization of change scope, complexity, and risk.
- \(A_T\): assumptions that the user has confirmed or explicitly adopted.
- \(N_T\): non-goals and scope limits.

Represent the object design, requirements, and candidates as extensional facts in \(D_T\). Keep \(P_0\)'s lifecycle semantics fixed and treat \(P_S\) as a fixed conceptual interface for checking constraints and searching designs. Perform LLM-guided heuristic exploration over a CTR-inspired state model. Generate no task-specific Horn rules. Describe the work as heuristic exploration, never as CTR execution, exhaustive search, or formal proof.

Humans own intent; AI owns search; the semantic contract is the boundary. Challenge explicitly; never override silently. Mark engineering recommendations ADVISORY. State their evidence, effects, and pending decisions. Add them to \(H_T\), \(J_T\), or \(A_T\) only after the user accepts them.

## Procedure

### 1. Ground the Task

Read the current request, design materials, relevant specifications, prior decisions, and necessary history. For each material statement, record its class—AUTHORITATIVE, DERIVED, INFERRED, ADVISORY, or UNKNOWN—and its source, locator, scope, and dependencies.

Ask a question only when an unresolved choice would change a hard constraint, assumption, non-goal, system boundary, or candidate selection. Mark other gaps UNKNOWN and continue building a reviewable model.

### 2. Build the Semantic Contract and Slice

Seed \(D_T\) with the objective, external observations, components, interfaces, states, dependencies, and lifecycle actions. Retain a fact only when removing it could change the objective's expression, a candidate's feasibility, a hard-constraint judgment, or a relevant external-behavior judgment.

Model each peripheral system as a black box with inputs, outputs, guarantees, and failure modes. Once the slice closes, record its scope, exclusions, and open dependencies.

### 3. Build the Baseline and Gap

Construct the current design \(D_0\). When no prior design exists, build the baseline from the known environment, interfaces, and constraints; mark everything else UNKNOWN.

Give one concrete gap witness: a missing capability, conflicting constraint, unreachable objective, invalid state path, or unsatisfied observation. Identify the facts and assumptions on which the witness depends.

### 4. Search Design Candidates

When the task presents a material design choice, generate multiple semantically distinct candidates and run:

\[
generate\rightarrow simulate\rightarrow critique
\rightarrow branch\rightarrow compare.
\]

For each \(D_i\), record:

- \(Del_i\) and \(Ins_i\);
- changed facts, orderings, boundaries, bindings, or assumptions;
- the satisfied, violated, or unknown status of each \(H_T\);
- improvements and regressions in \(J_T\);
- changes, complexity, and risk charged by \(R_T\);
- side effects, recovery obligations, and possible smaller semantic deltas.

Compare candidates by Pareto dominance. Use only stated user preferences to choose among nondominated candidates.

### 5. Search for Counterexamples

For each \(H_i\), seek a state, input, version change, or lifecycle trace that falsifies it. Reject or revise a candidate when a counterexample appears. When none appears, write:

> No counterexample was found within the modeled states, boundaries, and assumptions.

Never present LLM self-review as \(H(D^*)=\mathrm{true}\) or as a proof of equivalence.

### 6. Select the Design and Delta

Select the \(D^*\) supported by current evidence and user preferences. Report:

\[
\Delta_T=(D_0-D^*,D^*-D_0).
\]

Account for preserved behavior, intentionally changed behavior, requirement-to-design mappings, remaining assumptions, uncertainty, and verification obligations. End the design task here. List file or code changes only after the user explicitly enters the artifact stage.

## Output Contract

Present the result in this order:

1. **Result:** PASS, SPEC_GAP, or SEMANTIC_REGRESSION, followed by a one-sentence justification.
2. **Grounding:** material claims, conflicts, unknowns, and advisory challenges.
3. **Semantic Contract:** \(D_T,H_T,J_T,R_T,A_T,N_T\) and the slice boundary.
4. **Baseline and Witness:** \(D_0\) and the gap witness.
5. **Candidates:** candidate deltas, constraint status, objective tradeoffs, and counterexample results.
6. **Selected Design:** \(D^*\), \(\Delta_T\), relational facts, and any necessary prose or diagram.
7. **Behavior Accounting:** preserved, changed, and unverified behavior.
8. **Traceability:** the evidence chain \(R_{\mathrm{req}}\rightarrow S\rightarrow D\rightarrow V\), where \(R_{\mathrm{req}}\) denotes the raw request. Add \(I\) only after the task enters the artifact stage.

Use SPEC_GAP when the contract is incomplete, contradictory, or dependent on an unauthorized assumption. Use SEMANTIC_REGRESSION when a candidate violates a constraint or breaks behavior that must remain stable. Use PASS for every other closed design. PASS means only that the bounded model can proceed to the next stage.
