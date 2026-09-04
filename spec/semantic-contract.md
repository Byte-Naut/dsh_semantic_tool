# Software State Semantic Contract

Status: active specification 1.0.0  
Normative source: this file  
Applies to: Portable Semantic Protocol and dsh-native reference implementation

## 1. Purpose

This contract defines a compact, auditable view of software and Agent-runtime state. It separates authoritative intent, observed runtime truth, derived design judgments, mechanical assurance, and proposed change.

An implementation may support only part of the contract. It must declare coverage and preserve uncertainty. It must not replace an unobserved value with a guess.

The formal foundation gives the relational state a precise semantic role. Ordinary product use does not require the formal texts.

## 2. Normative language

`MUST`, `MUST NOT`, `SHOULD`, and `MAY` carry their usual requirement meanings. A field marked authoritative may be changed only by its owner or by an explicitly approved revision.

## 3. Responsibility model

| Actor | Responsibility |
|---|---|
| User or upstream system | Own intent and authoritative requirements |
| Harness | Report truthful observations within declared coverage |
| LLM | Search for a proposal under the approved contract |
| Checker and tests | Discharge selected mechanical obligations |
| Implementation | Conform to the approved semantic delta |
| Reviewer or user | Accept the result or revise the contract |

An LLM MAY propose missing requirements or advisory constraints. It MUST NOT silently promote them to authoritative requirements.

## 4. Contract record

A task contract contains only fields needed for the current decision:

- `intent`: the requested outcome;
- `requirements`: authoritative, testable conditions;
- `assumptions`: explicit facts temporarily accepted for search;
- `hardConstraints`: conditions no accepted proposal may violate;
- `protectedFrame`: identities, behaviors, or state that must remain unchanged;
- `nonGoals`: work excluded from the task;
- `objectives`: ordered or weighted optimization goals;
- `changeRegularization`: preference for the smallest justified semantic delta;
- `acceptance`: observations or tests that decide completion.

Every item carries an owner and an information authority. An omitted requirement is a `SPEC_GAP`, not permission to invent one.

## 5. Relational state

The semantic world is an extensional state (D): a set of ground records about the observed software system. Project-specific program facts enter (D). They do not become new interpreter rules.

A portable implementation MAY serialize (D) as JSON records. A native implementation MAY materialize the same relations through runtime state and tools. Both must preserve the meanings in this contract.

### 5.1 Stable identity

Each component, service implementation, effect, package, run, snapshot, and evidence item has an identity that remains stable across observations for as long as the implementation claims continuity.

If continuity cannot be established, the implementation MUST mint a new identity or report `UNKNOWN`. Similar labels do not prove identity.

Disposed objects MAY remain as tombstones. A tombstone records historical identity and last observed state; it is not a live object.

### 5.2 Time and observation phase

Each slice identifies its runtime, snapshot sequence, and phase:

- `COMMITTED`: no observed transition is in flight;
- `IN_FLIGHT`: at least one relevant lifecycle transition is unresolved;
- `UNKNOWN`: quiescence could not be established.

Target state and committed state are separate observations. An in-flight replacement can therefore satisfy:

```text
targetBinding = KNOWN_VALUE(v2)
committedBinding = KNOWN_VALUE(v1)
```

An implementation MUST NOT collapse these fields.

### 5.3 Epistemic carrier

Every value whose absence depends on observation coverage uses one of three statuses:

```text
KNOWN_VALUE(value)
KNOWN_ABSENT
UNKNOWN(reason)
```

- `KNOWN_VALUE` means the observer established a value within declared coverage.
- `KNOWN_ABSENT` means the observer established absence within complete relevant coverage.
- `UNKNOWN` means the observer could not establish value or absence.

`KNOWN_ABSENT` and `UNKNOWN` are never interchangeable.

### 5.4 Coverage

Each observation domain declares one status:

- `COMPLETE`: the observer can establish both value and absence within the declared scope;
- `PARTIAL`: the observer sees some members but cannot establish global absence;
- `UNAVAILABLE`: no observation path is available.

`PARTIAL` and `UNAVAILABLE` entries include a reason. The scope of `COMPLETE` coverage must be explicit, such as `current process` or `current Agent session`.

### 5.5 Information authority

Every claim or record uses one authority:

- `AUTHORITATIVE`: owned requirement or authoritative runtime observation;
- `DERIVED`: deterministic result from identified authoritative inputs;
- `INFERRED`: defeasible conclusion with stated assumptions;
- `ADVISORY`: recommendation or optimization preference.

Derived, inferred, and advisory information MUST NOT be relabeled authoritative without an explicit owner decision or a new authoritative observation.

### 5.6 Provenance

Every observation and derived claim links to provenance sufficient to audit its origin:

- source kind and source identity;
- observer or derivation;
- snapshot identity;
- coverage domain;
- supporting record identities;
- assumptions, when applicable.

Provenance closure and runtime correctness are different measures. Missing provenance does not by itself prove a runtime conclusion false.

## 6. Core records

An implementation uses these framework-independent concepts. Framework adapters MAY add namespaced fields.

### 6.1 Components and dependencies

- `Component`: stable identity, name, kind, lifecycle state, parent, liveness.
- `Dependency`: consumer identity, required key, direct provider when observed.
- `Binding`: consumer, dependency key, `target`, and `committed` epistemic carriers.

Direct and transitive impact are derived from dependency edges. A semantic slice may return the graph. It MUST NOT hide the graph behind a root-cause answer.

### 6.2 Services

- `ServiceImplementation`: stable identity, service key, provider identity.
- `registered`: implementation belongs to the registry.
- `visible`: implementation is currently eligible for consumption.

Registration and visibility are distinct lifecycle facts.

### 6.3 Effects

- `Effect`: stable identity, owner identity, label or class, parent, lifecycle status.
- `tracked`: the runtime owns and can observe the cleanup.
- `external`: cleanup truth lies outside the observer unless an oracle reports it.

The observer MUST declare coverage before asserting that an effect is absent or disposed.

### 6.4 Packages and runs

- `lastSuccessfulPackage`: the package whose activation last committed successfully;
- `nextTargetPackage`: the package selected for a failed or in-progress transition;
- `activeRun`: the currently live run, with its exact package;
- `latestAttempt`: the most recent activation attempt and its state.

These records are independent. `lastSuccessfulPackage` does not imply `activeRun`. A failed update may leave a last-successful package, a failed next target, and `KNOWN_ABSENT` active run. Recovery then requires an explicit lifecycle action; field names do not authorize it.

## 7. Workflow

The protocol has five stages:

```text
CONTRACT → OBSERVE → SEARCH → ASSURE → DELTA
```

### 7.1 CONTRACT

Resolve intent, authoritative requirements, hard constraints, protected frame, non-goals, and acceptance. Record unresolved requirements as `SPEC_GAP`.

### 7.2 OBSERVE

Request an issue-centered semantic slice. Use the semantic interface as the primary source for every domain marked `COMPLETE`. Use a native or external oracle only for a declared coverage gap, and record the escape and its provenance.

### 7.3 SEARCH

Generate candidate explanations or designs from the contract and observed slice. Separate facts from assumptions and advisory preferences. Compare candidates against the same hard constraints and protected frame.

### 7.4 ASSURE

Discharge mechanical obligations that the available checker or tests support. Assurance validates a candidate; it does not supply missing world facts or choose the design.

### 7.5 DELTA

Describe the smallest approved semantic change. The delta identifies changed identities and relations, preserved frame, preconditions, postconditions, validation, and rollback or recovery when relevant.

## 8. Semantic obligations

The standard assurance vocabulary is:

- `PRESERVE_UNKNOWN`: a conclusion dependent on an `UNKNOWN` operand remains `UNKNOWN` unless an explicit rule resolves it;
- `REQUIRE_TRUE_GUARD`: execute a protected action only when its guard is known true;
- `DISTINGUISH_ABSENCE`: do not treat `UNKNOWN` as `KNOWN_ABSENT`;
- `PRESERVE_AUTHORITY`: do not promote derived, inferred, or advisory information to authoritative;
- `PROTECT_FRAME`: do not change a protected item without approval;
- `CONFORM_DELTA`: implementation changes only the approved semantic delta.

A checker result is evidence about these obligations. It is not evidence that the checker increased model capability.

## 9. Result taxonomy

Every reviewed outcome uses one primary status:

- `SPEC_GAP`: an authoritative requirement is missing or contradictory;
- `UNKNOWN / INSUFFICIENT_EVIDENCE`: coverage cannot support the requested conclusion;
- `DESIGN_VIOLATION`: the proposal violates the approved contract;
- `SEMANTIC_REGRESSION`: observed post-state breaks a preserved semantic property;
- `IMPLEMENTATION_DEVIATION`: code differs from the approved delta;
- `PASS`: required evidence and obligations are satisfied.

Operational errors MAY use more specific names, but they map to one of these review outcomes.

## 10. Change discipline

Before a mutation, the proposal states:

- exact target identities;
- authoritative preconditions;
- expected relation changes;
- protected relations that remain unchanged;
- assurance and runtime validation;
- behavior if a required fact remains `UNKNOWN`.

After a mutation, re-observe the affected slice and compare it with the approved delta. Tests verify the external world when available; an Agent self-report is not sufficient.

## 11. Portable and native conformance

A Portable Skill conforms when it:

- follows the five-stage workflow;
- constructs a minimal issue-centered slice when no native semantic observer exists;
- labels coverage, provenance, authority, and uncertainty;
- does not require the user to read the formal foundation;
- does not generate project-specific Horn rules.

A native adapter conforms when it additionally:

- obtains dynamic truth from runtime state and tools;
- publishes a stable, small model-facing surface;
- keeps Host-owned state on the Host;
- logs model-visible observations under the host framework's durability policy;
- exposes explicit oracle escape for uncovered domains;
- remains a semantic interface unless separate evidence authorizes runtime control.

## 12. Versioning and extensions

The contract version changes when a consumer-visible meaning or required record changes. Additive namespaced fields do not change core meanings. Implementations report their contract version and adapter version in every slice.

An extension MUST document:

- new records or obligations;
- their authority and provenance;
- coverage semantics;
- interaction with the core epistemic carrier;
- compatibility with existing consumers.

## 13. Limits

This contract does not assert complete capture of arbitrary JavaScript control state, external systems, model continuity state, or uninstrumented effects. It does not authorize a semantic mirror to replace the Cordis/dsh executor. It also does not claim general correctness improvement or a shifted Agent capability boundary.
