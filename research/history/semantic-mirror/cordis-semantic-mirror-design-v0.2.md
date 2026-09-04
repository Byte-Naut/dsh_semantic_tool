# Cordis Semantic Mirror Design v0.2

## 从 Semantic ABI 到最小可执行闭环

日期：2026-09-03  
模式：DESIGN / SYNTHESIZE + ARTIFACT / CHANGE  
事实基线：cordis-relational-reification-v0.2  
实现：cordis-semantic-mirror-poc v0.1

本文只回答：

> 如何利用 Cordis semantic ABI 建造、验证并逐步授权一个 semantic mirror？

Cordis 的客观 source/runtime facts 不在这里重复；它们属于独立 REIFY 文档。

---

# 1. Result

**PASS**

选定的“shadow collector → relational snapshot → impact_remove → independent direct
comparison”最小闭环已实现并在真实 Cordis 4.0.0-rc.9 runtime 上通过；更广泛的
query engine、bounded checker 与 authority 仍保持未实现状态。

PASS 的含义仅是：

- 本次 bounded design 已进入 artifact stage；
- \(D^*\) 与实现 \(I\) 在一个 provider-removal scenario 上一致；
- 没有发现 fixed-\(P_0\)、read-only shadow 或 oracle boundary 违规。

---

# 2. Grounding

## 2.1 Claims

| Claim | Class | Evidence |
|---|---|---|
| v0.1 混合了 REIFY 与 DESIGN | AUTHORITATIVE | 用户本次分析与 2234 行文档结构 |
| snapshot schema 以前没有 live instantiation | AUTHORITATIVE | 用户本次分析 |
| first value test 应是 impact_remove(provider) | AUTHORITATIVE | 用户本次要求 |
| target/committed binding 必须分开 | DERIVED | Cordis Fiber source |
| direct/transitive impact 需要跨五个 native domains | DERIVED | PoC direct-inspection.json |
| 一次关系 query 可返回七类结果 | DERIVED | PoC impact-remove.json |
| query prediction 与 actual disposal trace 一致 | DERIVED | PoC closed-loop-result.json |
| 该结果证明一般 Agent complexity 更低 | UNKNOWN | 当前没有 Agent-level comparative experiment |

## 2.2 Advisory challenge

不把“2234 行 schema 更统一”当成 compression evidence。当前只接受一个更窄的结论：

> 在 bounded provider-removal fixture 中，调用者从跨五个 Cordis native state
> domains 的 bookkeeping，收缩到一个返回七类结果的 relational query。

## 2.3 Remaining unknowns

- 生产 runtime overhead；
- observer 事件丢失与恢复；
- Context 全量枚举；
- isolate 多 realm；
- loader tree；
- dsh dynamic package live capture；
- asynchronous in-flight snapshot；
- arbitrary JavaScript 与 external effects；
- Agent token/step/error complexity。

---

# 3. Semantic Contract

\[
M_D=(D_D,H_D,\mathbf J_D,R_D,A_D,N_D).
\]

## 3.1 \(D_D\)

本设计只保留改变 candidate feasibility 或验证结果的事实：

~~~text
baseline("mixed_semantic_abi_v0_1").
gap("no_live_snapshot").
gap("no_executable_impact_query").
gap("no_direct_differential_witness").

selected_runtime("cordis", "4.0.0-rc.9").
selected_scenario("provider_removal_transitive_chain").
selected_query("impact_remove").
selected_mode("shadow_read_only").
selected_oracle("independent_native_traversal").
~~~

## 3.2 Hard constraints \(H_D\)

| ID | Constraint |
|---|---|
| HD01 | Cordis-specific semantics 只进入 \(D\)，不增加 \(P_0\) rules。 |
| HD02 | collector 对 Cordis state 只读。 |
| HD03 | scenario mutation 只通过正式 Cordis API。 |
| HD04 | relational query 只能读取 facts。 |
| HD05 | direct comparator 不调用 relational query。 |
| HD06 | query prediction 必须与 native pre-inspection 一致。 |
| HD07 | prediction 必须与 actual quiescent post-state 一致。 |
| HD08 | coverage 与 UNKNOWN 必须返回。 |
| HD09 | disposed identity 必须以 tombstone 稳定保留。 |
| HD10 | 本阶段没有 authority。 |

## 3.3 Objectives \(\mathbf J_D\)

优先级：

1. 产生 actual \(D_{\text{snapshot}}\)；
2. 闭合一条高价值 transitive query；
3. 建立 independent differential witness；
4. 暴露 query coverage；
5. 测量 interface compression；
6. 最小化 collector 和 scenario。

## 3.4 Regularization \(R_D\)

- 一个 process；
- 一个 provider；
- 一个 direct consumer；
- 一个 transitive consumer；
- 两个 services；
- 一个 destructive action：dispose provider Fiber；
- 不引入数据库、Datalog、CTR engine 或 UI；
- 不修改 Cordis repository；
- 不接入 dsh dynamic authority。

## 3.5 Assumptions \(A_D\)

| ID | Assumption |
|---|---|
| AD01 | npm cordis 4.0.0-rc.9 与 pinned source 语义一致。 |
| AD02 | bounded fixture 中 Registry/Reflect/Fiber reachable closure 完整。 |
| AD03 | Fiber._store 与 Fiber.store 可在此 revision 被 observer 读取。 |
| AD04 | getEffects 的 EffectMeta object identity 在 process 内稳定。 |
| AD05 | await Fiber 后得到本 scenario 的 quiescent boundary。 |

## 3.6 Non-goals \(N_D\)

- production deployment；
- general-purpose query language；
- full loader/dsh support；
- bounded model checker；
- runtime authority；
- formal verification；
- general complexity proof。

---

# 4. Baseline and Witness

## 4.1 Baseline \(D_0\)

v0.1 已经有：

- ontology/schema；
- identity discipline；
- source-grounded facts；
- snapshot format；
- transition/query/checker specifications。

但没有：

~~~text
absence("actual_live_snapshot").
absence("executable_impact_remove").
absence("independent_runtime_comparator").
absence("executed_cordis_to_d_trace").
~~~

## 4.2 Gap witness

在 v0.1 中可以写出：

~~~text
query_kind("q1", "impact_remove").
~~~

但不能给出来自真实 runtime 的：

~~~text
query_input("q1", "actual_service_impl_id").
query_result("q1", "actual_direct_consumer", "fiber_id").
comparison_result("q1", "native_oracle", "equal").
post_state_result("q1", "actual_runtime", "equal").
~~~

因此旧状态是 semantic model specification，不是 executable mirror。

---

# 5. Candidates

## 5.1 Candidate A：JSON snapshot helper

Delta：

- 增加一次 object-to-JSON capture；
- query 直接遍历 JSON object graph。

优点：

- 最少代码；
- 调试容易。

缺点：

- identity、predicate、coverage 与 evidence semantics 仍由每个 query 重写；
- 容易变成另一个 Cordis-specific helper；
- 与 semantic ABI 的 ground-fact contract 不一致。

Constraint：违反 HD04 的稳定 fact boundary。未选。

## 5.2 Candidate B：in-memory ground FactStore

Delta：

- 增加 canonical identity mint；
- 将每次 snapshot 写成 ground tuples；
- impact_remove 只读 facts；
- direct comparator 独立读 native objects；
- action 后再 capture。

优点：

- 最小地实现 semantic ABI；
- 不需要外部数据库；
- 可导出 facts/JSON；
- 能检查 identity、coverage 与 provenance path；
- query caller 与 native structure 解耦。

缺点：

- collector 仍依赖 revision-pinned semi-private members；
- 只支持一个 query；
- 没有 durability 或 concurrency control。

Constraint：HD01–HD10 均可满足。选定。

## 5.3 Candidate C：直接 core instrumentation

Delta：

- 修改 Cordis core，为 every effect/binding transition 增加稳定事件；
- mirror 由 event sourcing 重建。

优点：

- 更接近完整 observation；
- 减少 private-field polling。

缺点：

- 超出最小闭环；
- 改动 executor；
- 在价值尚未证明前增加耦合与维护成本。

Constraint：违反当前 \(R_D\) 与 HD02。延后。

## 5.4 Counterexample search

对 Candidate B 主动检查：

| Counterexample | 处理 |
|---|---|
| wrapper Fiber 与 underlying Fiber 重复 | 发现并修复；collector 只从 Registry 保留 underlying object |
| effect path 变化导致跨 snapshot ID 漂移 | 发现并修复；改用 EffectMeta object identity |
| internal/service 有 value 就误称 visible | 发现并修复；事件改称 service_registry_value；visibility 仍由 provider ACTIVE 决定 |
| disposed provider 从 Registry 消失 | 发现并修复；known Fiber 以 tombstone 保留 |
| partial Context coverage 被误当 complete | coverage 明确为 partial |
| query 与 comparator 共用算法 | comparator 独立遍历 native objects，不调用 facts/query |

No additional counterexample was found within the modeled states, boundaries, and assumptions.

---

# 6. Selected Design

## 6.1 \(D^*\)

~~~text
design("cordis_semantic_mirror_poc_v0_1").
design_status("cordis_semantic_mirror_poc_v0_1", "implemented").

component("cordis_runtime").
component("live_collector").
component("fact_store").
component("impact_remove_query").
component("direct_native_comparator").
component("closed_loop_assertions").

reads("live_collector", "registry").
reads("live_collector", "runtime_fibers").
reads("live_collector", "fiber_target_and_committed_store").
reads("live_collector", "reflect_store").
reads("live_collector", "effect_metadata").
writes("live_collector", "ground_snapshot").

reads("impact_remove_query", "ground_snapshot_only").
writes("impact_remove_query", "impact_result").

reads("direct_native_comparator", "native_cordis_objects_only").
writes("direct_native_comparator", "oracle_result").

calls("closed_loop_assertions", "fiber_dispose").
compares("closed_loop_assertions", "impact_result", "oracle_result").
compares("closed_loop_assertions", "impact_result", "actual_post_state").

authority("cordis_runtime", "executor").
authority("fact_store", "read_only_shadow").
~~~

## 6.2 Architecture

~~~mermaid
flowchart TD
    C["Actual Cordis runtime"] --> O["Read-only collector"]
    O --> D["Ground snapshot D"]
    D --> Q["impact_remove"]
    C --> N["Native comparator"]
    Q --> X["Assertions"]
    N --> X
    X --> C
~~~

最后一条 edge 只执行 fixture 已授权的 Fiber.dispose；query 本身没有 write authority。

## 6.3 Semantic delta

\[
\Delta_D=(Del_D,Ins_D).
\]

删除：

~~~text
mixed_mode("artifact_reify", "design_synthesize").
proposal_facts_inside_reification_document.
uninstantiated_snapshot_only.
query_specification_without_execution.
~~~

增加：

~~~text
document("cordis_relational_reification_v0_2", "reify_only").
document("cordis_semantic_mirror_design_v0_2", "design_only").
implementation("cordis_semantic_mirror_poc_v0_1").
actual_snapshot("snap:rt:cordis-poc:1:1", 227).
actual_snapshot("snap:rt:cordis-poc:1:2", 267).
actual_event_trace("provider_removal", 23).
executed_query("impact_remove").
differential_result("impact_remove", "pass").
~~~

## 6.4 Components

| File | Responsibility |
|---|---|
| src/facts.mjs | ground tuple store 与 deterministic serialization |
| src/collector.mjs | identity、capture、coverage、events、tombstones |
| src/impact-query.mjs | fact-only transitive impact closure |
| src/direct-oracle.mjs | independent native traversal 与 post-state inspection |
| src/fixture.mjs | provider → UI → reporter runtime |
| src/run-closed-loop.mjs | capture/query/action/compare/artifacts |
| test/closed-loop.test.mjs | bounded executable assertions |

---

# 7. Behavior Accounting

## 7.1 Preserved

- Cordis remains the actual executor；
- plugin activation uses Context.plugin；
- services use ctx.provide；
- dependencies use plugin inject；
- teardown uses Fiber.dispose；
- Cordis state transitions and effect cleanup remain unchanged；
- \(P_0\) remains fixed and absent from implementation。

## 7.2 Added

- runtime-local canonical IDs；
- before/after ground snapshots；
- event trace；
- effect tombstones；
- per-domain coverage；
- impact_remove query；
- independent direct comparator；
- executable assertions；
- serialized evidence artifacts。

## 7.3 Intentionally not added

- write authority；
- Datalog/SQL/CTR runtime；
- design search；
- dynamic package actions；
- arbitrary code model；
- external effect proof。

## 7.4 Actual trace result

Pre-state：

\[
clock\ provider
\to clock\ UI
\to clockView\ reporter.
\]

Prediction：

- direct consumer：clock-ui；
- transitive consumer：clock-reporter；
- provider final：DISPOSED；
- consumers final：PENDING；
- affected services：clock、clockView；
- predicted Cordis-tracked effects：5。

Actual：

- visible services：0；
- provider：DISPOSED；
- UI：PENDING；
- reporter：PENDING；
- active fixture effects：0；
- disposed effect facts：6，包括 root-owned plugin lifecycle wrapper。

## 7.5 Compression accounting

| Metric | Result |
|---|---:|
| relational caller operations | 1 query |
| result facets | 7 |
| native state domains used by independent comparator | 5 |
| direct consumers | 1 |
| transitive consumers | 1 |
| runtime events | 23 |
| pre facts | 227 |
| post facts | 267 |

结论：

\[
\boxed{\text{bounded interface compression demonstrated}}
\]

不是：

\[
\boxed{\text{general reasoning complexity reduction proved}}.
\]

---

# 8. Traceability and Implementation Review

## 8.1 Responsibility chain

\[
R_{\mathrm{req}}
\to S
\to D
\to I
\to V.
\]

| Stage | Artifact |
|---|---|
| \(R_{\mathrm{req}}\) | 文档拆分 + M0/M1 + impact_remove + direct comparison |
| \(S\) | source anchors、REIFY/DESIGN prompts、semantic ABI v0.1 |
| \(D\) | Candidate B 与 \(D^*\) |
| \(I\) | cordis-semantic-mirror-poc |
| \(V\) | node --test、demo、facts、query、direct comparator、event trace |

## 8.2 Verification

执行环境：

- Node 24.19.0；
- cordis 4.0.0-rc.9；
- built-in node:test。

结果：

~~~text
tests 1
pass 1
fail 0
~~~

Assertions cover：

- relational/native direct consumers equal；
- relational/native transitive consumers equal；
- affected fibers equal；
- effect sets equal；
- actual provider DISPOSED；
- actual consumers PENDING；
- services absent；
- fixture effects disposed；
- target/committed bindings present before；
- stable provider tombstone after；
- disposed effect facts retained。

## 8.3 \(D^*\leftrightarrow I\)

| Design obligation | Implementation | Status |
|---|---|---|
| fact-only query | impact-query.mjs receives snapshot only | PASS |
| read-only collector | collector only reads runtime | PASS |
| official mutation path | fixture Fiber.dispose | PASS |
| independent oracle | direct-oracle.mjs | PASS |
| identity stability | WeakMap/Map + native uid | PASS |
| effect identity across snapshots | EffectMeta identity | PASS |
| UNKNOWN/coverage | domain_coverage facts + query output | PASS |
| no project Horn rules | no rule engine/rule file | PASS |

## 8.4 Implementation status by original slices

| Slice | Status |
|---|---|
| M0 static/source grounding | already present in REIFY ABI |
| M1 live collector | implemented for bounded reachable core domains |
| M2 query service | one query implemented：impact_remove |
| M3 differential harness | one provider-removal scenario implemented |
| M4 bounded checker | not implemented |
| M5 reviewed authority | not implemented |

## 8.5 Next evidence threshold

下一步不应扩写 ontology。优先增加两个反例压力最大的 executable scenarios：

1. provider replacement while consumer is LOADING，用来验证 target/committed divergence；
2. failed dsh update，用来验证 last_successful_package/active_run divergence。

只有在这些场景仍保持统一 query 与 direct trace correspondence 后，才值得实现通用
query service 或 bounded checker。
