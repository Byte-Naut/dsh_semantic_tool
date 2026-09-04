# Cordis Agent-interface A/B v2：语义复杂度边界校准

## 结论

本轮新实验已按冻结配置执行完 12 个付费 run，但没有得到可解释的 A/B correctness 估计，也没有证明：

\[
E':\text{semantic normalization reduces reconstruction burden and shifts the failure boundary.}
\]

更准确的判断是：

\[
\boxed{\text{实验诊断成功；效应估计失败。}}
\]

原因不是 runtime fixture 无效。36/36 预生成 seed 均通过独立 native parity、参考动作、可见测试与私有 runtime grade。真正的问题是实验轨迹校准：9/12 run 在 Turn 1 达到 24 次工具预算，Native 没有任何完成 pair；同时 Frozen scorer 仍有动作名词法错配。

本轮保留下来的两个新信号是：

1. 在双方都达到 evidence closure 的 5 个 pair 中，Relational 每次更早，平均提前 2.2 次工具调用。
2. 唯一完成的 Hard run 暴露了一个真实语义失败：当 committed observation 缺失但 target 存在时，模型把 `transitioning` 写成 `true`，而非 `null/UNKNOWN`。

前者支持“局部 semantic access compression”的进一步校准价值；后者说明新任务确实进入了 partial observability 的复杂推理区。但两者都不足以支持一般能力边界位移。

## 冻结实验设计

被测模型与双臂控制：

| 项目 | 冻结值 |
|---|---|
| Requested model | `gemini-3.8-flash` |
| Reported model version | `gemini-3.8-flash`（全部已完成响应一致） |
| API metadata | `models/gemini-3.8-flash`, metadata version `3.0` |
| Thinking | `medium` |
| Temperature | `1` |
| Model seed | 每个 task/fixture 固定；双臂相同 |
| Turn-1 tool budget | 24 |
| HTTP retry | 1 attempt；无 fallback |
| Workspace/runtime | 每个 pair 同字节、同 seed、独立新进程状态 |
| Arm difference | Relational 仅增加一条只读 `software_semantic_query` |

信息防火墙不向被测模型发送理论论文、Companion、实验动机、预期方向、参考动作、私有 grader、另一臂轨迹或旧实验结果。

## 真实语义难度梯度

三档使用同一个 executable incident family；难度来自语义维度，而不是文件噪声或 prompt padding。

| Level | 真实语义维度 | 关键约束 |
|---|---|---|
| Easy / L1 | failed immutable update → active-run absence → service withdrawal → direct consumer | 显式 `run(v1)` 后在同一 Plugin 定义/更新新 Package |
| Medium / L2 | L1 + transitive derived service + tracked/external effect ownership | 修复 future ownership；精确退役旧 escaped handle；保留 Plugin identity |
| Hard / L3 | L2 + concurrent provider replacement paused in LOADING + committed/target divergence + counterfactual | 不撤销 target、不重启辅助 consumer；UNKNOWN 必须保持 UNKNOWN |

时间链为：

\[
D_0\;(primary\ active)
\rightarrow D_1\;(optional\ auxiliary\ LOADING)
\rightarrow D_2\;(dynamic\ update\ failed)
\rightarrow D_3\;(constrained\ repair).
\]

Experimental 查询没有扩展 ontology 或 Horn rule；它组合 v0.3 已有的 dynamic-package、impact-remove 与 binding-divergence 查询。外部 scheduler 仍保持 oracle/UNKNOWN 边界。

## 离线门控

付费执行前完成：

- 36/36 seed 的 Native/Relational Agent workspace 同字节；
- 公共工具 schema 同构，Relational 仅多一个只读查询；
- 36/36 组合 query 与独立 native state witness 一致；
- 36/36 reference action sequence 通过可见测试及私有真实 runtime grade；
- task card、workspace 与可见 schema 通过 information-firewall scan；
- terminal-JSON parser 支持前置 JS/diff/JSON fences，并只解析最后一个 terminal JSON。

## 原始执行结果

| Level | Native | Relational |
|---|---|---|
| Easy | 0/2 completed；2 budget-exhausted | 2/2 completed；2/2 runtime pass；2/2 semantic closure=1 |
| Medium | 0/2 completed；2 budget-exhausted | 0/2 completed；2 budget-exhausted |
| Hard | 0/2 completed；2 budget-exhausted | 1/2 completed；1 budget-exhausted；completed run runtime fail |
| 合计 | 0/6 completed | 3/6 completed |

冻结 runner 把工具预算耗尽记作 `invalid-infrastructure`。Post-hoc 审计将其重新标记为 `agent-budget-exhausted`，但没有替换、补跑或改写 raw outcome。

## Turn-1 重建负担

这些指标包含全部 12 个 slot，因此可以观察截断前的轨迹；但 completed 与 censored run 的 token 数不可直接解释为最终解决成本。

| 指标 | Native | Relational |
|---|---:|---:|
| Completed | 0/6 | 3/6 |
| Mean tool calls | 22.8333 | 23.5 |
| Mean observation calls | 17.6667 | 17.0 |
| Mean native observations | 17.6667 | 15.1667 |
| Mean native domains touched | 8 | 8 |
| Evidence closure reached | 5/6 | 6/6 |
| Mean calls to evidence closure | 15.0 | 13.3333 |
| Mean calls after evidence closure | 8.0 | 10.1667 |
| Mean gross input tokens | 89,427.7 | 110,695.5 |

关系查询在 5/5 可比较 pair 中都提前达到 evidence closure，平均差为：

\[
\Delta_{R-N}=-2.2\text{ calls}.
\]

但 Relational 仍触及全部 8 个 native 域，并在证据充分后继续调用。因此本轮没有复制 v1 的总 token/call compression；它只观察到“关键证据更早可得”。

## Frozen primary 与 post-hoc 敏感性

冻结 primary 为 0/3 completed runs。不过两个 Easy Relational run：

- structured semantic closure = 1；
- hidden runtime pass；
- 正确执行 `run(pkg-1, mode=run) → define(pkg-3) → update(pkg-3)`；
- 唯一 critical error 来自 scorer 只接受工具函数名，却拒绝组合 query 自己返回的等价语义动作名。

别名不敏感的 post-hoc sensitivity 下，这两个 run 为 pass，即 2/3 completed。这个数不能替代冻结 primary，只用于证明 Frozen primary 的词法污染。

Hard run 还存在两项记录层污染：`external_effect_truth` 把“mirror coverage unavailable”和“native scheduler 已观察”压进一个字段；`minimumSafeAction` 使用 camelCase 而不是冻结的 snake_case。这两点不改变其真实 runtime fail。

## Hard run 的真实失败

Hard Relational 完成轨迹正确做到了：

- 区分 `last_successful=pkg-1`、`failed_target=pkg-2`、`active_run=null`；
- 恢复 v1 后在同一 Plugin 发布 repaired Package；
- 识别 direct 与 transitive consumer；
- 修复 future callback ownership；
- 精确退役 `external-job:1`；
- 识别 LOADING 中 committed=v1、target=v2；
- 选择 `allow_current_load_to_settle` 并成功收敛。

但是 status adapter 写成：

```js
transitioning: servingId !== targetId
```

因此在 `servingId=null, targetId=v2` 时错误返回 `true`。正确实现应在任一观测缺失时返回 `null`，只有两侧都已知时才比较。这是本轮最有价值的 genuine semantic counterexample。

## 对 H1/H2/H3 的判断

| 假设 | 本轮判断 |
|---|---|
| H1 runtime correctness | 不可估计：没有完成的 Native pair；Relational completed 为 2 pass / 1 genuine fail |
| H2 access efficiency | 混合信号：evidence closure 更早、native observations 平均少 2.5；但 native domains 相同、总调用略多、input token 更高 |
| H3 complex capability | 未证明：观察到 partial-observability 真实失败，但 Native 全部被预算截断，无法比较 failure boundary |

因此当前最强可支持的新结论是：

\[
\boxed{
\text{The composed semantic query accelerated critical-evidence closure,}
\newline
\text{but the treatment did not prevent native reconstruction or yield an interpretable paired capability estimate.}
}
\]

## Harness 诊断与下一门控

本轮不应扩大到 72 runs。下一次只应先做 4-slot harness calibration，并满足：

1. Experimental 改为 interface-first：coverage complete 的域只走 query；只为 Package source 与声明的 UNKNOWN/oracle 域保留 native inspection。
2. 公共 Turn-1 tool budget 提高到足以观察完整解，而不是主要测停止行为；gross-token cap 保持一致。
3. 在 L1/L2 之间加入单维度中档：先只加 transitive impact 或只加 ownership，不同时增加两者。
4. JSON 使用枚举化 semantic action IDs，并在冻结前显式映射到工具调用；禁止再按措辞评分。
5. 把 `mirror_external_coverage` 与 `native_external_observation` 拆成两个字段。
6. budget exhaustion 保存部分 model exchanges，并归类为 agent outcome/censored，而非 infrastructure。
7. partial-observability acceptance 明确要求 unknown-preserving three-valued status。

## 成本

- 12 个实际 slot：$2.2472；
- 72 runs 按全部 slot 均值机械投影：$13.483；
- 按完成 run 均值：$33.6219；
- 按本轮最大单次：$48.4408。

由于 9 个 run 提前截断，这三个 72-run 数只能作为预算区间，不能作为精确预期。

## 证据边界

本报告不声称：

- Relational 提高了 runtime correctness；
- semantic normalization 已移动 Gemini 的一般推理上限；
- 当前 0/6 Native completion 可直接当作 0/6 correctness；
- post-hoc alias sensitivity 是预注册 primary；
- 当前任务可直接扩样本。

完整 raw telemetry、有效 run 的 model exchanges、task/tool schema、冻结 preregistration、36-seed parity report、Frozen analysis 与 post-hoc audit 均随可复现包交付。
