# Software Space LLM Normalization: Shared Minimal Constraints

**Version:** 1.0

**Purpose:** Provide one semantic kernel for software design reification, software artifact reification, and specific issue normalization.

This document defines the world model, relational state, program encoding, execution configuration, knowledge classes, task slice, and design delta shared by all three tasks. Each task prompt selects the necessary sections and specifies its procedure and output.

---

## 1. Software Lifecycle World

Software Space represents a versioned, concurrent, reconfigurable software lifecycle world. It covers artifacts, runtime states, versions, edits, publication, call binding, deployment, rollback, environmental change, and their histories. Each language enters the model through its own signature and relational facts; the shared lifecycle vocabulary spans programs, versions, environments, executions, and evolutionary branches.

An objective software world is:

\[
W=
\langle
C_W,Q_W,A_W,N_W,\nu_W,\longrightarrow_W,\mathsf{Def}_W
\rangle .
\]

| Component | Meaning |
| --- | --- |
| \(C_W\) | Set of complete software configurations |
| \(Q_W\) | Set of objective state queries |
| \(A_W\) | Set of primitive lifecycle actions |
| \(N_W\) | Set of callable names |
| \(\nu_W\) | Query denotation |
| \(\longrightarrow_W\) | Primitive lifecycle transition |
| \(\mathsf{Def}_W\) | Current-definition interface |

A complete configuration has the form:

\[
c=(s,\kappa,\pi),
\]

where \(s\) contains artifacts, object state, versions, and the environment; \(\kappa\) contains active control and version bindings captured by continuations; and \(\pi\) contains scheduler, path, multipath, or isolation-cut information.

\(A_W\) distinguishes run, edit, and publish actions. It may also contain deploy, rollback, and environment actions. Every primitive action has the same relational semantic type.

Software Space uses six lifecycle capabilities:

| Capability | Meaning |
| --- | --- |
| empty | Empty behavior |
| act | Primitive action |
| then | Sequential composition |
| overlap | Legal interleaving |
| protect | Uninterrupted protected interval |
| resolve | Resolution of the current definition at a binding event |

The default doctrine uses left-to-right sequence, interleaving concurrency, protected intervals that do not suspend, and live unfold-time binding. Relational structure organizes software space; lifecycle paths organize software time. Together, they form software spacetime.

### 1.1 Observation Basis

Objective queries and lifecycle predecessors determine the distinctions that semantics must preserve. For a lifecycle term \(\theta\), define:

\[
Pre_\theta(X)
=
\{c\mid \exists c'\in X.\;cR_\theta^Wc'\}.
\]

The least observation domain, \(\mathsf{ReqObs}_W\), contains every \(\nu_W(q)\) and is closed under complements, arbitrary intersections, and every \(Pre_\theta\). \(\mathsf{ReqObs}_W\) is a semantic observation domain; a task slice \(S_I\) is a bounded relational state. Selected queries and lifecycle terms determine the distinctions that \(S_I\) retains.

---

## 2. Ground Relational State

Software Space represents the selected object world as ground atoms:

\[
D\subseteq HB_\Sigma.
\]

The signature \(\Sigma\) defines numbers, strings, node identifiers, program identifiers, function names, action codes, and domain-object constructors.

Every fact meets four requirements:

1. The fact is fully ground.
2. Its schema declares the predicate, arity, and argument sorts.
3. Its scope identifies the software objects, versions, and environments.
4. Its provenance identifies a source, deterministic derivation, or explicit assumption.

Domain predicates represent artifacts, architecture, interfaces, dependencies, runtime states, environments, versions, publication, and history. Code predicates represent \(L_0\) control. Both sets of predicates inhabit the same relational state.

~~~text
component(comp(api)).
interface(iface(api, submit)).
owns(comp(api), iface(api, submit)).
deployment(dep(prod), version(api, v17)).
~~~

---

## 3. Relational Programs and the Fixed Interpreter

### 3.1 \(L_0\) Program Encoding

The minimal object language \(L_0\) has six constructors:

\[
E ::=
skip
\mid primitive(a)
\mid seq(E,E)
\mid par(E,E)
\mid iso(E)
\mid call(f).
\]

The relational encoding assigns a ground node identifier to every syntax occurrence and generates one mutually exclusive descriptor:

~~~text
code_skip(Node).
code_prim(Node, Action).
code_seq(Node, Left, Right).
code_par(Node, Left, Right).
code_iso(Node, Child).
code_call(Node, Function).

entry(Program, Root).
current_def(Function, Root).
~~~

Object programs enter relational state as data:

\[
\rho(Q)\subseteq D.
\]

Ground relational facts carry object programs and domain logic. Seven generic Concurrent-Horn clauses form the fixed interpreter \(P_0\).

### 3.2 Identifiers and Well-Formedness

Derive each node identifier from its program, version, and occurrence path:

~~~text
node(Program, Version, OccurrencePath)
fun(Program, Module, LocalName)
~~~

Every program graph meets seven requirements:

1. Each syntax occurrence has one unique ground node identifier.
2. Independent immutable versions use disjoint node namespaces.
3. Function names use fully qualified ground terms.
4. Each reachable node has exactly one code descriptor.
5. Every child reference, entry root, and current-definition root exists.
6. Every primitive action is fully ground.
7. Every deterministic function has exactly one current root.

### 3.3 Fixed Interpreter

Seven \(P_0\) clauses interpret relational programs:

\[
\begin{aligned}
execute(Q)
&\leftarrow entry(Q,R)\otimes run(R)
\\
run(N)
&\leftarrow code\_skip(N)
\\
run(N)
&\leftarrow code\_prim(N,A)\otimes exec(A)
\\
run(N)
&\leftarrow code\_seq(N,L,R)\otimes run(L)\otimes run(R)
\\
run(N)
&\leftarrow code\_par(N,L,R)\otimes(run(L)\mid run(R))
\\
run(N)
&\leftarrow code\_iso(N,C)\otimes\odot run(C)
\\
run(N)
&\leftarrow code\_call(N,F)\otimes current\_def(F,R)\otimes run(R).
\end{aligned}
\]

---

## 4. CTR Execution and Object-Level Reflection

A CTR relational implementation has the form:

\[
\mathfrak S=
\langle
\mathcal D,O^d,O^t,P_0
\rangle_{CTR},
\qquad
O^d(D)=D.
\]

\(\mathcal D\) defines legal states, \(O^d\) queries relational facts, \(O^t\) executes primitive transitions, and \(P_0\) interprets object programs. The minimal interpreter uses a complete execution configuration:

\[
\boxed{(D,\Gamma,\Pi)}.
\]

| Component | Content |
| --- | --- |
| \(D\) | Object state and relational code |
| \(\Gamma\) | Active CTR goals or resolvents |
| \(\Pi\) | Path, multipath, and scheduling information |

When a task must query active control directly, reify tasks, program counters, stacks, or continuations in \(D\):

~~~text
active_task(Task, Node).
kont(Task, Frame, Next).
join_wait(Task, Left, Right).
~~~

Runtime execution and design search use separate transition namespaces:

\[
O^t_{run}
\qquad\text{and}\qquad
O^t_{edit}.
\]

\(P_0\) executes exec(Action) through \(O^t_{run}\). Design search changes an isolated relational snapshot through \(O^t_{edit}\).

Code descriptors, roots, and domain state inhabit \(D\). Object-level reflection uses ordinary relational queries to read code structure, current definitions, versions, and publication relations. Ordinary relational updates install immutable versions, compute relational deltas, update published roots, and reclaim old versions.

The default publication process first installs immutable facts under fresh identifiers, then updates current_def through an atomic root swap. A new call reads the new root at its binding event; an expanded continuation retains the old root. The system reclaims an old version after quiescence, an epoch condition, or reference tracking confirms that no active reference remains.

---

## 5. Grounding and Provenance

The grounding ledger separates facts, derivations, assumptions, advice, and unknowns.

| Class | Meaning |
| --- | --- |
| AUTHORITATIVE | Approved user statements, explicit issue text, formal specifications, source artifacts, or designated authoritative records |
| DERIVED | Results from parsers, relational queries, the fixed interpreter, checkers, or deterministic computations |
| INFERRED | Explanations, structures, causes, or candidates inferred by the LLM from context |
| ADVISORY | Nonbinding preferences, rankings, or recommendations |
| UNKNOWN | Claims that lack enough evidence or context |

Record each claim in one form:

~~~yaml
claim_id: <unique id>
class: AUTHORITATIVE | DERIVED | INFERRED | ADVISORY | UNKNOWN
role: AS_IS | TO_BE | CONSTRAINT | ASSUMPTION | OBSERVATION | PREFERENCE
statement: <single proposition>
scope: <software, version, component, and environment>
source: <file, issue, user, tool, or model>
locator: <section, symbol, commit, or query>
depends_on: [<claim ids>]
~~~

Class records a claim's origin; role records its function as a current fact, target, constraint, assumption, observation, or preference.

Original issue text, specifications, and artifact bytes provide AUTHORITATIVE records. Deterministic parsing and relational extraction produce DERIVED records. LLM explanations and candidates produce INFERRED records.

Provenance divides relational facts into four layers:

\[
D_{observed},
\qquad
D_{derived},
\qquad
D_{assumed},
\qquad
D_{proposed}.
\]

The current model \(D_0\) combines observed facts, derived facts, and approved assumptions admitted by the task contract. Candidate designs remain in a separate proposed layer.

---

## 6. Minimal Software-Space Slice

Each task constructs the smallest slice that can express its current objective. The slice starts with relevant entities, versions, interfaces, boundaries, queries, actions, lifecycle states, and constraints.

Close the slice over five dependencies:

1. Include referenced entities.
2. Follow typed dependencies and ownership.
3. Include selected lifecycle predecessors.
4. Close call, publication, and version bindings.
5. Close constraint and observation dependencies.

Stop expanding the slice when it can express the current state, behavior, constraints, and observations. Record its scope, seeds, included facts, explicit exclusions, and open dependencies.

---

## 7. Relational Designs and Deltas

Let \(D_0\) denote the current relational design. Ground-fact edits generate candidate designs:

\[
\Delta_i=(Del_i,Ins_i),
\qquad
D_i=(D_0-Del_i)\cup Ins_i.
\]

Represent the selected design as \(D^*\) and its delta as \(\Delta^*=(D_0-D^*,D^*-D_0)\).

The primitive edit actions are:

\[
ins(quote(Fact))
\qquad\text{and}\qquad
del(quote(Fact)).
\]

Typed transactions combine these actions to express replacement, movement, splitting, merging, redirection, and publication.

Design search uses the following parameters:

| Symbol | Meaning |
| --- | --- |
| \(D_0\) | Initial quiescent design snapshot |
| \(\Sigma_s\) | Finite typed search signature |
| \(E\) | Enumerable edit transactions |
| \(\sim_B\) | Bounded search congruence |
| \(H\) | Hard constraints |
| \(\mathbf J\) | Objective vector |
| \(R\) | Change regularization |
| \(M\) | Edit-permission mask |
| \(B\) | Bounds on carriers, terms, facts, edits, observations, concurrency, and evaluators |

\(\sim_B\) preserves \(H\), \(\mathbf J\), and successor equivalence classes.

Hard constraints decompose as:

\[
H(D)=
H_{wf}(D)
\land
H_{R_h}(D)
\land
H_{protect}(D,D_0)
\land
H_{business}(D)
\land
H_{quality}(D).
\]

\(H_{wf}\) checks structural validity; \(H_{R_h}\) checks mandatory behavior; \(H_{protect}\) preserves protected components and interfaces; and \(H_{business}\) and \(H_{quality}\) check domain rules and nonnegotiable quality thresholds.

Change regularization uses:

\[
R(D,D_0)
=
d_{W,M}(D,D_0)
=
\sum_{c:M(c)=1}
w_c\,\Delta_c(D,D_0).
\]

\(M(c)=0\) marks a component immutable; \(w_c\) measures the cost of changing an editable component. Use \(R\) as the edit-distance objective in \(\mathbf J\). LLM guidance proposes and ranks candidate deltas \(\Delta_i\).

---

## 8. Unified Information Package

All tasks exchange the same composable objects:

~~~yaml
Grounding:
  claims: [...]
  conflicts: [...]
  unknowns: [...]

World:
  scope: <software, version, and environment>
  configuration: <selected s, kappa, and pi>
  queries: <selected Q>
  actions: <selected A>
  names: <selected N>
  definitions: <selected Def>
  doctrine: <then, overlap, protect, and resolve>

Slice:
  scope: <bounded software space>
  bounds: <scope and closure bounds>
  seeds: [...]
  facts: <ground relational facts>
  exclusions: [...]
  open_dependencies: [...]

Model:
  schema: <predicates, arities, and sorts>
  identifiers: <canonical node and name terms>
  facts:
    observed: [...]
    derived: [...]
    assumed: [...]
    proposed: [...]
  anchors: <source or design anchors>
  descriptors: <code facts>
  roots: <entry and current-definition facts>
  well_formedness: <results>

Execution:
  state: <D>
  control: <Gamma or reified control facts>
  path: <Pi>
  behavior: <selected lifecycle terms and traces>
  witness: <D0 reaches the target state through tau>

Design:
  current: <D0>
  signature: <Sigma_s>
  edits: <E>
  congruence: <sim_B>
  hard_constraints: <H>
  objectives: <J>
  regularization: <R>
  permission_mask: <M>
  bounds: <B>
  candidates: [<Di>]
  selected: <D_star>
  deltas: [<Del and Ins pairs>]
  constraint_results: <H(Di)>
  behavior_comparison: <preserved and intentionally changed observations>
~~~

Each task uses the following minimum payload:

| Task | Minimum information |
| --- | --- |
| Software design reification | Grounding, World, Slice, and Model; add descriptors, roots, and well-formedness for executable structures; add Execution for state machines or lifecycle behavior |
| Software artifact reification | Grounding, World, Slice, Model, source anchors, identifiers, descriptors, roots, and well-formedness; add Execution for runtime semantics |
| Specific issue normalization | Grounding, World, Slice \(S_I\), current model \(D_0\), Design, and \(\Delta\); add a failure witness and behavior comparison for behavioral issues |

All tasks use the same semantics, predicates, identifiers, knowledge classes, and relational deltas.
