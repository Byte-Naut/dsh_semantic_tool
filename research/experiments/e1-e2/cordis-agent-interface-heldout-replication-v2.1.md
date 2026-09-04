# Cordis Agent Interface v2.1：held-out paired replication

## 最终判定

本轮得到两个必须同时保留、不能互相覆盖的结果：

1. **预注册效率机制复制通过。** 在 S03–S12 的 10/10 held-out pairs 中，Semantic 都更早完成 evidence closure、使用更少 tool calls、消耗更少 gross input tokens；三项单侧精确配对 sign tests 经 Holm 校正后均为 \(p=0.00293\)。
2. **冻结 overall gate 形式上失败。** Frozen primary 为 Native 10/10、Semantic 6/10，未满足 correctness-retention gate。但四次 Semantic failure 经审计均是同一个 arm-sensitive scorer contract mismatch：Agent 按 prompt 允许的格式提交了 query 返回的精确 effect IDs，冻结 scorer 却只接受 effect labels。隐藏 runtime、真实语义事实、计划和动作均未失败。

因此最准确的结论是：

\[
\boxed{
\textbf{E1+E2 efficiency mechanism replicated cleanly within the held-out task family.}
}
\]

同时：

\[
\boxed{
\textbf{The preregistered overall PASS/FAIL remains FAIL because the frozen primary scorer was contract-incomplete.}
}
\]

透明的 contract adjudication 得到 Native 10/10、Semantic 10/10，但它是 post-hoc audit，不能替换冻结分数。

## 冻结协议

- Task、task card、runtime fixture、common prompt、Native/Semantic interface schemas、source oracle、three-action lifecycle、evidence tags、scorer、40-call budget、模型配置均从 v2.1 calibration 逐字节复制；
- 27 个协议文件逐文件 SHA-256 一致；
- Calibration source-tree hash：`475f2bce6867a0d4133848756b0132e0f56dd1ae805ae9fbdbcc334efb122a5e`；
- Replication source-tree hash：`ea664960df3f381a7ccf70048095c0a2e801248a6eb2a4c715bbaab360f6683e`；
- S01–S02 完全排除于 confirmatory analysis；
- S03–S12 从未在 calibration 中执行，构成 10 个 procedural holdout pairs；
- 20 slots 按奇偶 seed 反向排序执行一次，无 early stopping、补跑或失败替换；
- 模型为 `gemini-3.8-flash`，thinking `medium`，temperature 1；所有响应均报告同一 model version；
- 预计费用约 `$2.21`，实际估算费用 `$2.300554`。

执行前，20 个 held-out offline arm-cases 全部通过 reference recovery、semantic/native witness 对照、workspace/task-card 同构、interface boundary 与信息防火墙验证。

## 预注册统计方案

三项效率端点定义为 pair 内：

\[
d_i=Native_i-Semantic_i.
\]

正值代表 Semantic burden 更低：

1. calls to first sufficient evidence；
2. total tool calls；
3. gross input tokens。

每项使用单侧精确配对 sign test；零差异排除，并在三项之间进行 Holm family-wise error 校正，\(\alpha=0.05\)。Calibration pairs 不进入检验。

## Confirmatory efficiency results

| 端点 | 正/平/负 pairs | Raw p | Holm p | Native 均值 | Semantic 均值 | 降幅 | Median pair delta |
|---|---:|---:|---:|---:|---:|---:|---:|
| Evidence-closure calls | 10/0/0 | 0.000977 | 0.002930 | 10.5 | 2.0 | 81.0% | 8.5 calls |
| Total tool calls | 10/0/0 | 0.000977 | 0.002930 | 20.1 | 6.0 | 70.1% | 14 calls |
| Gross input tokens | 10/0/0 | 0.000977 | 0.002930 | 176,540.1 | 44,216.3 | 75.0% | 124,202 tokens |

三项均通过预注册 Holm gate，而且所有 10 个 pairs 方向一致。

### 其他轨迹指标

| 指标 | Native 均值 | Semantic 均值 | 变化 |
|---|---:|---:|---:|
| Observation calls | 17.1 | 3.0 | -82.5% |
| Calls after evidence closure | 9.6 | 4.0 | -58.3% |
| Raw native domains touched | 5.0 | 0.0 | -100% |
| Repeated observation calls | 4.0 | 0.0 | -100% |
| Output + thinking tokens | 11,514.1 | 5,682.7 | -50.6% |
| Tool-result bytes | 17,365.7 | 5,583.4 | -67.8% |
| Arm cost | $1.755830 | $0.544724 | -69.0% |

所有 Semantic trajectories 都采用同一个 6-call 闭环：

1. composed incident query；
2. failed-Package source oracle；
3. restore last successful Package；
4. define repaired immutable Package；
5. update to repaired Package；
6. composed verification query。

Native 使用 17–22 calls，跨 timeline、dynamic inventory、Fiber list、Fiber bindings/effects 与 services 五个 raw domains，并重复执行 Fiber/Package inspections。

## Calibration replication stability

| 端点 | Calibration S01–S02 | Held-out S03–S12 |
|---|---:|---:|
| Evidence-closure reduction | 81.0% | 81.0% |
| Total-call reduction | 69.2% | 70.1% |
| Gross-input reduction | 73.1% | 75.0% |
| Semantic raw native domains | 0 | 0 |
| Hidden runtime parity | 2/2 vs 2/2 | 10/10 vs 10/10 |

三个主要幅度在 holdout 中与 calibration 高度一致。它支持的不是“Semantic 偶然在两个 seed 上少调用”，而是一个在相同真实 lifecycle task family、不同词汇实例和 model seeds 上稳定复现的 reconstruction-tax signal。

## Correctness readout 与 scorer defect

### Frozen readout

| 指标 | Native | Semantic |
|---|---:|---:|
| Valid slots | 10/10 | 10/10 |
| Hidden runtime pass | 10/10 | 10/10 |
| Frozen primary pass | 10/10 | 6/10 |
| Critical semantic errors | 0 | 0 |

因此预注册 `correctnessRetention` gate 为 FAIL，整体 frozen replication result 也必须记为 FAIL。

### Root cause

共同 Turn-1 schema 明确允许：

> `tracked_effects_at_risk`: exact effect label **or id**

S05、S07、S10、S12 Semantic 均提交了四个精确 `effectId`。审计逐一确认：

- 每个 ID 都存在于该 run 的 composed-query tool output；
- direct 与 transitive tracked effects 均被正确识别；
- Turn-1/Turn-2 terminal JSON 均正常解析；
- 除两个 effect-label-only checks 外，所有 fact、plan、action checks 均通过；
- 所有 critical-error checks 与 hidden runtime grade 均通过。

冻结 scorer 的实际逻辑只搜索字符串中的 `tracked:direct:` 与 `tracked:transitive:` label fragments，没有接受 exact effect IDs。这还具有 arm sensitivity：Semantic query 暴露 ID 和 label，Native Fiber interface 只暴露 label。

### Contract audit

| Readout | Native | Semantic |
|---|---:|---:|
| Frozen primary | 10/10 | 6/10 |
| ID-or-label contract adjudication | 10/10 | 10/10 |
| Hidden runtime | 10/10 | 10/10 |

Contract adjudication 证明这四条是 scorer false negatives，而不是 Agent semantic drift；但因为它是看到结果后的 audit，不能把 frozen overall result 改写为 PASS。

## 对核心命题的更新

### \(E_1\)：semantic normalization reduces reconstruction burden

在 held-out task-family replication 中得到强而一致的支持：10/10 pairs 同向，Holm-adjusted \(p=0.00293\)，幅度与 calibration 几乎相同。

### \(E_2\)：interface-first converts access into trajectory efficiency

同样得到强而一致的支持。Semantic 没有回退到 raw native domains；更早的闭包稳定传导为更少总调用、post-closure 调用、tokens 和费用。

### 运行正确性

真实 runtime 为 10/10 对 10/10，没有观测到 operational correctness loss。书面-contract 审计也为 10/10 对 10/10，但 frozen primary 受 scorer defect 污染，因此“confirmatory primary correctness parity”仍不能无保留宣称通过。

### \(E_3/E_4\)

仍未证明 hard UNKNOWN preservation 或 capability-boundary shift。本轮 task family 仍处于两臂都能正确执行的能力范围。

## 当前最强可支持结论

\[
\boxed{
\begin{aligned}
&\text{A strong model that solved every held-out Cordis/dsh runtime task natively}\
&\text{paid a large and highly repeatable software-state reconstruction tax.}\
&\text{An interface-first semantic boundary removed most of that observed tax}\
&\text{without an observed runtime-correctness loss.}
\end{aligned}
}
\]

这比“CTR 让模型更聪明”更窄，但目前证据更真实：同一强模型在 Native 下平均额外支付约 14.1 tool calls 和 132,324 gross input tokens，Semantic 则把轨迹稳定压缩为固定 6-call 闭环。

## 限制与下一步

- 10 个 seeds 是同一 task template 的 procedural holdouts，不是 10 种独立真实 Issue；sign-test 的一般化范围仅限该 family；
- 只有一个模型和一次时间窗口；
- Semantic 6-call 轨迹受到 interface-first boundary 与 stop rule 的共同约束，这正是 treatment，但不能外推到未约束 Agent；
- Gross input 是 SDK 按请求累计报告的上下文成本；
- 没有测试并发 LOADING、external ownership、hard UNKNOWN checker 或更高能力边界。

下一步不应重跑 S03–S12 并把修正分数冒充 confirmatory replication。应：

1. 将 scorer 修为 canonical ID-or-label membership，而非 label substring；
2. 增加“同一 effect 以 label 与 ID 表达均通过”的对称单元测试；
3. 把本轮 efficiency family 作为已复制的产品机制证据冻结；
4. 若仍需一个形式上完整的 overall PASS，使用新的预生成 held-out seeds 进行小规模 clean replication；
5. E3 hard-UNKNOWN checker 与 E4 boundary localization 继续作为独立实验，不与 scorer repair 混在同一批次。
