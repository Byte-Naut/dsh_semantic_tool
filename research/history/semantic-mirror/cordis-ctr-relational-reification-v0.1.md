# Cordis 的 CTR 可解释关系状态

## 源码锚定的 reification、语义影子内核与局部 authority 设计

版本：0.1  
日期：2026-09-02  
目标：Cordis v4 core、官方插件，以及 DeepSeek Harness 中的动态 Cordis package seam  
主模式：ARTIFACT / REIFY  
次模式：DESIGN / SYNTHESIZE（用户已经选择“影子内核 → 局部替换”，因此不做开放式候选比较）

---

# 1. Mode and Result

## 1.1 Result

**PASS**

在下述有界范围内，Cordis 已被物化为 ground relational state \(D_{\text{Cordis}}\)：对象、身份、拓扑、依赖、服务绑定、作用域、配置、effects、生命周期状态、动态 package/version/run，以及需求和验证义务都成为事实；项目差异只改变 \(D\)，固定的 CTR 解释器 \(P_0\) 不变。

这个 PASS 只表示：

1. 本文给出的 reification contract 对已选边界是闭合的；
2. 每个重要断言都有来源、推导级别或显式未知项；
3. 可以据此实现 semantic mirror、差分测试与 bounded checker。

它不表示 semantic mirror 已经实现，不表示已形式验证任意 JavaScript，也不表示 dsh 动态包已经把 authority 交给关系状态。

## 1.2 核心结论

\[
\boxed{
\text{Cordis artifact/runtime}
\xrightarrow{\alpha}
D_{\text{Cordis}}
\quad\text{且}\quad
P_0\ \text{保持固定}
}
\]

这里 \(\alpha\) 是观察与规范化投影。它不是编译器，不生成 Cordis 专属 Horn rule。

\[
\boxed{
Q_{\text{Cordis}}\neq P_0
}
\]

Cordis 代码、结构、状态、需求、版本与候选设计都属于 \(D\)。只有固定的 execute/run 七条解释规则属于 \(P_0\)。Cordis 生命周期动作由固定、类型化的 transition oracle vocabulary 承担；文件系统、网络、模型调用、任意用户 JavaScript 与 effect inverse 的真实性停留在 primitive/oracle boundary。

## 1.3 两个必须分开的“package”

| 域 | 身份 | 版本语义 | 本文关系域 |
|---|---|---|---|
| Cordis 仓库/npm artifact | package name，例如 cordis、@cordisjs/plugin-loader | 发布 artifact 的 semver | artifact_package、artifact_version |
| dsh 动态 Cordis package | pluginId 下的 packageId | 进程内、不可变、追加式定义 | dynamic_plugin、dynamic_package、package_of |

两者不能共享一个 package_version 谓词后再靠上下文猜含义。

---

# 2. Grounding

## 2.1 来源与固定版本

| Source ID | 类型 | 固定点 | 用途 |
|---|---|---|---|
| S1 | 用户提供理论稿 | software-space-ctdd-3.md | ground relational state、\(L_0\)、固定 \(P_0\)、oracle boundary、quiescent design search |
| S2 | 用户提供 companion | software-space-joint-canonicity-companion(2).md | immutable version fiber、stable interpreter boundary、active-control 边界 |
| S3 | 用户提供流程 | software-artifact-semantic-normalization.prompt.en(1).md | REIFY 输出契约 |
| S4 | 用户提供流程 | software-design-semantic-normalization.prompt.en(1).md | DESIGN/SYNTHESIZE 输出契约 |
| S5 | 用户提供规范 | software-space-llm-normalization-minimal-reference-v1.0.en(1).md | evidence class、H/J/R/A/N、UNKNOWN 纪律 |
| S6 | 论文 | arXiv:2608.25512，2026-08-26 | Cordis calculus、fiber lifecycle、effects、configuration、HMR、system boundary |
| S7 | Cordis source | git 00278924a984fedfaffb4bc3d5eb7d8e76215643 | 当前实现状态、package 版本与源码行为 |
| S8 | dsh source | git 49a606bc5b5934603f22a26957a07dc799ab0291 | tool-cordis 与 dynamic package runner 的真实生命周期 |
| S9 | 用户提供目标 | 本任务消息 | 影子内核 → 局部替换；统一 query；mechanically verified composition/lifecycle kernel |

主要外部锚点：

- Cordis 论文：[arXiv abstract](https://arxiv.org/abs/2608.25512) 与 [PDF](https://arxiv.org/pdf/2608.25512)
- Cordis 仓库：[cordiverse/cordis](https://github.com/cordiverse/cordis)
- 固定 Cordis revision：[00278924](https://github.com/cordiverse/cordis/commit/00278924a984fedfaffb4bc3d5eb7d8e76215643)
- dsh tool-cordis：[固定源码目录](https://github.com/deepseek-ai/deepseek-harness/tree/49a606bc5b5934603f22a26957a07dc799ab0291/packages/extensions/tool-cordis)
- dsh host runner：[固定源码目录](https://github.com/deepseek-ai/deepseek-harness/tree/49a606bc5b5934603f22a26957a07dc799ab0291/packages/extensions/cordis-host-runner)

## 2.2 断言账本

| Claim | 内容 | 级别 | Source / locator |
|---|---|---|---|
| C01 | object program 必须成为 ground facts，不能成为项目专属 Horn rules | AUTHORITATIVE | S1 §2.4、§3.3–3.4 |
| C02 | 固定 \(P_0\) 只有 execute/run 七条规则 | AUTHORITATIVE | S1 §3.4 |
| C03 | Cordis 的 component 经 fiber 实例化；fiber 同时承载依赖、提供、effects 与 lifecycle | AUTHORITATIVE | S6，Components/Fibers 与 calculus 章节 |
| C04 | 当前实现有 PENDING、LOADING、ACTIVE、FAILED、DISPOSED、UNLOADING 六个 FiberState | DERIVED | S7 packages/core/src/fiber.ts::FiberState |
| C05 | dependency target 由可见 provider fiber identity 构成；缺失依赖得到 INACTIVE target | DERIVED | S7 packages/core/src/fiber.ts::Fiber._refresh |
| C06 | committed provider view 与 target view 分开；reload/unload 有 inertia | DERIVED | S7 packages/core/src/fiber.ts::_setEpoch/_reload/_unload |
| C07 | provider withdrawal 先撤销可见 binding，再通知并等待 consumers | DERIVED | S7 packages/core/src/reflect.ts::provide |
| C08 | 单个 ctx.effect 内的 disposer 逆序；Fiber 顶层 effects 在 unload 中并发清理 | DERIVED | S7 packages/core/src/fiber.ts 与 tests/core/dispose.spec.ts |
| C09 | inverse 的正确性以及外部 emission 的可逆性不是 Cordis runtime 自动证明的 | AUTHORITATIVE | S6，Effects 与 System Boundary |
| C10 | loader/group/include/HMR 共同维护期望配置树与运行 fiber | AUTHORITATIVE + DERIVED | S6 Configuration/HMR；S7 plugin-loader/group/include/hmr |
| C11 | dsh dynamic package definition 不执行代码，packageId 不可变且追加 | DERIVED | S8 tool-cordis 与 host-runner registry |
| C12 | currentPackageId 是最后成功提交的 package（running 或合法 waiting），不等于 live run | DERIVED | S8 registry/types、versioning.spec.ts |
| C13 | update 先 retract 旧 run；失败不会自动重启旧 package | DERIVED | S8 host-runner index.ts::startFresh；tool-cordis prompt.ts |
| C14 | Context 没有可跨进程复用的原生全局 identity | INFERRED | S7 Context/Fiber object model；S8 runtime-tree inspection design |
| C15 | 一次 quiescent snapshot 是否完整，必须按 predicate domain 单独声明 | INFERRED | C03–C14 与 S1 active-control boundary |
| C16 | 影子阶段只读、authority 首先限于 dynamic package lifecycle | AUTHORITATIVE | S9 |
| C17 | 有界 checker 验证 composition/lifecycle，不验证任意 JS | AUTHORITATIVE | S9 与 S1 oracle boundary |

## 2.3 来源冲突与规范化裁决

| 表面冲突 | 裁决 |
|---|---|
| 论文使用 Inactive/Reloading/Active/Unloading；源码有六态 | 源码六态是运行观测词汇。PENDING 对应可再次激活的 inactive；FAILED 与 DISPOSED 是实现扩展；LOADING 对应 reload 进行中。两套词汇都保留，以 correspondence facts 连接。 |
| 论文 loader entry 示例使用 url；当前源码 EntryOptions 使用 name | 本文对 revision 00278924 使用 loader_name；url 只作为论文历史字段，不写入当前 D。 |
| plugin metadata 可声明 provide；实际 service 也可由 ctx.provide/Service 注册 | 分成 declared_provide 与 observed_service_impl。查询实际依赖时以后者为准。 |
| “effects LIFO”容易被理解成整个 fiber 的全局顺序 | 只保证单个 effect scope 内嵌套 disposer 逆序。顶层 effect disposer 由 Promise.all 启动，不建立全序。 |
| currentPackageId 字面上像当前运行版本 | 在 dsh 中规范化为 last_successful_package；live activation 单独由 active_run 表示。 |
| HMR 有回滚，不等于所有观察者看到单一原子瞬间 | mirror 记录 staging/committed phase；只有 committed snapshot 可供默认 query。 |

## 2.4 UNKNOWN 清单

以下项不以默认值补齐：

1. 任意真实进程此刻有哪些 fibers、services、effects 与配置值；
2. 未加 observer instrumentation 时 effect inventory 是否完整；
3. 未被 Fiber、service、event 或 loader tree 引用的 Context 是否可枚举；
4. effect inverse 是否恢复了真实外部世界；
5. service key 的接口/版本兼容性；
6. semantic mirror 的吞吐、延迟与内存成本；
7. 所有中间态能否被现有 event hooks 无损观察；
8. 动态 Host/Client JavaScript 的语义、安全性与 termination。

这些未知项都在 D 中具有 explicit coverage/unknown facts；查询不得把 unknown 当成 false。

---

# 3. Artifact Scope

## 3.1 最小语义切片

本次 reification 包含能回答以下问题的最小闭包：

> 删除或替换某个 service provider 后，哪些 fibers 会失活或 reload，哪些 effects 应撤销，哪些 config/dynamic package/run 会受影响，结果是否符合生命周期不变量？

为回答它，必须同时包含：

- plugin definition 与 runtime instance；
- fiber identity、parent、context 与状态；
- declared injection 和 observed binding；
- service key、provider implementation、realm/scope；
- target provider view 与 committed provider view；
- effect ownership、nesting 与 cleanup 状态；
- loader entry、配置摘要、disabled/isolate/intercept；
- repository artifact versions；
- dsh dynamic plugin/package/run/current/next/approval；
- transition events、snapshot phase 与 coverage；
- requirements、hard constraints、objectives 与 edit mask。

## 3.2 纳入边界

| 区域 | 纳入内容 |
|---|---|
| Cordis core | Context、Registry、Runtime、Fiber、Reflect、Service、Events |
| 官方插件 | loader、group、include、hmr、timer、logger-console 的结构角色 |
| 配置 | desired loader tree、entry parent/group、enabled state、config digest、inject/isolate/intercept |
| dsh seam | tool-cordis、host/client runner、dynamic registry、immutable package、run/approval |
| CTR | ground state \(D\)、\(L_0\) descriptor facts、固定 \(P_0\)、typed \(O^t_{run}\) |
| 验证 | trace projection、differential comparison、bounded composition/lifecycle checker |

## 3.3 排除边界

- 不 fork 或重写 Cordis；
- 不把 TypeScript/JavaScript 全量转换成 Horn；
- 不证明 filesystem、network、浏览器、模型调用或用户代码；
- 不把未展开的任意 JavaScript 控制状态伪装成 D 中的完整语义；
- 不在 shadow phase 让 D 直接控制 production runtime；
- 不从 search 直接部署；
- 不声明 service interface/version compatibility 已解决；
- 不声明 security sandbox 已由 Cordis isolation 提供。

## 3.4 系统边界

本文区分三层：

1. **Core layer**：Cordis 原生 plugin/fiber/service/effect/config lifecycle；
2. **Dynamic layer**：dsh 对 Cordis 的 package/version/run/approval 管理；
3. **Semantic layer**：snapshot、facts、queries、constraints、trace 与 candidate \(D'\)。

Dynamic layer 不是 Core layer 的同义词；Semantic layer也不是新 executor。

---

# 4. Semantic Contract

## 4.1 合同

\[
M_{\text{Cordis}}
=
(D_C,H_C,\mathbf J_C,R_C,A_C,N_C)
\]

其中：

- \(D_C\)：本文第 5 节的 ground relational facts；
- \(H_C\)：必须满足的 hard constraints；
- \(\mathbf J_C\)：shadow 与 authority 设计的目标向量；
- \(R_C\)：允许的修改边界；
- \(A_C\)：显式采用的假设；
- \(N_C\)：非目标。

## 4.2 Hard constraints \(H_C\)

| ID | 约束 |
|---|---|
| H01 | 每个 ACTIVE fiber 的 required injection 都绑定到其可见 realm 内的 ACTIVE provider。 |
| H02 | consumer unload 时使用 committed provider view；target 的变化不能重写已经提交的 teardown view。 |
| H03 | provider 从可见 registry 撤销后，依赖它的 active consumer 最终离开 ACTIVE。 |
| H04 | provider cleanup 完成前，所有仍依赖其 committed binding 的 consumers 已完成相应 teardown。 |
| H05 | quiescent DISPOSED fiber 不拥有 registered service、effect、listener 或 child fiber。 |
| H06 | 同一可见 realm 中一个 service key 至多有一个 observed provider。 |
| H07 | dynamic package 的 source 与身份在 define 后不可变；修订产生新 packageId。 |
| H08 | last_successful_package 只在所需 Host/Client halves 成功建立后改变；合法 waiting 状态也属于成功提交。 |
| H09 | active_run 与 last_successful_package 是不同关系；任何 query 不得用一个推导另一个。 |
| H10 | update failure 后允许 last_successful_package 存在而 active_run 缺失；回滚必须是显式 action。 |
| H11 | snapshot 对每个 predicate domain 都声明 complete、partial 或 unavailable。 |
| H12 | 默认 query 只读取 committed snapshot；staging snapshot 必须显式请求。 |
| H13 | Cordis 项目语义只改变 D；不得生成 Cordis 专属 Horn clauses。 |
| H14 | shadow phase 的 edit mask 为空。 |
| H15 | authority phase 的 edit mask 只开放 dynamic package lifecycle，并经过 review/commit gate。 |
| H16 | 外部 primitive 与 arbitrary JS 的结果由 oracle/evidence 给出，不由关系模型臆造。 |

## 4.3 Objectives \(\mathbf J_C\)

\[
\mathbf J_C(D)=
\langle
q_{\mathrm{coverage}},
q_{\mathrm{trace}},
q_{\mathrm{explanation}},
-c_{\mathrm{core}},
-c_{\mathrm{observer}},
-r_{\mathrm{authority}}
\rangle
\]

按字典序解释：

1. 最大化重要 runtime state 的 query coverage；
2. 最大化 Cordis trace 与 CTR-state trace 的差分一致率；
3. 最大化每个答案的 provenance 与 why-chain 完整度；
4. 最小化新增核心状态类型与项目专属语义；
5. 最小化 observer 延迟、内存与侵入；
6. 最小化 authority 范围。

不把“predicate 数量越少”单独当目标。关系被压进 opaque JSON blob 会减少 predicate 数，但会破坏可查询性和解释性。

## 4.4 Edit boundary \(R_C\)

| Phase | 可写目标 | 禁止目标 |
|---|---|---|
| P0：reification | 本文与离线 facts | 运行 Cordis、仓库源码 |
| P1：semantic mirror | mirror store、event log、snapshot metadata | Cordis runtime |
| P2：differential | test fixture、bounded model、oracle adapter | production authority |
| P3：dynamic authority | dsh dynamic define/run/update/stop/undefine transaction adapter | Cordis core、任意 plugin 代码 |
| P4：可选扩展 | 经单独 review 的 lifecycle action | 未审查 deployment |

## 4.5 Assumptions \(A_C\)

| ID | 假设 | 若失败 |
|---|---|---|
| A01 | observer 与目标 Cordis instance 同进程，能读取对象 identity 并订阅 internal events | 退化为 periodic public inspection，coverage 降为 partial |
| A02 | 每个 snapshot 有单调 observation sequence | 无法可靠构造 trace correspondence |
| A03 | quiescence 可通过所有已知 Fiber inertia settled 与 dynamic transition settled 判断 | query 只能返回 intermediate/unknown |
| A04 | runtime-instance-local 的 Symbol/object identity 可由 mirror mint 稳定 surrogate | realm/context joins 只能在单次 snapshot 内成立 |
| A05 | dsh dynamic registry inventory 对当前进程和 session 是闭合的 | package queries 降为 partial |
| A06 | review gate 在 authority edit 与 executor call 之间不可绕过 | 不允许进入 authority phase |

## 4.6 Non-goals \(N_C\)

1. 形式验证任意 JavaScript；
2. 证明 effect compensation 对外部世界正确；
3. 证明真实并行语义；CTR/Cordis 当前均以可观察 interleaving 和异步边界建模；
4. 解决 service interface versioning；
5. 把所有 active continuation 都塞入最小 \(D\)；
6. 提供安全沙箱；
7. 自动部署 search result；
8. 以新的 plugin framework 取代 Cordis；
9. 为每个项目生成 \(P_W\)；
10. 声称一次有界检查等于全局证明。

## 4.7 需求的 ground facts

下面是 \(D_C\) 的一部分。这里没有规则头或规则体。

~~~text
semantic_contract(contract(cordis_ctr_v0_1)).

hard_constraint(h01_active_requires_bound_dependencies).
constraint_kind(h01_active_requires_bound_dependencies, lifecycle_safety).
constraint_target(h01_active_requires_bound_dependencies, fiber_service_binding).

hard_constraint(h02_committed_view_survives_target_change).
constraint_kind(h02_committed_view_survives_target_change, teardown_consistency).
constraint_target(h02_committed_view_survives_target_change, committed_provider_view).

hard_constraint(h03_provider_loss_deactivates_consumers).
constraint_kind(h03_provider_loss_deactivates_consumers, eventual_quiescence).
constraint_target(h03_provider_loss_deactivates_consumers, dependency_graph).

hard_constraint(h04_provider_waits_for_consumers).
constraint_kind(h04_provider_waits_for_consumers, disposal_order).
constraint_target(h04_provider_waits_for_consumers, service_provider).

hard_constraint(h05_disposed_leaves_no_owned_capability).
constraint_kind(h05_disposed_leaves_no_owned_capability, cleanup).
constraint_target(h05_disposed_leaves_no_owned_capability, fiber_owned_resources).

hard_constraint(h06_unique_provider_per_visible_realm).
constraint_kind(h06_unique_provider_per_visible_realm, uniqueness).
constraint_target(h06_unique_provider_per_visible_realm, service_realm_pair).

hard_constraint(h07_dynamic_package_immutable).
constraint_kind(h07_dynamic_package_immutable, version_identity).
constraint_target(h07_dynamic_package_immutable, dynamic_package).

hard_constraint(h08_publication_after_complete_activation).
constraint_kind(h08_publication_after_complete_activation, publication).
constraint_target(h08_publication_after_complete_activation, last_successful_package).

hard_constraint(h09_pointer_not_run).
constraint_kind(h09_pointer_not_run, semantic_separation).
constraint_target(h09_pointer_not_run, dynamic_plugin_state).

hard_constraint(h10_explicit_rollback).
constraint_kind(h10_explicit_rollback, recovery).
constraint_target(h10_explicit_rollback, dynamic_update_failure).

hard_constraint(h11_domain_coverage_declared).
constraint_kind(h11_domain_coverage_declared, epistemic_safety).
constraint_target(h11_domain_coverage_declared, snapshot).

hard_constraint(h12_committed_snapshot_default).
constraint_kind(h12_committed_snapshot_default, observation_consistency).
constraint_target(h12_committed_snapshot_default, query_engine).

hard_constraint(h13_no_project_horn_rules).
constraint_kind(h13_no_project_horn_rules, interpreter_stability).
constraint_target(h13_no_project_horn_rules, p0).

hard_constraint(h14_shadow_read_only).
constraint_kind(h14_shadow_read_only, authority).
constraint_target(h14_shadow_read_only, phase_shadow).

hard_constraint(h15_dynamic_authority_only).
constraint_kind(h15_dynamic_authority_only, authority).
constraint_target(h15_dynamic_authority_only, dynamic_package_lifecycle).

hard_constraint(h16_oracle_boundary_explicit).
constraint_kind(h16_oracle_boundary_explicit, verification_scope).
constraint_target(h16_oracle_boundary_explicit, primitive_action).

objective(j01_query_coverage).
objective_kind(j01_query_coverage, maximize_domain_coverage).
objective_priority(j01_query_coverage, 1).

objective(j02_trace_correspondence).
objective_kind(j02_trace_correspondence, maximize_differential_agreement).
objective_priority(j02_trace_correspondence, 2).

objective(j03_explanation_completeness).
objective_kind(j03_explanation_completeness, maximize_provenance_paths).
objective_priority(j03_explanation_completeness, 3).

protected_target(cordis_core_executor).
protected_target(fixed_ctr_interpreter_p0).
protected_target(external_world).

assumption(a01_same_process_observer).
assumption_kind(a01_same_process_observer, runtime_access).
assumption_failure_effect(a01_same_process_observer, coverage_becomes_partial).

assumption(a02_monotonic_observation_sequence).
assumption_kind(a02_monotonic_observation_sequence, trace_identity).
assumption_failure_effect(a02_monotonic_observation_sequence, trace_correspondence_unavailable).

assumption(a03_detectable_quiescence).
assumption_kind(a03_detectable_quiescence, lifecycle_boundary).
assumption_failure_effect(a03_detectable_quiescence, query_result_intermediate_or_unknown).

assumption(a04_runtime_local_surrogate_identity).
assumption_kind(a04_runtime_local_surrogate_identity, identity).
assumption_failure_effect(a04_runtime_local_surrogate_identity, cross_snapshot_join_unavailable).

assumption(a05_dynamic_inventory_closed_per_process).
assumption_kind(a05_dynamic_inventory_closed_per_process, dynamic_registry).
assumption_failure_effect(a05_dynamic_inventory_closed_per_process, package_coverage_partial).

assumption(a06_non_bypassable_review_gate).
assumption_kind(a06_non_bypassable_review_gate, authority).
assumption_failure_effect(a06_non_bypassable_review_gate, authority_phase_forbidden).

design_phase(phase_reification).
design_phase(phase_shadow).
design_phase(phase_differential).
design_phase(phase_dynamic_authority).
phase_order(phase_reification, phase_shadow).
phase_order(phase_shadow, phase_differential).
phase_order(phase_differential, phase_dynamic_authority).

edit_mask(phase_reification, offline_artifact_only).
edit_mask(phase_shadow, relational_mirror_only).
edit_mask(phase_differential, test_fixture_and_checker_only).
edit_mask(phase_dynamic_authority, dsh_dynamic_lifecycle_only).

write_forbidden(phase_shadow, cordis_runtime).
write_forbidden(phase_shadow, dsh_dynamic_registry).
write_allowed(phase_dynamic_authority, reviewed_dynamic_lifecycle_transaction).
write_forbidden(phase_dynamic_authority, cordis_core_executor).
review_gate(phase_dynamic_authority, explicit_acceptance).

non_goal(verify_arbitrary_javascript).
non_goal(prove_external_effect_inverse).
non_goal(generate_project_specific_horn_program).
non_goal(direct_search_to_deployment).
non_goal(rewrite_cordis).
~~~

---

# 5. Relational Model

## 5.1 Carrier 与分区

\[
D_C=
D_{\text{source}}
\uplus
D_{\text{snapshot}}
\uplus
D_{\text{trace}}
\uplus
D_{\text{requirements}}
\uplus
D_{\text{proposal}}
\uplus
D_{\text{evidence}}
\uplus
D_{\text{code}}
\]

所有成员都是 ground atoms。分区用于 provenance，不改变它们共享同一 relational carrier 的事实。

## 5.2 类型

| Type | Canonical form | 说明 |
|---|---|---|
| RuntimeId | rt(ProcessEpoch) | 每次进程启动唯一 |
| SnapshotId | snap(RuntimeId, Seq) | 单调序号 |
| PluginDefId | pdef(SourceRevision, QualifiedName) | 静态 plugin definition |
| PluginRuntimeId | prun(RuntimeId, RuntimeSerial) | Registry runtime identity |
| FiberId | fiber(RuntimeId, Uid) | Cordis uid；root 为 0 |
| ContextId | ctx(RuntimeId, MirrorSerial) | mirror 对 object identity mint 的进程内 surrogate |
| RealmId | realm(RuntimeId, ServiceKey, MirrorSerial) | 对 isolate Symbol/object identity mint |
| ServiceKey | service(QualifiedName) | 字符串 key 的规范化 |
| ServiceImplId | simpl(SnapshotId, RealmId, ServiceKey, ProviderFiber) | 一次 snapshot 中的实现 |
| EffectId | effect(RuntimeId, FiberId, RegistrationSeq) | observer 注册序号 |
| LoaderEntryId | lentry(RuntimeId, EntryId) | loader 配置 identity |
| DynamicPluginId | dplugin(SessionId, PluginId) | dsh stable plugin identity |
| DynamicPackageId | dpkg(DynamicPluginId, PackageId) | immutable package identity |
| DynamicRunId | drun(DynamicPluginId, PluginRunId) | activation identity |
| EventId | event(RuntimeId, EventSeq) | 单调 trace identity |
| CodeNodeId | node(ProgramId, VersionId, Path) | immutable node occurrence |

禁止把 Context object address、Symbol description 或数组位置当跨进程 identity。它们只能生成 scoped surrogate。

## 5.3 Predicate schema

下面的首字母大写项只是 schema metavariables，不属于 \(D_C\)。

### Runtime、plugin 与 fiber

~~~text
runtime(RuntimeId).
runtime_revision(RuntimeId, SourceRevision).
snapshot(SnapshotId, RuntimeId).
snapshot_observation_sequence(SnapshotId, IntegerSeq).
snapshot_predecessor(SnapshotId, PreviousSnapshotId).
snapshot_phase(SnapshotId, staging_or_committed).
snapshot_quiescence(SnapshotId, quiescent_or_in_flight_or_unknown).
domain_coverage(SnapshotId, Domain, complete_or_partial_or_unavailable).
coverage_scope(SnapshotId, ScopeKind).
current_snapshot(RuntimeId, SnapshotId).

plugin_definition(PluginDefId).
plugin_name(PluginDefId, Name).
plugin_runtime(PluginRuntimeId, PluginDefId).
plugin_runtime_member(SnapshotId, PluginRuntimeId).

fiber(FiberId).
fiber_member(SnapshotId, FiberId).
fiber_uid(FiberId, IntegerUid).
fiber_instance_of(SnapshotId, FiberId, PluginRuntimeId).
fiber_parent(SnapshotId, FiberId, ParentFiberId).
fiber_context(SnapshotId, FiberId, ContextId).
fiber_state(SnapshotId, FiberId, FiberState).
fiber_target_epoch(SnapshotId, FiberId, EpochId).
fiber_committed_epoch(SnapshotId, FiberId, EpochId).
fiber_waits_for(SnapshotId, FiberId, ServiceKey).
fiber_error(SnapshotId, FiberId, ErrorId).
~~~

### Service、dependency、scope 与 binding

~~~text
service_key(ServiceKey).
declared_injection(PluginDefId, ServiceKey, required_or_optional).
declared_provide(PluginDefId, ServiceKey).

context(ContextId).
context_parent(SnapshotId, ContextId, ParentContextId).
context_owner(SnapshotId, ContextId, FiberId).
context_intercept(SnapshotId, ContextId, Property, ValueDigest).
realm(RealmId).
realm_for(SnapshotId, ContextId, ServiceKey, RealmId).

service_impl(ServiceImplId).
service_impl_key(ServiceImplId, ServiceKey).
service_impl_provider(ServiceImplId, FiberId).
service_impl_realm(ServiceImplId, RealmId).
service_impl_visible(SnapshotId, ServiceImplId).

target_binding(SnapshotId, ConsumerFiber, ServiceKey, ServiceImplId).
committed_binding(SnapshotId, ConsumerFiber, ServiceKey, ServiceImplId).
binding_reason(SnapshotId, ConsumerFiber, ServiceKey, Reason).
~~~

### Effects

~~~text
effect(EffectId).
effect_member(SnapshotId, EffectId).
effect_owner(EffectId, FiberId).
effect_label(EffectId, Label).
effect_parent(EffectId, ParentEffectId).
effect_registration_order(EffectId, IntegerSeq).
effect_status(SnapshotId, EffectId, registered_or_disposing_or_disposed_or_unknown).
effect_inverse_evidence(EffectId, declared_or_observed_or_verified_or_unknown).
effect_external_boundary(EffectId, inside_or_outside_or_mixed_or_unknown).
~~~

### Configuration

~~~text
loader_entry(LoaderEntryId).
loader_entry_member(SnapshotId, LoaderEntryId).
loader_entry_parent(SnapshotId, LoaderEntryId, ParentEntryId).
loader_entry_name(SnapshotId, LoaderEntryId, ModuleSpecifier).
loader_entry_group(SnapshotId, LoaderEntryId, GroupName).
loader_entry_disabled(SnapshotId, LoaderEntryId, Boolean).
loader_entry_config_digest(SnapshotId, LoaderEntryId, Digest).
loader_entry_inject(SnapshotId, LoaderEntryId, ServiceKey, Alias).
loader_entry_isolate(SnapshotId, LoaderEntryId, ServiceKey, RealmId).
loader_entry_intercept(SnapshotId, LoaderEntryId, Property, ValueDigest).
loader_entry_fiber(SnapshotId, LoaderEntryId, FiberId).
~~~

### Artifact 与 dynamic package

~~~text
artifact_package(ArtifactPackage).
artifact_version(ArtifactPackage, Semver).
artifact_revision(ArtifactPackage, SourceRevision).

dynamic_plugin(DynamicPluginId).
dynamic_plugin_owner(DynamicPluginId, SessionId).
dynamic_package(DynamicPackageId).
package_of(DynamicPackageId, DynamicPluginId).
package_define_order(DynamicPackageId, IntegerSeq).
package_half(DynamicPackageId, host_or_client).
package_source_digest(DynamicPackageId, host_or_client, Digest).
last_successful_package(SnapshotId, DynamicPluginId, DynamicPackageId).
next_package(SnapshotId, DynamicPluginId, DynamicPackageId).
active_run(SnapshotId, DynamicPluginId, DynamicRunId).
run_package(DynamicRunId, DynamicPackageId).
run_status(SnapshotId, DynamicRunId, Status).
run_half_status(SnapshotId, DynamicRunId, host_or_client, Status).
run_waits_for(SnapshotId, DynamicRunId, host_or_client, ServiceKey).
approval_request(SnapshotId, ApprovalId, DynamicRunId).
~~~

### Trace、evidence 与 requirements

~~~text
transition_event(EventId).
event_sequence(EventId, IntegerSeq).
event_kind(EventId, ActionKind).
event_subject(EventId, SubjectId).
event_from(EventId, SnapshotId).
event_to(EventId, SnapshotId).
event_outcome(EventId, Outcome).
event_cause(EventId, CauseEventId).

evidence(EvidenceId).
evidence_class(EvidenceId, authoritative_or_derived_or_inferred_or_advisory_or_unknown).
evidence_source(EvidenceId, SourceId, Locator).
supports(EvidenceId, ClaimId).

hard_constraint(ConstraintId).
constraint_kind(ConstraintId, Kind).
constraint_target(ConstraintId, Target).
objective(ObjectiveId).
objective_kind(ObjectiveId, Kind).
protected_target(Target).
non_goal(NonGoal).
~~~

### Static vocabulary、absence、query 与 checker artifacts

~~~text
source_revision(SourceId, SourceRevision).
repository_status(SourceId, Status).
semantic_contract(ContractId).

fiber_state_symbol(FiberState).
fiber_state_code(FiberState, IntegerCode).
paper_state_symbol(PaperState).
state_correspondence(FiberState, PaperStateOrGap, CorrespondenceKind).
lifecycle_operation(OperationKind).
dependency_binding_identity(IdentityKind).
dependency_target_missing_value(ValueKind).
failed_fiber_recovery_trigger(TriggerKind).
root_fiber_uid(IntegerUid).
root_fiber_initial_state(FiberState).

subsystem(SubsystemId).
owns_state(SubsystemId, StateDomain).
internal_event(EventKind).
effect_cleanup_order(EffectScope, OrderKind).
effect_inverse_runtime_proof(ProofLevel).

loader_entry_field(FieldName).
config_reconcile_action(ChangeKind, ActionKind).
hmr_phase(PhaseKind).

dynamic_tool(ToolName).
dynamic_action(ActionKind).
dynamic_run_status(Status).
source_field_alias(SourceField, NormalizedRelation).
update_order(FirstAction, SecondAction).
update_failure_recovery(RecoveryKind).
stop_retention(RetainedDomain).
undefine_removal(RemovedDomain).
dynamic_definition_storage(StorageKind).

absence_fact(SnapshotId, PredicateTag, SubjectId).
coverage_reason(SnapshotId, Domain, Reason).
latest_attempt_status(SnapshotId, DynamicPluginId, Status).
recovery_required(SnapshotId, RecoveryActionKind).

query(QueryId).
query_kind(QueryId, QueryKind).
query_snapshot(QueryId, SnapshotId).
query_argument(QueryId, GroundArgument).
query_result(QueryId, ResultKind, GroundValue).
query_confidence(QueryId, ConfidenceClass).
query_coverage(QueryId, CoverageClass).

bound_profile(BoundProfileId).
bound(BoundProfileId, CarrierKind, IntegerLimit).
counterexample(CounterexampleId).
counterexample_constraint(CounterexampleId, ConstraintId).
counterexample_initial_snapshot(CounterexampleId, SnapshotId).
counterexample_event(CounterexampleId, EventId).
counterexample_bad_snapshot(CounterexampleId, SnapshotId).
counterexample_minimal(CounterexampleId, Boolean).
counterexample_oracle_assumption(CounterexampleId, AssumptionId).

desired_state(DesignId, StateKind).
desired_package(DesignId, DynamicPluginId, DynamicPackageId).
protected_constraint(DesignId, ConstraintId).
objective_ref(DesignId, ObjectiveId).
objective_priority(ObjectiveId, IntegerPriority).

assumption(AssumptionId).
assumption_kind(AssumptionId, Kind).
assumption_failure_effect(AssumptionId, Effect).
design_phase(PhaseId).
phase_order(EarlierPhase, LaterPhase).
edit_mask(PhaseId, EditScope).
write_allowed(PhaseId, Target).
write_forbidden(PhaseId, Target).
review_gate(PhaseId, GateKind).

design(DesignId).
design_status(DesignId, Status).
design_component(DesignId, ComponentId).
component_role(ComponentId, Role).
component_reads(ComponentId, StateDomain).
component_writes(ComponentId, StateDomain).
component_calls(ComponentId, Interface).
dataflow_edge(DesignId, FromComponent, ToComponent, PayloadKind).
component_enabled_in(ComponentId, PhaseId).
decision_authority_owner(PhaseId, Owner).
execution_authority_owner(PhaseId, Owner).
identity_policy(DesignId, EntityKind, IdentityKind).
snapshot_policy(DesignId, PolicyKind).
query_policy(DesignId, PolicyKind).
oracle_namespace(DesignId, OracleNamespace).
verification_obligation(DesignId, ObligationId).

code_skip(NodeId).
code_prim(NodeId, GroundAction).
code_seq(NodeId, LeftNodeId, RightNodeId).
code_par(NodeId, LeftNodeId, RightNodeId).
code_iso(NodeId, ChildNodeId).
code_call(NodeId, QualifiedFunctionId).
entry(ProgramId, RootNodeId).
current_def(QualifiedFunctionId, RootNodeId).
~~~

absence_fact 是显式的三值/局部闭世界记录，不是 Prolog negation-as-failure。只有当同一 snapshot 的对应 domain_coverage 为 complete 时，它才构成强否定；partial 或 unavailable 时，query 必须返回 unknown。

## 5.4 Source-grounded \(D_{\text{source}}\)

### Artifact versions

~~~text
source_revision(cordis_source, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).
source_revision(dsh_source, git_49a606bc5b5934603f22a26957a07dc799ab0291).
repository_status(cordis_source, active_development_api_unstable).

artifact_package(pkg_cordis).
artifact_version(pkg_cordis, semver_4_0_0_rc_9).
artifact_revision(pkg_cordis, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_create_cordis).
artifact_version(pkg_create_cordis, semver_0_3_0).
artifact_revision(pkg_create_cordis, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_plugin_group).
artifact_version(pkg_cordis_plugin_group, semver_1_0_0).
artifact_revision(pkg_cordis_plugin_group, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_plugin_hmr).
artifact_version(pkg_cordis_plugin_hmr, semver_1_0_15).
artifact_revision(pkg_cordis_plugin_hmr, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_plugin_include).
artifact_version(pkg_cordis_plugin_include, semver_1_0_5).
artifact_revision(pkg_cordis_plugin_include, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_plugin_loader).
artifact_version(pkg_cordis_plugin_loader, semver_1_0_0_rc_6).
artifact_revision(pkg_cordis_plugin_loader, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_plugin_logger_console).
artifact_version(pkg_cordis_plugin_logger_console, semver_1_0_0).
artifact_revision(pkg_cordis_plugin_logger_console, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_plugin_timer).
artifact_version(pkg_cordis_plugin_timer, semver_1_1_3).
artifact_revision(pkg_cordis_plugin_timer, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_cordis_utils).
artifact_version(pkg_cordis_utils, semver_1_0_0).
artifact_revision(pkg_cordis_utils, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

artifact_package(pkg_dsh_tool_cordis).
artifact_version(pkg_dsh_tool_cordis, semver_0_1_2_alpha_5).
artifact_revision(pkg_dsh_tool_cordis, git_49a606bc5b5934603f22a26957a07dc799ab0291).

artifact_package(pkg_dsh_cordis_host_runner).
artifact_version(pkg_dsh_cordis_host_runner, semver_0_1_2_alpha_5).
artifact_revision(pkg_dsh_cordis_host_runner, git_49a606bc5b5934603f22a26957a07dc799ab0291).

artifact_package(pkg_dsh_cordis_client_runner).
artifact_version(pkg_dsh_cordis_client_runner, semver_0_1_2_alpha_5).
artifact_revision(pkg_dsh_cordis_client_runner, git_49a606bc5b5934603f22a26957a07dc799ab0291).
~~~

### Fiber lifecycle vocabulary

~~~text
fiber_state_symbol(pending).
fiber_state_code(pending, 0).
fiber_state_symbol(loading).
fiber_state_code(loading, 1).
fiber_state_symbol(active).
fiber_state_code(active, 2).
fiber_state_symbol(failed).
fiber_state_code(failed, 3).
fiber_state_symbol(disposed).
fiber_state_code(disposed, 4).
fiber_state_symbol(unloading).
fiber_state_code(unloading, 5).

paper_state_symbol(inactive).
paper_state_symbol(reloading).
paper_state_symbol(active).
paper_state_symbol(unloading).

state_correspondence(pending, inactive, live_retryable).
state_correspondence(loading, reloading, exact).
state_correspondence(active, active, exact).
state_correspondence(unloading, unloading, exact).
state_correspondence(failed, no_exact_paper_state, implementation_extension_error_sticky_until_update).
state_correspondence(disposed, no_exact_paper_state, implementation_extension_retired_terminal).

lifecycle_operation(refresh_target).
lifecycle_operation(begin_reload).
lifecycle_operation(commit_provider_view).
lifecycle_operation(run_apply).
lifecycle_operation(begin_unload).
lifecycle_operation(withdraw_publication).
lifecycle_operation(await_dependents).
lifecycle_operation(dispose_owned_effects).
lifecycle_operation(clear_committed_view).
lifecycle_operation(chain_reload).
lifecycle_operation(mark_failed).
lifecycle_operation(mark_disposed).
~~~

### Core architectural relations

~~~text
subsystem(cordis_context).
subsystem(cordis_registry).
subsystem(cordis_runtime).
subsystem(cordis_fiber).
subsystem(cordis_reflect).
subsystem(cordis_service).
subsystem(cordis_events).
subsystem(cordis_loader).
subsystem(cordis_group).
subsystem(cordis_include).
subsystem(cordis_hmr).

owns_state(cordis_registry, plugin_runtime_collection).
owns_state(cordis_runtime, fiber_collection).
owns_state(cordis_fiber, lifecycle_and_effects).
owns_state(cordis_reflect, service_provider_table).
owns_state(cordis_loader, desired_entry_tree).
owns_state(cordis_hmr, module_cache_transaction).

internal_event(internal_plugin).
internal_event(internal_status).
internal_event(internal_service).
internal_event(internal_update).
internal_event(internal_get).
internal_event(internal_set).
internal_event(internal_listener).
internal_event(internal_dispatch).

effect_cleanup_order(within_one_effect, reverse_registration).
effect_cleanup_order(across_top_level_fiber_effects, concurrent_unordered).
effect_inverse_runtime_proof(none).

dependency_binding_identity(provider_fiber_uid).
dependency_target_missing_value(inactive_epoch).
failed_fiber_recovery_trigger(explicit_update).
root_fiber_uid(0).
root_fiber_initial_state(active).
~~~

### Configuration and HMR roles

~~~text
loader_entry_field(id).
loader_entry_field(name).
loader_entry_field(config).
loader_entry_field(group).
loader_entry_field(disabled).
loader_entry_field(inject).
loader_entry_field(isolate).
loader_entry_field(intercept).

config_reconcile_action(id_change, rebuild_entry).
config_reconcile_action(name_change, rebuild_entry).
config_reconcile_action(isolate_change, reassign_realm).
config_reconcile_action(intercept_change, update_in_place).
config_reconcile_action(config_change, update_fiber).
config_reconcile_action(disabled_true, unload_entry).
config_reconcile_action(disabled_false, load_entry).

hmr_phase(classify_module_graph).
hmr_phase(select_stale_entries).
hmr_phase(backup_module_cache).
hmr_phase(reimport_modules).
hmr_phase(rebuild_entries).
hmr_phase(commit_cache).
hmr_phase(restore_cache_on_failure).
~~~

### dsh dynamic lifecycle vocabulary

~~~text
dynamic_tool(cordis_inspect_list).
dynamic_tool(cordis_inspect_query).
dynamic_tool(cordis_inspect_self).
dynamic_tool(cordis_define).
dynamic_tool(cordis_run).
dynamic_tool(cordis_stop).
dynamic_tool(cordis_undefine).

dynamic_action(define_package).
dynamic_action(request_run).
dynamic_action(start_host_half).
dynamic_action(start_client_half).
dynamic_action(commit_activation).
dynamic_action(retract_run).
dynamic_action(stop_plugin).
dynamic_action(undefine_plugin).
dynamic_action(explicit_rollback).

dynamic_run_status(awaiting_approval).
dynamic_run_status(starting_host).
dynamic_run_status(client_pending).
dynamic_run_status(running).
dynamic_run_status(waiting).
dynamic_run_status(rejected).
dynamic_run_status(failed).
dynamic_run_status(cancelled).
dynamic_run_status(stopped).

source_field_alias(current_package_id, last_successful_package).
source_field_alias(next_package_id, failed_or_in_progress_target).
update_order(retract_old_run, start_target_run).
update_failure_recovery(does_not_restart_old_run).
stop_retention(package_definitions).
stop_retention(last_successful_package).
undefine_removal(dynamic_plugin_and_all_packages).
dynamic_definition_storage(process_local_memory).
~~~

### Ground evidence facts

~~~text
evidence(ev_c01).
evidence_class(ev_c01, authoritative).
evidence_source(ev_c01, s1, section_2_4_and_3_3_to_3_4).
supports(ev_c01, c01).

evidence(ev_c02).
evidence_class(ev_c02, authoritative).
evidence_source(ev_c02, s1, section_3_4).
supports(ev_c02, c02).

evidence(ev_c03).
evidence_class(ev_c03, authoritative).
evidence_source(ev_c03, s6, components_fibers_and_calculus).
supports(ev_c03, c03).

evidence(ev_c04).
evidence_class(ev_c04, derived).
evidence_source(ev_c04, s7, packages_core_src_fiber_ts_fiberstate).
supports(ev_c04, c04).

evidence(ev_c05).
evidence_class(ev_c05, derived).
evidence_source(ev_c05, s7, packages_core_src_fiber_ts_refresh).
supports(ev_c05, c05).

evidence(ev_c06).
evidence_class(ev_c06, derived).
evidence_source(ev_c06, s7, packages_core_src_fiber_ts_setepoch_reload_unload).
supports(ev_c06, c06).

evidence(ev_c07).
evidence_class(ev_c07, derived).
evidence_source(ev_c07, s7, packages_core_src_reflect_ts_provide).
supports(ev_c07, c07).

evidence(ev_c08).
evidence_class(ev_c08, derived).
evidence_source(ev_c08, s7, fiber_ts_and_dispose_spec_ts).
supports(ev_c08, c08).

evidence(ev_c09).
evidence_class(ev_c09, authoritative).
evidence_source(ev_c09, s6, effects_and_system_boundary).
supports(ev_c09, c09).

evidence(ev_c10).
evidence_class(ev_c10, derived).
evidence_source(ev_c10, s7, loader_group_include_hmr_sources).
supports(ev_c10, c10).

evidence(ev_c11).
evidence_class(ev_c11, derived).
evidence_source(ev_c11, s8, tool_cordis_and_dynamic_registry).
supports(ev_c11, c11).

evidence(ev_c12).
evidence_class(ev_c12, derived).
evidence_source(ev_c12, s8, registry_types_and_versioning_spec).
supports(ev_c12, c12).

evidence(ev_c13).
evidence_class(ev_c13, derived).
evidence_source(ev_c13, s8, startfresh_and_tool_prompt).
supports(ev_c13, c13).

evidence(ev_c14).
evidence_class(ev_c14, inferred).
evidence_source(ev_c14, s7, context_and_fiber_object_model).
supports(ev_c14, c14).

evidence(ev_c15).
evidence_class(ev_c15, inferred).
evidence_source(ev_c15, s1, active_control_and_oracle_boundary).
supports(ev_c15, c15).

evidence(ev_c16).
evidence_class(ev_c16, authoritative).
evidence_source(ev_c16, s9, selected_shadow_to_authority_route).
supports(ev_c16, c16).

evidence(ev_c17).
evidence_class(ev_c17, authoritative).
evidence_source(ev_c17, s9, bounded_kernel_scope).
supports(ev_c17, c17).

evidence(ev_design_route).
evidence_class(ev_design_route, advisory).
evidence_source(ev_design_route, s9, selected_design_continuation).
supports(ev_design_route, design_cordis_ctr_shadow_v0_1).
~~~

## 5.5 Selected design \(D_{\text{proposal}}\)

以下事实物化第 7–13 节所述的所选设计。它们的 status 是 proposed；不得与 source-observed facts 混作当前实现。

~~~text
design(design_cordis_ctr_shadow_v0_1).
design_status(design_cordis_ctr_shadow_v0_1, proposed).

design_component(design_cordis_ctr_shadow_v0_1, component_cordis_executor).
component_role(component_cordis_executor, actual_runtime_executor).
component_reads(component_cordis_executor, plugin_code_and_configuration).
component_writes(component_cordis_executor, live_cordis_state).

design_component(design_cordis_ctr_shadow_v0_1, component_dynamic_runner).
component_role(component_dynamic_runner, existing_dynamic_lifecycle_executor).
component_reads(component_dynamic_runner, dynamic_package_definitions).
component_writes(component_dynamic_runner, dynamic_registry_and_runs).

design_component(design_cordis_ctr_shadow_v0_1, component_observer).
component_role(component_observer, capture_canonicalize_reconcile).
component_reads(component_observer, live_cordis_state).
component_reads(component_observer, dynamic_registry_and_runs).
component_writes(component_observer, staging_relational_snapshot).

design_component(design_cordis_ctr_shadow_v0_1, component_snapshot_validator).
component_role(component_snapshot_validator, well_formedness_and_coverage_gate).
component_reads(component_snapshot_validator, staging_relational_snapshot).
component_writes(component_snapshot_validator, committed_snapshot_root).

design_component(design_cordis_ctr_shadow_v0_1, component_relational_store).
component_role(component_relational_store, immutable_versioned_fact_carrier).
component_reads(component_relational_store, committed_snapshot_root).
component_writes(component_relational_store, immutable_relational_snapshot).

design_component(design_cordis_ctr_shadow_v0_1, component_query_engine).
component_role(component_query_engine, fixed_relational_query_protocol).
component_reads(component_query_engine, immutable_relational_snapshot).
component_writes(component_query_engine, query_result_facts).

design_component(design_cordis_ctr_shadow_v0_1, component_differential_checker).
component_role(component_differential_checker, compare_runtime_and_relation).
component_reads(component_differential_checker, live_cordis_state).
component_reads(component_differential_checker, immutable_relational_snapshot).
component_writes(component_differential_checker, evidence_and_counterexamples).

design_component(design_cordis_ctr_shadow_v0_1, component_bounded_checker).
component_role(component_bounded_checker, fixed_composition_lifecycle_checker).
component_reads(component_bounded_checker, immutable_relational_snapshot).
component_reads(component_bounded_checker, requirements_and_bounds).
component_writes(component_bounded_checker, evidence_and_counterexamples).

design_component(design_cordis_ctr_shadow_v0_1, component_review_gate).
component_role(component_review_gate, authority_boundary).
component_reads(component_review_gate, candidate_design_and_evidence).
component_writes(component_review_gate, approved_or_rejected_decision).

design_component(design_cordis_ctr_shadow_v0_1, component_authority_adapter).
component_role(component_authority_adapter, typed_dynamic_lifecycle_adapter).
component_reads(component_authority_adapter, approved_typed_action).
component_calls(component_authority_adapter, existing_dsh_dynamic_lifecycle_verbs).
component_writes(component_authority_adapter, action_receipt_and_trace).

dataflow_edge(design_cordis_ctr_shadow_v0_1, component_cordis_executor, component_observer, runtime_objects_and_events).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_dynamic_runner, component_observer, package_run_and_approval_state).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_observer, component_snapshot_validator, staging_facts).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_snapshot_validator, component_relational_store, committed_snapshot).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_relational_store, component_query_engine, queryable_facts).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_relational_store, component_differential_checker, expected_runtime_view).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_relational_store, component_bounded_checker, bounded_initial_state).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_bounded_checker, component_review_gate, candidate_and_evidence).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_review_gate, component_authority_adapter, approved_typed_action).
dataflow_edge(design_cordis_ctr_shadow_v0_1, component_authority_adapter, component_dynamic_runner, lifecycle_call).

component_enabled_in(component_observer, phase_shadow).
component_enabled_in(component_snapshot_validator, phase_shadow).
component_enabled_in(component_relational_store, phase_shadow).
component_enabled_in(component_query_engine, phase_shadow).
component_enabled_in(component_differential_checker, phase_differential).
component_enabled_in(component_bounded_checker, phase_differential).
component_enabled_in(component_review_gate, phase_dynamic_authority).
component_enabled_in(component_authority_adapter, phase_dynamic_authority).

decision_authority_owner(phase_shadow, existing_cordis_and_dsh_callers).
execution_authority_owner(phase_shadow, existing_cordis_and_dsh_executors).
decision_authority_owner(phase_differential, existing_cordis_and_dsh_callers).
execution_authority_owner(phase_differential, existing_cordis_and_dsh_executors).
decision_authority_owner(phase_dynamic_authority, committed_candidate_plus_review_gate).
execution_authority_owner(phase_dynamic_authority, component_dynamic_runner).

identity_policy(design_cordis_ctr_shadow_v0_1, fiber, native_uid_scoped_by_runtime).
identity_policy(design_cordis_ctr_shadow_v0_1, context, mirror_surrogate_scoped_by_runtime).
identity_policy(design_cordis_ctr_shadow_v0_1, realm, mirror_surrogate_scoped_by_runtime_and_service).
identity_policy(design_cordis_ctr_shadow_v0_1, effect, registration_sequence_scoped_by_fiber).
identity_policy(design_cordis_ctr_shadow_v0_1, dynamic_package, native_immutable_package_id_scoped_by_plugin).

snapshot_policy(design_cordis_ctr_shadow_v0_1, immutable_snapshots).
snapshot_policy(design_cordis_ctr_shadow_v0_1, atomic_committed_root).
snapshot_policy(design_cordis_ctr_shadow_v0_1, staging_hidden_by_default).
snapshot_policy(design_cordis_ctr_shadow_v0_1, per_domain_coverage).
snapshot_policy(design_cordis_ctr_shadow_v0_1, periodic_full_reconciliation).

query_policy(design_cordis_ctr_shadow_v0_1, one_root_read_per_query).
query_policy(design_cordis_ctr_shadow_v0_1, three_valued_absence).
query_policy(design_cordis_ctr_shadow_v0_1, return_provenance).
query_policy(design_cordis_ctr_shadow_v0_1, return_quiescence).
query_policy(design_cordis_ctr_shadow_v0_1, separate_target_and_committed_bindings).
query_policy(design_cordis_ctr_shadow_v0_1, separate_last_successful_and_active_run).

oracle_namespace(design_cordis_ctr_shadow_v0_1, ot_run).
oracle_namespace(design_cordis_ctr_shadow_v0_1, ot_edit_reviewed_dynamic_only).

verification_obligation(design_cordis_ctr_shadow_v0_1, t01_sound_projection).
verification_obligation(design_cordis_ctr_shadow_v0_1, t02_quiescent_agreement).
verification_obligation(design_cordis_ctr_shadow_v0_1, t03_event_preservation).
verification_obligation(design_cordis_ctr_shadow_v0_1, t04_no_invented_absence).
verification_obligation(design_cordis_ctr_shadow_v0_1, t05_authority_reflection).
verification_obligation(design_cordis_ctr_shadow_v0_1, t06_failure_fidelity).
verification_obligation(design_cordis_ctr_shadow_v0_1, t07_identity_stability).
verification_obligation(design_cordis_ctr_shadow_v0_1, t08_version_stability).
~~~

## 5.6 Runtime snapshot template

一个 observer 不能只写正事实，还必须声明闭包范围：

~~~text
runtime(rt_process_7f31).
runtime_revision(rt_process_7f31, git_00278924a984fedfaffb4bc3d5eb7d8e76215643).

snapshot(snap_rt7f31_0042, rt_process_7f31).
snapshot_observation_sequence(snap_rt7f31_0042, 42).
snapshot_phase(snap_rt7f31_0042, committed).
snapshot_quiescence(snap_rt7f31_0042, quiescent).
coverage_scope(snap_rt7f31_0042, illustrative_runtime_snapshot).
current_snapshot(rt_process_7f31, snap_rt7f31_0042).

domain_coverage(snap_rt7f31_0042, fiber_inventory, complete).
domain_coverage(snap_rt7f31_0042, service_inventory, complete).
domain_coverage(snap_rt7f31_0042, dependency_bindings, complete).
domain_coverage(snap_rt7f31_0042, effect_inventory, partial).
domain_coverage(snap_rt7f31_0042, context_inventory, partial).
domain_coverage(snap_rt7f31_0042, loader_configuration, complete).
domain_coverage(snap_rt7f31_0042, dynamic_package_inventory, complete).
domain_coverage(snap_rt7f31_0042, external_effect_truth, unavailable).

coverage_reason(snap_rt7f31_0042, effect_inventory, observer_not_instrumented_at_every_registration).
coverage_reason(snap_rt7f31_0042, context_inventory, no_native_global_context_registry).
coverage_reason(snap_rt7f31_0042, external_effect_truth, primitive_oracle_boundary).
~~~

以上 ID 是规范性示例，不声称来自当前真实进程。任何实际 capture 必须 mint 新 RuntimeId/SnapshotId，不能复用此示例。

## 5.7 Ground witness A：service provider loss

这个 witness 抽象自 Cordis 的 provider withdrawal、consumer refresh 与 unload 语义。它是 source-derived expected trace，不是一次已执行测试的日志。

~~~text
runtime(rt_witness_provider_loss).

snapshot(snap_provider_loss_0, rt_witness_provider_loss).
snapshot_observation_sequence(snap_provider_loss_0, 0).
snapshot_phase(snap_provider_loss_0, committed).
snapshot_quiescence(snap_provider_loss_0, quiescent).
coverage_scope(snap_provider_loss_0, closed_witness_runtime).
domain_coverage(snap_provider_loss_0, fiber_inventory, complete).
domain_coverage(snap_provider_loss_0, service_inventory, complete).
domain_coverage(snap_provider_loss_0, dependency_bindings, complete).

fiber(fiber_provider_1).
fiber_uid(fiber_provider_1, 1).
fiber(fiber_consumer_2).
fiber_uid(fiber_consumer_2, 2).

fiber_member(snap_provider_loss_0, fiber_provider_1).
fiber_member(snap_provider_loss_0, fiber_consumer_2).
fiber_state(snap_provider_loss_0, fiber_provider_1, active).
fiber_state(snap_provider_loss_0, fiber_consumer_2, active).

service_key(service_clock).
realm(realm_root_clock).
service_impl(simpl_clock_by_fiber_1).
service_impl_key(simpl_clock_by_fiber_1, service_clock).
service_impl_provider(simpl_clock_by_fiber_1, fiber_provider_1).
service_impl_realm(simpl_clock_by_fiber_1, realm_root_clock).
service_impl_visible(snap_provider_loss_0, simpl_clock_by_fiber_1).

target_binding(snap_provider_loss_0, fiber_consumer_2, service_clock, simpl_clock_by_fiber_1).
committed_binding(snap_provider_loss_0, fiber_consumer_2, service_clock, simpl_clock_by_fiber_1).

effect(effect_provider_service_1).
effect_owner(effect_provider_service_1, fiber_provider_1).
effect_label(effect_provider_service_1, ctx_provide_clock).
effect_status(snap_provider_loss_0, effect_provider_service_1, registered).
effect_inverse_evidence(effect_provider_service_1, observed).

effect(effect_consumer_hook_1).
effect_owner(effect_consumer_hook_1, fiber_consumer_2).
effect_label(effect_consumer_hook_1, consumer_clock_hook).
effect_status(snap_provider_loss_0, effect_consumer_hook_1, registered).
effect_inverse_evidence(effect_consumer_hook_1, declared).

transition_event(event_provider_loss_1).
event_sequence(event_provider_loss_1, 1).
event_kind(event_provider_loss_1, withdraw_service).
event_subject(event_provider_loss_1, simpl_clock_by_fiber_1).
event_from(event_provider_loss_1, snap_provider_loss_0).
event_to(event_provider_loss_1, snap_provider_loss_1).
event_outcome(event_provider_loss_1, committed).

snapshot(snap_provider_loss_1, rt_witness_provider_loss).
snapshot_observation_sequence(snap_provider_loss_1, 1).
snapshot_predecessor(snap_provider_loss_1, snap_provider_loss_0).
snapshot_phase(snap_provider_loss_1, committed).
snapshot_quiescence(snap_provider_loss_1, in_flight).
coverage_scope(snap_provider_loss_1, closed_witness_runtime).
domain_coverage(snap_provider_loss_1, fiber_inventory, complete).
domain_coverage(snap_provider_loss_1, service_inventory, complete).
domain_coverage(snap_provider_loss_1, dependency_bindings, complete).
fiber_state(snap_provider_loss_1, fiber_provider_1, unloading).
fiber_state(snap_provider_loss_1, fiber_consumer_2, unloading).
committed_binding(snap_provider_loss_1, fiber_consumer_2, service_clock, simpl_clock_by_fiber_1).
effect_status(snap_provider_loss_1, effect_consumer_hook_1, disposing).
effect_status(snap_provider_loss_1, effect_provider_service_1, disposing).
absence_fact(snap_provider_loss_1, visible_service_impl, simpl_clock_by_fiber_1).

transition_event(event_provider_loss_2).
event_sequence(event_provider_loss_2, 2).
event_kind(event_provider_loss_2, reach_quiescence).
event_subject(event_provider_loss_2, fiber_provider_1).
event_from(event_provider_loss_2, snap_provider_loss_1).
event_to(event_provider_loss_2, snap_provider_loss_2).
event_outcome(event_provider_loss_2, committed).
event_cause(event_provider_loss_2, event_provider_loss_1).

snapshot(snap_provider_loss_2, rt_witness_provider_loss).
snapshot_observation_sequence(snap_provider_loss_2, 2).
snapshot_predecessor(snap_provider_loss_2, snap_provider_loss_1).
snapshot_phase(snap_provider_loss_2, committed).
snapshot_quiescence(snap_provider_loss_2, quiescent).
coverage_scope(snap_provider_loss_2, closed_witness_runtime).
domain_coverage(snap_provider_loss_2, fiber_inventory, complete).
domain_coverage(snap_provider_loss_2, service_inventory, complete).
domain_coverage(snap_provider_loss_2, dependency_bindings, complete).
fiber_state(snap_provider_loss_2, fiber_provider_1, disposed).
fiber_state(snap_provider_loss_2, fiber_consumer_2, pending).
fiber_waits_for(snap_provider_loss_2, fiber_consumer_2, service_clock).
effect_status(snap_provider_loss_2, effect_consumer_hook_1, disposed).
effect_status(snap_provider_loss_2, effect_provider_service_1, disposed).
absence_fact(snap_provider_loss_2, committed_binding, binding_consumer_2_clock).
~~~

这个 trace 明确表达了一个容易丢失的事实：在中间 unload snapshot 中，consumer 的 committed binding 仍可指向已经不再公开可见的 provider，用于一致 teardown；因此不能用“当前 lookup 结果”覆盖 committed view。

## 5.8 Ground witness B：dsh failed update

这个 witness 直接由 dsh versioning.spec.ts 和 startFresh/commitActivation/retract 行为支持。

~~~text
runtime(rt_witness_dynamic_update).

dynamic_plugin(dplugin_agent_a_clock_1).
dynamic_plugin_owner(dplugin_agent_a_clock_1, session_agent_a).

dynamic_package(dpkg_clock_pkg_1).
package_of(dpkg_clock_pkg_1, dplugin_agent_a_clock_1).
package_define_order(dpkg_clock_pkg_1, 1).
package_half(dpkg_clock_pkg_1, host).
package_source_digest(dpkg_clock_pkg_1, host, sha256_host_v1).

dynamic_package(dpkg_clock_pkg_2).
package_of(dpkg_clock_pkg_2, dplugin_agent_a_clock_1).
package_define_order(dpkg_clock_pkg_2, 2).
package_half(dpkg_clock_pkg_2, host).
package_source_digest(dpkg_clock_pkg_2, host, sha256_broken_host_v2).

snapshot(snap_dynamic_update_0, rt_witness_dynamic_update).
snapshot_observation_sequence(snap_dynamic_update_0, 0).
snapshot_phase(snap_dynamic_update_0, committed).
snapshot_quiescence(snap_dynamic_update_0, quiescent).
coverage_scope(snap_dynamic_update_0, closed_witness_runtime).
domain_coverage(snap_dynamic_update_0, dynamic_package_inventory, complete).
last_successful_package(snap_dynamic_update_0, dplugin_agent_a_clock_1, dpkg_clock_pkg_1).
active_run(snap_dynamic_update_0, dplugin_agent_a_clock_1, drun_clock_run_1).
run_package(drun_clock_run_1, dpkg_clock_pkg_1).
run_status(snap_dynamic_update_0, drun_clock_run_1, running).

transition_event(event_dynamic_update_1).
event_sequence(event_dynamic_update_1, 1).
event_kind(event_dynamic_update_1, request_update).
event_subject(event_dynamic_update_1, dpkg_clock_pkg_2).
event_from(event_dynamic_update_1, snap_dynamic_update_0).
event_to(event_dynamic_update_1, snap_dynamic_update_1).
event_outcome(event_dynamic_update_1, in_flight).

snapshot(snap_dynamic_update_1, rt_witness_dynamic_update).
snapshot_observation_sequence(snap_dynamic_update_1, 1).
snapshot_predecessor(snap_dynamic_update_1, snap_dynamic_update_0).
snapshot_phase(snap_dynamic_update_1, committed).
snapshot_quiescence(snap_dynamic_update_1, in_flight).
coverage_scope(snap_dynamic_update_1, closed_witness_runtime).
domain_coverage(snap_dynamic_update_1, dynamic_package_inventory, complete).
last_successful_package(snap_dynamic_update_1, dplugin_agent_a_clock_1, dpkg_clock_pkg_1).
next_package(snap_dynamic_update_1, dplugin_agent_a_clock_1, dpkg_clock_pkg_2).
absence_fact(snap_dynamic_update_1, active_run, dplugin_agent_a_clock_1).

transition_event(event_dynamic_update_2).
event_sequence(event_dynamic_update_2, 2).
event_kind(event_dynamic_update_2, host_half_failure).
event_subject(event_dynamic_update_2, dpkg_clock_pkg_2).
event_from(event_dynamic_update_2, snap_dynamic_update_1).
event_to(event_dynamic_update_2, snap_dynamic_update_2).
event_outcome(event_dynamic_update_2, failed).
event_cause(event_dynamic_update_2, event_dynamic_update_1).

snapshot(snap_dynamic_update_2, rt_witness_dynamic_update).
snapshot_observation_sequence(snap_dynamic_update_2, 2).
snapshot_predecessor(snap_dynamic_update_2, snap_dynamic_update_1).
snapshot_phase(snap_dynamic_update_2, committed).
snapshot_quiescence(snap_dynamic_update_2, quiescent).
coverage_scope(snap_dynamic_update_2, closed_witness_runtime).
domain_coverage(snap_dynamic_update_2, dynamic_package_inventory, complete).
last_successful_package(snap_dynamic_update_2, dplugin_agent_a_clock_1, dpkg_clock_pkg_1).
next_package(snap_dynamic_update_2, dplugin_agent_a_clock_1, dpkg_clock_pkg_2).
absence_fact(snap_dynamic_update_2, active_run, dplugin_agent_a_clock_1).
latest_attempt_status(snap_dynamic_update_2, dplugin_agent_a_clock_1, failed).
recovery_required(snap_dynamic_update_2, explicit_run_of_last_successful_package).
~~~

必须由 query 返回：

\[
\text{last successful}=pkg_1,\quad
\text{failed target}=pkg_2,\quad
\text{live run}=\varnothing
\]

若 helper 只返回 currentPackageId=pkg_1，Agent 很容易错误推断 v1 仍在运行。统一 D 必须拒绝这个推断。

## 5.9 \(L_0\) 中的 probe workflow

下面只把 mirror 的观察工作流编码为 code-as-data。它不编码 Cordis plugin 的任意 JavaScript，也不增加规则。

~~~text
entry(program_cordis_shadow_probe_v1, node_probe_root).

code_seq(node_probe_root, node_capture_before, node_probe_tail).
code_prim(node_capture_before, capture_committed_snapshot).

code_seq(node_probe_tail, node_issue_observation, node_compare_tail).
code_prim(node_issue_observation, observe_withdraw_provider).

code_seq(node_compare_tail, node_await_quiescence, node_compare).
code_prim(node_await_quiescence, await_cordis_quiescence).
code_prim(node_compare, compare_direct_and_relational_views).

current_def(fun_cordis_shadow_probe_main, node_probe_root).
~~~

这些是 \(D_{\text{code}}\) 中的 ground facts。固定 \(P_0\) 通过 code_seq 与 code_prim 解释它们。capture、observe、await、compare 的真实状态变化属于固定类型的 \(O^t_{run}\) primitive contracts。

## 5.10 固定 \(P_0\) 边界

以下七条来自 S1，不属于 \(D_C\)，也不随 Cordis 改变：

\[
\begin{aligned}
execute(Q)&\leftarrow entry(Q,R)\otimes run(R)\\
run(N)&\leftarrow code\_skip(N)\\
run(N)&\leftarrow code\_prim(N,A)\otimes exec(A)\\
run(N)&\leftarrow code\_seq(N,L,R)\otimes run(L)\otimes run(R)\\
run(N)&\leftarrow code\_par(N,L,R)\otimes(run(L)\mid run(R))\\
run(N)&\leftarrow code\_iso(N,C)\otimes\odot run(C)\\
run(N)&\leftarrow code\_call(N,F)\otimes current\_def(F,R)\otimes run(R)
\end{aligned}
\]

本文没有第八条 Cordis rule。所有 Cordis 名词、状态、约束表达式和 transition instances 都是 data。

## 5.11 Well-formedness

一个合法 committed Cordis snapshot 至少满足：

1. 每个 FiberId 在同一 RuntimeId 内唯一；非 root 的 uid 不复用；
2. 每个 fiber_member 都有一个已知 fiber_state；
3. 每个 service_impl 恰有一个 key、provider 与 realm；
4. 每个 target_binding/committed_binding 指向已知 service_impl；
5. 每个 effect 恰有一个 owner；parent effect 若存在则同属该 fiber；
6. 每个 loader entry 的 parent 链无环；
7. 每个 dynamic package 恰属一个 dynamic plugin；
8. 同一 dynamic plugin 的 package define order 严格递增；
9. 每个 active_run 的 package 属于同一 dynamic plugin；
10. 每个 snapshot/domain 恰有一个 coverage 状态；
11. absence_fact 只有在对应 domain complete 时可解释为强否定；否则只是 observer 未见；
12. code node 对每个可达 occurrence 恰有一个 code_* descriptor；
13. immutable code version 的 node ID 集合互不相交；
14. execute 与 run 不出现在 data predicate 定义中。

---

# 6. Behavior and Evidence

## 6.1 Cordis lifecycle 的 relational reading

| Cordis 行为 | D 中的前态 | transition event | D 中的后态 |
|---|---|---|---|
| provider 出现 | consumer PENDING；required service 无 target | service_publish | target epoch 获得 provider fiber identity；consumer LOADING |
| apply 成功 | candidate provider view 已解析 | activation_commit | committed view 写入；fiber ACTIVE |
| provider 被替换 | target epoch 与 committed epoch 不同 | reload_request | fiber 先 UNLOADING，再以新 target LOADING |
| provider 被撤销 | public service_impl 删除 | service_withdraw | consumers 刷新并离开 ACTIVE；provider 等待 |
| effect 清理 | fiber UNLOADING | effect_dispose | nested inverse 逆序；顶层 effects 无全序 |
| apply 抛错 | fiber LOADING | activation_failure | fiber FAILED；直到 update 才重试 |
| dispose | fiber 任意可处置态 | fiber_dispose | uid 失效；quiescent state DISPOSED |

## 6.2 target view 与 committed view

这是 mirror 的必要双态，不是冗余：

\[
T_f(s)=\text{fiber target bindings in snapshot }s
\]

\[
C_f(s)=\text{fiber committed bindings used by its active instance}
\]

正常 ACTIVE 时通常 \(T_f=C_f\)。provider 变化后，可能短暂出现：

\[
T_f\neq C_f
\]

Cordis 的 unload/reload 正是消解这个差异的过程。只保存一个 dependencies map 会丢失 teardown 一致性。

## 6.3 Effect 证据级别

| 值 | 含义 |
|---|---|
| declared | observer 看见 disposer 被声明或注册 |
| observed | observer 看见 disposer 被调用并从 registry 撤销 |
| verified | 有专门 oracle 比较了前后外部状态 |
| unknown | 没有足够证据 |

Cordis 自动管理 disposer 不等于证明 disposer 是正确 inverse。

## 6.4 dsh dynamic package 的实际 publication semantics

| 字段 | 精确含义 |
|---|---|
| packages | 同一 dynamic plugin 下的 immutable definitions |
| last_successful_package | 最后一次成功建立的 package；对应源码 currentPackageId。running 与合法 waiting 都可提交，failed/rejected/cancelled 不可提交。 |
| next_package | 正在尝试、等待审批或最近失败的 target；对应 nextPackageId |
| active_run | 当前物理 activation；失败 update 后可能不存在 |
| latest_attempt | 最近一次尝试的状态与诊断；独立于 active_run |

成功 update：

\[
(current=v_1,run=v_1)
\to
(next=v_2,run=\varnothing)
\to
(current=v_2,run=v_2,next=\varnothing)
\]

失败 update：

\[
(current=v_1,run=v_1)
\to
(current=v_1,next=v_2,run=\varnothing)
\to
(current=v_1,next=v_2,run=\varnothing,latest=failed)
\]

恢复 v1 需要显式：

\[
run(plugin,v_1,mode=run)
\]

## 6.5 Evidence matrix

| Obligation | Source anchor | 现有可执行 witness | 本文状态 |
|---|---|---|---|
| missing dependency parks consumer | fiber.ts::_refresh；core inject tests | Cordis core tests | source-grounded，未在本任务重跑 |
| provider replacement reloads consumer | reflect.ts::provide；core service tests | Cordis service tests | source-grounded，未在本任务重跑 |
| dispose is awaited/idempotent | fiber.ts::_unload；dispose tests | Cordis dispose tests | source-grounded，未在本任务重跑 |
| failed fiber recovers on update | fiber.ts::_error/update；fiber tests | Cordis fiber tests | source-grounded，未在本任务重跑 |
| HMR restores cache on failure | hmr source | HMR tests | source-grounded，未在本任务重跑 |
| package definitions immutable | dsh registry/types | versioning tests | source-grounded，未在本任务重跑 |
| failed update leaves no active run | host-runner startFresh + versioning.spec.ts | explicit test assertion | source-grounded，未在本任务重跑 |
| stop retains packages/current | host-runner stop + docs/tests | lifecycle tests | source-grounded，未在本任务重跑 |
| undefine removes plugin/packages | host-runner undefine | lifecycle tests | source-grounded，未在本任务重跑 |
| mirror equals runtime | 尚无实现 | 待建 differential harness | OPEN verification obligation |
| bounded invariants hold | 尚无 checker | 待建 model checker | OPEN verification obligation |

## 6.6 Reification completeness result

| Domain | Schema closed | Static facts grounded | Live facts available now | 下一验证动作 |
|---|---:|---:|---:|---|
| plugins/fibers | yes | yes | no current process snapshot | collector capture |
| services/bindings | yes | yes | no current process snapshot | reflect projection |
| effects | yes | partial by design | no | registration instrumentation |
| state/lifecycle | yes | yes | witness only | event trace |
| package/version | yes | yes | no current process snapshot | dsh inventory projection |
| scopes/realms | yes | yes | no | surrogate identity map |
| configuration | yes | yes | no | loader tree projection |
| requirements | yes | yes | yes | fixed checker ingestion |
| arbitrary JS/external world | intentionally no | oracle boundary | no | dedicated oracle if required |

---

# 7. Selected Design: CTR Semantic Mirror

## 7.1 Architecture

~~~mermaid
flowchart TD
    C["Cordis + dsh runtime"] --> O["Observer and identity mint"]
    O --> D["Versioned relational snapshots D"]
    D --> Q["Fixed query and constraint engine"]
    D --> V["Differential and bounded checker"]
    Q --> A["Reviewed authority adapter"]
    A --> C
~~~

在 shadow phase，最后一条 authority edge 禁用。Cordis 仍是唯一 executor。

## 7.2 Observer responsibilities

Observer 只做五件事：

1. **Capture**：读取 Registry/Runtime/Fiber/Reflect/loader/dynamic inventory；
2. **Mint**：为无原生稳定 ID 的 Context、realm、effect 注册生成 runtime-local surrogate；
3. **Normalize**：把 object graphs 转成 typed ground facts；
4. **Version**：产生 staging snapshot，经一致性检查后发布 committed snapshot；
5. **Reconcile**：增量事件之后定期 full capture，发现 drift。

Observer 不解释 plugin 业务逻辑，不生成 Horn clauses，不假装验证 inverse。

## 7.3 Event ingestion

最低事件集：

| Event source | 用途 |
|---|---|
| internal/plugin | plugin runtime 与 fiber membership |
| internal/status | fiber lifecycle transition |
| internal/service | service publication/withdrawal |
| internal/update | config-driven fiber update |
| internal/listener、internal/dispatch | listener/effect 观测辅助 |
| loader/group/include hooks | desired entry tree 与 source config |
| cordis/dynamic-package | dynamic active run publication |
| cordis/dynamic-retract | physical run withdrawal |
| cordis/request-run、resolved | approval 与 attempt trace |

仅靠事件不够。Observer 必须周期性 full reconciliation，因为：

- observer 可能晚于某些注册；
- Context 没有完整全局 registry；
- effect registration 没有一个公开、完备的单一 event；
- HMR 可能产生密集的 staging transitions。

## 7.4 Snapshot publication

每次 capture 产生：

\[
D^{staging}_{n}
\]

通过 well-formedness、coverage 与 monotonic event checks 后，原子更新 root：

\[
current\_snapshot(rt,s_{n-1})
\Rightarrow
current\_snapshot(rt,s_n)
\]

旧 snapshot immutable。默认 query 绑定到一次 root read，避免同一查询跨越两个 runtime 时刻。

## 7.5 Active control boundary

最小 shadow D 不包含 JavaScript stack、promise continuation 或 CTR resolvent。它包含：

- fiber lifecycle state；
- inertia 是否 settled；
- committed/target view；
- dynamic attempt/half status；
- 可观察 transition event。

若将来需要暂停、迁移或搜索 active control，必须另加：

~~~text
active_task(TaskId).
task_program_counter(TaskId, NodeId).
task_continuation(TaskId, ContinuationId).
join_wait(TaskId, JoinId).
~~~

这属于扩展 interpreter/observer contract，不应在本次 reification 中假定已经存在。

---

# 8. Fixed Transition Vocabulary

## 8.1 原则

生命周期不通过以下形式编码：

~~~text
activate(Fiber) :- dependencies_available(Fiber), ...
~~~

本文没有这种规则。

相反，action kind、pre-state references、outcome 与 state delta 都是 ground facts；固定 transition oracle 和固定 constraint engine 解释这些事实。

## 8.2 Core primitive actions

| Action kind | 读取 | 允许写入 | Oracle boundary |
|---|---|---|---|
| capture_snapshot | live registries | new staging facts | object graph enumeration |
| publish_snapshot | validated staging root | current_snapshot root | atomic metadata write |
| refresh_fiber_target | visible service facts | target_binding/target_epoch | Cordis _refresh observation |
| request_fiber_update | config/target difference | transition event | Cordis Fiber.update |
| await_fiber | inertia | settled/status facts | Promise settlement |
| dispose_fiber | fiber identity | lifecycle/effect/service events | Cordis Fiber.dispose |
| compare_views | direct + relational snapshot | evidence facts | differential comparator |

## 8.3 Dynamic authority actions

| Action kind | Precondition facts | Commit evidence |
|---|---|---|
| define_package | owner session、plugin exists/new、source supplied | new immutable packageId appears |
| request_run | mode valid、no in-flight transition | attempt identity and next target appear |
| approve_run | exact pending approval | claimed request and Host start |
| commit_activation | required halves succeeded | active_run and last_successful_package agree |
| stop_plugin | active run or pending request | no active_run; definitions retained |
| undefine_plugin | owner matches | plugin and all packages absent in complete inventory |
| explicit_rollback | last_successful exists; no conflicting transition | new active_run on last_successful |

## 8.4 Publication and version binding

Mirror/query programs采用 immutable node IDs 与 atomic current_def/root publication：

- 已展开进 CTR resolvent 的 node IDs 继续指向旧 version；
- 尚未展开的 call 在其 binding point 读取 current_def；
- publication 不回写旧 node；
- reclamation 需要 quiescence、epoch 或 reference tracking。

Dynamic package 采用另一套 publication：

- package definition 永不就地改写；
- last_successful_package 只在 activation 成功提交后变更；running 与合法 waiting 都属于提交成功；
- 但 update 会先撤销旧 physical run；
- 因此 package pointer publication 与 live-run continuity 是两个独立性质。

---

# 9. Query Surface

## 9.1 固定 query vocabulary

Query engine 只需要固定关系操作与少量领域无关构造：

~~~text
query_select.
query_join.
query_reachability.
query_snapshot_diff.
query_explain_absence.
query_impact.
query_counterexample.
query_minimal_edit.
~~~

Cordis 的具体 service、fiber 与 package 作为 query data，不生成 query rules。

## 9.2 必须支持的 query

| Query | 结果 |
|---|---|
| explain_fiber_state(Fiber, Snapshot) | state、缺失依赖、target/committed 差异、最近 cause events、coverage |
| providers(Service, Context, Snapshot) | 可见 realm、impl、provider fiber、publication state |
| consumers(ServiceImpl, Snapshot) | target 与 committed consumers 分开 |
| impact_remove(ServiceImpl, Snapshot) | 将失活/reload 的 fibers、将撤销的 effects、受影响 loader/dynamic run |
| package_truth(DynamicPlugin, Snapshot) | last successful、next、live run、latest attempt，不折叠 |
| snapshot_diff(S1,S2) | added/removed/changed facts 与 provenance |
| why_unknown(Query, Snapshot) | 缺失的 coverage domain 或 oracle |
| minimal_runtime_edit(Goal,H,R) | 在 hard constraints/edit mask 下的最小 typed action sequence |

## 9.3 Ground query witness

~~~text
query(query_impact_clock_provider).
query_kind(query_impact_clock_provider, impact_remove).
query_snapshot(query_impact_clock_provider, snap_provider_loss_0).
query_argument(query_impact_clock_provider, simpl_clock_by_fiber_1).

query_result(query_impact_clock_provider, will_leave_active, fiber_consumer_2).
query_result(query_impact_clock_provider, will_dispose_effect, effect_consumer_hook_1).
query_result(query_impact_clock_provider, will_wait_for_service, service_clock).
query_result(query_impact_clock_provider, provider_final_state, disposed).
query_confidence(query_impact_clock_provider, source_derived_expected_trace).
query_coverage(query_impact_clock_provider, sufficient_for_listed_relations).

query(query_dynamic_clock_truth).
query_kind(query_dynamic_clock_truth, package_truth).
query_snapshot(query_dynamic_clock_truth, snap_dynamic_update_2).
query_argument(query_dynamic_clock_truth, dplugin_agent_a_clock_1).

query_result(query_dynamic_clock_truth, last_successful_package, dpkg_clock_pkg_1).
query_result(query_dynamic_clock_truth, failed_target_package, dpkg_clock_pkg_2).
query_result(query_dynamic_clock_truth, active_run, none).
query_result(query_dynamic_clock_truth, required_recovery, explicit_run_pkg_1).
~~~

## 9.4 为什么不能轻易被“再写一个 helper”替代

一个 helper 可以返回 service list 或 package list。这里的核心能力是跨域、带时态与证据的闭包：

\[
\text{service impl}
\to
\text{provider fiber}
\to
\text{committed consumers}
\to
\text{owned effects}
\to
\text{loader entry/config}
\to
\text{dynamic package/run}
\to
\text{candidate edit}
\]

同一个 query 还必须返回：

- snapshot identity；
- quiescence；
- domain coverage；
- provenance；
- current 与 target 的分离；
- actual 与 proposed 的分离；
- hard-constraint consequence。

增加一个专用 helper 往往只把这条 join path 再编码一次。统一 D 让所有 query 共享 identity、time 与 evidence semantics。

---

# 10. Trace Correspondence

## 10.1 Abstraction

令真实 Cordis/dsh 状态为 \(C_i\)，观察投影为：

\[
\alpha(C_i)=D_i
\]

真实 trace：

\[
C_0\xrightarrow{a_0}C_1\xrightarrow{a_1}\cdots C_n
\]

mirror trace：

\[
D_0\xRightarrow{\hat a_0}D_1\xRightarrow{\hat a_1}\cdots D_n
\]

其中 \(\hat a_i\) 可以包含多个 observer administrative steps；比较时擦除 capture/canonicalize/publish 的 stuttering，但不能擦除 Cordis state-changing event。

## 10.2 Correspondence obligations

| ID | Obligation |
|---|---|
| T01 Sound projection | 每个 committed D fact 都能追溯到 source object、event、approved derivation 或显式 assumption。 |
| T02 Quiescent agreement | quiescent 时 direct inspection 与 relational query 对闭合 domain 相等。 |
| T03 Event preservation | 每个 observed Cordis lifecycle change 在 D trace 中有同序 cause event。 |
| T04 No invented absence | partial/unavailable domain 中未观察到的事实不变成强否定。 |
| T05 Authority reflection | 每个 approved edit 要么产生允许的 Cordis action trace并匹配 postcondition，要么得到显式 rejection。 |
| T06 Failure fidelity | update failure、FAILED fiber、HMR rollback 等失败态不能被 normalizer 折叠成 success/no-op。 |
| T07 Identity stability | 同一 runtime process 内 Fiber/Context/Realm/Effect surrogate 在其生命周期中稳定。 |
| T08 Version stability | immutable package/code version facts永不就地改写。 |

## 10.3 Differential harness

每个 scenario 执行：

1. capture direct pre-state \(C_i\)；
2. project committed \(D_i\)；
3. 通过现有 Cordis/dsh API 执行一个 action；
4. 同时记录 internal/dynamic events；
5. 等待已声明的 quiescence boundary；
6. capture \(C_{i+1}\) 并 project \(D_{i+1}\)；
7. 运行 direct query 与 relational query；
8. 比较 fact diff、query result、event order 与 coverage；
9. 将 mismatch 作为 ground counterexample 保存。

最先覆盖的 scenarios：

- required provider appears/disappears；
- provider replacement；
- config update while active；
- effect throws during cleanup；
- apply fails then explicit update；
- nested plugin disposal；
- isolate/intercept change；
- loader disable/enable；
- HMR accepted update、declined update、rollback；
- dynamic define/run/update success；
- dynamic update failure；
- explicit rollback；
- stop 与 undefine；
- Host/Client half waiting/failure；
- approval cancel/race。

---

# 11. Bounded Composition/Lifecycle Checker

## 11.1 Fixed checker boundary

Checker 的输入是有限 \(D\)、固定 action vocabulary、固定 constraint expression vocabulary 与 bounds。它不加载由 LLM 生成的新 Horn program。

建议第一个 bound profile：

~~~text
bound_profile(cordis_kernel_small_v1).
bound(cordis_kernel_small_v1, fibers, 8).
bound(cordis_kernel_small_v1, service_keys, 8).
bound(cordis_kernel_small_v1, realms, 4).
bound(cordis_kernel_small_v1, effects_per_fiber, 8).
bound(cordis_kernel_small_v1, loader_entries, 8).
bound(cordis_kernel_small_v1, dynamic_plugins, 3).
bound(cordis_kernel_small_v1, packages_per_dynamic_plugin, 4).
bound(cordis_kernel_small_v1, in_flight_transitions, 3).
bound(cordis_kernel_small_v1, trace_steps, 32).
~~~

这些数值是 ADVISORY 起点，不是理论上限。

## 11.2 Invariant suite

### Safety

1. ACTIVE consumer 必有 required bindings；
2. visible binding 的 provider 必为 ACTIVE；
3. 同 realm/key provider 唯一；
4. active_run package 属于对应 dynamic plugin；
5. 一个 dynamic plugin 至多一个 active_run；
6. immutable package digest 不改变；
7. committed snapshot 满足 referential integrity；
8. shadow phase 不产生 executor action。

### Teardown

1. provider withdrawal 后不再产生新的 target binding；
2. existing consumer 可暂持 committed binding 直到其 unload 完成；
3. provider final cleanup 等待 committed consumers；
4. quiescent disposed fiber 无 owned registered capability；
5. stop 不删除 package facts；
6. undefine 在 complete inventory 中删除 plugin/package/run。

### Publication

1. last_successful_package 只在 running 或合法 waiting 提交后改变；
2. failure 保留 diagnosis；
3. explicit rollback 成功后 active_run 指向 last_successful_package；
4. current_def publication 只替换 root fact，不改旧 nodes；
5. default query 不跨 snapshot root。

### Observation

1. event sequence 单调；
2. snapshot predecessor 唯一；
3. complete domain 才允许 closed-world absence；
4. direct/relational result 在 quiescence 相等；
5. staging state 不被普通 query 发布。

## 11.3 Liveness 的有界表述

不声称无限 liveness。只检查：

\[
\text{within }k\text{ steps}
\]

- unavailable dependency 的 active consumer 离开 ACTIVE；
- provider unload 到达 disposed/pending terminal；
- owned reversible effects 到达 disposed；
- update attempt 到达 running/waiting/failed/rejected/cancelled/stopped；
- HMR transaction 到达 committed 或 rollback-complete。

如果 primitive oracle 永不返回，结果是 oracle_blocked，不是 invariant pass。

## 11.4 Counterexample artifact

~~~text
counterexample(counterexample_017).
counterexample_constraint(counterexample_017, h04_provider_waits_for_consumers).
counterexample_initial_snapshot(counterexample_017, snap_ce_017_0).
counterexample_event(counterexample_017, event_ce_017_1).
counterexample_event(counterexample_017, event_ce_017_2).
counterexample_bad_snapshot(counterexample_017, snap_ce_017_2).
counterexample_minimal(counterexample_017, true).
counterexample_oracle_assumption(counterexample_017, disposer_returns).
~~~

Checker 输出仍是 D，可直接由同一 query surface 解释。

---

# 12. Authority Migration

## 12.1 Phase 1：semantic shadow

Authority：

\[
\text{Cordis}=executor,\qquad D=read\text{-}only\ mirror
\]

完成门槛：

- core/dynamic domains 的 coverage 逐项可见；
- 重要 query 有 provenance；
- differential scenario 在 quiescent boundary 一致；
- observer drift 可自动重建；
- instrumentation 不改变 lifecycle outcome。

## 12.2 Phase 2：advisory planning

Agent 可提交目标 facts：

~~~text
desired_state(design_42, dynamic_plugin_running).
desired_package(design_42, dplugin_agent_a_clock_1, dpkg_clock_pkg_1).
protected_constraint(design_42, h07_dynamic_package_immutable).
protected_constraint(design_42, h08_publication_after_complete_activation).
objective_ref(design_42, j_minimize_runtime_actions).
~~~

固定 planner 返回 typed action sequence，但不执行。

## 12.3 Phase 3：dynamic package authority

第一块 authority 只覆盖：

\[
inspect\to define\to run/update\to observe\to stop/rollback/undefine
\]

执行协议：

1. 从 committed \(D_i\) 生成 candidate \(D'\)；
2. 固定 checker 检查 \(H_C\) 与 edit mask；
3. 人或策略通过 review gate；
4. adapter 调用现有 dsh lifecycle verb；
5. Cordis/dsh 仍执行真实 transition；
6. observer capture \(D_{i+1}\)；
7. 比较 \(D'\) 与 \(D_{i+1}\)；
8. mismatch 不提交为 success，保存 counterexample；
9. 若失败 update 需要恢复，显式计划 rollback，不假定 current 指针表示 live run。

## 12.4 不采用直接替换

不直接 fork/rewrite Cordis 的原因不是“关系模型天然更安全”，而是当前需要先证明：

1. 同一 D 是否真正减少 Agent 的跨 API bookkeeping；
2. trace correspondence 是否足以承载 authority；
3. coverage gaps 是否可关闭；
4. fixed checker 是否发现现有 helper 难以发现的 counterexample；
5. observer 成本是否可接受。

只有这些证据成立，才讨论更深的 lifecycle ownership。

---

# 13. Implementation Slices

## Slice M0：离线 extractor

输入：

- pinned Cordis/dsh source；
- package manifests；
- loader schema/type definitions；
- test names 与 source anchors。

输出：

- \(D_{\text{source}}\)；
- source revision；
- evidence ledger；
- predicate schema check。

验收：同一 revision 重跑得到 canonical-identical facts。

## Slice M1：live shadow collector

新增一个 observer package，不修改 executor semantics。

输出：

- runtime-local IDs；
- committed snapshots；
- domain coverage；
- incremental events；
- full reconciliation。

验收：provider loss、replacement、fiber failure 与 dispose 的 direct/relational query 一致。

## Slice M2：query service

实现：

- explain_fiber_state；
- providers/consumers；
- impact_remove；
- package_truth；
- snapshot_diff；
- why_unknown。

验收：Ground witness A/B 的 expected results 通过；任何 partial domain 都传播 unknown。

## Slice M3：differential harness

复用 Cordis 与 dsh 现有 tests，增加 projection assertions 和 trace fixtures。

验收：

- quiescent relation equality；
- intermediate committed/target distinction；
- failed update 三元状态正确；
- mismatch 产生最小 counterexample artifact。

## Slice M4：bounded checker

实现 fixed finite signature 与 invariant suite。

验收：能自动发现人工注入的：

- active-without-provider；
- duplicate provider；
- premature provider cleanup；
- stale effect；
- package mutation；
- current-equals-live 错误假设；
- implicit rollback；
- incomplete-domain false negative。

## Slice M5：reviewed dynamic authority

实现 typed adapter，调用既有 dsh verbs。

验收：

- 无 review 不执行；
- action/postcondition 全量记录；
- success 与 actual committed D 对齐；
- failure 不吞并；
- rollback 显式；
- authority 无法触及 Cordis core 或任意外部 action。

---

# 14. Acceptance Criteria

达到以下四项才适合向 Cordis/dsh 负责人展示为“内核方向”而非“额外 helper”：

## 14.1 真实复杂性降低

同一组关系和 identity semantics 取代 Agent 对 Registry/Fiber/Reflect/Effect/Loader/Dynamic Registry 的手工拼接。报告：

- query 所需 API 调用数；
- Agent 中间状态字段数；
- duplicate join logic；
- opaque/unknown 数量；
- predicate/schema 数量及其可复用比例。

## 14.2 行为对齐

至少 dynamic lifecycle 和 core provider-loss subsystem 具有：

\[
Cordis\ trace\leftrightarrow D\ trace
\]

并在 pinned tests + generated bounded cases 中自动 differential。

## 14.3 Agent 新能力

Agent 能在一次 query 中回答 transitive impact，并能在 \(H_C\) 和 \(R_C\) 下搜索最小 typed modification。

## 14.4 不可被单一 helper 轻易替代的 demo

推荐演示：

1. v1 dynamic package 正在运行并提供 service；
2. consumer fibers 横跨不同 realm，拥有 effects 与 loader config；
3. v2 update 失败；
4. 统一 query 返回：
   - v1 是 last successful，但没有 live run；
   - v2 是 failed target；
   - 哪些 services 已撤销；
   - 哪些 consumers pending；
   - 哪些 effects 已/未确认清理；
   - 哪些 coverage 仍 unknown；
   - 恢复不变量的最小动作是显式 run(v1)，不是重复 update(v2)；
5. bounded checker 验证恢复 trace；
6. direct Cordis/dsh inspection 与 D 一致。

看完这个 demo，应自然得到：

> 这不是给 Cordis 增加一个查询功能；它重新定义了 Agent 所见的 Cordis runtime truth。

---

# 15. Decision Record

## Adopted

1. 采用 ground relational state，不生成项目专属 Horn；
2. 保持固定 \(P_0\)；
3. shadow first；
4. core 与 dsh dynamic layer 分域、同 carrier；
5. target binding 与 committed binding 分开；
6. last_successful_package 与 active_run 分开；
7. coverage 成为一等事实；
8. authority 首先只给 dynamic package lifecycle；
9. verification 只覆盖 bounded composition/lifecycle kernel；
10. arbitrary JS 与外部世界留在 oracle boundary。

## Deferred

1. active CTR resolvent 的完整关系化；
2. service interface/version type system；
3. production-grade persistent fact store；
4. distributed/multi-process identity；
5. external effect verification；
6. 更深 Cordis core authority。

## Rejected

1. 为 Cordis 生成一套新的 Horn program；
2. 直接 fork/rewrite；
3. 把 currentPackageId 当 live state；
4. 用缺失事实假装 false；
5. 用全局 LIFO 描述所有 fiber effects；
6. 让 search result 自动部署；
7. 声称关系化本身等于安全或形式验证。

---

# 16. Final Normalized Statement

\[
\boxed{
D_{\text{Cordis}}
=
\text{source}
+\text{runtime topology}
+\text{bindings}
+\text{effects}
+\text{config}
+\text{versions}
+\text{trace}
+\text{requirements}
+\text{candidates}
}
\]

\[
\boxed{
\text{fixed }P_0
+\text{fixed typed }O^t_{run}
+\text{fixed }P_S
}
\]

项目变化、runtime 变化与设计变化只产生：

\[
D_0\to D_1\to D_2
\]

不产生：

\[
P_0\to P_0'
\]

最可信的近期目标不是“形式验证整个 Harness”，而是：

\[
\boxed{
\text{mechanically checked Cordis composition/lifecycle kernel}
}
\]

它先作为 Cordis 的 semantic shadow；只有在 trace 对齐、coverage 闭合、Agent reasoning 明显简化之后，才在 dsh dynamic package seam 上获得受审查的局部 authority。
