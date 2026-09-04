# Prompt: Relational Semantic Normalization for a Specific Issue

## Use

Use this prompt for bugs, feature requests, compatibility problems, concurrency failures, version updates, behavioral regressions, or local refactorings. Deliver a design delta by default. Artifact implementation requires separate authorization.

## Semantic Discipline

Before starting, read `software-space-llm-normalization-minimal-reference-v1.0.en.md`. Use its Grounding, World, Slice, Model, Execution, and Design objects. Do not restate the shared definitions.

For the current issue \(T\), construct:

\[
M_T=(D_T,H_T,J_T,R_T,A_T,N_T).
\]

Represent the issue, code facts, requirements, and repair candidates as extensional facts in \(D_T\). Keep \(P_0\)'s lifecycle semantics fixed and treat \(P_S\) as a fixed conceptual interface for checking constraints and searching designs. Generate no issue-specific Horn rules. Perform only LLM-guided heuristic exploration over a CTR-inspired state model.

Humans own intent; AI owns search; the semantic contract is the boundary. Challenge explicitly; never override silently. Identify safety, compatibility, performance, and operational risks. State their evidence, effects, and pending decisions. Keep those risks ADVISORY until the user accepts them.

## Procedure

### 1. Ground the Issue Contract

Read the issue, relevant specifications, roadmap, code, tests, and necessary history. Classify each material statement as AUTHORITATIVE, DERIVED, INFERRED, ADVISORY, or UNKNOWN. Keep current-state code facts, explicit issue goals, and model-inferred causes in separate records.

Define \(H_T,J_T,R_T,A_T,N_T\). Admit only user-confirmed or explicitly adopted assumptions into \(A_T\). When the contract contains a conflict, a material gap, or a required unauthorized assumption, return SPEC_GAP and ask the smallest clarifying question.

### 2. Build the Minimal Issue Slice

Seed \(S_I\) with the states, entities, interfaces, lifecycle behavior, versions, observations, and boundaries named by the issue. Add a fact only when removing it could change at least one judgment:

- whether the issue or objective can be expressed;
- whether a candidate is feasible;
- whether a hard constraint can fail; or
- whether relevant external behavior remains stable.

Close the slice over ownership, typed dependencies, calls, publication, version bindings, selected predecessors, and constraint dependencies. Model each peripheral system as a black box with inputs, outputs, guarantees, and failure modes.

### 3. Build the Baseline and Witness

Construct the current model \(D_0\) and show why it fails the issue contract.

For a behavioral issue, give a checkable failure witness:

\[
D_0\xRightarrow{\tau}BadState.
\]

Record the initial state, critical actions or interleaving, observed result, source anchors, and dependent assumptions. For a nonbehavioral issue, give a requirement conflict, missing capability, or structural gap witness.

### 4. Search Repair Candidates

Run:

\[
generate\rightarrow simulate\rightarrow critique
\rightarrow branch\rightarrow compare.
\]

Generate semantically distinct \(D_i\). For each candidate, record:

- \(Del_i\) and \(Ins_i\);
- changed facts, orderings, boundaries, bindings, or assumptions;
- the satisfied, violated, or unknown status of each \(H_T\);
- improvements and regressions in \(J_T\);
- the change scope, complexity, and risk charged by \(R_T\);
- side effects, rollback or migration obligations, and possible smaller semantic deltas.

Compare candidates by Pareto dominance. Prefer a nondominated candidate that satisfies current constraints, preserves non-target behavior, and minimizes the semantic delta.

### 5. Search for Counterexamples

For each \(H_i\), try to construct an input, state path, concurrent interleaving, version change, or publication sequence that falsifies it. Mark the candidate SEMANTIC_REGRESSION and return to candidate search when a counterexample appears.

When none appears, write only:

> No counterexample was found within the modeled states, boundaries, and assumptions.

Never present LLM self-review as \(H(D^*)=\mathrm{true}\), a proof of behavioral equivalence, or a complete search result.

### 6. Select the Design Delta

Report the selected design \(D^*\) and:

\[
\Delta_T=(D_0-D^*,D^*-D_0).
\]

Account for preserved behavior, intentionally changed behavior, each requirement's design mapping, evidence, provenance, remaining assumptions, and unresolved verification obligations. Stop here by default.

When the user requests implementation, first present \(D^*\) and \(\Delta_T\) for semantic review. After approval, enter a separate artifact stage, map relational edits to files or code, and verify the implementation's fidelity.

## Output Contract

Present the result in this order:

1. **Result:** PASS, SPEC_GAP, or SEMANTIC_REGRESSION, followed by a one-sentence justification.
2. **Issue Contract:** the objective, \(H_T,J_T,R_T,A_T,N_T\), non-goals, and authorization boundary.
3. **Grounding Ledger:** material claims, sources, conflicts, unknowns, and advisory challenges.
4. **Issue Slice:** the scope, facts, boundaries, exclusions, and open dependencies of \(S_I\).
5. **Baseline and Witness:** \(D_0\) and the failure or gap witness.
6. **Candidates:** candidate deltas, constraint status, objective tradeoffs, risks, and counterexample results.
7. **Selected Design:** \(D^*\), \(\Delta_T\), and any necessary prose or diagram.
8. **Behavior Accounting:** preserved behavior, intentionally changed behavior, and requirement mappings.
9. **Evidence and Obligations:** validation evidence, provenance, remaining assumptions, uncertainty, and the gate for the next stage.
10. **Traceability:** \(R_{\mathrm{req}}\rightarrow S\rightarrow D\rightarrow V\), where \(R_{\mathrm{req}}\) denotes the raw request. After implementation, extend the chain to \(R_{\mathrm{req}}\rightarrow S\rightarrow D\rightarrow I\rightarrow V\).

Use SPEC_GAP when the contract is incomplete, contradictory, or dependent on an unauthorized assumption. Use SEMANTIC_REGRESSION when a candidate violates a constraint or breaks behavior that must remain stable. Use PASS for every other closed design. If a later artifact fails to implement \(D^*\), mark the implementation result IMPLEMENTATION_DEVIATION.
