# Software Space as a Concurrent Transaction Deductive Database: Executable Semantics and Bounded Design Search

## 0. Abstract

This document gives the Software Space executable world model and its bounded
design-search extension a precise semantic formulation. A Software Space is
represented by a relational database state, a relational data oracle, a
transition oracle, and a fixed Concurrent-Horn transaction base, all
interpreted by Concurrent Transaction Logic (CTR).

The central distinction is:

\[
\boxed{
\text{state-representation completeness}
\neq
\text{transition-simulation completeness}
\neq
\text{concurrency-structure preservation}
}
\]

The bounded design-search extension adds two further distinctions:

\[
\boxed{
\text{execution adequacy}
\neq
\text{search adequacy}
\neq
\text{useful search}.
}
\]

Search adequacy is a mathematical property of an admissibly bounded search
instance. Useful search is a probabilistic and empirical hypothesis about the
landscape, evaluators, priors, and human acceptance. The former is proved here;
the latter is stated in measurable form and is not promoted to a theorem.

The first two properties hold for every effectively representable classical digital transition system. The third is conditional: a compositional mapping of sequence, parallel composition, and atomic regions is available only when the source concurrency semantics is compatible with CTR's interleaving and atomic-execution model.

The document makes the fixed interpreter concrete. It defines a small kernel object language \(L_0\), a computable injective relational encoding \(\rho\), and a seven-clause Concurrent-Horn transaction base \(P_0\). For finite executions, \(P_0\) is proved operationally adequate for \(L_0\): it is sound and complete for the source transition system, with exact correspondence on primitive state-changing actions and weak correspondence on administrative rule unfolding and database queries. A commuting-conversion lemma normalizes arbitrary successful finite deductions without moving a code query across an update. Atomic source regions correspond to complete, uninterrupted CTR proof segments.

Programs are reified as ground relational facts:

\[
\rho(Q)\subseteq D.
\]

Program replacement is therefore an ordinary transition over \(D\). The default update policy adopted here is live, unfold-time binding with atomic publication: an unexpanded code node or call consults the current relational state, while control already expanded into the CTR resolvent continues from the node identifiers it has captured.

One boundary is essential. In the minimal interpreter, the active continuation is carried by the CTR proof resolvent, not by facts in \(D\). Consequently, the theorem proves relational reification of object code and object state, but it does not make the active proof continuation queryable as object-level data. A model that requires reflective access to live program counters, stacks, or pending continuations must reify them explicitly with task and continuation facts. This is an optional stronger machine construction, not a consequence of the no-program-counter interpreter.

The resulting theorem hierarchy is:

1. CTR well-formedness;
2. general state representation;
3. general forward operational simulation, with exact correspondence on a deliberately restricted image;
4. conditional compositional preservation of interleaving concurrency;
5. program reification;
6. finite-trace operational adequacy of \(P_0\) for \(L_0\).

For the design-only search phase, the document additionally defines a separate
edit oracle and proves:

7. exact reachability distance for the relational insert/delete edit basis;
8. finiteness of every admissibly bounded quotient search space;
9. termination and reachability completeness of fair tabled search;
10. exact recovery of the bounded feasible Pareto set;
11. correctness of exact canonicalization with collision-safe hashing;
12. conditional round-trip and frame laws for a partial resourceful source
    lens;
13. preservation of the exact result by a deterministic fast/slow guided
    scheduler; and
14. conditional lifting of exportable relational solutions back to concrete
    artifacts.

The search theorem is deliberately bounded. It does not claim decidability of
unbounded program equivalence, termination of unrestricted proof search, or a
practical complexity bound for exact graph canonization.

The original executable world model is thereby given a semantic refinement, not claimed to be preserved literally or to cover concurrency models stronger than CTR.

---

# 1. Background and Scope

## 1.1 Transaction Logic

A relational database state may be represented as a set of ground atoms:

\[
D\subseteq HB_\Sigma,
\]

where \(HB_\Sigma\) is the Herbrand base induced by a first-order signature \(\Sigma\).

Ordinary Horn logic describes consequences within a state. Transaction Logic adds a semantics for formulas whose execution traverses a sequence of states. Its serial conjunction

\[
\phi\otimes\psi
\]

means that \(\phi\) executes first and \(\psi\) executes from the state at which \(\phi\) finishes.

Transaction Logic separates two kinds of primitive semantics from logical composition:

- a data oracle \(O^d\), which gives formulas true in a state;
- a transition oracle \(O^t\), which gives elementary transaction atoms true over a pair of states.

For a relational state, the canonical data oracle is:

\[
O^d(D)=D.
\]

## 1.2 Concurrent Transaction Logic

Concurrent Transaction Logic extends serial Transaction Logic with concurrent conjunction and an atomicity modality. This document writes the three relevant operators as:

\[
\phi\otimes\psi,
\qquad
\phi\mid\psi,
\qquad
\odot\phi.
\]

Their intended readings are, respectively, serial execution, interleaved concurrent execution, and execution without suspension or interleaving by another concurrent process.

CTR interprets concurrent computations over multipaths. Serial conjunction is based on multipath concatenation, concurrent conjunction on interleaving, and atomicity on the requirement that the selected subtransaction execute on a path rather than a suspended multipath ([Bonner and Kifer 1996, §§3–4](https://www3.cs.stonybrook.edu/~kifer/TechReports/concurrent-trans-logic.pdf)). This is an interleaving account of concurrency. It does not by itself preserve the event structures of true-concurrency models, weak-memory executions, quantitative time, or probabilistic schedulers.

## 1.3 Concurrent-Horn

A concurrent serial goal is generated by:

\[
G ::= A
\mid G\otimes G
\mid G\mid G
\mid \odot G,
\]

where \(A\) is atomic. A Concurrent-Horn rule has the form:

\[
A\leftarrow G.
\]

The Concurrent-Horn proof system uses four relevant kinds of inference:

1. replace a hot atomic transaction by the body of a matching transaction rule;
2. discharge a hot query through the data oracle without changing the database;
3. execute a hot elementary update through the transition oracle;
4. extract and execute a hot atomic subtransaction to completion before resuming the surrounding goal.

The hot components of a serial goal occur only in its leftmost unfinished component; the hot components of a concurrent goal are the union of the hot components of its branches. This is the proof-theoretic source of serial order and interleaving.

For the Concurrent-Horn fragment, the transaction base must also satisfy an independence condition: predicates defined by transaction-rule heads may not be defined in rule bodies returned by the data oracle ([Bonner and Kifer 1996, §4](https://www3.cs.stonybrook.edu/~kifer/TechReports/concurrent-trans-logic.pdf)). With \(O^d(D)=D\), the data oracle returns ground atoms and no rule bodies, so this condition is immediate provided the transaction-head predicates are reserved for \(P_0\).

## 1.4 CTDD as a Shorthand

This document uses **Concurrent Transaction Deductive Database (CTDD)** as a descriptive name for a deductive database instantiated with CTR semantics. It is not a new logic layered above CTR.

The semantic package is written:

\[
\mathfrak S=
\langle
\mathcal D,O^d,O^t,P_0
\rangle_{\mathrm{CTR}},
\]

where \(\mathcal D\) is a set of legal database states, \(O^d\) and \(O^t\) are CTR oracles, and \(P_0\) is a Concurrent-Horn transaction base.

---

# 2. Claims and Their Exact Strength

The theory does not use a single undifferentiated completeness claim.

## 2.1 State Representation

For a software configuration space \(C\), the required property is a computable injection:

\[
enc:C\hookrightarrow\mathcal D.
\]

This says that a complete source configuration can be represented losslessly as relational state. It says nothing yet about execution.

## 2.2 Operational Simulation

For a labeled transition system \(M=(C,A,\rightarrow)\), the required forward property is:

\[
c\xrightarrow{a}c'
\Longrightarrow
enc(c)\xrightarrow{\ulcorner a\urcorner}enc(c').
\]

This is an operational simulation. Reflection of target transitions, preservation of observations, bisimulation, and contextual equivalence are additional properties and do not follow from state encoding alone.

## 2.3 Concurrency-Structure Preservation

The compositional equations

\[
\llbracket E;F\rrbracket
=
\llbracket E\rrbracket\otimes\llbracket F\rrbracket,
\]

\[
\llbracket E\parallel F\rrbracket
=
\llbracket E\rrbracket\mid\llbracket F\rrbracket,
\]

and

\[
\llbracket atomic(E)\rrbracket
=
\odot\llbracket E\rrbracket
\]

are claimed only for source languages whose operational scheduler and atomic regions have the corresponding CTR interleaving behavior.

## 2.4 Program Reification

Object programs are encoded as relational facts, not identified with the fixed transaction base:

\[
Q\xrightarrow{\rho}\rho(Q)\subseteq D,
\qquad
Q\neq P_0.
\]

The architecture is:

\[
\boxed{
Q
\xrightarrow{\rho}
\text{relational program facts}
\xrightarrow{P_0}
\text{CTR execution}
}.
\]

Ground program facts in \(D\) are data-oracle facts. They are not themselves Concurrent-Horn rules. The Concurrent-Horn clauses are the fixed clauses of \(P_0\).

---

# 3. Formal Software Space

## 3.1 Signature and States

Let \(\Sigma\) be a countable first-order signature containing constructors for natural numbers, finite strings, node identifiers, program identifiers, function names, and action codes. Let \(HB_\Sigma\) be its Herbrand base.

A database state is a set of ground atoms:

\[
D\subseteq HB_\Sigma.
\]

Let \(\mathcal D\subseteq2^{HB_\Sigma}\) be the selected class of legal CTR states. States may be finite or effectively enumerable. For the executable kernel below, code reachable from a published program root is finite, although recursion through calls may produce unbounded execution.

The predicate vocabulary is partitioned. The state predicates `entry`, `current_def`, and `code_*` may occur in \(D\). The transaction predicates `execute` and `run`, and the transition predicate `exec`, are reserved and do not occur as data facts in \(D\).

The relational data oracle is:

\[
\boxed{O^d(D)=D.}
\]

The transition oracle has the CTR type:

\[
O^t:\mathcal D\times\mathcal D\to2^{HB_\Sigma}.
\]

An elementary action code \(a\) is invoked through the fixed predicate \(exec\):

\[
exec(a)\in O^t(D,D')
\]

means that action \(a\) may transform \(D\) into \(D'\). The predicate symbol is fixed; \(a\) is a ground first-order term. No higher-order predicate variable is required.

## 3.2 Kernel Object Language \(L_0\)

The kernel syntax is:

\[
E ::= skip
\mid primitive(a)
\mid seq(E,E)
\mid par(E,E)
\mid iso(E)
\mid call(f).
\]

A program \(Q\) consists of a finite entry expression and a finite collection of named definitions. Calls may be recursive. The language is deliberately small: it contains exactly the control constructors needed to test the corresponding CTR composition operators, relative to a chosen primitive action set. It is not claimed that these six constructors alone form a convenient or independently universal surface language.

Using a Horn fragment of CTR to give executable descriptions of source-language semantics has prior precedent; the contribution required here is the explicit relational code encoding, fixed interpreter, and correspondence proof rather than that general methodological observation alone (Santos 2006).

Parameters, environments, conditions, pattern matching, exceptions, and return values can be represented by additional relational facts and primitive tests, or by extending the node vocabulary. They are not needed for the control adequacy proof.

## 3.3 Relational Program Encoding \(\rho\)

Assign a globally fresh ground node identifier to every syntax-tree occurrence. Encode nodes with the following mutually exclusive predicates:

```text
code_skip(Node).
code_prim(Node, Action).
code_seq(Node, Left, Right).
code_par(Node, Left, Right).
code_iso(Node, Child).
code_call(Node, Function).
```

Program and definition roots are represented by:

```text
entry(Program, Root).
current_def(Function, Root).
```

For example, \(seq(primitive(a),call(f))\) with root \(n_0\) may be encoded by:

```text
code_seq(n0, n1, n2).
code_prim(n1, a).
code_call(n2, f).
entry(q, n0).
```

Choose node identifiers canonically from the program identifier and the path of each AST occurrence. Then \(\rho\) is computable and injective. A decoder reconstructs the unique tree by following child identifiers from `entry` and `current_def` roots.

A code state is **well formed** when:

1. every reachable node has exactly one descriptor among the six `code_*` predicates;
2. every referenced child node exists;
3. every published entry or definition root exists;
4. node identifiers of independently installed immutable versions are disjoint;
5. every action term in `code_prim` is ground.

Multiple `current_def(f,r)` facts may intentionally represent nondeterministic definitions. The deterministic sublanguage requires exactly one current root per function.

### 3.3.1 Namespace Discipline

The finite kernel treats every function name as a globally qualified ground term. For example:

```text
fun(Program, Module, LocalName)
```

may occupy the `Function` argument of `code_call` and `current_def`. The short symbol `f` used in examples is an abbreviation for such a qualified term. Consequently, independently installed programs do not accidentally share `main`, `parse`, or `init` merely because those local names are equal.

An implementation that keeps local names unqualified may instead use:

```text
code_call(Node, Program, Function).
current_def(Program, Function, Root).
```

and the corresponding internal control `invoke(Program, Function)`. Threading this additional ground argument through the call clause, the source rules, and \(\Phi\) is a conservative parameterization: it changes neither the control operators nor the adequacy proof. The two-argument `current_def` schema below is retained to keep the single-kernel proof uncluttered.

## 3.4 The Fixed Concurrent-Horn Interpreter \(P_0\)

The fixed transaction base is the following seven-clause program:

\[
\begin{aligned}
execute(Q)
&\leftarrow
entry(Q,R)\otimes run(R)
\\[2mm]
run(N)
&\leftarrow
code\_skip(N)
\\[2mm]
run(N)
&\leftarrow
code\_prim(N,A)\otimes exec(A)
\\[2mm]
run(N)
&\leftarrow
code\_seq(N,L,R)\otimes run(L)\otimes run(R)
\\[2mm]
run(N)
&\leftarrow
code\_par(N,L,R)\otimes\bigl(run(L)\mid run(R)\bigr)
\\[2mm]
run(N)
&\leftarrow
code\_iso(N,C)\otimes\odot run(C)
\\[2mm]
run(N)
&\leftarrow
code\_call(N,F)\otimes current\_def(F,R)\otimes run(R).
\end{aligned}
\]

All rule heads are atomic. Every body is a concurrent serial goal. The predicates `entry`, `current_def`, and `code_*` are data-oracle predicates. The predicate `exec` is a transition-oracle predicate. The predicates `execute` and `run` are reserved transaction predicates defined only by \(P_0\).

The rules are therefore genuine first-order Concurrent-Horn rules, not meta-syntactic pseudocode.

## 3.5 Source Control Machine

After a syntax node is unfolded, the remaining source control is represented by a control term:

\[
K ::= \mathbf 0
\mid n
\mid do(a)
\mid invoke(f)
\mid K;K
\mid K\parallel K
\mid iso(K),
\]

where \(n\) is a node identifier, \(do(a)\) is a primitive action already fetched from a code node, \(invoke(f)\) is a call target already fetched but not yet bound to its current definition root, and \(\mathbf 0\) is completed control. The two internal forms expose the exact points at which a concurrent code update may occur.

Control terms are considered modulo the least structural congruence containing:

\[
\mathbf 0;K\equiv K,
\qquad
K;\mathbf 0\equiv K,
\]

\[
\mathbf 0\parallel K\equiv K,
\qquad
K\parallel\mathbf 0\equiv K,
\]

and associativity of serial and parallel composition. No commutativity of serial composition is assumed. Parallel composition may be treated as commutative if the source language does so.

The non-atomic transition rules are:

\[
\frac{code\_skip(n)\in D}
{\langle n,D\rangle\xrightarrow{\tau}\langle\mathbf 0,D\rangle}
\tag{Skip}
\]

\[
\frac{code\_prim(n,a)\in D}
{\langle n,D\rangle\xrightarrow{\tau}\langle do(a),D\rangle}
\tag{Prim-Unfold}
\]

\[
\frac{exec(a)\in O^t(D,D')}
{\langle do(a),D\rangle\xrightarrow{a}\langle\mathbf 0,D'\rangle}
\tag{Exec}
\]

\[
\frac{code\_seq(n,l,r)\in D}
{\langle n,D\rangle\xrightarrow{\tau}\langle l;r,D\rangle}
\tag{Seq}
\]

\[
\frac{code\_par(n,l,r)\in D}
{\langle n,D\rangle\xrightarrow{\tau}\langle l\parallel r,D\rangle}
\tag{Par}
\]

\[
\frac{code\_iso(n,c)\in D}
{\langle n,D\rangle\xrightarrow{\tau}\langle iso(c),D\rangle}
\tag{Iso-Unfold}
\]

\[
\frac{code\_call(n,f)\in D}
{\langle n,D\rangle\xrightarrow{\tau}\langle invoke(f),D\rangle}
\tag{Call-Unfold}
\]

\[
\frac{current\_def(f,r)\in D}
{\langle invoke(f),D\rangle\xrightarrow{\tau}\langle r,D\rangle}.
\tag{Call-Bind}
\]

Serial and parallel contexts propagate transitions:

\[
\frac{\langle K,D\rangle\xrightarrow{\ell}\langle K',D'\rangle}
{\langle K;L,D\rangle\xrightarrow{\ell}\langle K';L,D'\rangle},
\tag{Serial-Ctx}
\]

\[
\frac{\langle K,D\rangle\xrightarrow{\ell}\langle K',D'\rangle}
{\langle K\parallel L,D\rangle\xrightarrow{\ell}\langle K'\parallel L,D'\rangle},
\tag{Par-L}
\]

with the symmetric `Par-R` rule. Here \(\ell\in\{\tau\}\cup Act\).

To model isolation, write:

\[
\langle K,D\rangle
\Downarrow_{\vec a}
\langle\mathbf 0,D'\rangle
\]

when \(K\) has a finite complete execution from \(D\) to \(D'\), with administrative \(\tau\)-steps erased and primitive action trace \(\vec a\). Then:

\[
\frac{
\langle K,D\rangle
\Downarrow_{\vec a}
\langle\mathbf 0,D'\rangle
}
{
\langle iso(K),D\rangle
\xrightarrow{atomic(\vec a)}
\langle\mathbf 0,D'\rangle
}.
\tag{Atomic}
\]

The rule is a macro-step only with respect to the surrounding scheduler. Its internal action trace is retained. This is the correct granularity for comparison with CTR's atomic inference rule, which executes an atomic hot subtransaction to completion before resuming the surrounding concurrent goal.

## 3.6 Continuations as CTR Resolvents

Define a compositional map from source control to CTR goals:

\[
\begin{aligned}
\Phi(\mathbf 0)&=(),\\
\Phi(n)&=run(n),\\
\Phi(do(a))&=exec(a),\\
\Phi(invoke(f))&=(\exists R)\bigl(current\_def(f,R)\otimes run(R)\bigr),\\
\Phi(K;L)&=\Phi(K)\otimes\Phi(L),\\
\Phi(K\parallel L)&=\Phi(K)\mid\Phi(L),\\
\Phi(iso(K))&=\odot\Phi(K).
\end{aligned}
\]

The variable \(R\) in each \(\Phi(invoke(f))\) occurrence is fresh and existentially scoped to that occurrence.

The empty goal \(()\) is the successful completed transaction in the CTR proof system.

The key correspondence is:

\[
\boxed{
\text{source continuation }K
\quad\longleftrightarrow\quad
\text{CTR proof resolvent }\Phi(K)
}.
\]

For example, resolving and querying a sequential node produces:

\[
run(n)
\Longrightarrow_{adm}^{+}
run(l)\otimes run(r),
\]

where the administrative segment first applies the matching \(P_0\) rule and then discharges `code_seq(n,l,r)` through \(O^d(D)\). No transition-oracle step occurs, so \(D\) is unchanged.

Similarly:

\[
run(n)
\Longrightarrow_{adm}^{+}
exec(a)
\Longrightarrow_{a}
(),
\]

for a primitive node. The final step is exactly one application of the transition oracle.

## 3.7 Default Self-Modification Policy

The default policy is **live, unfold-time binding with atomic publication**.

Every unexpanded `run(n)` consults the node descriptor in the current state. A call first captures its function name as \(invoke(f)\), then consults `current_def(f,r)` in the state current at binding time. A primitive first captures its action term as \(do(a)\), then executes that action from the state current at execution time. Once a node has been expanded, the identifiers or terms it contributed to the proof resolvent are not retroactively replaced.

Thus a running process observes an update precisely when the corresponding descriptor, definition-root, or action-execution stage has not yet passed its lookup boundary. This is more exact than the informal phrase “all later execution uses the newest code.”

The preferred publication transition is a single primitive pointer swap:

\[
exec\bigl(publish(f,r_{old},r_{new})\bigr)\in O^t(D,D')
\]

iff:

\[
current\_def(f,r_{old})\in D
\]

and:

\[
D'=
\bigl(D-\{current\_def(f,r_{old})\}\bigr)
\cup
\{current\_def(f,r_{new})\}.
\]

New immutable node facts may be installed before publication. Because they are unreachable until the pointer swap, their partial installation does not affect callers. The pointer swap is an ordinary transition-oracle action; it introduces no new ontology for code.

Old versioned node facts must remain available while any active resolvent may still contain their identifiers. Safe reclamation therefore requires a quiescence or epoch condition, or explicit reified reference tracking. Atomic root publication makes the new version visible; it does not by itself prove that deleting the old version is safe.

A multi-update replacement may instead be wrapped in \(\odot\), which prevents another CTR process from interleaving during that compound replacement. This prevents observation of a delete/insert gap. It does not rewind a continuation that already resolved the old root.

Snapshot execution is a different policy. It can be implemented by pinning a version at call entry and interpreting only nodes of that immutable version. A fully relational version uses facts such as `pinned(Task,Version)` rather than relying on an unspecified in-memory AST extraction. Snapshot semantics is not the default of \(P_0\).

## 3.8 The No-Program-Counter Boundary

The minimal interpreter intentionally carries active control in the proof resolvent. This has a precise consequence.

**Lemma 1 — Non-reification of active control.** Suppose two running configurations have the same database state \(D\) but distinct pending continuations \(K_1\not\equiv K_2\). If their representation contains only \(D\), with no task or continuation facts, then the representation is not injective.

**Proof.** Both configurations map to the same set of relational facts \(D\). Therefore no query over \(D\) can distinguish them, and the map from complete running configurations to relational states is not injective. \(\square\)

This does not contradict the general state-representation theorem. A full running configuration, including \(K\), can be encoded relationally. The minimal \(P_0\) simply chooses a different factorization in which \(K\) is represented intensionally by the active CTR goal. To combine full relational reflection with execution adequacy, an extended interpreter must maintain the relational control encoding as it executes.

Accordingly, the complete semantic execution configuration of the minimal architecture is:

\[
\boxed{
(D,\Gamma,\Pi)
}
\]

where \(D\) is relational object state and reified program code, \(\Gamma\) is the set of active CTR goals or resolvents, and \(\Pi\) is the current path or multipath information.

If active program counters, stacks, tasks, or continuations must themselves be queryable and mutable object-level data, they must be reified explicitly, for example:

```text
active_task(Task, Node).
kont(Task, Frame, Next).
join_wait(Task, Left, Right).
```

Such a machine is compatible with CTDD, but its interpreter is larger and its stable-step adequacy theorem is a separate construction. The no-program-counter interpreter cannot be used simultaneously as proof that active control is already in \(D\).

---

# 4. Theorems

## 4.1 Theorem 1 — CTR Well-Formedness

**Theorem.** Let \(\mathcal D\) be a class of CTR state identifiers represented as ground relational states. Let \(O^d(D)=D\). Let \(O^t\) map pairs of states to sets of ground elementary transaction atoms. Let \(P_0\) be the seven clauses of Section 3.4, with `execute` and `run` reserved from the data-oracle vocabulary. Then:

\[
\boxed{
P_0\in CH_{CTR}
\land
(O^d,O^t)\text{ are legal CTR oracles}
\Longrightarrow
\mathfrak S
=
\langle\mathcal D,O^d,O^t,P_0\rangle_{CTR}
\text{ is a Concurrent-Horn CTR instance.}
}
\]

**Proof.** Every head in \(P_0\) is atomic. Every body is generated from atomic goals by \(\otimes\), \(\mid\), and \(\odot\), so every clause is Concurrent-Horn. The relational oracle returns ground atoms and no rules. Hence no predicate occurring in a rule head of \(P_0\) occurs in a rule body returned by \(O^d\), and the Concurrent-Horn independence condition holds. The data and transition oracles have the required CTR types. The multipath satisfaction relation and proof theory are inherited unchanged from CTR. \(\square\)

This theorem discharges the former assumption that a suitable \(P_0\) merely exists.

## 4.2 Theorem 2 — State Representation

Call a configuration space \(C\) **effectively representable** when there is a computable injection:

\[
\gamma:C\hookrightarrow\{0,1\}^*.
\]

**Theorem.** Every effectively representable configuration space has a computable injective relational encoding into finite database states. The state class \(\mathcal D\) can be chosen to contain this encoded image.

**Construction.** For \(\gamma(c)=b_0b_1\ldots b_{n-1}\), define:

\[
enc(c)=
\{length(\bar n)\}
\cup
\{bit(\bar i,b_i)\mid 0\le i<n\}.
\]

Here \(\bar i\) is the canonical ground numeral for \(i\).

**Proof.** The map is computable. The `length` fact and indexed `bit` facts reconstruct \(\gamma(c)\) uniquely. Since \(\gamma\) is injective, \(enc\) is injective. Each image is a finite set of ground atoms. \(\square\)

Structured encodings for heaps, files, stacks, networks, deployments, or code are preferable in practice, but this bit-relation construction proves existence without assigning any of those components a privileged ontology.

For a canonical computably enumerable infinite description, the same construction yields an effectively enumerable relational state. The finite theorem already covers physical classical machines at a fixed instant under the usual finite-description assumption.

## 4.3 Theorem 3 — Operational Simulation

Let:

\[
M=(C,A,\rightarrow)
\]

be an effectively presented labeled transition system, and let \(enc\) be the encoding of Theorem 2. Choose a computable injection \(\alpha:A\hookrightarrow Terms_\Sigma\).

Define a dedicated transition-oracle predicate `sim_step` by:

\[
sim\_step(\alpha(a))
\in
O^t(enc(c),enc(c'))
\]

whenever:

\[
c\xrightarrow a c'.
\]

Then:

\[
\boxed{
c\xrightarrow a c'
\Longrightarrow
enc(c)
\xrightarrow{sim\_step(\alpha(a))}
enc(c').
}
\]

**Proof.** Immediate from the construction of \(O^t\). \(\square\)

This is a general forward operational simulation. It is intentionally independent of \(P_0\): it proves that CTR's oracle interface can host the source transition relation, not that the fixed meta-interpreter derives it from reified source code.

**Exact-image corollary.** If, on pairs of states in \(enc(C)\), `sim_step` is included in \(O^t\) iff the corresponding source transition exists, then:

\[
c\xrightarrow a c'
\iff
sim\_step(\alpha(a))
\in
O^t(enc(c),enc(c')).
\]

This is transition reflection on the encoded image. It still does not establish observational or contextual equivalence without a source/target observation relation.

## 4.4 Conditional Theorem 4 — Compositional Concurrency Preservation

**Compatibility assumptions.** Assume the source language:

1. gives \(E;F\) left-to-right completion semantics;
2. gives \(E\parallel F\) an interleaving scheduler whose enabled steps are the union of the enabled steps of the components;
3. gives `atomic(E)` a complete execution segment that cannot be interleaved by a sibling process;
4. uses the same primitive transition relation represented by \(O^t\).

**Theorem.** Under these assumptions, the homomorphic mapping:

\[
;\mapsto\otimes,
\qquad
\parallel\mapsto\mid,
\qquad
atomic\mapsto\odot
\]

preserves and reflects finite primitive-action traces, modulo administrative proof steps and source structural congruence.

**Proof sketch.** Induct on the derivation of a finite source trace. The hot-component definition for \(\otimes\) enables only the left unfinished component, matching serial execution. The hot components of \(\mid\) are the union of those of its branches, matching source interleaving. CTR's atomic inference rule extracts the selected atomic goal and proves it to completion before returning to the surrounding goal, matching the source atomic segment. The reverse induction uses the same three cases. \(\square\)

The assumptions exclude automatic preservation of true-concurrency partial orders, weak-memory reads-from relations, timed deadlines, probabilistic weights, and fairness constraints. Such structures require a richer source-to-target argument or an extended oracle/logic.

## 4.5 Theorem 5 — Program Reification

**Theorem.** For every finite \(L_0\) program \(Q\), the construction in Section 3.3 gives a computable injective relational encoding:

\[
\rho:Program_{L_0}\hookrightarrow\mathcal D
\]

such that:

\[
\rho(Q)\subseteq D.
\]

**Proof.** Canonical occurrence addresses assign distinct ground identifiers. Exactly one descriptor records each syntax constructor and its children. Entry and definition facts identify all roots. A structural decoder reconstructs the finite ASTs, so \(\rho\) is injective. \(\square\)

**Corollary — Program replacement is state replacement.** If \(D\) contains exactly the published facts of \(Q\), then replacing them with those of \(Q'\) has the ordinary relational form:

\[
D'
=
\bigl(D-\rho(Q)\bigr)
\cup
\rho(Q').
\]

For a quiescent system, this equation is a complete replacement. For a concurrent running system, immutable installation plus atomic root publication is preferable because it avoids transiently dangling program roots. Deletion of \(\rho(Q)\) must be delayed until no active resolvent can reference the old nodes.

## 4.6 Theorem 6 — Operational Adequacy of \(P_0\)

We now connect the source control semantics of Section 3.5 to the actual Concurrent-Horn proof execution of \(P_0\).

Write:

\[
\langle P_0,D,G\rangle
\Rightarrow_{adm}
\langle P_0,D,G'\rangle
\]

for a successful CTR proof inference that applies a transaction definition or discharges a data query without changing \(D\). Write:

\[
\langle P_0,D,G\rangle
\Rightarrow_a
\langle P_0,D',G'\rangle
\]

when one hot occurrence of \(exec(a)\) is discharged through \(O^t(D,D')\). Structural normalization removes empty goals and reassociates serial or concurrent goals without changing the database.

Define the cross-language relation:

\[
\langle K,D\rangle
\;\mathcal R\;
\langle P_0,D,\Phi(K)\rangle.
\]

In this section, a source control term is **closed** when every node identifier, action term, and function term occurring in it is ground. The only variables introduced during target execution are variables standardized apart in a selected \(P_0\) clause and the occurrence-local existential root in \(\Phi(invoke(f))\).

### Lemma 2 — Administrative Permutation

Let \(\delta\) be a CTR transaction-definition inference that expands a hot occurrence of `run` or `execute`. Let \(\sigma\) be an inference selected from a different hot branch of a concurrent goal, or a completed atomic segment selected from such a branch. Assume that:

1. the initial kernel goal is closed;
2. the clause used by \(\delta\) is standardized apart from the entire current goal, as required by the CTR inference rule;
3. \(\sigma\) does not select the discriminator query introduced by \(\delta\).

If a successful deduction contains the local fragment:

\[
\mathcal C_0
\Rightarrow_{\delta}
\mathcal C_1
\Rightarrow_{\sigma}
\mathcal C_2,
\]

then that fragment has the valid commuting conversion:

\[
\mathcal C_0
\Rightarrow_{\sigma'}
\mathcal C_1'
\Rightarrow_{\delta'}
\mathcal C_2'
\]

such that \(\mathcal C_2'\) is alpha-equivalent to \(\mathcal C_2\), the two fragments have the same database path after administrative stuttering is erased, and they have the same primitive-action trace.

**Proof.** The inference \(\delta\) replaces one hot transaction atom by a fixed clause body. It neither consults \(O^d\) nor invokes \(O^t\), so it leaves \(D\) unchanged. The hot components of a concurrent conjunction are the union of the hot components of its branches. Consequently, expanding one branch neither disables the selected occurrence in the sibling branch nor prevents the original `run` or `execute` occurrence from being expanded after the sibling inference.

CTR standardizes the variables of the selected clause apart from the whole current goal ([Bonner and Kifer 1996, Definition 4.3](https://www3.cs.stonybrook.edu/~kifer/TechReports/concurrent-trans-logic.pdf)). For closed kernel controls, all remaining existential variables are local to their occurrences. The substitutions produced in the two branches therefore commute. If \(\sigma\) is a definition or data-query inference, both orders leave alpha-equivalent residual goals in the same state. If \(\sigma\) is an elementary transition from \(D\) to \(D'\), its oracle premise is unchanged because \(\delta\) is state-inert, and both orders have the same single transition \(D\to D'\). A sibling atomic segment is handled as one block by the same argument: \(\delta\) is outside the extracted atomic component and changes neither its initial state nor its internal trace. \(\square\)

The sibling condition is essential. This is not a global equation \(adm;a=a;adm\) for arbitrary administrative steps. In particular, the lemma does **not** commute a `code_*`, `entry`, or `current_def` data query across a state-changing inference. Such a move could change which program version is observed.

### Corollary 2.1 — Administrative Normalization

Every successful finite \(P_0\) deduction from a closed kernel goal can be converted, without changing its database path after administrative stuttering is erased or its primitive-action trace, to one in which each definition inference expanding `run` or `execute` occurs immediately before the data-oracle inference that discharges its first discriminator:

\[
entry,
\quad
code\_skip,
\quad
code\_prim,
\quad
code\_seq,
\quad
code\_par,
\quad
code\_iso,
\quad
code\_call.
\]

**Proof.** In every \(P_0\) clause, the discriminator is the leftmost body atom. After rule expansion it is therefore the only hot atom in that serial branch. Any inference placed between the expansion and its successful discriminator query must come from a concurrent sibling branch. Repeatedly apply Lemma 2 to move the state-inert expansion rightward across those independent sibling inferences. The process terminates because the deduction is finite and each conversion shortens the gap to the associated query. Applying the conversion from the last such query backward yields all adjacent pairs. The discriminator query itself is never moved, so it sees exactly the same database state as before normalization. \(\square\)

For a call, normalization pairs the rule expansion only with `code_call`; a later `current_def` query remains a separate binding boundary. For a primitive, `exec(a)` likewise remains a separate state-changing boundary. The `execute`/`entry` pair is only the public wrapper's initialization block, not an additional \(L_0\) constructor step. Thus normalization preserves the live unfold-time semantics of Section 3.7 rather than imposing an eager snapshot policy.

**Theorem.** Assume that the initial source control is closed, every code lookup used by a successful execution sees a well-formed code state, and \(P_0\) has no transition-oracle atom other than `exec`. Then \(\mathcal R\) induces a finite operational correspondence, modulo the administrative normalization above, with the following properties.

### Administrative correspondence

If:

\[
\langle K,D\rangle
\xrightarrow{\tau}
\langle K',D\rangle,
\]

then:

\[
\langle P_0,D,\Phi(K)\rangle
\Rightarrow_{adm}^{+}
\langle P_0,D,\Phi(K')\rangle
\]

modulo structural normalization.

Conversely, in a normalized successful deduction, every adjacent definition/discriminator block that expands one source constructor reflects a source \(\tau\)-step, and every subsequent successful `current_def` query reflects `Call-Bind`. The `execute`/`entry` block is the conservative public wrapper. Failed proof-search branches that select a mismatching `run` clause perform no state transition and are not semantic executions.

### Primitive-action correspondence

If:

\[
\langle K,D\rangle
\xrightarrow{a}
\langle K',D'\rangle,
\]

then:

\[
\langle P_0,D,\Phi(K)\rangle
\Rightarrow_{adm}^{*}
\Rightarrow_a
\Rightarrow_{adm}^{*}
\langle P_0,D',\Phi(K')\rangle,
\]

and this proof segment contains exactly one transition-oracle step, labeled by \(exec(a)\).

Conversely, every transition-oracle step in a successful \(P_0\) execution from \(\Phi(K)\) is an occurrence of \(exec(a)\). It either represents a \(do(a)\) subcontrol already present in \(K\), or originates from a successfully discharged `code_prim` query; in both cases it reflects one source `Exec` step.

### Atomic correspondence

If:

\[
\langle iso(K),D\rangle
\xrightarrow{atomic(\vec a)}
\langle\mathbf 0,D'\rangle,
\]

then CTR's atomic inference rule proves \(\odot\Phi(K)\) to completion along the same primitive-action trace \(\vec a\), with no interleaving step from a surrounding concurrent branch. Every successful atomic proof segment reflects such a source atomic macro-step.

### Completed executions

Let \(Ded(P_0,D_0,run(r);D_0\cdots D_n,\vec a)\) mean that there is a successful CTR executional deduction of `run(r)` whose database path is \(D_0\cdots D_n\) after erasing administrative stuttering and whose transition-oracle inferences carry primitive trace \(\vec a\).

Let \(r\) be a published root. Then:

\[
\boxed{
\langle r,D_0\rangle
\xRightarrow{\vec a}_{L_0}^{*}
\langle\mathbf 0,D_n\rangle
\iff
Ded(P_0,D_0,run(r);D_0\cdots D_n,\vec a).
}
\]

Atomic subtraces occur contiguously. Erasing action annotations and applying CTR's executional soundness and completeness theorem gives the model-theoretic corollary:

\[
\boxed{
\bigl(\exists\vec a.\;
\langle r,D_0\rangle
\xRightarrow{\vec a}_{L_0}^{*}
\langle\mathbf 0,D_n\rangle\bigr)
\iff
P_0,D_0\cdots D_n
\models_{CTR}
run(r).
}
\]

The wrapper clause is conservative: if `entry(q,r)` belongs to \(D_0\), `execute(q)` administratively reduces to `run(r)`, so both completed-execution equivalences also hold with the public goal `execute(q)`.

### Proof

Proceed by rule induction.

1. **Skip.** `run(n)` resolves to `code_skip(n)`. The data oracle discharges the ground descriptor in the same state, leaving the empty goal. This matches `Skip` and changes no state.

2. **Primitive.** `run(n)` resolves to `code_prim(n,a) \otimes exec(a)`. Discharging the descriptor query leaves `exec(a)`, matching `Prim-Unfold` and the internal control \(do(a)\). The CTR elementary-update rule then transforms \(D\) to \(D'\) exactly when \(exec(a)\in O^t(D,D')\), matching `Exec`. A concurrent branch may act between these two stages in both systems.

3. **Sequence.** Resolution and the descriptor query transform `run(n)` into `run(l) \otimes run(r)`. The CTR hot-component rule enables only the unfinished left component. This matches `Seq` and `Serial-Ctx`.

4. **Parallel composition.** Resolution and the descriptor query transform `run(n)` into `run(l) \mid run(r)`. The hot components are the union of the hot components of both branches, so each CTR scheduling choice corresponds to `Par-L` or `Par-R`, and vice versa.

5. **Call.** Resolution exposes the `code_call` query followed by `current_def`. Discharging the first query leaves the existential goal for \(invoke(f)\), matching `Call-Unfold`. Discharging `current_def` later leaves `run(r)`, matching `Call-Bind`. A concurrent publication may occur between these stages in both systems. If definitions are deterministic, the root is unique; if multiple roots are allowed, the same nondeterminism appears in both systems.

6. **Isolation.** Resolution produces \(\odot run(c)\). CTR's atomic inference rule removes this hot component from the surrounding goal, executes its body to completion, and only then resumes the remainder. By the induction hypothesis, the internal proof and source traces coincide. This matches `Atomic`.

7. **Contexts.** The CTR definitions of hot components for serial and concurrent goals give exactly the two source context rules. Structural congruence corresponds to removal of the empty goal and associativity of goal composition.

These cases prove one-step preservation. Concatenating them proves preservation of finite executions.

For reflection, first apply Corollary 2.1 to an arbitrary successful finite target deduction. Each normalized definition/discriminator block now exposes exactly one well-formed source constructor at the database state in which its descriptor was actually read, so it reflects the corresponding source \(\tau\)-step. The only later data-oracle boundary introduced by a kernel constructor is `current_def`, which reflects `Call-Bind`; `entry` belongs only to the public wrapper. Predicate separation ensures that every state-changing inference is an `exec(a)`: it either corresponds to a \(do(a)\) already present in the initial control or was exposed by the primitive clause, and in both cases reflects exactly one source `Exec` step. Rule 4 and the induction hypothesis reflect each completed atomic segment. Induction over the normalized deduction therefore reconstructs a source execution with the same database path and primitive trace. Because normalization preserves both, this source execution also reflects the original, unnormalized deduction; no proof-search scheduling discipline has been assumed.

Finally, CTR's executional soundness and completeness theorem for Concurrent-Horn goals ([Bonner and Kifer 1996, Theorem 4.2](https://www3.cs.stonybrook.edu/~kifer/TechReports/concurrent-trans-logic.pdf)) identifies successful executional deductions with model-theoretic executional entailment, giving the displayed completed-execution equivalence. \(\square\)

## 4.7 Exact Status of the Adequacy Result

The theorem is stronger than a mere representation theorem: reified \(L_0\) code is actually executed by a fixed legal Concurrent-Horn interpreter.

It is deliberately not described as a literal one-proof-inference/one-source-step bisimulation:

- one source constructor-unfolding step uses a short sequence of CTR rule-resolution and data-query inferences;
- those inferences do not change the database;
- an atomic source region corresponds to a complete CTR atomic segment, not one primitive oracle transition.

In particular, the overall relation is not a strong bisimulation in the standard process-semantics sense, because one source administrative step corresponds to more than one target inference and arbitrary target deductions are compared after the commuting conversions of Corollary 2.1.

The correct description is:

\[
\boxed{
\text{exact primitive-action correspondence}
+
\text{weak correspondence on administrative steps}
+
\text{atomic-segment correspondence}.
}
\]

The theorem covers finite successful executions. Infinite traces, divergence reflection, scheduler fairness, rollback policy after failure, and observational equivalence require separate definitions and proofs.

---

# 5. Reflection and Semantic Boundaries

## 5.1 Object-Level Reflection

Object-level code reflection is ordinary relational access:

\[
\boxed{
\text{object-level reflection}
=
\text{query/update over }\rho(Q)\subseteq D.
}
\]

Consequently:

- inspect code = query code facts;
- generate code = insert unreachable versioned code facts;
- patch code = transact over code facts;
- publish code = update a root fact;
- delete obsolete code = transact over unreachable code facts.

No distinct `ProgramState` or `ReflectionState` sort is required.

## 5.2 Fixed Semantic Substrate

The following remain semantic parameters rather than mutable object data in the core model:

\[
P_0,
\qquad
O^t,
\qquad
\models_{CTR}.
\]

In the minimal interpreter, the active proof resolvent and multipath also belong to the execution substrate rather than \(D\). They may be reified by a stronger machine, but are not reified automatically.

The precise boundary is therefore:

\[
\boxed{
\text{all chosen object-level software state and code are relational data;}
}
\]

not:

\[
\text{the entire semantic mechanism is mutable data inside itself.}
\]

This avoids infinite regress while preserving program reification.

---

# 6. Semantic Refinement of the Executable World Model

The original executable world model is related to CTDD by semantic refinement.

| Original concept | CTDD interpretation | Status |
| --- | --- | --- |
| Files, functions, modules, services, devices, users, commits, processes | Ground relational facts in \(D\) | Direct representation |
| Relationships and cross-project topology | Relational predicates and derived queries | Direct representation |
| Diagrams and views | Queries or derived projections over \(D\) | Direct refinement |
| Runtime topology changes | Transitions \(D\to D'\) | Direct refinement |
| Composite executable behavior | Reified code interpreted by \(P_0\) | Operationally adequate for \(L_0\) |
| Primitive environmental effects | Transition-oracle atoms | Explicit semantic boundary |
| Concurrent behavior | CTR interleaving and multipaths | Preserved only for compatible source semantics |
| Atomic regions | CTR atomic modality | Segment correspondence |
| Program replacement | Transaction over \(\rho(Q)\) or atomic root publication | Direct refinement |
| Source/deployment/runtime history | Reified historical facts plus CTR paths or multipaths | Two distinct forms of history |
| Code reflection | Query/update over program facts | Direct object-level reflection |
| Active PC, stack, pending continuation | CTR resolvent unless explicitly reified | Not contained in \(D\) by the minimal \(P_0\) |

The refinement preserves the original model's relational unity and executable feedback loop while making three limitations explicit:

1. primitive effects remain oracle parameters;
2. concurrency preservation is relative to CTR-compatible interleaving semantics;
3. active control is not object-level reflective state unless a reified-control machine is chosen.

Accordingly, “preserved exactly” is too strong. “Semantically refined with explicit boundaries” is accurate.

---

# 7. Execution Results and Remaining Execution Obligations

The execution proof status under the stated finite-trace scope is:

| Obligation | Status | Exact boundary |
| --- | --- | --- |
| CTR-instance well-formedness | Closed | Fixed legal \(P_0\), relational \(O^d\), and typed \(O^t\) |
| Computable relational state representation | Closed | Finite encodings of effectively representable configurations |
| Arbitrary effective-LTS forward simulation | Closed | Oracle construction; independent of \(P_0\) |
| Exact transition correspondence on the encoded image | Closed by construction | Only for the deliberately restricted `sim_step` image |
| Unconditional concurrency universality | Not claimed | Excludes true-concurrency, weak-memory, timed, and probabilistic structure |
| CTR-compatible compositional concurrency preservation | Closed conditionally | Finite traces under the four assumptions of Theorem 4 |
| Program reification and concrete fixed \(P_0\) | Closed | Object programs are data interpreted by \(P_0\) |
| Finite \(L_0\) operational adequacy | Closed | Successful finite executions, using administrative normalization |
| Atomic-region correspondence | Closed in scope | Complete non-interleaved target segments, not one inference per region |
| Live publication semantics | Defined | Unfold-time binding plus atomic root publication |
| Active continuation contained in \(D\) | Refuted for the minimal machine | Runtime configuration is \((D,\Gamma,\Pi)\) |
| Infinite traces, divergence, fairness, and mechanization | Open | Require separate definitions and proofs |

The following are optional stronger results, not premises silently assumed by the completed core:

- a reified task/continuation interpreter for reflective access to active execution state;
- divergence-sensitive or fair infinite-trace correspondence;
- observation preservation and contextual equivalence;
- semantics for weak memory, true concurrency, real time, probability, or failures beyond the selected CTR/oracle model;
- an implementation and mechanized proof in a theorem prover.

The central result can now be stated without overclaiming:

> **Software Space is a Concurrent-Horn CTR instance whose selected mutable object world and object programs are relational state, whose reified kernel programs are executed adequately by a fixed Concurrent-Horn interpreter, and whose irreducible actions are defined by a transition oracle.**

For the minimal interpreter, an executing system is not only \(D\); it is \((D,\Gamma,\Pi)\). The program text is data in \(D\), while its current continuation is the CTR resolvent in \(\Gamma\). Choosing to reify \(\Gamma\) is possible, but it is a further design decision.

This formulation yields the intended universal-machine architecture:

\[
\boxed{
\text{mutable relational world}
+
\text{fixed Concurrent-Horn interpreter}
+
\text{primitive transition oracle}
}.
\]

It also supplies the missing executable semantic theorem: within the defined kernel and the stated CTR compatibility assumptions, the interpreter neither invents primitive behavior nor omits source behavior.

---

# 8. Bounded Design Search Layer

## 8.1 Phase Separation

The search result of this section is a software **design**, not a live runtime
continuation. Search operates on quiescent shadow snapshots. A candidate may be
executed in a bounded evaluator, but the evaluator's transient CTR resolvent is
not part of the candidate identity. Its selected observations are written into
the evaluator result and then discarded.

The lifecycle is the external transition system:

\[
capture
\to formalize
\to search
\to translate
\to review
\to
\begin{cases}
accept,\\
revise\to formalize.
\end{cases}
\]

There is no transition directly from `search` to deployment. Publication or
code generation requires the explicit `review -> accept` gate. This is the
formal version of a dynamically designed, subsequently frozen shadow build.

Runtime actions and design edits occupy disjoint transition-oracle namespaces:

\[
O^t_{run}
\qquad\text{and}\qquad
O^t_{edit}.
\]

The fixed interpreter \(P_0\) uses only \(O^t_{run}\). The search controller
uses only \(O^t_{edit}\) against versioned candidate snapshots. This separation
prevents a design mutation from being confused with an environmental action of
the design being evaluated.

## 8.2 Search Instances

A bounded CTDD design-search instance is:

\[
\boxed{
I=
\langle
D_0,\Sigma_s,B,E,\sim_B,H,\mathbf J,\preceq_P,\Pi,\Lambda
\rangle.
}
\]

Its components are:

- \(D_0\), the initial quiescent relational design snapshot;
- \(\Sigma_s\), a finite typed search signature;
- \(B\), the user-supplied search boundary;
- \(E\), an effectively enumerable set of CTR edit transactions;
- \(\sim_B\), a decidable search congruence inside the boundary;
- \(H:X_B\to\{true,false\}\), the hard-constraint predicate;
- \(\mathbf J:X_B\to V_1\times\cdots\times V_k\), a finite objective
  vector whose component orders are decidable;
- \(\preceq_P\), an optional user preference preorder used to select among
  nondominated candidates;
- \(\Pi\), optional guidance such as a generative-model or active-inference
  prior; and
- \(\Lambda\), an optional partial bidirectional projection between concrete
  design artifacts and relational designs.

The set \(X_B\) contains the committed candidate snapshots permitted by the
boundary. Raw staging states used inside an atomic edit need not belong to
\(X_B\). Search results are equivalence classes in \(X_B/\!\sim_B\).

The committed edit relation is:

\[
D\Rightarrow_E D'
\iff
\exists e\in E.\;
\langle D,e,D'\rangle
\text{ is a successful committed CTR edit outcome}.
\]

If a CTR transaction has several successful outcomes, each target \(D'\) is a
separate search edge. The exact enumerator ranges over all such outcome edges,
not merely over edit names followed by one arbitrarily selected execution.

## 8.3 Formal Requirements, Constraints, and Objectives

Natural-language requirements enter the formal theory through an explicitly
approved compilation boundary:

\[
Formalize:
NLRequirement\times Context
\to
(R_h,R_s,H,\mathbf J),
\]

followed by:

\[
UserApprove(R_h,R_s,H,\mathbf J).
\]

The search theorem begins after approval. It does not claim that an arbitrary
natural-language requirement has a unique or automatically correct formal
meaning.

The hard predicate has the factorization:

\[
\boxed{
H(D)=
H_{wf}(D)
\land H_{R_h}(D)
\land H_{protect}(D,D_0)
\land H_{business}(D)
\land H_{quality}(D).
}
\]

Here \(H_{wf}\) checks relational, typing, reference, and program-graph
well-formedness; \(H_{R_h}\) checks mandatory behavior; \(H_{protect}\)
checks immutable components and interfaces; \(H_{business}\) contains custom
domain constraints; and \(H_{quality}\) contains non-negotiable quality
thresholds such as safety, correctness, or minimum robustness.

A representative objective vector is:

\[
\mathbf J(D)=
\begin{bmatrix}
L_{R_s}(D)\\
Coupling(D)\\
-Cohesion(D)\\
-Extensibility(D)\\
-Maintainability(D)\\
-Reusability(D)\\
d_{W,M}(D,D_0)\\
-Explainability(D)\\
RuntimeCost(D)\\
Uncertainty(D)
\end{bmatrix}.
\]

This is an interface, not a claim that there is one universal metric for each
software quality. Each selected component must be a total evaluator under
\(B\), possibly by returning \(+\infty\) or a distinguished failure value on
timeout.

Permission and regularization are separate. Let \(M(c)=0\) mean that component
\(c\) is outside the edit domain. For editable components:

\[
d_{W,M}(D,D_0)
=
\sum_{c:M(c)=1}w_c\,\Delta_c(D,D_0).
\]

A zero edit mask prohibits a change. A zero penalty weight would instead make
the change free and therefore cannot represent immutability.

## 8.4 Pareto Semantics

Assume every objective is oriented so that smaller is better. Define strict
Pareto dominance by:

\[
D\prec_{\mathbf J}D'
\iff
\left(\forall i.\ J_i(D)\le J_i(D')\right)
\land
\left(\exists i.\ J_i(D)<J_i(D')\right).
\]

Let \(Reach_B(D_0)\) be the equivalence classes reachable from \(D_0\) by
edit transactions within the configured edit-depth and resource bounds. The
feasible set is:

\[
F_B(I)=
\{[D]_{\sim_B}\in Reach_B(D_0)\mid H(D)\}.
\]

The exact bounded solution is:

\[
\boxed{
Sol_B(I)=
\left\{
[D]\in F_B(I)
\mid
\nexists[D']\in F_B(I).\ D'\prec_{\mathbf J}D
\right\}.
}
\]

The preference preorder \(\preceq_P\) may select or rank members of
\(Sol_B(I)\). It does not silently turn a hard constraint into a compensable
objective. When it is decidable and invariant on \(\sim_B\)-classes, define
the optional preferred result as the \(\preceq_P\)-maximal subset:

\[
PrefSol_B(I)=Max_{\preceq_P}(Sol_B(I)).
\]

Computing this set after `Sol_B` preserves the full Pareto certificate while
making the user's tie-breaking policy explicit.

## 8.5 Search Congruence

An arbitrary state equivalence is not sufficient for safe tabling. The relation
\(\sim_B\) must be a **search congruence**. For all \(D\sim_BD'\):

1. \(H(D)=H(D')\);
2. \(\mathbf J(D)=\mathbf J(D')\); and
3. their successor equivalence classes agree:

\[
\{[K]\mid D\Rightarrow_EK\}
=
\{[K]\mid D'\Rightarrow_EK\}.
\]

These conditions make the quotient transition graph well defined. Labeled
identity is always a valid, if weak, search congruence. Alpha-renaming,
structural congruence, or bounded observational equivalence may be added only
when the three conditions are proved.

A canonicalizer is a total function:

\[
can_B:X_B\to Bytes
\]

such that:

\[
can_B(D)=can_B(D')
\iff
D\sim_BD'.
\]

Section 11 gives an exact construction. A cryptographic digest is only an
index into canonical-byte buckets; it is not used as a mathematical equality
oracle.

## 8.6 Admissible User Bounds

The boundary \(B\) may contain:

\[
B=
\langle
C_B,h_B,n_B,d_B,v_B,c_B,t_B,m_B,g_B
\rangle,
\]

where the components bound, respectively, the finite carrier of each sort,
ground-term depth, fact count, edit depth, observation depth, concurrent
width, evaluator time, evaluator memory, and guided proposals per state.

Bounding only the number or depth of nodes is insufficient when strings,
numbers, fresh identifiers, or other payloads remain unbounded. An admissible
\(B\) must induce a finite ground universe and total bounded evaluators.

Formally, \(B\) is **admissible** for \(I\) when:

1. \(D_0\in X_B\);
2. the bounded ground universe \(U_B=HB_{\Sigma_s,B}\) is finite;
3. \(X_B\subseteq2^{U_B}\) is decidable;
4. every state has a terminating procedure that returns the complete finite
   list of committed \(E\)-outcome edges and signals completion;
5. \(can_B\), \(H\), and every \(J_i\) terminate;
6. \(\sim_B\) is a search congruence;
7. every guided-model call is time and output bounded; and
8. finite candidate executions have explicit timeout or bounded-abstraction
   outcomes.

These are obligations on a user configuration, not hidden global assumptions.
An inadmissible configuration may still be explored heuristically, but it is
outside the termination and exactness theorems below.


# 9. Edit Completeness and Bounded Finiteness

## 9.1 The Primitive Relational Edit Basis

Let \(Q_B\) be a finite edit-token carrier disjoint from the searched state
signature, and let \(quote_B:U_B\hookrightarrow Q_B\) be a computable
injection. These tokens are arguments of meta-level edit atoms; introducing
them does not recursively enlarge the searched Herbrand universe. Define
elementary edit atoms:

\[
ins(quote_B(A))\in O^t_{edit}(D,D\cup\{A\})
\quad\text{iff}\quad A\notin D,
\]

and:

\[
del(quote_B(A))\in O^t_{edit}(D,D-\{A\})
\quad\text{iff}\quad A\in D.
\]

The primitive edit basis is:

\[
E_0=\{ins(quote_B(A)),del(quote_B(A))\mid A\in U_B\}.
\]

Typed refactorings such as replace, move, split, merge, redirect, and publish
may be defined as serial or atomic CTR transaction macros over \(E_0\). Their
presence changes search locality, not relational reachability.

## 9.2 Theorem 7 — Exact Edit-Basis Reachability

**Theorem.** For any finite relational states \(D,D'\subseteq U_B\), there is
an \(E_0\)-execution from \(D\) to \(D'\) of length exactly:

\[
|D\triangle D'|.
\]

Consequently, there is always one of length at most
\(|D\triangle D'|\).

**Proof.** Write:

\[
R=D-D',
\qquad
A=D'-D.
\]

Delete each fact in \(R\), in any order, and then insert each fact in \(A\),
in any order. Every deletion is enabled because its fact is still present; no
fact in \(R\) is reinserted. Every insertion is enabled because its fact was
absent from \(D\) and no earlier step inserts it twice. The final state is:

\[
(D-R)\cup A
=(D\cap D')\cup(D'-D)
=D'.
\]

The sequence length is:

\[
|R|+|A|=|D\triangle D'|.
\]

For the lower bound, each primitive edit changes membership of exactly one
ground fact. Every fact in \(D\triangle D'\) has different membership in the
initial and final states and must therefore be changed at least once. No
shorter \(E_0\)-execution exists. \(\square\)

The theorem is about raw relational reachability. A sequence may pass through
a staging state that is not a well-formed program graph. There are two sound
policies:

1. retain raw staging states in an isolated shadow workspace and check
   \(H_{wf}\) only at committed candidate boundaries; or
2. package a typed macro's primitive sequence as one atomic candidate-level
   transaction whose endpoints are well formed.

If a search prunes every malformed intermediate state while permitting only
single-fact committed edges, Theorem 7 does not imply connectivity of the
remaining legal subgraph. This boundary is explicit.

## 9.3 Theorem 8 — Finiteness Under an Admissible Bound

Let:

\[
m=|U_B|<\infty.
\]

If committed states contain at most \(n_B\) facts, then:

\[
|X_B|
\le
\sum_{i=0}^{\min(n_B,m)}{m\choose i}
\le 2^m.
\]

**Theorem.** For every admissibly bounded search instance \(I\), both
\(X_B\) and \(X_B/\!\sim_B\) are finite.

**Proof.** The finite signature and finite sort carriers, together with the
ground-term depth bound, induce the finite universe \(U_B\). Every relational
state is a subset of \(U_B\), and the fact-count restriction selects at most
the number of subsets displayed above. Hence \(X_B\) is finite. A quotient of
a finite set by an equivalence relation has no more classes than the original
set, so:

\[
|X_B/\!\sim_B|\le|X_B|<\infty.
\]

\(\square\)

Fresh identifiers do not invalidate the proof: admissibility requires either
a finite identifier carrier or canonical occurrence identifiers that are
renormalized into such a carrier. Arbitrary unbounded strings, integers, or
fresh names would make \(U_B\) infinite and are therefore rejected by the
exact bounded mode.


# 10. Exact Bounded CTR Search

## 10.1 The Lifted Budget Graph

Because a guided scheduler may discover the same state first along a longer
path, tabling only the state identifier can incorrectly consume its edit-depth
budget. The exact construction therefore searches a lifted graph.

For unit-cost edit transactions and depth bound \(d_B\), let:

\[
\widehat X_B=
\{([D]_{\sim_B},r)\mid [D]\in X_B/\!\sim_B,\ 0\le r\le d_B\},
\]

where \(r\) is remaining edit depth. Define:

\[
([D],r)\widehat\Rightarrow_E([D'],r-1)
\]

iff \(r>0\) and \(D\Rightarrow_ED'\). Variable positive integer edit costs
can be handled by subtracting the cost instead of one, provided search
congruence is strengthened to preserve target-class/cost pairs. The core
theorems below use unit cost. The pair, not only the design state, is the
tabled search node. Candidate evaluation and the final solution set project
away \(r\).

## 10.2 Fair Tabled Enumeration

A work-list scheduler is **fair** when every item that remains enqueued is
selected after finitely many selections. It is **tabled** when each lifted node
is expanded at most once. Successor enumeration must enumerate every committed
edit outcome admitted by \(B\); an LLM proposal list alone is not a successor
enumerator.

An abstract exact algorithm is:

```text
EXACT-CTR-SEARCH(I):
    start := (can_B(D0), d_B)
    open := fair_queue(start)
    table := { start }
    reached := { can_B(D0) }

    while open is not empty:
        (c, remaining) := fair_pop(open)
        D := representative(c)

        if remaining > 0:
            for (e, D') in EnumerateCommittedEditOutcomes_B(D):
                if D' is a committed member of X_B:
                    c' := can_B(D')
                    reached.add(c')
                    item := (c', remaining - 1)
                    if item not in table:
                        table.add(item)
                        open.push(item)

    feasible := { c in reached | H(representative(c)) }
    return ParetoMin(feasible, J)
```

`EnumerateCommittedEditOutcomes_B` emits every successful design-phase CTR
outcome and no failed or rolled-back outcome. Exact mode returns only after the
tabled frontier is exhausted. The table stores a canonical representative
together with each canonical byte key, so `representative(c)` is an effective
lookup rather than an inverse of a hash.

## 10.3 Theorem 9 — Termination and Reachability Completeness

**Theorem.** For every admissibly bounded instance \(I\), fair tabled search of
\((\widehat X_B,\widehat\Rightarrow_E)\) terminates. On termination, its
`reached` set contains exactly the equivalence classes reachable from \(D_0\)
by at most \(d_B\) edit transactions.

**Proof — termination.** By Theorem 8, \(X_B/\!\sim_B\) is finite. Therefore:

\[
|\widehat X_B|
\le
(d_B+1)|X_B/\!\sim_B|
<\infty.
\]

Tabling expands each lifted node at most once. Admissibility makes the
successor set of each node finite and makes successor generation,
canonicalization, constraint evaluation, and queue operations terminating.
Hence only finitely many work items can be inserted and every expansion takes
finite time. Fairness prevents a permanently enqueued item from being
starved. The queue is eventually exhausted. \(\square\)

**Proof — soundness of reachability.** The start state represents the empty
edit path. A newly inserted item is produced only by executing one enabled CTR
edit from an already reached item and decrementing its remaining budget.
Induction on insertion history therefore gives a concrete path from \(D_0\) of
length at most \(d_B\) to every member of `reached`. \(\square\)

**Proof — completeness of reachability.** Let:

\[
D_0\Rightarrow_ED_1\Rightarrow_E\cdots\Rightarrow_ED_k
\]

be a path with \(k\le d_B\). Induct on \(k\). The base class \([D_0]\) is
inserted initially. For the induction step, the lifted item corresponding to
\([D_{k-1}]\) with sufficient remaining budget is eventually expanded by
fairness. Complete successor enumeration includes the final edit, and search
congruence makes its target class independent of the selected representative.
Thus \([D_k]\) is inserted. Every bounded reachable class is found. \(\square\)

The lifted construction is conservative. A FIFO breadth-first implementation
may instead table the smallest known depth per canonical state, because its
first discovery is shortest. The lifted definition is retained for schedulers
that expand out of depth order.

## 10.4 Theorem 10 — Exact Bounded Pareto Search

Write `Search_CTR(I)` for the equivalence classes returned by exhaustive exact
mode.

**Theorem.** For every admissibly bounded instance:

\[
\boxed{
Search_{CTR}(I)=Sol_B(I).
}
\]

**Proof.** By Theorem 9, after frontier exhaustion `reached` is exactly
\(Reach_B(D_0)\). Filtering it with \(H\) therefore produces exactly
\(F_B(I)\). Search congruence makes \(H\) and \(\mathbf J\) independent of
the chosen representative. `ParetoMin` removes a feasible class iff another
feasible class weakly improves every objective and strictly improves at least
one. This is exactly the defining predicate of \(Sol_B(I)\). Hence the two
sets are equal. \(\square\)

The theorem has two important operational boundaries:

1. a candidate reported before frontier exhaustion is sound if it satisfies
   \(H\), but it is not yet certified globally nondominated within \(B\); and
2. a user stop, timeout, or inadmissible evaluator changes exact mode into an
   anytime heuristic mode and voids only the completeness equality, not the
   validity of separately verified candidates.

The theorem is independent of whether the frontier is ordered by breadth,
cost, an active-inference score, an LLM, or another heuristic. Ordering may
change discovery time but not the final set, provided the search remains fair,
tabled, and successor-complete.


# 11. Exact and Lossless Implementation Mechanisms

## 11.1 Exact Canonicalization with a Collision-Safe Index

### 11.1.1 Mathematical Canonical Form

Let \(Anch(D)\) be the public, source-linked, or otherwise semantically stable
identifiers that must be fixed. Let \(Anon(D)\) be the remaining identifiers,
partitioned by sort. For each sort containing \(n\) anonymous identifiers,
choose the fixed canonical slots \(anon_s(0),\ldots,anon_s(n-1)\). Let
\(Ren_B(D)\) be the finite set of sort-preserving bijections from
\(Anon(D)\) to these canonical slots, extended by the identity on every
anchor.

Define \(ser(D)\) by encoding every predicate, sort, arity, and argument with
an unambiguous length-prefixed binary encoding, sorting the encoded ground
facts lexicographically, and concatenating them. The exact canonical bytes are:

\[
\boxed{
CanBytes_B(D)
=
\min_{\pi\in Ren_B(D)}ser(\pi D),
}
\]

where the minimum is lexicographic. This definition is computable because the
renaming set is finite under \(B\). It is not presented as the practical fast
path; it specifies the result that every optimized canonicalizer must return.

### 11.1.2 Theorem 11 — Canonicalization Correctness

Let \(D\cong_BD'\) mean that an anchor-fixing, sort-preserving bijection maps
the facts of \(D\) exactly to those of \(D'\).

**Theorem.**

\[
CanBytes_B(D)=CanBytes_B(D')
\iff
D\cong_BD'.
\]

**Proof.** If \(D\cong_BD'\), composition with the witnessing isomorphism
gives a bijection between the two finite renaming sets. Corresponding renamed
states have equal serializations, so the sets of candidate byte strings and
therefore their minima are equal.

Conversely, equality of minima means that there exist
\(\pi\in Ren_B(D)\) and \(\pi'\in Ren_B(D')\) with:

\[
ser(\pi D)=ser(\pi'D').
\]

The serialization is injective on labeled relational states, hence
\(\pi D=\pi'D'\). The bijection \((\pi')^{-1}\circ\pi\) is an anchor-fixing,
sort-preserving isomorphism from \(D\) to \(D'\). \(\square\)

For a different search congruence, the canonical bytes must include or erase
exactly the distinctions specified by that congruence and must separately
satisfy Section 8.5. Graph isomorphism alone does not establish preservation of
constraints, objectives, or edit successors.

### 11.1.3 Practical Canonicalization Pipeline

The exact implementation uses four layers:

1. **Deterministic anchors.** Public symbols use qualified semantic paths such
   as package, module, type, and member. Nodes in an ordered ownership tree use
   root-to-occurrence paths. Bound variables use de Bruijn indices, eliminating
   alpha-renaming before graph processing.
2. **Immutable-subgraph summaries.** Rooted acyclic code fragments may use
   bottom-up Merkle summaries. Content addressing is a cache and identity aid,
   as in Unison; the canonical serialized content remains available for
   collision checks.
3. **Invariant color refinement.** Predicate roles, sorts, anchors, and
   neighborhood multisets refine anonymous-node color classes. A
   Weisfeiler--Leman-style refinement is useful here, but is only a partitioning
   heuristic: it is not a complete isomorphism test for arbitrary graphs.
4. **Exact individualization/refinement fallback.** Any unresolved color class
   is individualized, refined, and searched using a nauty/Traces-style exact
   canonization procedure. The lexicographically least complete serialization
   is returned. Because no unresolved permutation is discarded without an
   invariant proof, this layer implements the mathematical minimum above.

The fast path for strongly anchored tree-like software graphs is dominated by
traversal and sorting and can be near \(O(N\log N)\). No such worst-case bound
is claimed for arbitrary relational graphs; the exact fallback may be
exponential. Admissible finiteness establishes termination, not practical
canonization complexity.

Define the visited-table index as:

\[
Index(D)=SHA256(CanBytes_B(D)).
\]

The table stores collision buckets containing the complete canonical bytes.
Digest equality triggers byte comparison:

```text
bucket := visited[SHA256(canonical_bytes)]
seen   := any(existing_bytes == canonical_bytes for existing_bytes in bucket)
```

Thus expected hash-table lookup may be \(O(1)\) after canonicalization, but
neither equivalence computation nor the mathematical theorem assumes that
SHA-256 is collision free. If an engineering timeout disables exact anonymous
canonization, the safe fallback is labeled-state equality, which may retain
duplicates but never merges non-equivalent states. Exact quotient reporting
then requires later completion of canonization.

## 11.2 A Partial Resourceful Source Lens

### 11.2.1 Concrete and Abstract Domains

Let \(\mathcal A_{L,B}\) be the parseable concrete artifacts in a supported
design or source language \(L\) whose extracted views satisfy the structural
boundary \(B\), represented by their exact bytes. Let:

\[
get_L:\mathcal A_{L,B}\to X_B
\]

parse an artifact with a full-fidelity concrete syntax tree and extract the
canonical representative of its relational semantic view. Parsing also
constructs a resource package:

\[
Res(a)=\langle CST(a),Trace(a),Shadow(a)\rangle.
\]

`Trace` maps stable relational keys to source anchors and byte ranges.
`Shadow` contains source material not selected by the relational view,
including whitespace, comments, directives, concrete syntax choices, and
other trivia. Keeping the original artifact bytes is a valid complete shadow.

The reverse function is deliberately partial:

\[
put_L:\mathcal A_{L,B}\times X_B\rightharpoonup\mathcal A_{L,B}.
\]

It is defined only when the relational delta is realizable by the registered
typed source-edit algebra for \(L\). Define:

\[
Real_L(a,D')\iff put_L(a,D')\text{ is defined}.
\]

The exportable search subspace relative to an artifact is:

\[
X_B^{\Lambda}(a)=\{D'\in X_B\mid Real_L(a,D')\}.
\]

Exact search over exportable artifacts either adds \(Real_L(a,D)\) to \(H\)
or restricts \(E\) to edit macros with total registered renderers. Theorem 7
continues to describe the larger abstract relational space; it does not imply
that every raw fact set has a natural rendering in every source language.

### 11.2.2 Patch Construction

The reverse algorithm is:

```text
PUT-L(original_artifact, D'):
    (D, cst, trace, shadow) := LOSSLESS-GET(original_artifact)
    if D' == D:
        return original_artifact

    delta := TYPED-SEMANTIC-DIFF(D, D')
    edits := []

    for deletion or update in delta:
        anchor := trace.lookup(stable_key(operation))
        edits.add(RENDER-EXISTING-EDIT(operation, anchor, cst, shadow))

    for insertion in delta:
        anchor := SELECT-TYPED-ANCHOR(insertion, D', cst)
        edits.add(RENDER-NEW-FRAGMENT(insertion, anchor, local_style(cst)))

    edits := NORMALIZE-OR-REJECT-OVERLAPS(edits)
    candidate := APPLY-IN-DESCENDING-BYTE-OFFSET(original_artifact, edits)
    parsed_candidate := LOSSLESS-GET(candidate)

    if parsing failed or parsed_candidate.canonical_relational_view != D':
        return undefined
    return candidate
```

The edit list may be serialized as LSP `TextEdit` or `WorkspaceEdit`, but LSP
is a transport format rather than the semantic foundation of the lens.

Unmodified ranges are never regenerated. A deletion removes the deterministic
full span, including trivia owned by the deleted concrete node. A move carries
that full span. Cut the original byte sequence at every edit-span boundary and
zero-width insertion anchor. Every retained segment is copied verbatim and in
its original relative order; its absolute offset may shift after an insertion
or deletion. Insertions use a deterministic typed renderer or template. An
LLM may propose a fragment, but the lens theorem relies only on the subsequent
parse-and-view equality check, not on model correctness.

Macro expansions, generated files, or preprocessor views with no unique source
anchor make `put` undefined unless the language adapter supplies an explicit
source-level edit rule. This is a declared partiality boundary, not silent
information loss.

### 11.2.3 Theorem 12 — Partial Lens and Frame Laws

Assume the full-fidelity parser reproduces its input bytes, source anchors are
valid for the original artifact, every affected trace key resolves uniquely,
registered renderers terminate, patch overlap is either composed
deterministically or rejected, and the final equality check uses the exact
relational view.

Then the partial lens obeys, on its domain:

\[
\boxed{
put_L(a,get_L(a))=a
}
\tag{GetPut}
\]

and:

\[
\boxed{
get_L(put_L(a,D'))=D'
}
\tag{PutGet}
\]

whenever \(put_L(a,D')\) is defined. It also obeys the frame law:

\[
Frame_L(a,put_L(a,D'),EditSpans)=true.
\]

Here `EditSpans` includes replacement, deletion, and move-source intervals and
zero-width insertion anchors. `Frame_L` cuts the original at all of their
boundaries and requires every retained segment to occur verbatim and in the
same relative order in the result. It deliberately does not require equal
absolute byte offsets, which insertions and deletions necessarily shift; a
declared move preserves its complete source span at the declared target.

**Proof.** If the requested view is \(get_L(a)\), the first branch returns the
original artifact unchanged, proving `GetPut` byte for byte. For an update,
`put_L` returns a candidate only after reparsing it and checking that the exact
relational view equals \(D'\), proving `PutGet`. Patch application replaces
only the normalized edit spans; descending-offset application prevents an
earlier replacement from shifting the coordinates of a later one. All other
retained byte segments are copied from the original artifact, proving the
frame law.
\(\square\)

This theorem is stronger than regenerating a semantically equivalent file and
weaker than claiming a total lens for arbitrary programming languages and
arbitrary relational mutations. The partiality is necessary to state the
guarantee honestly.

## 11.3 Deterministically Fair Guided Search

### 11.3.1 Separation of Guidance and Coverage

Let:

\[
p_{guide}(e\mid D)
\propto
p_{LLM}(e\mid D)^{\alpha}
\exp\bigl(-\beta G_{AIF}(D,e)\bigr)
\]

be any bounded guidance distribution, with \(\alpha,\beta\ge0\). If every
unnormalized score is zero, use a fixed bounded fallback distribution.
\(G_{AIF}\) may use a supplied Markov blanket partition, generative model,
preference distribution, expected free energy, or a structural surrogate. The
exact search theorem requires only that the guidance call terminate under
\(B\); it does not require calibrated probabilities or full support.
No theorem here asserts that a software design has a unique privileged Markov
blanket. Blanket selection is part of the optional configuration \(\Pi\), and
its usefulness is evaluated under \(H_{AIF}\).

A PUCT-style score may order the fast queue:

\[
Guide(D,e)=
Q_{\omega}(D,e)
+c\,p_{guide}(e\mid D)
\frac{\sqrt{1+N(D)}}{1+N(D,e)},
\]

where \(Q_{\omega}\) is a user-selected scalarization used only for ordering.
It is oriented so that larger means more promising. It neither defines Pareto
optimality nor removes an edit from the exact space. Setting \(\beta=0\)
ablates the AIF term while leaving \(B,E,\sim_B,H,\mathbf J\), the slow
queue, and therefore the exact result unchanged.

The completeness guarantee is supplied by an independent slow queue. Every
finite committed outcome edge emitted by
`EnumerateCommittedEditOutcomes_B` is entered into the slow queue as a lifted
edge work item. The fast queue contains prioritized copies of any subset of
those items. A shared ledger ensures that an edge tried on one track is skipped
on the other.

### 11.3.2 Weighted Round-Robin Algorithm

For integer \(r\ge0\), use \(r\) fast quanta followed by one slow quantum:

```text
GUIDED-EXACT-CTR-SEARCH(I, r):
    discover((can_B(D0), d_B))
    fast_credit := r

    while slow_queue is not empty:
        if fast_credit > 0 and fast_queue is not empty:
            edge := fast_queue.pop_max_by_Guide()
            fast_credit := fast_credit - 1
        else:
            edge := slow_queue.pop_fifo()
            fast_credit := r

        if edge in tried:
            continue
        tried.add(edge)

        target := edge.committed_target
        if target is a new lifted node:
            discover(target)

    return ParetoMin({ reached states satisfying H }, J)

discover(node):
    add node to the table and its projected design to reached
    if node.remaining > 0:
        outcomes := EnumerateCommittedEditOutcomes_B(representative(node.c))
        all_edges := LiftAndCanonicalize(outcomes, node.remaining - 1)
    else:
        all_edges := {}
    slow_queue.push_all(all_edges)
    fast_queue.push_all(BoundedGuideSubset_B(all_edges))
```

`LiftAndCanonicalize` records the source lifted node, the CTR edit label, and
the canonical target paired with the decremented remaining budget. This tuple
is also the identity used by the shared `tried` ledger.

The ratio controls expansion quanta, not exact wall-clock time. With \(r=9\),
up to nine guided edge attempts are scheduled per compulsory slow attempt when
guided work is available. Lazy finite successor iterators may replace
`push_all`; the slow track must dovetail their cursors fairly.

The model may return an invalid edit, duplicate, zero probability, or no
proposal. Invalid proposals are rejected before entering the fast queue,
duplicates are absorbed by the ledger, and the slow enumerator remains
authoritative. When the slow queue becomes empty, every residual fast item is
a stale copy of an item already removed from the slow queue, so it need not be
drained. The guided proposal count and time are bounded by \(g_B\) and \(t_B\),
so the fast track cannot create an infinite side computation.

### 11.3.3 Theorem 13 — Guidance Preservation

**Theorem.** For every admissible instance and finite \(r\),
`GUIDED-EXACT-CTR-SEARCH` terminates and returns the same set as
`EXACT-CTR-SEARCH`:

\[
Search^{guided}_{CTR}(I,r)
=
Search_{CTR}(I)
=
Sol_B(I).
\]

**Proof.** Every enabled bounded edge is placed in the slow queue. When guided
work is available, at most \(r\) fast selections occur before a slow
selection; when it is unavailable, the slow selection occurs immediately.
Therefore every slow item with finitely many predecessors is selected after
finitely many scheduling quanta. A fast selection can only execute an edge
earlier and mark the identical work item tried; it cannot delete an untried
slow edge.

By induction on bounded path length, every reachable lifted node is therefore
discovered exactly as in Theorem 9. The lifted graph and edge set are finite,
each work item is executed at most once, and all auxiliary calls terminate, so
the algorithm terminates. Both algorithms obtain the same `reached` set and
apply the same \(H\) filter and Pareto operator. The result sets are equal, and
Theorem 10 gives equality with \(Sol_B(I)\). \(\square\)

This is deterministic bounded completeness, stronger than relying on an
asymptotic probability argument. PUCT, epsilon-greedy sampling, or an AIF score
may be used inside the fast track, but none of them is cited as the source of
fairness. If the slow track is removed, full-support random sampling provides
at most asymptotic probabilistic completeness and no finite exactness theorem.

Hard AIF or LLM pruning changes \(E\) and therefore may change \(Sol_B(I)\).
Preserving at least one original optimum requires a retention proof; preserving
the exact Pareto set requires every original Pareto class to be retained. In
the core architecture AIF is consequently a ranking prior; its pruning and
retention performance remain an empirical hypothesis.


# 12. Search Lifting and the Remaining Utility Hypotheses

## 12.1 Theorem 14 — Conditional Artifact-Level Search Lifting

Fix an original artifact \(a_0\in\mathcal A_{L,B}\), and restrict exact search to
the exportable subspace \(X_B^{\Lambda}(a_0)\), either through a hard
realizability constraint or a lens-closed edit algebra. Pull constraints and
objectives back to concrete artifacts by:

\[
H_L(a)=H(get_L(a)),
\qquad
\mathbf J_L(a)=\mathbf J(get_L(a)).
\]

If realizability is encoded in \(H\), it must be invariant under \(\sim_B\) as
required by search congruence. Below, \(D^*\) denotes the canonical
representative of the returned class \([D^*]\).

**Theorem.** Under the assumptions of Theorem 12, every relational solution
\([D^*]\in Sol_B(I)\) in the exportable subspace yields:

\[
a^*=put_L(a_0,D^*)
\]

such that:

1. \(get_L(a^*)=D^*\);
2. \(H_L(a^*)\) holds;
3. \(a^*\) is Pareto nondominated under \(\mathbf J_L\) among the reachable
   exportable artifact views; and
4. the concrete artifact satisfies the frame relation of Theorem 12.

**Proof.** Exportability makes \(put_L(a_0,D^*)\) defined. Theorem 12 gives
the exact view and frame properties. Since \(D^*\) is feasible, constraint
pullback gives \(H_L(a^*)=H(D^*)=true\). If a reachable exportable artifact
\(b\) dominated \(a^*\), its view \(get_L(b)\) would be a feasible reachable
relational state dominating \(D^*\), contradicting
\([D^*]\in Sol_B(I)\). \(\square\)

The result is relative to the supported artifact language and lens domain. It
does not claim a universal total source renderer. Different UML, source,
deployment, or document languages may each supply a lens into the same
relational design state.

## 12.2 Strict Searchability

The preceding definitions support the following exact statement.

> **Bounded strict searchability.** For every admissible user configuration,
> the quotient design graph is finite and effective; a fair tabled CTR search
> terminates; and exhaustive mode returns exactly all hard-feasible bounded
> Pareto-optimal equivalence classes. Optional model or AIF guidance changes
> discovery order but not the result. On the domain of a validated partial
> lens, each result has a source artifact whose re-extracted relational design
> is exactly the searched design.

This property is mathematical. It follows from Theorems 7--14 and is not an
empirical claim about speed or human satisfaction.

## 12.3 Measurable Usefulness

The phrase "probably useful" requires a task distribution. Let \(\mu\) be a
declared distribution over admissible search instances, initial artifacts, and
review contexts. For a practical sub-budget \(b\le B\), define:

\[
Useful(I,\omega,b)=1
\]

iff a guided run with model randomness \(\omega\):

1. returns within \(b\) an exportable candidate \(D\);
2. proves \(H(D)\);
3. improves or satisfies the configured objective/preference target;
4. passes the lens round trip; and
5. is accepted at the explicit human review gate.

The overall utility hypothesis is:

\[
\boxed{
H_U(\epsilon):
\Pr_{I\sim\mu,\omega}
[Useful(I,\omega,b)=1]
\ge1-\epsilon.
}
\]

No numerical \(\epsilon\) is asserted before validation. The hypothesis is
decomposed into five correction surfaces:

### \(H_{locality}\) — Structured Landscape

Relational edit distance and typed CTR edit neighborhoods have sufficient
correlation with behavioral and quality changes that guided local exploration
outperforms flat or bit-level encodings under equal evaluation budget.

### \(H_{gen}\) — Generative Guidance

The generative prior reduces the expected number of expanded or evaluated
states required to reach a configured quality threshold, without being used as
a correctness oracle.

### \(H_{AIF}\) — Active-Inference Prior

Let \(\Rightarrow_{E,\tau}^{AIF}\subseteq\Rightarrow_E\) be the outcome-edge
relation retained by an optional hard AIF threshold \(\tau\), and let
\(Reach_{B,\tau}^{AIF}(D_0)\) be the equivalence classes reachable from
\(D_0\) under that pruned relation and the same budget. This definition counts
path loss: retaining a target state is insufficient if every path to it was
pruned. Define:

\[
PruneRate_{\tau}(I)
=
1-\frac{|Reach_{B,\tau}^{AIF}(D_0)|}{|Reach_B(D_0)|},
\]

and:

\[
RetainAny_{\tau}(I)
=
\mathbf 1
\left[
Sol_B(I)\cap Reach_{B,\tau}^{AIF}(D_0)\ne\varnothing
\right].
\]

For the stronger claim that pruning preserves the complete exact result,
define:

\[
RetainAll_{\tau}(I)
=
\mathbf 1
\left[
Sol_B(I)\subseteq Reach_{B,\tau}^{AIF}(D_0)
\right].
\]

The strong-pruning hypothesis is that pruning rate and expected search speedup
are high while:

\[
\Pr_{I\sim\mu}[RetainAny_{\tau}(I)=1]
\ge1-\epsilon_A.
\]

This is a usefulness hypothesis, not an exact-set preservation theorem. Such a
theorem would instead require \(RetainAll_{\tau}(I)=1\) for every admitted
instance.

The core exact algorithm does not assume this hypothesis: it uses AIF as a
ranking prior and retains the slow track.

### \(H_{align}\) — Human Alignment

Formal requirements, hard constraints, objectives, and preferences approved at
the formalization gate predict acceptance at the review gate with declared
calibration error. Active inference can expose boundaries, preferences, and
expected observations, but does not select human values without this approved
input.

### \(H_{lens}\) — Concrete Realizability

A sufficiently large fraction of useful relational candidates falls inside the
partial lens domain, and the resulting patches preserve untouched concrete
content while remaining acceptable to human reviewers.

These are the only claims in the bounded theory that require empirical cases.
They concern efficiency, landscape quality, alignment, and coverage rather
than the correctness of the exact bounded search theorem.

## 12.4 Completed and Open Obligations

The extended theorem ledger is:

| Obligation | Status | Exact boundary |
| --- | --- | --- |
| Relational edit-basis reachability | Closed | Raw finite states; exact distance \(|D\triangle D'|\) |
| Legal-state connectivity by single-fact edits | Not claimed | Use staging or typed atomic macros |
| Bounded state-space finiteness | Closed | All carriers and evaluators must satisfy admissibility |
| Quotient search safety | Closed conditionally | \(\sim_B\) must preserve \(H\), \(\mathbf J\), and successors |
| Fair tabled termination | Closed | Finite lifted budget graph and total bounded operations |
| Bounded reachability completeness | Closed | All enabled edits must be enumerated by the slow track |
| Exact bounded Pareto result | Closed | Exhaustive mode only |
| Collision-safe exact canonicalization | Closed by construction | Exact fallback may be expensive |
| Byte-preserving source projection | Closed conditionally | Partial lens domain and registered language adapter |
| Guided-search preservation | Closed | Finite weighted schedule with independent slow coverage |
| Unbounded search termination or equivalence | Excluded | Subject to classical undecidability boundaries |
| Practical speed and memory | Hypothesis | \(H_{locality},H_{gen},H_{AIF}\) |
| Human-value alignment | Hypothesis | \(H_{align}\) under approved formalization |
| Cross-language lens coverage | Hypothesis | \(H_{lens}\) and language-specific adapters |
| Mechanized proofs | Open strengthening | Does not change theorem statements |

No further philosophical primitive is required by this formalization. The
remaining non-empirical work is mechanization or implementation of declared
interfaces, not discovery of an additional semantic layer. The remaining
claims about likely usefulness are isolated as the five hypotheses above.


## References

- Anthony J. Bonner and Michael Kifer. [*An Overview of Transaction Logic*](https://www.sciencedirect.com/science/article/pii/0304397594901902). *Theoretical Computer Science* 133(2), 205–265, 1994.
- Anthony J. Bonner and Michael Kifer. [*Transaction Logic Programming (or, A Logic of Procedural and Declarative Knowledge)*](https://www3.cs.stonybrook.edu/~kifer/TechReports/transaction-logic.pdf). Technical Report CSRI-323, University of Toronto, 1995.
- Anthony J. Bonner and Michael Kifer. [*Concurrency and Communication in Transaction Logic*](https://www3.cs.stonybrook.edu/~kifer/TechReports/concurrent-trans-logic.pdf). Joint International Conference and Symposium on Logic Programming, 142–156, MIT Press, 1996.
- Anthony J. Bonner and Michael Kifer. [*A Logic for Programming Database Transactions*](https://link.springer.com/chapter/10.1007/978-1-4615-5643-5_5). In *Logics for Databases and Information Systems*, 117–166, 1998.
- Marcus Vinicius dos Santos. *Executable Denotations for Concurrent Languages Using Concurrent Transaction Logic*. 20th Workshop on Logic Programming, 2006.
- Brendan D. McKay and Adolfo Piperno. [*Practical Graph Isomorphism, II*](https://arxiv.org/abs/1301.1493). *Journal of Symbolic Computation* 60, 94–112, 2014.
- Irene Heinrich, Moritz Lichter, Klara Pakhomenko, and Simon Raßmann. [*Weisfeiler–Leman on Graphs of Small Twin-Width*](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.WG.2026.26). *LIPIcs WG 2026* 376, 26:1–26:15, 2026.
- Aaron Bohannon, J. Nathan Foster, Benjamin C. Pierce, Alexandre Pilkiewicz, and Alan Schmitt. [*Boomerang: Resourceful Lenses for String Data*](https://laser.epfl.ch/papers/boomerang.pdf). ACM SIGPLAN–SIGACT Symposium on Principles of Programming Languages, 2008.
- Unison Computing. [*The Big Idea: Content-Addressed Code*](https://www.unison-lang.org/docs/the-big-idea/). Unison language documentation.
- Microsoft. [*Use the .NET Compiler Platform SDK Syntax Model*](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/work-with-syntax). Roslyn full-fidelity syntax-tree documentation.
- Tree-sitter. [*Tree-sitter Documentation*](https://tree-sitter.github.io/tree-sitter/). Incremental concrete-syntax-tree documentation.
- Microsoft. [*Language Server Protocol Specification 3.18*](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.18/specification/). `TextEdit` and `WorkspaceEdit` protocol definitions.
- David Silver et al. [*Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*](https://arxiv.org/abs/1712.01815). 2017.
- Karl Friston, Thomas FitzGerald, Francesco Rigoli, Philipp Schwartenbeck, and Giovanni Pezzulo. [*Active Inference: A Process Theory*](https://direct.mit.edu/neco/article/29/1/1/8207/Active-Inference-A-Process-Theory). *Neural Computation* 29(1), 1–49, 2017.
- Michael Kirchhoff, Thomas Parr, Ensor Palacios, Karl Friston, and Julian Kiverstein. [*The Markov Blankets of Life: Autonomy, Active Inference and the Free Energy Principle*](https://royalsocietypublishing.org/rsif/article/15/138/20170792/35768/The-Markov-blankets-of-life-autonomy-active). *Journal of the Royal Society Interface* 15(138), 20170792, 2018.
