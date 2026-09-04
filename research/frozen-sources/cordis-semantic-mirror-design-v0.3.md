# Cordis Semantic Mirror Design v0.3

## 从 Semantic ABI 到最小可执行闭环

日期：2026-09-03  
模式：DESIGN / SYNTHESIZE + ARTIFACT / CHANGE  
事实基线：cordis-relational-reification-v0.3  
实现：cordis-semantic-mirror-poc v0.2

本文只回答：

> 如何利用 Cordis semantic ABI 建造、验证并逐步授权一个 semantic mirror？

Cordis 的客观 source/runtime facts 不在这里重复；它们属于独立 REIFY 文档。

---

# 1. Result

**PASS**

选定的 shadow collector → relational snapshot → fact-only query → independent direct
comparison 闭环已跨三个 lifecycle scenarios 通过：provider removal、LOADING 中
provider replacement、failed dsh update + explicit recovery。更广泛的 query engine、
bounded checker 与 authority migration 仍保持未实现状态。

PASS 的含义仅是：

- 本次 bounded design 已进入 artifact stage；
- \(D^*\) 与实现 \(I\) 在三个相互不同的 lifecycle scenarios 上一致；
- 同一 FactStore、snapshot/coverage、identity、absence/provenance discipline 被复用；
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
| LOADING replacement 中 target=v2、committed=v1 | DERIVED | PoC scenario-2/during.facts + direct inspection |
| first load settle 后 consumer 重新以 v2 ACTIVE | DERIVED | PoC scenario-2/result.json |
| failed update 后 currentPackageId=pkg-1 但 activeRun absent | DERIVED | PoC scenario-3 failed facts + native inventory |
| explicit run(pkg-1) 恢复 active run | DERIVED | PoC scenario-3 recovered facts + native inventory |
| 该结果证明一般 Agent complexity 更低 | UNKNOWN | 当前没有 Agent-level comparative experiment |

## 2.2 Advisory challenge

不把“2234 行 schema 更统一”当成 compression evidence。当前接受两个受限结论：

> 在 bounded provider-removal fixture 中，调用者从跨五个 Cordis native state
> domains 的 bookkeeping，收缩到一个返回七类结果的 relational query。

> 同一 relational substrate 在三个 lifecycle phenomena 上都能与 native state 和
> actual transition 对齐，已构成 semantic substrate reuse evidence。

## 2.3 Remaining unknowns

- 生产 runtime overhead；
- observer 事件丢失与恢复；
- Context 全量枚举；
- isolate 多 realm；
- loader tree；
- 生产规模 dsh dynamic package capture；
- 除选定 LOADING cut 外的通用 in-flight observation；
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
baseline("cordis_semantic_mirror_poc_v0_1_provider_removal").

selected_runtime("cordis", "4.0.0-rc.9").
selected_runtime("@deepseek-ai/cordis", "4.0.2").
selected_runtime("@deepseek-ai/dsh-cordis-host-runner", "0.1.2-alpha.5").
selected_scenario("provider_removal_transitive_chain").
selected_scenario("provider_replacement_while_consumer_loading").
selected_scenario("failed_dsh_update_and_explicit_recovery").
selected_query("impact_remove").
selected_query("explain_binding_divergence").
selected_query("explain_dynamic_package_state").
selected_mode("shadow_read_only").
selected_oracle("independent_native_traversal").
~~~

## 3.2 Hard constraints \(H_D\)

| ID | Constraint |
|---|---|
| HD01 | Cordis/dsh-specific semantics 只进入 \(D\)，不增加 \(P_0\) rules。 |
| HD02 | collector 对 Cordis state 只读。 |
| HD03 | scenario mutation 只通过正式 Cordis/dsh runner API。 |
| HD04 | relational query 只能读取 facts。 |
| HD05 | direct comparator 不调用 relational query。 |
| HD06 | query prediction 必须与 native pre-inspection 一致。 |
| HD07 | prediction 必须与 actual quiescent post-state 一致。 |
| HD08 | coverage 与 UNKNOWN 必须返回。 |
| HD09 | disposed identity 必须以 tombstone 稳定保留。 |
| HD10 | 本阶段没有 authority。 |
| HD11 | Scenario 2/3 只实例化既有 ABI predicates，不扩 ontology。 |

## 3.3 Objectives \(\mathbf J_D\)

优先级：

1. 产生 actual \(D_{\text{snapshot}}\)；
2. 闭合三个高价值 lifecycle queries；
3. 建立 independent differential witness；
4. 暴露 query coverage；
5. 测量 interface compression；
6. 最小化 collector 和 scenario。

## 3.4 Regularization \(R_D\)

- 每个 scenario 一个 process；
- provider-removal 保留一个 direct 与一个 transitive consumer；
- replacement 保留一个 provider slot 与一个 deliberately blocked consumer；
- failed-update 保留一个 dynamic plugin 与两个 immutable host packages；
- actions 仅为 dispose、replace、update 与 explicit run；
- 不引入数据库、Datalog、CTR engine 或 UI；
- 不修改 Cordis repository；
- 不接入模型、浏览器或 production dsh composition。

## 3.5 Assumptions \(A_D\)

| ID | Assumption |
|---|---|
| AD01 | npm cordis 4.0.0-rc.9 与 pinned source 语义一致。 |
| AD02 | bounded fixture 中 Registry/Reflect/Fiber reachable closure 完整。 |
| AD03 | Fiber._store 与 Fiber.store 可在此 revision 被 observer 读取。 |
| AD04 | getEffects 的 EffectMeta object identity 在 process 内稳定。 |
| AD05 | await Fiber 后得到本 scenario 的 quiescent boundary。 |
| AD06 | published dsh runner 0.1.2-alpha.5 是本 scenario 的 native lifecycle oracle。 |

## 3.6 Non-goals \(N_D\)

- production deployment；
- general-purpose query language；
- full loader/dsh production support；
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
- 只支持三个固定高价值 queries；
- 没有 durability 或 concurrency control。

Constraint：HD01–HD11 均可满足。选定。

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
| replacement 时 target/committed 被 collapse | 以 blocked apply 捕获 LOADING cut；两个 impl identity 必须不同 |
| old service impl 从 Reflect store 消失后失去 identity | collector 保留已知 service impl metadata；binding 仍可引用 tombstone |
| currentPackageId 被误读为正在运行 | query 必须读取 active_run 或 complete-coverage absence_fact |
| failed target 覆盖 last successful | next_package 与 last_successful_package 分开 |

No additional counterexample was found within the modeled states, boundaries, and assumptions.

---

# 6. Selected Design

## 6.1 \(D^*\)

~~~text
design("cordis_semantic_mirror_poc_v0_2").
design_status("cordis_semantic_mirror_poc_v0_2", "implemented").

component("cordis_runtime").
component("live_collector").
component("fact_store").
component("impact_remove_query").
component("binding_divergence_query").
component("dynamic_package_state_query").
component("dynamic_inventory_collector").
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

reads("binding_divergence_query", "ground_snapshot_only").
writes("binding_divergence_query", "binding_result").

reads("dynamic_inventory_collector", "runner_inventory").
writes("dynamic_inventory_collector", "ground_snapshot").
reads("dynamic_package_state_query", "ground_snapshot_only").
writes("dynamic_package_state_query", "package_state_result").

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
    C["Cordis runtime"] --> O["Cordis collector"]
    R["dsh runner"] --> P["Inventory collector"]
    O --> D["Ground snapshot D"]
    P --> D
    D --> Q["Three fact-only queries"]
    C --> N["Native comparators"]
    R --> N
    Q --> X["Assertions"]
    N --> X
    X --> A["Fixture-authorized actions"]
    A --> C
    A --> R
~~~

action edges 只执行 fixture 已授权的 Fiber.dispose/provider mount 或 runner.run；query
本身没有 write authority。

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
document("cordis_relational_reification_v0_3", "reify_only").
document("cordis_semantic_mirror_design_v0_3", "design_only").
implementation("cordis_semantic_mirror_poc_v0_2").
actual_snapshot("snap:rt:cordis-poc:1:1", 227).
actual_snapshot("snap:rt:cordis-poc:1:2", 277).
actual_event_trace("provider_removal", 23).
executed_query("impact_remove").
differential_result("impact_remove", "pass").
actual_snapshot("snap:rt:cordis-replacement:1:2", 219).
actual_event_trace("provider_replacement", 19).
executed_query("explain_binding_divergence").
differential_result("explain_binding_divergence", "pass").
actual_snapshot("snap:rt:dsh-dynamic:1:2", 32).
actual_event_trace("failed_dsh_update", 3).
executed_query("explain_dynamic_package_state").
differential_result("explain_dynamic_package_state", "pass").
~~~

## 6.4 Components

| File | Responsibility |
|---|---|
| src/facts.mjs | ground tuple store 与 deterministic serialization |
| src/collector.mjs | identity、capture、coverage、events、tombstones |
| src/impact-query.mjs | fact-only transitive impact closure |
| src/binding-query.mjs | fact-only target/committed divergence explanation |
| src/dynamic-collector.mjs | public dsh inventory → existing dynamic package predicates |
| src/package-query.mjs | fact-only last-successful/active-run explanation |
| src/direct-oracle.mjs | independent native traversal 与 post-state inspection |
| src/dynamic-direct-oracle.mjs | independent public runner.inventory comparison |
| src/fixture.mjs | provider → UI → reporter runtime |
| src/dsh-fixture.mjs | real host-runner v1/v2 failed-update fixture |
| src/run-closed-loop.mjs | capture/query/action/compare/artifacts |
| src/run-provider-replacement.mjs | Scenario 2 capture/query/replace/compare |
| src/run-failed-update.mjs | Scenario 3 capture/query/update/recover/compare |
| src/run-all-scenarios.mjs | three-scenario executable aggregate |
| test/*.test.mjs | three bounded executable assertion suites |

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
- explain_binding_divergence query；
- dynamic inventory collector 与 explain_dynamic_package_state query；
- independent direct comparator；
- executable assertions；
- serialized evidence artifacts。

## 7.3 Intentionally not added

- write authority；
- Datalog/SQL/CTR runtime；
- design search；
- dynamic package authority migration；
- arbitrary code model；
- external effect proof。

## 7.4 Scenario 1 trace result

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
| post facts | 277 |

结论：

\[
\boxed{\text{bounded interface compression demonstrated}}
\]

不是：

\[
\boxed{\text{general reasoning complexity reduction proved}}.
\]

## 7.6 Scenario 2：replacement during LOADING

刻意阻塞 consumer 的第一次 async apply，在 provider v1 的 disposal 尚未完成时发布
v2。中间 capture 必须同时满足：

\[
state=LOADING,\quad target=v2,\quad committed=v1.
\]

关系 query 与直接读取 `Fiber._store/Fiber.store` 一致。释放 gate 后，实际 trace 为：

\[
load(v1)\to unload(v1)\to load(v2)\to ACTIVE(v2).
\]

v1 consumer effect 被撤销，v2 成为 visible、target 与 committed provider。三个
snapshots 为 154 / 219 / 249 facts，19 events。

## 7.7 Scenario 3：failed dsh update

真实 published host runner 执行：

\[
run(pkg_1)\to update(pkg_2)\;fails\to run(pkg_1)\;explicitly.
\]

失败 snapshot 的统一 query 一次返回八类结果，并拒绝
`last_successful_package ⇒ active_run` 的错误推断。关系结果与独立 public
`runner.inventory()` 完全一致；建议的 `run(pkg-1, mode=run)` 由 runner 实际执行并
恢复 run-3/pkg-1。三个 snapshots 为 27 / 32 / 31 facts，native lifecycle events 为 3。

## 7.8 Semantic substrate reuse conclusion

| Reused mechanism | Scenario 1 | Scenario 2 | Scenario 3 |
|---|---|---|---|
| ground FactStore | yes | yes | yes |
| snapshot identity/coverage | yes | yes | yes |
| identity-sensitive relation | provider/effect | target/committed impl | package/run |
| explicit absence | post visibility | no | active_run |
| fact-only query | impact | binding divergence | package truth/recovery |
| independent native oracle | private traversal | Fiber stores | public inventory |
| actual transition validation | disposal | unload/reload | failed update/restart |

因此 v0.3 的最强可支持结论是：

\[
\boxed{\text{one relational substrate reused across three lifecycle phenomena}}
\]

仍不是一般 complexity reduction 或 runtime authority 的证明。

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
| \(R_{\mathrm{req}}\) | Scenario 2/3：binding divergence + failed update/recovery |
| \(S\) | source anchors、REIFY/DESIGN prompts、semantic ABI v0.3 |
| \(D\) | Candidate B 与 \(D^*\) |
| \(I\) | cordis-semantic-mirror-poc v0.2 |
| \(V\) | node --test、demo、facts、query、direct comparator、event trace |

## 8.2 Verification

执行环境：

- Node 24.19.0；
- cordis 4.0.0-rc.9；
- @deepseek-ai/cordis 4.0.2；
- @deepseek-ai/dsh-cordis-host-runner 0.1.2-alpha.5；
- built-in node:test。

结果：

~~~text
tests 3
pass 3
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
- LOADING 中 target impl 与 committed impl 不同；
- relational/native binding views equal；
- replacement 最终收敛到 v2 ACTIVE；
- failed update 保留 last successful 和 failed target；
- complete coverage 下 active_run 强缺失；
- relational/public inventory views equal；
- explicit run(pkg-1) 恢复 active run 并清除 next target。

## 8.3 \(D^*\leftrightarrow I\)

| Design obligation | Implementation | Status |
|---|---|---|
| fact-only query | impact-query.mjs receives snapshot only | PASS |
| binding divergence query | binding-query.mjs receives snapshot only | PASS |
| dynamic package query | package-query.mjs receives snapshot only | PASS |
| read-only collector | collector only reads runtime | PASS |
| public dynamic collector | dynamic-collector only reads runner.inventory | PASS |
| official mutation path | fixture Fiber.dispose | PASS |
| official update/recovery path | runner.run(update/run) | PASS |
| independent oracle | direct-oracle.mjs | PASS |
| independent dsh oracle | dynamic-direct-oracle reads native inventory | PASS |
| identity stability | WeakMap/Map + native uid | PASS |
| effect identity across snapshots | EffectMeta identity | PASS |
| UNKNOWN/coverage | domain_coverage facts + query output | PASS |
| no project Horn rules | no rule engine/rule file | PASS |
| no ontology expansion | Scenario 2/3 use predicates already present in v0.1 ABI | PASS |

## 8.4 Implementation status by original slices

| Slice | Status |
|---|---|
| M0 static/source grounding | already present in REIFY ABI |
| M1 live collector | implemented for bounded reachable core domains |
| M2 query service | three fixed queries implemented |
| M3 differential harness | three lifecycle scenarios implemented |
| M4 bounded checker | not implemented |
| M5 reviewed authority | not implemented |

## 8.5 Next evidence threshold

两个反例压力场景已经通过。下一步仍不应扩写 ontology；应冻结本次 predicate slice，
在以下两条中选择一个新的可证伪门槛：

1. 把三个固定 query 暴露为一个统一 read-only query service，并做 Agent native-vs-D
   step/token/error 对照；
2. 对现有三条 bounded lifecycle traces 实现机械 invariant checker。

在完成其中至少一条以前，不进入 authority migration。
