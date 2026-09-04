# Prompt: Relational Semantic Normalization for Software Artifacts

## Use

Use this prompt for source code, configuration, schemas, build files, tests, deployment descriptions, or technical documentation. Select one mode: REIFY for relational extraction, ASSESS for contract evaluation, or CHANGE for controlled modification.

## Semantic Discipline

Before starting, read `software-space-llm-normalization-minimal-reference-v1.0.en.md`. Use its schemas, canonical identifiers, \(L_0\) descriptors, execution configuration, provenance classes, and relational delta format. Do not restate the shared definitions.

For the current task \(T\), construct:

\[
M_T=(D_T,H_T,J_T,R_T,A_T,N_T).
\]

Source artifacts and user-approved specifications provide AUTHORITATIVE evidence. Deterministic parsing, queries, and checks produce DERIVED evidence. Structural interpretations and change candidates remain INFERRED. Represent object software as extensional facts that transactions can change. Keep \(P_0\)'s lifecycle semantics fixed and treat \(P_S\) as a fixed conceptual interface for checking constraints and searching designs. Generate no project-specific Horn rules.

Perform LLM-guided heuristic exploration. Actual parser, test, or static-analysis results may become DERIVED evidence; LLM simulation never substitutes for CTR execution, complete search, or formal proof.

Challenge explicitly; never override silently. Mark best practices, safety recommendations, and refactoring preferences ADVISORY. State their evidence, effects, and pending decisions. Add them to the contract only after the user accepts them.

## Procedure

### 1. Select the Mode and Scope

Choose REIFY, ASSESS, or CHANGE from the request. Ask only when the choice would alter the deliverable or write authority. Record the target artifacts, versions, entry points, environments, relevant tests, external interfaces, and non-goals.

### 2. Ground the Artifacts and Anchors

Read the smallest artifact set needed for the task. Give every semantic fact a stable source anchor, such as a file, symbol, configuration key, schema object, or test name. Separate source content, deterministic extraction, model inference, and unknowns.

When the task requires reversible write-back, preserve both:

- a trace from each relational identifier to its source anchor; and
- comments, whitespace, formatting, and other shadow content excluded from \(D_T\).

### 3. Build the Relational Slice

Declare predicates, arities, and sorts, then assign canonical ground identifiers. Encode components, interfaces, dependencies, states, versions, publication relations, and external observations in \(D_T\). Use `code_skip`, `code_prim`, `code_seq`, `code_par`, `code_iso`, and `code_call` only for control structure. Publish roots with `entry` and `current_def`.

Check descriptor uniqueness for reachable nodes, reference closure, ground actions, disjoint version namespaces, and unique current roots for deterministic functions. Keep descriptors, roots, versions, and publication relations as queryable, transaction-editable facts. Create fresh immutable identifiers and update the published root for each version change. Reify task, continuation, or scheduler facts only when the task must query active control.

Stop expanding when the slice can support the requested extraction, judgment, or change. Represent peripheral artifacts as black-box dependencies with source anchors.

### 4. Continue by Mode

**REIFY:** Use \(H_T\) for extraction and well-formedness requirements. Set \(J_T\) and \(R_T\) as the task requires. Output \(D_0\), the schema, identifiers, anchors, descriptors, roots, well-formedness results, and unknowns. Generate no design candidates.

**ASSESS:** Extend the REIFY result with target-specific constraints, objectives, regularization, assumptions, and non-goals. Report the requirement-to-artifact gap, a conflict witness or behavior witness, and the sufficiency of the evidence.

**CHANGE:** Complete ASSESS first, then run:

\[
generate\rightarrow simulate\rightarrow critique
\rightarrow branch\rightarrow compare.
\]

For each candidate, record \(Del_i\), \(Ins_i\), affected source anchors, hard-constraint status, objective tradeoffs, regularization cost, side effects, and recovery obligations. Compare candidates by Pareto dominance and prefer smaller semantic deltas among otherwise viable candidates.

### 5. Search for Counterexamples

For each hard constraint, seek an input, state, version binding, concurrent interleaving, or publication path that falsifies it. Return to candidate search when a counterexample appears. When none appears, report only:

> No counterexample was found within the modeled states, boundaries, and assumptions.

### 6. Separate Semantic Design from Artifact Write-Back

First report \(D^*\) and:

\[
\Delta_T=(D_0-D^*,D^*-D_0).
\]

Review semantic design and implementation separately. Map relational edits to artifact changes only when the request authorizes implementation and the user has approved the semantic delta. After editing, run the relevant tests, analyses, or builds, then compare artifact \(I\) with \(D^*\).

## Output Contract

All modes produce:

1. **Mode and Result:** the selected mode and one status—PASS, SPEC_GAP, SEMANTIC_REGRESSION, or IMPLEMENTATION_DEVIATION—followed by a one-sentence justification.
2. **Grounding:** claims, conflicts, unknowns, and advisory challenges.
3. **Artifact Scope:** artifacts, versions, entry points, environments, source anchors, and exclusions.
4. **Semantic Contract:** \(D_T,H_T,J_T,R_T,A_T,N_T\).
5. **Relational Model:** schema, identifiers, \(D_0\), descriptors, roots, and well-formedness results.
6. **Behavior and Evidence:** relevant lifecycle traces, observations, and validation evidence.

ASSESS and CHANGE also produce:

7. **Gap or Witness:** a requirement-to-artifact gap, conflict, or behavior witness.

CHANGE also produces:

8. **Candidates:** candidate deltas, constraint status, tradeoffs, and counterexample results.
9. **Selected Design:** \(D^*\), \(\Delta_T\), preserved behavior, intentionally changed behavior, and verification obligations.
10. **Implementation Review:** after write-back, report artifact changes, check results, and the \(D^*\leftrightarrow I\) comparison.

Use SPEC_GAP when the contract is incomplete, contradictory, or dependent on an unauthorized assumption. Use SEMANTIC_REGRESSION when a candidate breaks the semantic contract. Use IMPLEMENTATION_DEVIATION when an artifact fails to implement an approved design. Use PASS for every other closed result. Preserve the full responsibility chain \(R_{\mathrm{req}}\rightarrow S\rightarrow D\rightarrow I\rightarrow V\), where \(R_{\mathrm{req}}\) denotes the raw request.
