# Cordis Relational Reification v0.2

## Semantic ABI

日期：2026-09-03  
模式：ARTIFACT / REIFY  
上游：cordis-ctr-relational-reification-v0.1  
源码基线：cordiverse/cordis 00278924a984fedfaffb4bc3d5eb7d8e76215643  
运行基线：npm cordis 4.0.0-rc.9

本文只回答：

> Cordis 是什么，以及一个 Cordis runtime snapshot 应如何成为可查询的 ground relational state？

本文不描述要造什么 mirror、checker 或 authority adapter。那些内容位于独立的
cordis-semantic-mirror-design-v0.2。

---

# 1. Mode and Result

## Result

**PASS**

Cordis 的 source semantics、identity discipline、runtime snapshot ABI、证据边界与
query semantics 已闭合为纯 REIFY 产物；并且已有一个实际 Cordis
4.0.0-rc.9 进程生成的 before/after \(D_{\text{snapshot}}\)，不再只有 snapshot schema。

这个 PASS 只覆盖：

- pinned source reification；
- 单进程 bounded fixture；
- Registry/Fiber/Reflect/binding/tracked-effect 可达闭包；
- 一个 provider-removal trace。

它不表示一般 Cordis runtime 已完整关系化，也不表示任意 JavaScript 或外部 effect
已被验证。

## Fixed interpreter boundary

\[
Q_{\text{Cordis}}\xrightarrow{\rho}\rho(Q_{\text{Cordis}})\subseteq D,
\qquad Q_{\text{Cordis}}\neq P_0.
\]

所有 Cordis-specific 内容都是 ground data。本文不定义 Cordis-specific Horn
rules。

\[
\boxed{\text{本文没有第八条 Cordis rule。}}
\]

---

# 2. Grounding

## 2.1 Sources

| ID | 级别 | 固定点 | 用途 |
|---|---|---|---|
| S1 | AUTHORITATIVE | software-space-ctdd-3.md §2.4、§3.3–3.8、§8 | \(D\)、\(L_0\)、固定 \(P_0\)、oracle 与 active-control boundary |
| S2 | AUTHORITATIVE | software-space-joint-canonicity-companion(2).md | immutable version、stable interpreter boundary |
| S3 | AUTHORITATIVE | software-artifact-semantic-normalization.prompt.en | REIFY 流程与输出契约 |
| S4 | AUTHORITATIVE | 用户本次拆分要求 | REIFY/DESIGN provenance 分离 |
| S5 | AUTHORITATIVE | Cordis paper arXiv:2608.25512 | component/fiber/effect/config/lifecycle calculus |
| S6 | DERIVED | Cordis git 00278924 | 当前 core、loader、HMR 与 tests |
| S7 | DERIVED | dsh git 49a606bc | dynamic package/version/run semantics |
| S8 | DERIVED | minimal PoC execution 2026-09-03 | live snapshots、query、direct comparator 与 actual trace |

## 2.2 Material claims

| Claim | 内容 | 级别 | Anchor |
|---|---|---|---|
| C01 | Fiber 是 component 的 runtime instance，并承载 dependency/effect/lifecycle | AUTHORITATIVE | S5 Components/Fibers |
| C02 | 当前实现有六个 FiberState | DERIVED | S6 packages/core/src/fiber.ts::FiberState |
| C03 | target bindings 与 committed bindings 是不同状态 | DERIVED | S6 Fiber._store、Fiber.store、_refresh/_reload/_unload |
| C04 | service identity 包含 key、realm 与 provider Fiber | DERIVED | S6 packages/core/src/reflect.ts::Impl/provide |
| C05 | provider withdrawal 会 refresh 并等待 consumers | DERIVED | S6 ReflectService.provide/notify |
| C06 | getEffects 暴露 Cordis-tracked effect metadata | DERIVED | S6 Fiber.getEffects |
| C07 | 单 effect 内 disposer 逆序；Fiber 顶层 cleanup 不建立全序 | DERIVED | S6 Fiber.effect/_unload、dispose.spec.ts |
| C08 | currentPackageId 是 last successful，不等于 active run | DERIVED | S7 registry/types/versioning.spec.ts |
| C09 | failed dynamic update 可保留 last successful 但没有 active run | DERIVED | S7 startFresh/retract/versioning.spec.ts |
| C10 | bounded live snapshot 已由真实 Cordis runtime 产生 | DERIVED | S8 artifacts/before.facts、after.facts |
| C11 | impact_remove 结果与独立 native traversal 及 actual lifecycle 一致 | DERIVED | S8 closed-loop-result.json |

## 2.3 Normalized conflicts

| 表面冲突 | 规范化 |
|---|---|
| 论文四态与源码六态 | 当前 ABI 使用源码六态；FAILED/DISPOSED 标成 implementation extensions，不强配为 Inactive。 |
| declared provide 与实际 provide | declared_provide 只表达 metadata；service_impl 表达实际 Reflect registration。 |
| service store 中有值与 service 可访问 | service_impl_registered 与 service_impl_visible 分开；后者还要求 provider ACTIVE。 |
| currentPackageId 与“正在运行” | 分成 last_successful_package 与 active_run。 |
| effect registered 与 inverse 正确 | effect_status 与 effect_inverse_evidence 分开。 |
| 未观察到与不存在 | domain_coverage 不 complete 时，缺失只得到 UNKNOWN。 |

## 2.4 UNKNOWN

1. 未被 Registry、Fiber、Reflect 或 event 引用的全部 Context；
2. arbitrary JavaScript 的 continuation 与内部 stack；
3. disposer 是否真正恢复 filesystem/network/external world；
4. service key 的接口或版本兼容性；
5. 多进程 identity；
6. loader tree 与 dsh registry 在本次 bounded fixture 中的 live 值；
7. 中间态的全量 effect execution timing；
8. 一般 Agent reasoning complexity 的变化量。

---

# 3. Artifact Scope

## 3.1 Included

- Context、Registry、Plugin.Runtime、Fiber、ReflectService、Impl、effect metadata；
- required injections、target binding、committed binding；
- Fiber state、parent、runtime、context 与 tombstone；
- service key、provider、realm、registration 与 visibility；
- source package/revision；
- dynamic plugin/package/current/next/run 的 source-grounded schema；
- committed snapshot、quiescence、coverage、event trace；
- impact_remove 的输入与结果语义；
- provider-loss 与 failed-update witnesses。

## 3.2 Entry points

| Entry | 作用 |
|---|---|
| Context | root runtime |
| RegistryService.entries/values | plugin runtime 与 live fibers |
| Fiber.uid/state/inject/_store/store/getEffects | identity、target、committed、effects |
| ReflectService.store/_getImpl | registered/visible services |
| internal/plugin、internal/status、internal/service | lifecycle observation |
| dsh DynamicCordisRegistry | dynamic package truth |

带下划线成员是 revision-pinned observer anchor，不是稳定 public API。ABI 必须把这种
fragility 写入 provenance，不能隐藏。

## 3.3 Excluded

- semantic mirror 的组件设计；
- checker/planner/authority 架构；
- arbitrary JavaScript semantics；
- external-world inverse proof；
- production persistence；
- search、deployment 与 runtime replacement。

---

# 4. Semantic Contract

\[
M_R=(D_R,H_R,\mathbf J_R,R_R,A_R,N_R).
\]

## 4.1 \(D_R\)

\[
D_R=
D_{\text{source}}
\uplus D_{\text{snapshot}}
\uplus D_{\text{trace}}
\uplus D_{\text{evidence}}.
\]

没有 \(D_{\text{proposal}}\)。

## 4.2 Extraction constraints \(H_R\)

| ID | Constraint |
|---|---|
| HR01 | 每个 fact ground。 |
| HR02 | 每个 runtime-local entity 使用 scoped canonical ID。 |
| HR03 | target_binding 与 committed_binding 不合并。 |
| HR04 | service_impl_registered 与 service_impl_visible 不合并。 |
| HR05 | last_successful_package 与 active_run 不合并。 |
| HR06 | 每个 snapshot/domain 都声明 coverage。 |
| HR07 | partial/unavailable domain 的 absence 为 UNKNOWN。 |
| HR08 | disposed entity 以 stable tombstone 保留时不得换 ID。 |
| HR09 | source、inference 与 live observation 的 provenance 分开。 |
| HR10 | execute/run 仍由固定 \(P_0\) 保留，不能出现在项目规则中。 |

## 4.3 \(\mathbf J_R\)

1. 最大化 source fidelity；
2. 最大化 identity stability；
3. 最大化 query-relevant joins；
4. 最小化 opaque payload；
5. 最小化为单一 query 无关的 peripheral facts。

## 4.4 \(R_R\)

当关系切片足以计算 provider-removal 的 direct/transitive impact、effects 与
coverage 时停止扩张。Loader 和 dynamic package 只保留 schema/source witness，
不虚构本次 fixture 中不存在的 live facts。

## 4.5 \(A_R\)

- 本次 live witness 是单进程；
- npm cordis 版本为 4.0.0-rc.9；
- Fiber uid 在同一 runtime 中唯一；
- Symbol/object surrogate 只保证同一 process epoch 内稳定；
- bounded fixture 的 reachable Registry/Reflect/Fiber domains 可声明 complete。

## 4.6 \(N_R\)

- 不设计未来系统；
- 不证明一般 complexity reduction；
- 不把 active control 自动放进 \(D\)；
- 不验证 arbitrary JS；
- 不执行 dynamic package authority。

---

# 5. Relational Model

## 5.1 Identity discipline

| Sort | Form | Lifetime |
|---|---|---|
| RuntimeId | rt:cordis-poc:1 | process epoch |
| SnapshotId | snap:\(RuntimeId\):sequence | immutable snapshot |
| FiberId | fiber:\(RuntimeId\):uid | process epoch；dispose 后保留 |
| PluginDefinitionId | plugin-definition:\(RuntimeId\):serial | observed callback identity |
| PluginRuntimeId | plugin-runtime:\(RuntimeId\):serial | observed Runtime object |
| ContextId | context:\(RuntimeId\):serial | observed object |
| RealmId | realm:\(RuntimeId\):serial:description | observed Symbol |
| ServiceImplId | service-impl:\(RuntimeId\):serial | Impl object lifetime |
| EffectId | effect:\(RuntimeId\):serial | EffectMeta object lifetime |
| EventId | event:\(RuntimeId\):sequence | append-only |

Symbol description、fiber name、array index 都不是独立 identity。

## 5.2 Core predicate ABI

~~~text
runtime(RuntimeId).
runtime_package(RuntimeId, PackageName, Version).

snapshot(SnapshotId, RuntimeId).
snapshot_label(SnapshotId, Label).
snapshot_observation_sequence(SnapshotId, Integer).
snapshot_phase(SnapshotId, committed_or_staging).
snapshot_quiescence(SnapshotId, quiescent_or_in_flight).
coverage_scope(SnapshotId, Scope).
domain_coverage(SnapshotId, Domain, complete_or_partial_or_unavailable).
coverage_reason(SnapshotId, Domain, Reason).

plugin_definition(PluginDefinitionId).
plugin_runtime(PluginRuntimeId, PluginDefinitionId).
plugin_name(PluginDefinitionId, Name).

fiber(FiberId).
fiber_member(SnapshotId, FiberId).
fiber_uid(FiberId, Integer).
fiber_name(FiberId, Name).
fiber_state(SnapshotId, FiberId, State).
fiber_liveness(SnapshotId, FiberId, registered_or_retained_tombstone).
fiber_parent(SnapshotId, FiberId, ParentFiberId).
fiber_context(SnapshotId, FiberId, ContextId).
fiber_instance_of(SnapshotId, FiberId, PluginRuntimeId).
fiber_waits_for(SnapshotId, FiberId, ServiceKey).

declared_injection(FiberId, ServiceKey, required_or_optional).
target_binding(SnapshotId, FiberId, ServiceKey, ServiceImplId).
committed_binding(SnapshotId, FiberId, ServiceKey, ServiceImplId).

service_key(ServiceKey).
service_impl(ServiceImplId).
service_impl_key(ServiceImplId, ServiceKey).
service_impl_provider(ServiceImplId, FiberId).
service_impl_realm(ServiceImplId, RealmId).
service_impl_registered(SnapshotId, ServiceImplId).
service_impl_visible(SnapshotId, ServiceImplId).

effect(EffectId).
effect_member(SnapshotId, EffectId).
effect_owner(EffectId, FiberId).
effect_label(EffectId, Label).
effect_path(EffectId, SnapshotLocalPath).
effect_parent(EffectId, ParentEffectId).
effect_status(SnapshotId, EffectId, registered_or_disposed).

observed_event(EventId).
event_sequence(EventId, Integer).
event_kind(EventId, Kind).
event_subject(EventId, FiberId).
event_service(EventId, ServiceKey).
event_old_state(EventId, State).
event_new_state(EventId, State).
event_value_present(EventId, Boolean).
~~~

## 5.3 Source-grounded seed \(D_{\text{source}}\)

~~~text
source_revision("cordis", "00278924a984fedfaffb4bc3d5eb7d8e76215643").
artifact_version("cordis", "4.0.0-rc.9").
artifact_version("@cordisjs/plugin-loader", "1.0.0-rc.6").
artifact_version("@cordisjs/plugin-hmr", "1.0.15").

fiber_state_symbol("pending", 0).
fiber_state_symbol("loading", 1).
fiber_state_symbol("active", 2).
fiber_state_symbol("failed", 3).
fiber_state_symbol("disposed", 4).
fiber_state_symbol("unloading", 5).

dependency_binding_identity("provider_fiber_uid").
dependency_missing_target("inactive_epoch").
failed_fiber_recovery("explicit_update").
effect_cleanup_order("one_effect_scope", "reverse_registration").
effect_cleanup_order("fiber_top_level_effects", "concurrent_unordered").
effect_inverse_runtime_proof("none").

source_revision("dsh", "49a606bc5b5934603f22a26957a07dc799ab0291").
source_field_alias("currentPackageId", "last_successful_package").
source_field_alias("nextPackageId", "failed_or_in_progress_target").
update_order("retract_old_run", "start_target_run").
update_failure_recovery("explicit_rollback_required").
~~~

## 5.4 Runtime snapshot schema status

v0.1 只有 schema。v0.2 已实例化一个 bounded live world：

~~~text
runtime("rt:cordis-poc:1").
runtime_package("rt:cordis-poc:1", "cordis", "4.0.0-rc.9").

snapshot("snap:rt:cordis-poc:1:1", "rt:cordis-poc:1").
snapshot_label("snap:rt:cordis-poc:1:1", "before_provider_disposal").
snapshot_phase("snap:rt:cordis-poc:1:1", "committed").
snapshot_quiescence("snap:rt:cordis-poc:1:1", "quiescent").

domain_coverage("snap:rt:cordis-poc:1:1", "registry_fibers", "complete").
domain_coverage("snap:rt:cordis-poc:1:1", "reflect_services", "complete").
domain_coverage("snap:rt:cordis-poc:1:1", "fiber_bindings", "complete").
domain_coverage("snap:rt:cordis-poc:1:1", "tracked_effect_metadata", "complete").
domain_coverage("snap:rt:cordis-poc:1:1", "all_contexts", "partial").
domain_coverage("snap:rt:cordis-poc:1:1", "external_effect_truth", "unavailable").
~~~

完整实例保存在 PoC：

- artifacts/before.facts：227 ground facts；
- artifacts/after.facts：267 ground facts；
- artifacts/event-trace.json：23 events。

## 5.5 Actual pre-state slice

~~~text
fiber_state("snap:rt:cordis-poc:1:1", "fiber:rt:cordis-poc:1:2", "active").
fiber_state("snap:rt:cordis-poc:1:1", "fiber:rt:cordis-poc:1:3", "active").
fiber_state("snap:rt:cordis-poc:1:1", "fiber:rt:cordis-poc:1:4", "active").

service_impl_key("service-impl:rt:cordis-poc:1:22", "clock").
service_impl_provider("service-impl:rt:cordis-poc:1:22", "fiber:rt:cordis-poc:1:2").
service_impl_visible("snap:rt:cordis-poc:1:1", "service-impl:rt:cordis-poc:1:22").

target_binding(
  "snap:rt:cordis-poc:1:1",
  "fiber:rt:cordis-poc:1:3",
  "clock",
  "service-impl:rt:cordis-poc:1:22"
).
committed_binding(
  "snap:rt:cordis-poc:1:1",
  "fiber:rt:cordis-poc:1:3",
  "clock",
  "service-impl:rt:cordis-poc:1:22"
).

service_impl_key("service-impl:rt:cordis-poc:1:26", "clockView").
service_impl_provider("service-impl:rt:cordis-poc:1:26", "fiber:rt:cordis-poc:1:3").
service_impl_visible("snap:rt:cordis-poc:1:1", "service-impl:rt:cordis-poc:1:26").

target_binding(
  "snap:rt:cordis-poc:1:1",
  "fiber:rt:cordis-poc:1:4",
  "clockView",
  "service-impl:rt:cordis-poc:1:26"
).
committed_binding(
  "snap:rt:cordis-poc:1:1",
  "fiber:rt:cordis-poc:1:4",
  "clockView",
  "service-impl:rt:cordis-poc:1:26"
).
~~~

这里：

- Fiber 2：clock-provider；
- Fiber 3：clock-ui，直接依赖 clock，并提供 clockView；
- Fiber 4：clock-reporter，间接依赖 clock。

## 5.6 Actual post-state slice

~~~text
snapshot("snap:rt:cordis-poc:1:2", "rt:cordis-poc:1").
snapshot_label("snap:rt:cordis-poc:1:2", "after_provider_disposal").
snapshot_phase("snap:rt:cordis-poc:1:2", "committed").
snapshot_quiescence("snap:rt:cordis-poc:1:2", "quiescent").

fiber_state("snap:rt:cordis-poc:1:2", "fiber:rt:cordis-poc:1:2", "disposed").
fiber_liveness(
  "snap:rt:cordis-poc:1:2",
  "fiber:rt:cordis-poc:1:2",
  "retained_tombstone"
).
fiber_state("snap:rt:cordis-poc:1:2", "fiber:rt:cordis-poc:1:3", "pending").
fiber_waits_for("snap:rt:cordis-poc:1:2", "fiber:rt:cordis-poc:1:3", "clock").
fiber_state("snap:rt:cordis-poc:1:2", "fiber:rt:cordis-poc:1:4", "pending").
fiber_waits_for("snap:rt:cordis-poc:1:2", "fiber:rt:cordis-poc:1:4", "clockView").
~~~

post-state 中不存在 visible clock/clockView。六个 effect facts 变为 disposed：五个由
impact query 列出的 provider/consumer effects，加上 root 对 provider plugin
lifecycle 的 owned wrapper。

## 5.7 Source-grounded dynamic package witness

该 witness 来自 dsh source/test，不来自本次 live fixture：

~~~text
last_successful_package("s0", "clock-1", "pkg-1").
active_run("s0", "clock-1", "run-1").
run_package("run-1", "pkg-1").

last_successful_package("s2", "clock-1", "pkg-1").
next_package("s2", "clock-1", "pkg-2").
latest_attempt_status("s2", "clock-1", "failed").
absence_fact("s2", "active_run", "clock-1").
recovery_required("s2", "explicit_run_pkg_1").
~~~

因此：

\[
last\_successful=v_1\not\Rightarrow active\_run=v_1.
\]

## 5.8 Query semantics

impact_remove 的输入是：

~~~text
impact_remove(SnapshotId, ServiceImplId, RemovalMode).
~~~

在本次固定 mode dispose_provider_fiber 中，它只读取 facts，并返回：

1. selected provider；
2. direct consumers；
3. 经 consumer-provided services 传播的 transitive consumers；
4. affected fibers 与 predicted final states；
5. removed service implementations；
6. Cordis-tracked effects to dispose；
7. relation paths；
8. coverage 与 UNKNOWN。

算法闭包：

\[
I_0=\{selected\ service\ impl\}
\]

\[
F_{n+1}
=
F_n\cup consumers(I_n)
\]

\[
I_{n+1}
=
I_n\cup visible\_services\_provided\_by(F_{n+1}).
\]

达到不动点后返回 \(F^*,I^*\)。这是固定 query procedure 对 ground facts 的解释，
不是为 clock 或 Cordis 生成 Horn rules。

## 5.9 Well-formedness result

| Check | Result |
|---|---|
| facts ground | PASS |
| duplicate facts | PASS，before/after 均为 0 |
| stable Fiber IDs across dispose | PASS |
| disposed provider tombstone retained | PASS |
| target binding closure | PASS，2 |
| committed binding closure | PASS，2 |
| service impl referential integrity | PASS |
| effect owner closure | PASS |
| snapshot/domain coverage declared | PASS |
| project-specific Horn rules | PASS，0 |

---

# 6. Behavior and Evidence

## 6.1 Actual closed-loop trace

\[
\begin{aligned}
&capture(D_0)\\
\to\;&impact\_remove(D_0,clock)\\
\to\;&direct\_native\_inspection(C_0)\\
\to\;&Fiber.dispose(clock\_provider)\\
\to\;&await\ quiescence\\
\to\;&capture(D_1)\\
\to\;&compare(prediction,native,actual).
\end{aligned}
\]

Observed state path：

\[
\begin{aligned}
clock\_provider &: ACTIVE\to UNLOADING\to DISPOSED\\
clock\_ui &: ACTIVE\to UNLOADING\to PENDING\\
clock\_reporter &: ACTIVE\to UNLOADING\to PENDING.
\end{aligned}
\]

## 6.2 Query result

| Facet | Result |
|---|---|
| selected provider | clock-provider |
| direct consumer | clock-ui |
| transitive consumer | clock-reporter |
| removed services | clock、clockView |
| predicted tracked effects | 5 |
| actual visible services after | 0 |
| actual active fixture effects after | 0 |
| query confidence | complete within declared fixture scope |

## 6.3 Differential evidence

独立 native comparator 没有调用 relational query。它遍历：

1. Registry；
2. Runtime.fibers；
3. Fiber._store；
4. Reflect.store；
5. Fiber.getEffects。

关系接口调用一次，返回七类结果：

- direct consumers；
- transitive consumers；
- affected fibers；
- predicted states；
- effects；
- coverage；
- provenance paths。

三个视图一致：

\[
Q(D_0)
=
direct(C_0)
=
observe(C_0\xrightarrow{dispose}C_1).
\]

## 6.4 Compression claim

本次执行已经从 normalization 前进到一个很窄的 interface compression witness：

\[
1\ relational\ query
\quad\text{vs.}\quad
5\ native\ state\ domains.
\]

但尚不能推出：

\[
C_{\text{Agent relational}}<C_{\text{Agent native APIs}}
\]

在一般任务上成立。需要更多 scenarios、Agent traces、错误率与 token/step
measurements。

## 6.5 Evidence files

PoC 的 artifacts 目录包含：

- before.facts / after.facts；
- before.json / after.json；
- impact-remove.json；
- direct-inspection.json；
- event-trace.json；
- closed-loop-result.json；
- closed-loop-report.md。

## 6.6 Final status boundary

| Item | Status |
|---|---|
| fixed-\(P_0\) boundary | complete |
| source-grounded semantic ABI | complete for selected slice |
| snapshot schema | complete for selected slice |
| one actual live \(D_{\text{snapshot}}\) pair | executed |
| one high-value cross-layer query | executed |
| one Cordis↔D differential trace | executed |
| complete Context observation | open |
| loader/dynamic live capture | open |
| bounded checker | not part of REIFY |
| authority | not part of REIFY |
| arbitrary JS verification | explicit non-goal |

这份文件的准确定位是：

\[
\boxed{
\text{source-grounded Cordis semantic ABI}
+\text{one bounded live instantiation}
}
\]

而不是 Cordis relational runtime 的完成声明。
