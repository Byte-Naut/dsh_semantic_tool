# E4 能力边界实验报告

## 结论先行

本轮完成了一个真实 Cordis/dsh、无噪声、单变量的 dependency-depth calibration，但**没有建立 E4 能力边界位移**。

冻结实验在全部 16 个 slots 中均未发生预算截断或基础设施错误：

\[
N\in\{1,2,4,8,16,24,32,48\}.
\]

冻结 primary 表面上为 Native `6/8`、Semantic `8/8`，分岔出现在 \(N=32,48\)。但分解审计显示，两次 Native 都给出了完全正确的结构化事实、49 节点以内的完整有序路径、正确计划、正确动作记录，并通过真实 runtime；它们唯一没有通过的是“所有陈述均由预注册证据标签闭合”。因此：

\[
\boxed{\text{observed evidence-closure divergence}\neq\text{demonstrated capability-boundary divergence}}
\]

预注册要求的更晚“双臂均失败”高端锚点也没有出现，所以自动 gate 正确地阻止了 held-out confirmatory。没有使用新 seeds 追逐一个有利结果。

## 冻结设计

唯一复杂度自变量是失败根 publisher 到叶 consumer 的精确依赖边数 \(N\)。每增加一层，只增加：

- 一个真实 dynamic Cordis Plugin；
- 一个 required service binding；
- 一个 service publication；
- 一个归属于该组件的 `e4:` effect。

两臂共享模型、thinking level、temperature、model seed、task card、workspace、runtime、source oracle、动作工具、三值 carrier、120-call budget 与 hidden grader。

Native 得到原生 timeline、dynamic inventory、component、service、binding 与 effect 读取；Semantic 得到通用 `semantic_slice(target)`，其中包含规范化 identities、无序 dependency edges、typed lifecycle/binding carriers、effect ownership、Package/Run truth 与 coverage。Semantic 明确不返回 root cause、causal path 或 repair；三个答案字段均为 `null`。

组件名、service key 与 Plugin prefix 都没有序号，返回列表不按因果顺序排列，也没有 decoy、无关文件或错误日志噪声。

## 实际结果

| 深度 \(N\) | Native frozen primary | Semantic frozen primary | 两臂真实 runtime | Native calls | Semantic calls | Native input tokens | Semantic input tokens |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | pass | pass | pass / pass | 21 | 9 | 86,804 | 56,538 |
| 2 | pass | pass | pass / pass | 21 | 8 | 85,894 | 65,666 |
| 4 | pass | pass | pass / pass | 22 | 7 | 108,595 | 65,647 |
| 8 | pass | pass | pass / pass | 23 | 8 | 246,064 | 104,759 |
| 16 | pass | pass | pass / pass | 36 | 6 | 337,799 | 108,061 |
| 24 | pass | pass | pass / pass | 40 | 8 | 456,592 | 218,394 |
| 32 | fail* | pass | pass / pass | 19 | 7 | 400,226 | 242,838 |
| 48 | fail* | pass | pass / pass | 36 | 7 | 528,991 | 332,079 |

`fail*` 仅表示冻结 primary 中的 evidence-closure obligation 未闭合；并非结构化答案错误或 runtime 修复失败。

所有八个 pairs 中，Semantic 的 tool calls 与 gross input tokens 都更低。按 arm 均值：

| 指标 | Native | Semantic | 相对变化 |
|---|---:|---:|---:|
| Tool calls | 27.25 | 7.50 | −72.48% |
| Gross input tokens | 281,370.63 | 149,247.75 | −46.96% |
| Paid cost | $1.999008 | $1.117489 | −44.10% |
| Turn-1 evidence closure | 6/8 | 8/8 | Semantic 多 2 个闭包 |

在双方都完成 evidence closure 的六个深度中，Semantic 平均提前 17.67 calls 闭包。实验总成本为 `$3.116497`。

这些数据继续支持 E1/E2 的机制方向：随着语义工作集增长，规范接口显著减少重复 reconstruction；但它们不是 E4 的能力边界证据。

## 为什么 \(N=32,48\) 不能解释为 Native capability failure

两个 Native run 均满足：

- 所有 fact checks 通过；
- 完整 root-to-leaf path 通过，分别为 33/33 与 49/49 个组件；
- 所有 plan checks 通过；
- 所有 action/verification checks 通过；
- hidden runtime pass；
- 0 critical semantic errors；
- 无 tool/request/token censoring。

它们只检查了部分组件，却外推了其余 binding/effect 事实；每个 run 被记录 2 个 unsupported judgments。冻结 scorer 将 `semanticClosure=false` 统一标为 `wrong-semantic-conclusion`，这个标签在此处过宽。冻结分数没有被事后修改，但解释必须降级为：

\[
\boxed{\text{Native epistemic provenance discipline weakened at }N=32,48.}
\]

## 本轮暴露的两个 calibration 问题

1. **Correctness 与 evidence closure 被合并进同一 primary。** 精确正确但证据未闭合的答案被标成 semantic failure，无法单独估计 capability boundary。
2. **Effect label 存在可学习捷径。** `e4:cal:<componentName>` 使模型在观察少量样例后能准确猜出其余 label；同时，component injection list 与 service implementation list 的合法 join 已足以恢复 dependency edges，但 evidence tagger 仍要求逐组件 inspection，因而高估了缺失的 dependency evidence。

## Gate 与证据状态

预注册的三锚点要求是：更早双通过、最早 Semantic-only 分岔、更晚双失败。实际得到：

\[
N\le24:\ N+ / S+,
\qquad
N=32,48:\ N^-_{evidence}/S+.
\]

没有 `N-/S-` 高端锚点，且 nominal Native failure 不是 correctness failure。因此：

\[
\boxed{E_4:\ \text{NOT ESTABLISHED}}
\]

当前更准确的边界结论是：在这类单链 transformation 上，两臂的**观测到的正确性下界都超过 \(N=48\)**；Semantic 的 evidence-backed trajectory 边界超过 48，而 Native 的完整 provenance closure 在 24 与 32 之间开始失效。

## 下一步纪律

不运行当前 held-out seeds，也不在同一协议内继续增加 \(N\)。若继续 E4，应新建并重新冻结协议：

- 将 exact semantic/runtime correctness 与 epistemic evidence closure 拆成两个独立 endpoint；
- 使用 opaque、不可由组件名推导的 effect identities，或从纯 topology E4-A 中移除 effect-copying obligation；
- 对 `component injections JOIN service providers` 给予正确 provenance credit，只把真正未观察的 effect/binding 记为 unsupported；
- 再选择一个独立真实轴 E4-B，例如固定 depth 后增加同时维护的 lifecycle fronts \(K\)，而不是追加噪声或事后延长本梯子。

## 可复核元数据

- Requested/reported model：`gemini-3.8-flash`
- Model metadata：`models/gemini-3.8-flash`，display name `Gemini 3.8 Flash`，metadata version `3.0`
- Thinking：`medium`
- Temperature：`1`
- Fallback：禁用
- Frozen source tree：`7857c6a3f110c6c987ecb73cb884a07b898a68eeffc63f5b3b9c69969f9c721d`
- Calibration results：`5564f426e325cff5f5d68aec56d427cad56c4de4b70516b5651062d707c4a496`
- Offline parity：112/112 arm-cases；reference runtime closure 通过
- Persisted API key matches：0
