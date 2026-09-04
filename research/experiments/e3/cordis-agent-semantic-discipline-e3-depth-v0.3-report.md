# E3 transformation-depth v0.3 实验报告

## 结论先行

本轮按预注册的有限梯度完整执行，最终触发：

\[
\boxed{\texttt{BOUNDED\_SOFT\_CEILING}}
\]

Tier 1、2、3 共 6 个 paired calibration seeds、12 个付费模型 slots 全部有效；Soft 与 Typed 两臂均为：

- 6/6 executable pass；
- 6/6 terminal primary pass；
- 0 次错误肯定；
- 0 次不安全 action；
- 0 个 known-case regression；
- 0 个无效输出。

因此，本轮没有出现可进入 held-out replication 的 E3 contrast。按照冻结停止规则，没有执行任何 held-out seed，也没有事后构造 Tier 4。

当前最严格的解释是：

\[
\boxed{
\text{对 Gemini 3.8 Flash 和该局部三值变换族，公开 Soft contract 在三层深度内已经足够。}
}
\]

Typed checker 的机制仍然有效，但本轮只支持把它定位为低成本机械 assurance，不能声称它提高了模型正确率。

## 1. 冻结问题与单一变量

实验问题为：在完全相同的 normalized world 上，仅增加从事实到 lifecycle action 的语义变换深度时，可执行 typed obligation 是否会减少 Soft arm 的错误肯定？

两臂均获得同一份 task card、workspace、公开 `OBSERVATION-CONTRACT.md`、normalized observation、模型版本、model seed、temperature、thinking level、预算和非 treatment tools：

| Arm | 接口 |
|---|---|
| Semantic Soft | normalized query、源码读写、visible tests |
| Semantic Typed | 与 Soft 完全相同，另加一个只执行公开 contract、且不观察新世界事实的 checker |

主指标保持为 executable false certainty：当正确值应为 `UNKNOWN` 时输出 `TRUE/FALSE`，或当 action guard 为 `UNKNOWN` 时采取非 `DEFER_FOR_EVIDENCE` 动作。

## 2. 固定世界与深度梯度

所有 24 个预生成 seeds 使用同一个 normalized snapshot，哈希为：

`d3a14e995420acba47911450b068187a4636898f46d09ae36b31c210c58ee004`

固定事实包括：

- `targetBinding = KNOWN_VALUE(provider-v2)`；
- `committedBinding = UNKNOWN`；
- `activeRun = KNOWN_ABSENT`；
- `lastSuccessfulPackage = KNOWN_VALUE(package-v1)`；
- `cleanupReceipt = UNKNOWN`；
- coverage、provenance、subject 与 snapshot ID 也完全相同。

梯度只增加下游变换：

| Tier | 新增变换 | 当前 observation 的正确结果 |
|---|---|---|
| 1 | `handoffComplete = STRICT_AND(STRICT_NOT(transitioning), cleanupComplete)` | `UNKNOWN`，action 必须 defer |
| 2 | 再推导 `recoveryAllowed = STRICT_AND(STRICT_NOT(activeRunPresent), handoffComplete)` | `UNKNOWN`，action 必须 defer |
| 3 | 再推导 `serviceAdvertisable = STRICT_AND(recoveryAllowed, STRICT_NOT(transitioning))` | `UNKNOWN`，action 必须 defer |

`STRICT_AND` 被明确冻结为：任一 operand 为 `UNKNOWN`，结果即为 `UNKNOWN`；否则执行普通二值 conjunction。没有加入拓扑、额外 runtime facts、无关文件、decoy 或 Native interface。

## 3. 预注册执行与停止规则

每层先运行 2 个全新 paired seeds，arm order 按 seed 奇偶交替：

- Tier 1 calibration：S17–S18；条件 held-out：S19–S24；
- Tier 2 calibration：S25–S26；条件 held-out：S27–S32；
- Tier 3 calibration：S33–S34；条件 held-out：S35–S40。

每层只有三种冻结决策：

- `REPLICATE`：Soft 至少一对出现更多错误肯定、Typed 干净且从不更差；停止加深，只运行该层 6 个 held-out pairs；
- `CONTINUE`：两臂有效、guard 干净且零错误肯定持平；进入下一层；
- `INVALID_STOP`：出现预算截断、有效性问题、Typed failure、known-case/shape confound 或 Typed 更差；停止且禁止 treatment inference。

Tier 3 若仍为 `CONTINUE`，冻结结论就是 bounded Soft ceiling；不允许继续找更深的题目。

## 4. 模型与执行元数据

- requested model：`gemini-3.8-flash`；
- 12/12 responses reported model version：`gemini-3.8-flash`；
- API metadata name：`models/gemini-3.8-flash`；metadata version 字段：`3.0`；
- thinking level：`medium`；temperature：`1`；
- tool-call budget：每 run 24；
- fallback：禁止；
- 实际总费用：`$0.809493`。

## 5. 主结果

| Tier | Soft executable / primary | Typed executable / primary | Soft false certainty | Typed false certainty | Gate |
|---|---:|---:|---:|---:|---|
| 1 | 2/2 · 2/2 | 2/2 · 2/2 | 0 runs / 0 instances | 0 / 0 | `CONTINUE` |
| 2 | 2/2 · 2/2 | 2/2 · 2/2 | 0 / 0 | 0 / 0 | `CONTINUE` |
| 3 | 2/2 · 2/2 | 2/2 · 2/2 | 0 / 0 | 0 / 0 | `CONTINUE` |

三个 gate 的 `allValid`、`typedClean`、`softGuardClean`、`neverWorse` 均为 true，`exposed` 均为 false。最终为 `BOUNDED_SOFT_CEILING`，held-out 执行数为 0。

## 6. Checker 机制审计

checker 并非空操作：离线错误 scaffold 随深度产生 19、27、35 个错误肯定，并在全部 24 个预生成 seeds 上被 checker 拒绝；正确 reference 在全部 seeds 上通过。

实际 Typed trajectories 中：

- 5/6 首次 checker 为 `FAIL`，Agent 修改后变为 `PASS`；
- 1/6 在首次调用 checker 前已经正确，直接 `PASS`；
- 6/6 最终 checker 均为 `PASS`；
- 6/6 均在 PASS 后停止，没有 post-PASS tool loop。

这支持：checker 能发现并阻止二值化实现进入最终状态。但 Soft 在没有 checker 的情况下也全部根据公开 contract 修复成功，因此不能从本轮估计 correctness treatment effect。

## 7. 轨迹成本：仅作描述

| Arm | Runs | Tool calls | Gross input tokens | Output + thinking tokens | Cost |
|---|---:|---:|---:|---:|---:|
| Soft | 6 | 56 | 285,936 | 69,235 | $0.474084 |
| Typed | 6 | 60 | 227,293 | 43,984 | $0.335409 |

Typed 相对 Soft 多 7.1% tool calls，但本样本输入 token 少 20.5%、输出与 thinking token 少 36.5%、费用少 29.3%。这些是自适应 calibration 的小样本描述量，不是预注册主指标，也没有 held-out replication，不能解释为新的 E1/E2 或 checker 效率效应。

## 8. 研究状态更新

| 命题 | 本轮后状态 |
|---|---|
| \(E_1\) normalization 降低 reconstruction burden | 维持此前 task family 内 held-out replicated |
| \(E_2\) interface-first 转化为 trajectory efficiency | 维持此前 task family 内 held-out replicated |
| \(E_3\) typed semantic discipline | checker mechanism 再次验证；Tier 1–3 未出现 treatment contrast，得到 bounded Soft ceiling |
| \(E_4\) capability-boundary shift | 仍未触及 |

因此应遵守预注册的研究决策：结束这条 E3 depth ladder，不增加 Tier 4。下一步转向 E4；checker 作为 assurance guard 保留，但不把它包装成已经证明的能力增强器。

## 9. 解释边界

本轮只覆盖一个模型、一个小型 adapter family、一套明确公开的严格三值代数和最多三层的局部变换。隐藏矩阵是有界 executable checks，不是穷尽模型检查；任务没有启动 live Cordis/dsh runtime，也不支持跨任务、跨模型、真实 Issue 泛化或 runtime authority 结论。

一个重要的替代解释是：公开 contract 本身已经提供了足够强的 soft typing。这个结果并不证明所有无 checker 软件任务都安全，只说明在预注册边界内继续增加 transformation depth 已没有足够信息收益。

## 10. 完整性与安全审计

- source tree 在执行后仍匹配冻结哈希：`13887a1864ef497e0b113ad9f7365648f1b0d19fced114a650d23f4bb023ddef`；
- package lock 匹配冻结哈希：`0fd6c5f941edadd475a9329f694f533f47d6dc6c50ab2ae819ba2060c3d9f893`；
- 10/10 harness tests 通过；
- 24 个预生成 seeds 的 normalized world 只有 1 个唯一哈希；
- 12/12 paid slots 有效，无 budget censoring、无 model-version drift；
- 未创建任何 held-out run directory；
- 产物中明文 Gemini key 命中数为 0。
