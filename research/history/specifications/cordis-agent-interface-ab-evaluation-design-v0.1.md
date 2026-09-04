# Cordis Agent Interface A/B Evaluation Design v0.1

## 从 semantic substrate reuse 到 Agent utility gate

日期：2026-09-03  
模式：DESIGN  
状态：**PASS**  
源码基线：Cordis `00278924a984fedfaffb4bc3d5eb7d8e76215643`；dsh `49a606bc5b5934603f22a26957a07dc799ab0291`  
语义基线：`cordis-relational-reification-v0.3`；`cordis-semantic-mirror-design-v0.3`；`cordis-semantic-mirror-poc-v0.2`

本设计给出三项可执行、可修改、可盲评的 Agent 任务，以及 Native 与 Relational 两种 Agent-facing interface 的配对 A/B 方案。它不声称 relational interface 已降低 Agent reasoning complexity。它只把该主张变成下一步可以失败的实验。

本轮停在设计阶段。本文定义任务、接口、oracle、评分和实现切片，但不改 Cordis、dsh 或现有 PoC。

---

# 1. Result

**PASS**

当前证据足以冻结 ontology 和三个 fixed query，并进入 Agent utility 实验设计。选定方案采用 **augmentation A/B**：两组 Agent 都保留相同的 native inspection、源码、编辑、测试和 lifecycle action；Experimental 组额外获得同一 live state 上的 read-only semantic query service。

三项任务承担不同的判别作用：

| Task | 主要危险 | 预期实验作用 |
|---|---|---|
| T1 Provider withdrawal with an unowned external effect | direct-only impact；把 unobserved 当 absent | 检验跨层定位、UNKNOWN 纪律和最小修复 |
| T2 Misreported provider during LOADING replacement | collapse target/committed | 检验非稳定时态 truth 与 observer 修改 |
| T3 Failed dynamic-package update | currentPackageId ⇒ active run | 检验恢复与 self-modification；同时作为 negative control |

T3 是刻意保留的负向对照。现有 dsh `cordis_inspect_self` 已经在一个 native tool result 中分别给出 `state`、`currentPackageId`、`nextPackageId` 和 `activeRun`，系统提示也明确说明失败更新不会自动重启旧版本。若 Relational 组在 T3 上没有优势，但在 T1/T2 上有优势，结论应是“semantic mirror 对原生接口缺少统一 truth surface 的领域有针对性价值”，而不是实验失败。

---

# 2. Grounding

## 2.1 Material claims

| ID | Claim | Class | Source anchor |
|---|---|---|---|
| C01 | 同一 pre-specified relational substrate 已在三个 distinct lifecycle phenomena 上通过 differential runtime validation | DERIVED | semantic ABI v0.3 §6.7–6.9；design v0.3 §7.6–7.8 |
| C02 | 尚无 Agent native-vs-D 对照，因而不能声称 reasoning complexity reduction | AUTHORITATIVE | 用户分析；semantic ABI v0.3 §2.4；design v0.3 §8.5 |
| C03 | `impact_remove` 一次返回跨 Fiber、Reflect、binding、effect 和 coverage 的结果 | DERIVED | PoC `impact-query.mjs`；`artifacts/impact-remove.json` |
| C04 | LOADING cut 中 target provider 可以是 v2，而 committed provider 仍是 v1 | DERIVED | PoC Scenario 2；Cordis `Fiber._store` / `Fiber.store` |
| C05 | failed update 后 `currentPackageId` 可以保留 last successful package，而 `activeRun` 缺失 | DERIVED | dsh `versioning.spec.ts`；PoC Scenario 3 |
| C06 | 现有 native model-facing dsh tool 已分别呈现 current、next、active 和 failed state | DERIVED | `tool-cordis/src/index.ts::selfSummary/selfState`；`src/prompt.ts` |
| C07 | Cordis-tracked effect metadata 不能证明 filesystem、network、timer 或其他 external-world inverse 已发生 | DERIVED | semantic ABI v0.3 `external_effect_truth=unavailable` |
| C08 | 当前 PoC query 是 read-only shadow；Cordis/dsh 仍是 executor | DERIVED | design v0.3 HD02–HD10 |
| C09 | Specific Issue Skill 要求先形成 failure witness 与设计 delta；Artifact Skill 的 CHANGE stage 才执行 write-back | AUTHORITATIVE | issue/artifact normalization prompts |
| C10 | 英文 task card 应使用具体、主动、平行且简洁的表达 | AUTHORITATIVE | `elements-of-style.md` Rules 10, 12, 13, 15 |

## 2.2 Normalized conflicts

| Surface conflict | Normalization |
|---|---|
| “同样底层能力”与“Experimental 主要通过 D” | 两组保留相同 native/read/write/test 能力；Experimental 只增加 semantic query。实际是否采用 query 也成为观测量。 |
| “一个 query 少 tool calls”与“query schema/result 也消耗 token” | 同时报 gross tokens、trajectory tokens、tool-result bytes 和 calls；不以 calls 单指标判胜。 |
| “真实任务”与“需要可控 ground truth” | 使用 pinned real Cordis/dsh runtime 与正式 lifecycle APIs；只在 benchmark-owned consumer/status adapter/dynamic package 中注入缺陷。 |
| “修改任务”与 Issue Skill 默认 design-only | 每次 run 固定为两个 user turns：Turn 1 诊断与 \(D^*,\Delta\)；Turn 2 使用统一批准语句进入 Artifact/CHANGE。 |
| “同一个 Agent”与 paired run 污染 | 使用同一 model snapshot/configuration，但每个 arm 都在 fresh conversation 和 fresh worktree 中运行。 |

## 2.3 Advisory challenges

1. 不应把 Raw-only 与 Semantic-only 作为主要 A/B。排除 native tools 会同时改变能力集、故障恢复路径和可验证性，无法把差异归因于 semantic interface。
2. 不应把现有 `clock` 三场景原样交给 Agent。现有文档、命名和输出可能造成记忆或字符串匹配。主实验使用同构但重新命名、重新布置故障位置的 seeds。
3. 不应以 Task 3 的 null effect 否定 mirror。Task 3 的 native product tool 已经做了一次局部 semantic normalization；它用于检测 semantic query 是否只是在重复一个良好专用接口。
4. 不应把 patch test pass 等同于 diagnosis correct。Agent 可能偶然修对代码，却仍错误陈述 runtime truth。实验必须分别评分 truth、delta、implementation 和 epistemic discipline。

## 2.4 Unknowns

- Agent 是否会主动调用额外的 semantic query；
- fixed query schema 的 prompt cost 是否抵消 trajectory savings；
- 不同 model snapshot 或 reasoning effort 下的效应是否稳定；
- 12 paired seeds/task 是否足以给出窄置信区间；
- benchmark fixture 上的收益能否迁移到真实开放式 Issue；
- live collector 作为 Agent tool 时的 capture overhead 与 failure behavior；
- human reviewer 对因果解释的一致性。

---

# 3. Semantic Contract

令本实验设计为：

\[
M_E=(D_E,H_E,\mathbf J_E,R_E,A_E,N_E).
\]

## 3.1 \(D_E\)

只保留能改变实验有效性、任务可判定性或 gate 结论的 facts：

~~~text
source_revision("cordis", "00278924a984fedfaffb4bc3d5eb7d8e76215643").
source_revision("dsh", "49a606bc5b5934603f22a26957a07dc799ab0291").
semantic_abi("cordis-relational-reification-v0.3").
prototype("cordis-semantic-mirror-poc-v0.2").

arm("native").
arm("relational_augmented").
same_capability("source_read").
same_capability("native_inspection").
same_capability("artifact_edit").
same_capability("test_execution").
same_capability("authorized_lifecycle_action").
extra_capability("relational_augmented", "read_only_semantic_query").

task("t1", "provider_withdrawal_external_effect_leak").
task("t2", "loading_replacement_status_misreport").
task("t3", "failed_dynamic_update_restore_and_repair").

fixed_query("impact_remove").
fixed_query("explain_binding_divergence").
fixed_query("explain_dynamic_package_state").

oracle("independent_native_runtime_and_hidden_tests").
authority("cordis_and_dsh", "executor").
authority("relational_state", "read_only_shadow").
~~~

## 3.2 Hard constraints \(H_E\)

| ID | Constraint |
|---|---|
| HE01 | 在生成任何 main-run result 前冻结 v0.3 predicate ABI、collector semantics 和三个 query algorithms。 |
| HE02 | paired runs 使用相同 model snapshot、reasoning effort、common prompt、Skill、task seed、预算和 starting artifact bytes。 |
| HE03 | 两组具有完全相同的 native inspection、source、edit、test 和 lifecycle action；只有 Experimental 增加 read-only semantic query。 |
| HE04 | 每个 pair 的起始 runtime state、source tree 和 hidden oracle 必须具有相同 content hash。 |
| HE05 | lifecycle mutation 只通过正式 Cordis/dsh API；benchmark 不直接改 native runtime internals。 |
| HE06 | semantic query 只读 committed or explicitly marked in-flight snapshot，且不得执行其建议的 recovery action。 |
| HE07 | native comparator 和 hidden tests 不调用 relational query，也不共享 query implementation。 |
| HE08 | Agent 不得看到 v0.3 reification/design、旧 scenario reports、reference patch、hidden tests 或 evaluator rubric。 |
| HE09 | Turn 1 禁止 artifact write-back；两组收到同一句 Turn 2 approval 后才能修改。 |
| HE10 | 主实验不提供人工提示；所有 failure 先按原始结果计分。 |
| HE11 | strong absence 只在对应 domain coverage 为 complete 时成立；其他 absence 必须输出 UNKNOWN。 |
| HE12 | 每个 run 保存完整 tool trajectory、token usage、tool-result bytes、timestamps、patch 和 test results。 |
| HE13 | reviewer 在不知道 arm 的情况下评分 diagnosis；hidden tests 自动评分 implementation。 |
| HE14 | 任一 arm 都不得修改 Cordis core、dsh runner core 或固定 query 来通过 task。 |
| HE15 | \(P_0\) 不变；项目事实仍只进入 \(D\)。 |

## 3.3 Objectives \(\mathbf J_E\)

按优先级排序：

1. 测量 end-to-end task correctness 的变化；
2. 测量 critical semantic errors 的变化；
3. 测量获得正确结果的 observation calls、tokens、bytes 和 elapsed time；
4. 区分 representation value、query ergonomics 和额外 capability 的影响；
5. 保持 task realism、oracle independence 和 paired reproducibility；
6. 以最少新代码形成可重复运行的 benchmark；
7. 保留 null、targeted benefit 和 regression 三种诚实结论。

## 3.4 Regularization \(R_E\)

- 只使用三个现有 lifecycle phenomena；
- 不增加 ontology predicate；
- 不增加第四个 semantic query；
- 每项任务只注入一个 primary defect；
- 每个 seed 只改变名称、数据值、decoy 位置和允许的故障参数，不改变任务难度类别；
- 所有 production repositories 保持只读；
- source patch 只进入独立 benchmark worktree；
- 不接入 bounded checker、runtime authority 或 production persistence；
- 不把 prompt engineering 变化混入 interface treatment。

## 3.5 Assumptions \(A_E\)

| ID | Assumption |
|---|---|
| AE01 | pinned Cordis/dsh revisions 与当前 PoC collector anchors 一致。 |
| AE02 | 每个 fixture 的 reachable domains 足以声明 task-specific complete coverage。 |
| AE03 | deterministic scheduler gates 可以稳定重现 T2 的 LOADING cut。 |
| AE04 | fake clock 只替代 wall-clock nondeterminism，不替代 Cordis lifecycle。 |
| AE05 | model API 返回准确的 input/output/cache token accounting。 |
| AE06 | fresh conversations 消除同一 run 之间的 conversational memory。 |
| AE07 | 同一 model snapshot 的剩余 stochasticity 可由 paired seeds 和预注册分析吸收。 |

## 3.6 Non-goals \(N_E\)

- 证明所有 Agent、模型或代码库都受益；
- 证明一般 lifecycle coverage；
- 证明 bounded model-checking correctness；
- 证明 external-world inverse correctness；
- 把 \(D\) 变成 runtime authority；
- 重写 Cordis runtime；
- 评估 UI、browser、approval race 或 multi-process identity；
- 以 benchmark 分数选择或训练模型。

## 3.7 Slice boundary

实验 slice 包含：

- Registry/Fiber/Reflect/service binding/tracked effect；
- one in-flight LOADING cut；
- dsh dynamic package/current/next/run/latest attempt；
- benchmark-owned external timer witness；
- 三个 fixed semantic queries；
- native inspection adapters；
- artifact edit、test 和 authorized runtime actions；
- Agent trajectory telemetry 与 independent grading。

它排除其他 Cordis subsystems、arbitrary JavaScript verification、network/filesystem effects、production sessions、Client half 和 approval flow。

---

# 4. Baseline and Gap Witness

## 4.1 Current baseline \(D_0\)

v0.3 已有：

- source-grounded semantic ABI；
- actual live and in-flight snapshots；
- three fixed fact-only queries；
- independent native comparators；
- actual transition validation；
- bounded interface-compression counts。

v0.3 没有：

~~~text
absence("agent_facing_query_service").
absence("paired_agent_runs").
absence("agent_task_success_measurement").
absence("agent_semantic_error_measurement").
absence("agent_token_and_tool_trajectory_measurement").
~~~

## 4.2 Gap witness

当前可以确定：

\[
query(D)=native\ oracle
\]

但不能确定：

\[
Agent(native + query)
\stackrel{?}{>}
Agent(native).
\]

同一个 `impact_remove` result 可能减少五域 bookkeeping，也可能只增加 schema 和 result tokens；同一个 `explain_dynamic_package_state` 可能帮助 Agent，也可能完全重复 `cordis_inspect_self`。没有 paired trajectory、structured diagnosis、patch 和 hidden-test result，任何 Agent utility 结论都仍是 UNKNOWN。

---

# 5. Candidate Experiment Designs

| Candidate | Arms | Strength | Counterexample / risk | Decision |
|---|---|---|---|---|
| A. Interface replacement | Native-only vs Semantic-only | treatment contrast 大 | Semantic-only 缺少 native fallback；差异混入 capability removal | Reject as primary |
| B. Native vs Relational augmentation | Native vs Native + semantic query | 只增加目标 interface；可观察自发 adoption | improvement 可能较小；schema cost 真实存在 | **Select** |
| C. Precomputed report injection | Native vs native + pasted query report | 实现最便宜 | 不测 live capture、tool choice 或 query service；容易泄漏答案 | Reject |
| D. Multi-model benchmark | 多模型 × 两 arms | 外部效度更高 | 在第一 gate 前增加成本并混入 model variance | Defer |

## 5.1 Counterexample search

### Counterexample A: Experimental wins only because it has more facts

Mitigation: Native arm retains raw access to every fact from which the query derives its answer. A pre-run equivalence test confirms that the semantic answer is derivable from that native state.

### Counterexample B: Experimental prompt directly states the hidden answer

Mitigation: The query tool description names operations and fields but does not include task-specific outcomes. Task-specific values appear only after a live query. The common Skill and task card remain byte-identical across arms.

### Counterexample C: Agent solves the familiar `clock` demo by memory

Mitigation: Main seeds never use `clock`, `clockView`, `clock-ui`, `pkg-1`, or the old report text. The agent workspace excludes previous semantic documents and artifacts.

### Counterexample D: A/B sees different in-flight states

Mitigation: Each arm runs from a frozen seed image and a deterministic scheduler gate. The controller records source hash, fixture seed, pre-state fact hash, and native-state hash before exposing the task.

### Counterexample E: Hidden grader depends on the semantic query

Mitigation: The evaluator boots a fresh runtime, uses official actions, reads native outcomes, and runs behavior tests. It never imports collector or query modules.

### Counterexample F: T3 shows no improvement

Interpretation: T3 is expected to have a high native baseline. A null T3 result supports the narrower claim that a good purpose-built native tool can already provide a semantic truth layer.

No further counterexample was found within the modeled states, boundaries, and assumptions.

---

# 6. Selected Design \(D^*\)

## 6.1 Treatment arms

### Native arm \(A_N\)

The Agent receives:

- pinned repository source and task fixture;
- the shared minimal normalization reference;
- the Specific Issue Skill on Turn 1;
- the Artifact CHANGE Skill after Turn 2 approval;
- raw native observation tools;
- identical shell, edit, test, and lifecycle-action capabilities;
- the exact public task card.

### Relational-augmented arm \(A_R\)

The Agent receives everything in \(A_N\), plus one read-only `software_semantic_query` tool backed by the frozen v0.3 collector and query code.

The experiment does not require the Agent to use this tool. Query adoption, fallback to native inspection, and redundant double-checking are measured outcomes.

## 6.2 Native observation surface

Both arms receive the same operations:

| Operation | Raw result | Computation deliberately omitted |
|---|---|---|
| `native_list_fibers` | fiber IDs, names, states, parents, declared injections | no impact closure |
| `native_inspect_fiber` | target store, committed store, effect metadata for one fiber | no target/committed interpretation |
| `native_list_services` | registered implementation, provider, realm, visibility | no consumer traversal |
| `native_event_slice` | ordered internal lifecycle events | no causal summary |
| `cordis_inspect_self` | existing dsh plugin/package/run inspection | no relational translation |

These adapters serialize native structures without joining domains. They provide a usable baseline and avoid forcing the Agent to author ad hoc instrumentation before diagnosis.

Each observation accepts an optional immutable checkpoint ID. For a past checkpoint, the controller returns the raw native fields captured at that cut; for the current checkpoint, it reads the paused live objects. Both arms receive the same checkpoint inventory. This lets T1 inspect the pre-retirement state and T2 inspect the preserved LOADING cut without asking the Agent to reconstruct lost objects.

## 6.3 Semantic query surface

Experimental receives one tool with three frozen operations:

~~~json
{
  "query": "impact_remove | explain_binding_divergence | explain_dynamic_package_state",
  "subject": {
    "snapshotId": "optional pinned checkpoint",
    "serviceImplId": "for impact_remove",
    "fiberId": "for explain_binding_divergence",
    "serviceKey": "for explain_binding_divergence",
    "pluginId": "for explain_dynamic_package_state"
  }
}
~~~

The service may resolve an unambiguous task-supplied alias to a canonical ID. Ambiguity returns candidates and requires the Agent to select; it never silently guesses.

Every response contains:

- `snapshotId` and snapshot phase;
- the existing query result facets;
- `coverage` and `unknowns`;
- provenance paths to ground facts;
- no mutation receipt;
- no claim about external effects beyond coverage.

The service captures or reads one immutable snapshot, calls the existing function, and returns the result. It cannot call `Fiber.dispose`, `runner.run`, define a package, edit a file, or release a scheduler gate.

## 6.4 Common two-turn Skill protocol

Each run uses the same two turns.

### Turn 1: ISSUE / design delta

The Agent applies the Specific Issue normalization procedure, reproduces or inspects the witness, and returns \(D_0\), `BadState`, candidates, \(D^*\), \(\Delta\), unknowns, and a verification plan. It does not edit files or execute repair actions.

Every Turn 1 answer ends with this machine-readable record:

~~~json
{
  "status": "PASS | SPEC_GAP | SEMANTIC_REGRESSION",
  "runtime_truth": [],
  "derived_causes": [],
  "unknowns": [],
  "failure_witness": {
    "initial": [],
    "actions": [],
    "bad_state": []
  },
  "selected_delta": {
    "delete": [],
    "insert": []
  },
  "verification_obligations": []
}
~~~

### Turn 2: ARTIFACT / CHANGE

The controller sends this exact message in both arms:

> The proposed semantic delta is approved for this isolated benchmark fixture. Implement it, run the required checks, and report the implementation-to-design comparison. Do not expand the approved scope.

The Agent may now edit benchmark-owned files or execute the task-authorized lifecycle actions. It ends with:

~~~json
{
  "implementation_status": "PASS | IMPLEMENTATION_DEVIATION | SEMANTIC_REGRESSION",
  "files_changed": [],
  "lifecycle_actions": [],
  "checks": [],
  "final_runtime_truth": [],
  "remaining_unknowns": []
}
~~~

## 6.5 Semantic delta from v0.3

\[
\Delta_E=(Del_E,Ins_E).
\]

Delete:

~~~text
absence("agent_facing_query_service").
absence("paired_agent_runs").
absence("agent_utility_measurement").
~~~

Insert after implementation and execution:

~~~text
service("software_semantic_query", "read_only").
benchmark_task("t1").
benchmark_task("t2").
benchmark_task("t3").
paired_seed_count_per_task(12).
agent_run_count(72).
measurement("end_to_end_pass").
measurement("critical_semantic_error").
measurement("observation_calls").
measurement("gross_tokens").
measurement("tool_result_bytes").
measurement("standardized_corrections").
~~~

These insertions are design obligations, not current facts.

---

# 7. Task T1 — Provider Withdrawal with an Unowned External Effect

## 7.1 Task role

类型：diagnosis + source modification  
Primary query：`impact_remove`  
Primary test：跨层影响闭包、coverage/UNKNOWN、最小 effect-ownership repair

## 7.2 Exact public task card

Turn 1 uses the following English text; seed interpolation changes only bracketed identifiers:

> A Cordis process retires service implementation `[serviceImplAlias]`. A callback labeled `[orphanLabel]` continues after the retirement completes. Diagnose the complete affected plugin chain and the ownership defect. Distinguish observed Cordis-tracked cleanup from external-effect truth, then propose the smallest repair. Preserve the unrelated plugins and do not modify Cordis core. Stop after the semantic design delta; do not edit files yet. The fixture controller and permitted inspection tools are available under incident `[incidentId]`.

## 7.3 Author-private fixture

Each seed boots a real Cordis process with this logical topology:

\[
provider\ P
\to direct\ consumer\ C_1
\to derived\ service\ S_2
\to transitive\ consumer\ C_2.
\]

The fixture also boots one unrelated provider/consumer branch as a decoy. Exactly one impacted consumer schedules a repeating callback outside `ctx.effect()` and never returns a disposer. The scheduler uses a deterministic fake clock, but plugin activation, service publication, dependency refresh, unload, and reload use real Cordis APIs.

The controller exposes a reproducible pre-retirement checkpoint and the post-retirement symptom. Main seeds vary:

- service, plugin, effect, and incident names;
- chain depth two or three;
- whether the leak sits in the direct or transitive consumer;
- unrelated decoy location;
- callback payload values.

They do not vary the required semantic distinction.

## 7.4 Minimal issue slice

~~~text
selected_service_impl(P_impl).
service_impl_provider(P_impl, P).
required_consumer(C1, P_impl).
provided_service(C1, S2_impl).
required_consumer(C2, S2_impl).
tracked_effect_domain_complete.
external_effect_truth_unavailable.
external_callback_observed_after_retirement(C_leak, Label).
unrelated_branch(U1, U2).
~~~

## 7.5 Failure witness

\[
D_0
\xRightarrow{dispose(P)}
\left(
P=DISPOSED,
C_1=PENDING,
C_2=PENDING,
external\ callback=ACTIVE
\right).
\]

Cordis lifecycle behavior is correct. The benchmark-owned consumer violates effect ownership.

## 7.6 Expected selected delta

The reference repair changes only the leaking consumer. It registers the repeating callback inside `ctx.effect()` and returns its cancellation function. It neither edits Cordis core nor adds lifecycle rules.

Relationally:

~~~text
delete(unowned_external_effect(LeakingFiber, Callback)).
insert(owned_effect(LeakingFiber, Callback)).
insert(effect_inverse(Callback, CancelCallback)).
~~~

Equivalent minimal implementations may pass; the grader checks behavior, not textual identity.

## 7.7 Hidden oracle and checks

The independent evaluator asserts:

1. the diagnosis includes every direct and transitive affected fiber;
2. the diagnosis excludes the unrelated branch;
3. the diagnosis does not claim external cleanup from tracked-effect metadata alone;
4. provider disposal makes the selected service invisible;
5. impacted Cordis fibers reach their expected post-state;
6. advancing the fake clock after disposal produces no new orphan callbacks;
7. the callback disposer runs exactly once;
8. the unrelated branch remains active;
9. the patch does not touch Cordis or dsh core;
10. the focused regression test passes from a clean fixture.

## 7.8 Critical semantic errors

- `E_DIRECT_ONLY`: reports only \(C_1\), omitting \(C_2\);
- `E_ABSENCE_WITHOUT_COVERAGE`: treats unobserved external cleanup as proof of absence;
- `E_TRACKED_EQUALS_EXTERNAL`: claims Cordis-tracked effect disposal proves the timer stopped;
- `E_CORE_PATCH`: changes Cordis lifecycle to fix a consumer ownership bug;
- `E_DECOY_DAMAGE`: modifies or unloads the unrelated branch.

## 7.9 Why T1 is informative

T1 prevents a cheap “one query gives the answer” victory. `impact_remove` should narrow the source search and preserve provenance, but its `external_effect_truth=unavailable` result forces the Agent to inspect code and validate the real callback. A strong Experimental result therefore requires both semantic compression and correct epistemic restraint.

---

# 8. Task T2 — Misreported Provider During LOADING Replacement

## 8.1 Task role

类型：diagnosis + observer modification  
Primary query：`explain_binding_divergence`  
Primary test：non-quiescent truth、target/committed separation、no lifecycle rewrite

## 8.2 Exact public task card

> During a hot replacement, `[statusAdapter]` reports provider `[providerV2]` as serving consumer `[consumer]`, but the consumer's paused work still uses `[providerV1]`. Reproduce the paused LOADING state, determine the provider committed to the current consumer session and the provider selected for the next reload, then propose the smallest status-adapter repair. Preserve Cordis lifecycle behavior and do not wait for the transition to disappear. Stop after the semantic design delta; do not edit files yet. Use checkpoint `[checkpointId]`.

## 8.3 Author-private fixture

The fixture reuses the real Scenario 2 lifecycle shape with new names and values:

1. provider v1 becomes ACTIVE;
2. an injected consumer starts async `apply` and pauses on a deterministic gate;
3. v1 disposal starts;
4. provider v2 publishes the same service key;
5. Cordis refreshes the consumer target while its current apply remains committed to v1;
6. the controller freezes the process before releasing the first apply;
7. a benchmark-owned status adapter incorrectly labels the target provider as the serving provider.

The adapter already has a stable output object with three fields:

~~~json
{
  "servingProviderId": "...",
  "targetProviderId": "...",
  "transitioning": false
}
~~~

The seeded defect populates both IDs from the target store and therefore sets `transitioning` to false.

## 8.4 Minimal issue slice

~~~text
fiber_state(Snap, Consumer, "loading").
target_binding(Snap, Consumer, Service, ProviderV2Impl).
committed_binding(Snap, Consumer, Service, ProviderV1Impl).
provider_identity(ProviderV1Impl, ProviderV1).
provider_identity(ProviderV2Impl, ProviderV2).
status_adapter_reads_target_for_both_fields.
~~~

## 8.5 Failure witness

At the frozen checkpoint:

\[
target=v_2,
\qquad committed=v_1,
\qquad state=LOADING.
\]

The bad adapter returns:

\[
serving=v_2,
\qquad target=v_2,
\qquad transitioning=false.
\]

The adapter contradicts the native Fiber stores and the consumer's current session.

## 8.6 Expected selected delta

The reference design leaves Cordis unchanged and maps:

~~~text
servingProviderId <- committed_binding.
targetProviderId <- target_binding.
transitioning <- targetProviderId != servingProviderId.
~~~

When coverage cannot establish one binding, the adapter returns an explicit unknown status instead of copying the other field.

## 8.7 Hidden oracle and checks

The evaluator asserts:

1. the Agent captures rather than waits away the LOADING cut;
2. Turn 1 states `serving=v1`, `target=v2`, and `transitioning=true`;
3. the patch reads committed and target stores separately;
4. the frozen-checkpoint status object matches the independent native oracle;
5. releasing the gate produces `ACTIVE`, `serving=v2`, `target=v2`, and `transitioning=false`;
6. the v1 consumer session disposes before final convergence;
7. missing/incomplete binding observation yields unknown, not a fabricated provider;
8. no Cordis scheduler, Fiber, Reflect, or query code changes;
9. quiescent pre-replacement behavior remains unchanged;
10. focused in-flight and convergence tests pass.

## 8.8 Critical semantic errors

- `E_BINDING_COLLAPSE`: reports target and committed as one provider;
- `E_LOADING_MEANS_NONE`: assumes LOADING has no committed session;
- `E_WAIT_AWAY`: releases or waits past the only failing checkpoint before diagnosis;
- `E_UNKNOWN_COPY`: fills a missing binding with the observed other binding;
- `E_LIFECYCLE_REWRITE`: changes Cordis timing to make the status adapter look correct.

## 8.9 Why T2 is informative

T2 tests the strongest semantic distinction discovered by the reification. The task cannot be solved reliably from a quiescent snapshot, and a final-state-only test would miss the bug. The Agent must reason about an actual temporal cut and then change only the observer.

---

# 9. Task T3 — Failed Dynamic Update: Restore, Then Repair

## 9.1 Task role

类型：runtime diagnosis + authorized recovery + immutable package modification  
Primary query：`explain_dynamic_package_state`  
Primary test：last-successful/active-run separation、action ordering、same-plugin repair  
Experimental role：negative control against an already strong native tool

## 9.2 Exact public task card

> Session-owned dynamic Plugin `[pluginId]` stopped serving after an attempted update. Restore the last known good behavior first, then repair the failed source as a new immutable Package under the same Plugin. Do not create a replacement Plugin or overwrite an existing Package. In this turn, inspect the runtime, distinguish the last successful Package, the failed target, and the actual active Run, and propose the exact recovery and repair sequence. Stop before taking lifecycle actions.

## 9.3 Author-private fixture

Each seed uses the real dsh host runner:

1. define and run a valid host-only package \(v_1\);
2. define \(v_2\) under the same plugin;
3. update to \(v_2\);
4. fail \(v_2\) during host activation;
5. retain `currentPackageId=v1` and `nextPackageId=v2`;
6. expose `activeRun` as absent with complete inventory coverage.

The fixture includes a second stopped or running plugin as a decoy. Seeds vary plugin IDs, package numbers, method names, and one of several activation failures. They preserve the same update semantics.

## 9.4 Minimal issue slice

~~~text
last_successful_package(Snap, Plugin, V1).
next_package(Snap, Plugin, V2).
latest_attempt_status(Snap, Plugin, "failed").
absence_fact(Snap, "active_run", Plugin).
domain_coverage(Snap, "dynamic_package_inventory", "complete").
immutable_package(V1).
immutable_package(V2).
~~~

## 9.5 Failure witness

\[
run(v_1)
\to update(v_2) fails
\to
\left(
last\ successful=v_1,
failed\ target=v_2,
active\ run=\varnothing
\right).
\]

The bad inference is:

\[
currentPackageId=v_1
\Rightarrow v_1\ is\ running.
\]

## 9.6 Expected Turn 2 action sequence

The accepted sequence is:

1. execute `run(v1, mode="run")` to restore service;
2. verify an active run of v1 and the restored behavior;
3. inspect the exact failed v2 source and diagnostic;
4. define corrected source as a fresh immutable v3 under the same plugin;
5. execute `run(v3, mode="update")`;
6. verify `current=v3`, `active=v3`, `next=none`, and correct behavior.

The Agent may choose a different minimal code repair for v3 if it satisfies the package contract and hidden behavior test.

## 9.7 Hidden oracle and checks

The evaluator asserts:

1. Turn 1 states last-successful v1, failed target v2, and no active run;
2. the Agent rejects `currentPackageId ⇒ activeRun`;
3. the first mutating action is explicit `run(v1, mode="run")`;
4. recovery actually restores the v1 service before repair work continues;
5. the Agent inspects v2 source and diagnostics;
6. the Agent defines v3 under the original plugin ID;
7. no existing package source is overwritten;
8. final state has current and active v3 with no next target;
9. the dynamic service passes its behavioral probe;
10. the decoy plugin remains unchanged.

## 9.8 Critical semantic errors

- `E_CURRENT_IS_ACTIVE`: claims v1 is running because it is current;
- `E_WRONG_ROLLBACK_MODE`: uses `update` rather than explicit `run` for v1 recovery;
- `E_REPAIR_BEFORE_RESTORE`: leaves the service down while attempting v3 first;
- `E_NEW_PLUGIN`: creates a replacement plugin instead of a new package version;
- `E_OVERWRITE_VERSION`: edits an immutable package in place;
- `E_DECOY_ACTION`: stops or updates the wrong plugin.

## 9.9 Why T3 is informative

T3 enters real Agent self-modification state reasoning, but the native baseline is already unusually good. A relational advantage here would be strong evidence. A tie would show that the semantic need can also be met by a carefully designed purpose-specific native tool. Both outcomes are useful.

---

# 10. Seed Design and Leakage Control

## 10.1 Paired seeds

Each task uses 12 paired seeds. A pair shares the same generated fixture bytes and starting runtime state; one fresh run receives Native and the other receives Relational augmentation.

Total main runs:

\[
3\ tasks\times 12\ seeds\times 2\ arms=72\ Agent\ runs.
\]

The first two seed pairs per task form a pilot. Their results remain in the final dataset only if no prompt, tool schema, task contract, scoring rule, timeout, or fixture behavior changes after inspection. Any change invalidates and reruns the pilot.

## 10.2 Seed invariants

Every generator enforces:

- identical semantic difficulty within a task family;
- one primary defect;
- at least one decoy;
- stable official lifecycle path;
- complete coverage for facts used as strong absence;
- no familiar names from the original PoC;
- deterministic expected outputs;
- one reference repair/action trace that passes all hidden checks.

## 10.3 Workspace separation

Each run receives:

- a fresh conversation;
- a fresh benchmark worktree;
- a fresh runtime process;
- a task-scoped output directory;
- no network access unless the common task explicitly requires it;
- no access to author-private fixture generators, oracle code, reference patches, prior run logs, or v0.3 reports.

The evaluator retains the hidden half outside the Agent-readable tree.

## 10.4 Randomization

- Randomize arm order inside each pair.
- Counterbalance task order with a Latin square when a runner account executes several sessions.
- Mint run IDs before execution.
- Blind reviewers to arm, seed, query adoption, and tool counts.
- Freeze the analysis script and gate thresholds before unblinding.

---

# 11. Instrumentation

## 11.1 Per-run event log

Record append-only events:

~~~text
run_started.
prompt_tokens(input, cached, output).
tool_called(name, category, input_bytes).
tool_returned(name, output_bytes, duration_ms, status).
file_read(path, bytes).
file_changed(path, added_lines, deleted_lines).
test_executed(command_id, status, duration_ms).
lifecycle_action(kind, subject, mode, receipt).
turn_completed(turn_number, duration_ms).
run_completed(status).
~~~

Do not record or expose secrets. Hash artifact bytes and store source-relative paths.

## 11.2 Tool categories

Classify calls before execution:

- `OBSERVE_NATIVE`;
- `OBSERVE_RELATIONAL`;
- `READ_SOURCE`;
- `EDIT_ARTIFACT`;
- `RUN_CHECK`;
- `MUTATE_FIXTURE`;
- `OTHER`.

This prevents one semantic query and one broad shell command from appearing equivalent merely because each counts as one call.

## 11.3 Token accounting

Report both:

1. **Gross tokens:** every input, tool schema, tool result, cached input, and output token charged or processed by the model interface;
2. **Trajectory tokens:** task turns, tool inputs/results, and model outputs after the identical common prefix.

Gross tokens determine actual operational cost. Trajectory tokens explain where the interface changes that cost. Never subtract the Relational tool schema from the primary cost measure.

## 11.4 State parity record

Before Turn 1, persist:

~~~json
{
  "taskSeed": "...",
  "sourceTreeHash": "...",
  "fixtureDefinitionHash": "...",
  "nativeStateHash": "...",
  "relationalFactHash": "...",
  "modelSnapshot": "...",
  "reasoningEffort": "...",
  "commonPromptHash": "..."
}
~~~

A pair with mismatched source, fixture, native state, model, effort, or common prompt is invalid and must be rerun.

---

# 12. Scoring

## 12.1 Primary outcomes

1. **End-to-end PASS:** Turn 1 semantic truth contains no critical error, the approved delta matches the task contract, and Turn 2 passes every mandatory hidden check.
2. **Critical semantic error rate:** number of task-specific `E_*` errors per run and proportion of runs with at least one.

Correctness precedes efficiency. A shorter failed trajectory never counts as an improvement.

## 12.2 Secondary outcomes

- successful-run observation calls;
- unique native domains inspected;
- source files opened before the correct diagnosis;
- gross and trajectory tokens;
- tool-result bytes;
- time to first correct structured runtime truth;
- total wall time;
- patch lines and files;
- unnecessary lifecycle mutations;
- semantic query adoption and fallback rate;
- redundant observation after a complete query;
- standardized correction count in the assisted follow-up.

## 12.3 Structured diagnosis score

Blind reviewers score 100 points:

| Dimension | Points |
|---|---:|
| runtime truth | 25 |
| causal/failure witness | 15 |
| selected semantic delta | 20 |
| implementation or action fidelity | 25 |
| verification quality | 10 |
| provenance, UNKNOWN, and scope discipline | 5 |

Any critical semantic error caps the score at 59. Editing prohibited core files or taking an unauthorized lifecycle action makes End-to-end PASS false regardless of total points.

## 12.4 Automated and human grading split

Automated grading owns:

- runtime state and action order;
- hidden tests;
- file-scope constraints;
- token, tool, time, and patch metrics;
- machine-readable field consistency.

Blind human grading owns only:

- causal explanation quality;
- whether the selected delta follows from stated evidence;
- whether remaining uncertainty is expressed accurately.

Two reviewers independently score at least 20% of runs before unblinding. If their weighted agreement is below the preregistered threshold, clarify the rubric and rescore all affected runs without changing task outcomes.

## 12.5 Standardized correction ladder

Primary runs receive no correction. After primary scoring, failed runs may enter a separate assisted analysis using at most two fixed prompts:

1. `One runtime claim conflicts with the available evidence. Re-inspect the relevant state and revise the diagnosis.`
2. `Your revision still violates one task invariant. Recheck identity, lifecycle phase, and observation coverage.`

Count how many prompts produce a correct diagnosis. Never mix assisted outcomes into primary PASS.

---

# 13. Analysis Plan

## 13.1 Paired comparisons

Use seed as the pairing unit. For each task and overall, report:

- paired End-to-end PASS table;
- paired difference in critical-error incidence;
- median paired difference and bootstrap interval for observation calls, gross tokens, trajectory tokens, bytes, and time;
- semantic query adoption rate;
- task-by-arm results, never only an aggregate.

Use an exact paired binary test for PASS and a paired permutation or bootstrap analysis for continuous/count outcomes. Report raw counts and intervals; do not let a p-value replace effect size.

## 13.2 Cost-to-success

Efficiency summaries use two views:

1. successful runs only, labeled as conditional;
2. all runs with failure reported separately, not converted into an invented token penalty.

This avoids rewarding an arm that quits early or produces a cheap wrong answer.

## 13.3 Operational thresholds

The 12 pairs in one task define its gate unit.

**No material regression** requires all of the following for that task:

- Relational has at most one fewer End-to-end PASS than Native;
- Relational has at most one additional run with a critical semantic error;
- Relational introduces no additional prohibited-core edit or unauthorized lifecycle action.

A task has a **material improvement** when no material regression occurs and at least one condition holds:

1. **Correctness:** the number of discordant pairs won by Relational minus the number won by Native is at least two;
2. **Semantic reliability:** Relational produces at least three fewer runs with a critical semantic error and does not reduce PASS;
3. **Burden:** at least six pairs pass in both arms, the median paired Relational/Native ratio is at most `0.75` for observation calls or at most `0.85` for trajectory tokens, and the median gross-token ratio is at most `1.05`.

An observation-call ratio uses only pairs in which Native made at least one observation call. The report must show the underlying paired values so zero denominators, outliers, or a small eligible subset cannot hide behind a ratio.

These thresholds are decision rules for this bounded gate, not estimates of a universal effect. Exact tests and intervals remain part of the report even when a threshold is crossed.

## 13.4 Predeclared interpretations

### Strong Agent utility

- every task satisfies no material regression;
- at least two tasks satisfy material improvement;
- at least one improved task satisfies the correctness or semantic-reliability condition, rather than burden alone; and
- across all 36 pairs, Relational gains at least four net discordant PASS pairs or reduces runs with critical semantic errors by at least 50%.

### Targeted Agent utility

- both T1 and T2 satisfy material improvement;
- T3 satisfies no material regression but does not need to improve; and
- the aggregate Strong threshold is not reached.

This result supports a semantic truth layer for raw Cordis lifecycle inspection while recognizing that `cordis_inspect_self` already solves much of T3.

### No demonstrated utility

- the Strong and Targeted conditions both fail; and
- no task violates the regression condition.

The report may note a query-specific signal, but it does not pass the Agent utility gate.

### Regression

- any task violates no material regression;
- Relational increases prohibited-core edits or unauthorized lifecycle actions; or
- Relational systematically converts coverage-limited UNKNOWN into unsupported certainty.

The final report must choose one of these four interpretations. It may not promote a bounded result into a general reasoning-complexity theorem.

---

# 14. Execution Plan

## M0 — Freeze and preregister

1. Pin source revisions, package lockfiles, model snapshot, reasoning effort, timeouts, common prompts, and Skill versions.
2. Copy the three existing query functions unchanged into a versioned benchmark dependency or import the frozen PoC package by content hash.
3. Freeze task contracts, outcome definitions, critical errors, sample count, exclusions, and analysis script.
4. Record that T3 is a negative control before seeing Agent results.

Exit gate: every frozen input has a hash; no main result exists.

## M1 — Implement the read-only query service and native adapters

1. Wrap collector + FactStore + three query functions behind one tool.
2. Implement the five raw native observation operations.
3. Give both surfaces the same runtime controller and snapshot checkpoints.
4. Enforce read-only behavior structurally: query/observation handlers receive no mutation capability.
5. Log request/result sizes, duration, snapshot ID, coverage, and provenance.

Exit gate: tool tests prove query handlers cannot mutate; raw native results deterministically derive the same three query answers.

## M2 — Implement three task families

1. Build seed generators and decoys.
2. Add public task cards outside the Agent source tree and author-private fixture definitions outside Agent access.
3. Add one reference repair/action trace per seed family.
4. Add visible reproduction checks and separate hidden acceptance tests.
5. Verify the unmodified seeded artifact fails for the intended reason and the reference delta passes.

Exit gate: each task has one primary defect, a stable witness, a passing reference solution, and no query-specific dependency in its grader.

## M3 — Validate causal parity

For every seed:

1. boot two clean runtime images;
2. compare source and fixture hashes;
3. compare native pre-state hashes;
4. capture \(D\) and compare each query with the independent native oracle;
5. validate that both arms can complete the task with the same reference delta;
6. destroy both images without carrying state forward.

Exit gate: all 36 seed definitions pass parity and differential checks.

## M4 — Pilot

Run two paired seeds per task, 12 runs total. Inspect only harness failures, floor/ceiling effects, timeout sufficiency, parser failures, and accidental answer leakage.

If any task, prompt, tool schema, metric, or grader changes, invalidate all pilot results and return to M0.

Exit gate: no infrastructure-induced failure; T1/T2 are neither impossible nor trivial; T3 remains a deliberate high-baseline control.

## M5 — Main execution

1. Mint and randomize all remaining runs before starting.
2. Run every session in a fresh conversation/worktree/process.
3. Apply identical per-task budgets across arms.
4. Send the standardized Turn 2 approval after collecting Turn 1.
5. Save immutable trajectories, patches, runtime receipts, and check results.
6. Retry only preregistered infrastructure failures; never retry model failures.

Exit gate: 72 valid primary runs or an explicit accounting of invalidated infrastructure runs and exact replacements.

## M6 — Blind scoring and analysis

1. Strip arm labels and tool names from reviewer packets.
2. Run automated graders and hidden tests.
3. Complete blind causal scoring.
4. Lock scores, then unblind.
5. Run the preregistered paired analysis.
6. Run the standardized correction ladder on primary failures as a separate dataset.

Exit gate: every run has a validity status, primary outcome, error labels, and cost record.

## M7 — Gate decision

Produce one conclusion:

- `STRONG_AGENT_UTILITY`;
- `TARGETED_AGENT_UTILITY`;
- `NO_DEMONSTRATED_AGENT_UTILITY`;
- `AGENT_UTILITY_REGRESSION`.

Only the first two justify productizing a read-only Agent-facing truth layer. Neither justifies runtime authority or a Cordis rewrite. `NO_DEMONSTRATED_AGENT_UTILITY` keeps the mirror as a diagnostic/research artifact. `AGENT_UTILITY_REGRESSION` stops integration until the interface or query outputs change and a new preregistered experiment is designed.

---

# 15. Planned Artifact Layout

Implementation should create a separate benchmark package, not modify the existing v0.2 evidence bundle in place:

~~~text
cordis-agent-interface-benchmark/
  README.md
  package.json
  benchmark-lock.json
  src/
    runtime-controller.mjs
    native-observation-tools.mjs
    semantic-query-tool.mjs
    telemetry.mjs
  tasks/
    t1-provider-withdrawal/
      public-task.mjs
      fixture-factory.mjs
      visible-test.mjs
    t2-loading-status/
      public-task.mjs
      fixture-factory.mjs
      visible-test.mjs
    t3-failed-update/
      public-task.mjs
      fixture-factory.mjs
      visible-test.mjs
  evaluator-private/
    hidden-tests/
    native-oracles/
    reference-deltas/
  runner/
    generate-seeds.mjs
    run-paired-session.mjs
    validate-parity.mjs
    score-run.mjs
    analyze-results.mjs
  artifacts/
    preregistration.json
    run-manifest.jsonl
    results.jsonl
    report.md
~~~

The distributed Agent workspace must exclude `evaluator-private/`, prior run artifacts, and this authoring document.

---

# 16. Behavior Accounting

## 16.1 Preserved

- Cordis remains the lifecycle executor;
- dsh runner remains the dynamic-package authority;
- the v0.3 semantic ABI and three query algorithms remain fixed;
- target and committed binding remain separate;
- last-successful package and active run remain separate;
- absence remains coverage-sensitive;
- queries remain read-only;
- \(P_0\) remains unchanged;
- Issue design and Artifact write-back remain separate stages.

## 16.2 Added by the future implementation

- one Agent-facing read-only query tool;
- raw native inspection adapters with equivalent underlying state access;
- three seeded real-runtime task families;
- paired Agent runner;
- telemetry, blind grading, hidden runtime tests, and preregistered analysis;
- a negative control that can reveal an unnecessary semantic wrapper.

## 16.3 Intentionally not added

- new predicates or query kinds;
- direct query authority;
- changes to Cordis/dsh core;
- bounded state-space exploration;
- production deployment;
- a general Agent reasoning benchmark.

## 16.4 Unverified behavior

- Agent adoption of the semantic query;
- task-success improvement;
- token or tool-call reduction;
- cross-model replication;
- production performance and observer resilience.

---

# 17. Traceability

\[
R_{req}\to S\to D\to V_{planned}.
\]

| Stage | Artifact or evidence |
|---|---|
| \(R_{req}\) | 用户要求构造三个真实诊断/修改任务并设计 native-vs-D 执行方案 |
| \(S\) | minimal reference；Design/Artifact/Issue prompts；semantic ABI v0.3；design v0.3；PoC v0.2；pinned Cordis/dsh source |
| \(D\) | 本文的 \(M_E\)、三项 task contract、selected augmentation design 和 \(\Delta_E\) |
| \(V_{planned}\) | parity tests、reference deltas、72 paired runs、hidden runtime checks、blind scoring、paired analysis |

## 17.1 Current authoring verification

- `node --test test/*.test.mjs` in `cordis-semantic-mirror-poc`: 3 passed, 0 failed;
- source revisions match the v0.3 anchors;
- the design contains all three public task cards, private oracle contracts, critical-error taxonomies, execution stages, and gate outcomes;
- all 32 Markdown fences are paired.

实现后才把责任链扩展为：

\[
R_{req}\to S\to D\to I\to V.
\]

当前没有 \(I\)，因此本文的 PASS 只表示设计已闭合，可以进入 artifact stage。

---

# 18. Final Gate Statement

这项实验不再问：

\[
\text{relational substrate 能否表示第四种状态？}
\]

它直接问：

\[
\boxed{
\text{在相同 Agent、相同任务、相同 runtime truth 和相同修改能力下，}
\quad
\text{增加 }D+fixed\ queries\text{ 是否提高正确性或降低获得正确结果的成本？}
}
\]

只有实际 paired results 能回答这个问题。本文的作用是让成功、局部成功、无效和回归都具有明确、可复核的判据。
