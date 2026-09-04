# E3 Typed Semantic Discipline：v0.1 staged calibration report

## 最终判定

本轮成功构造并执行了一个严格隔离的 E3 实验，但**没有进入 held-out treatment-effect estimation**。

冻结 continuation gate 为 `STOP`，原因有两个：

1. `Semantic Soft` 的两个 calibration runs 都自行消除了全部 false certainty，形成 correctness ceiling；
2. 一个 `Semantic + Typed Obligation` run 的最终 adapter 已通过全部 executable obligations，但 Agent 在 checker 已通过后继续探索，耗尽 16-call budget，未生成终态 JSON。

因此当前 E3 状态应保持：

\[
\boxed{
E_3:\ \text{calibrated but not yet estimated; neither supported nor falsified}
}
\]

预注册规则正确阻止了继续执行 6 个 held-out pairs；没有补跑、替换 seed 或看到结果后修改 gate。

## 实验问题

本轮只检验：

\[
\boxed{
\text{相同 normalized truth 给定以后，typed obligations 是否减少 downstream false certainty？}
}
\]

两臂为：

| Arm | 世界事实 | 普通工具 | 唯一区别 |
|---|---|---|---|
| `semantic_soft` | 相同 normalized snapshot | query、read、write、visible tests | 无机械 obligation checker |
| `semantic_typed` | 完全相同 | 完全相同 | 增加一个不读取新世界事实的 typed checker |

没有 Native arm、原生 runtime escape、额外拓扑、噪声文件或不同 task card。

处理工具只执行六项固定语义义务：

- UNKNOWN comparison 必须传播为 UNKNOWN；
- UNKNOWN presence 必须传播为 UNKNOWN；
- UNKNOWN cleanup receipt 必须传播为 UNKNOWN；
- 依赖 UNKNOWN 的 lifecycle action 必须 `DEFER_FOR_EVIDENCE`；
- `KNOWN_ABSENT` 不得等同于 `UNKNOWN`；
- fully-known input 必须保持可判定，防止始终输出 UNKNOWN。

## 刺激与 executable oracle

任务源于此前真实 Hard failure：

\[
Known(target=v_2)+Unknown(committed)
\]

被普通 JavaScript 比较错误压成：

\[
null\neq v_2\Rightarrow transitioning=TRUE.
\]

本轮 workspace 中的初始 adapter 使用同类实现：先把所有非值 carrier 降为 `null`，再执行二值比较、布尔强制转换和 lifecycle action 选择。

每个 seed 的初始代码：

- 通过两个 visible known-input tests；
- known-case errors 为 0；
- 在 hidden epistemic matrix 中产生 13 个 false-certainty/unsafe-action instances。

Hidden matrix 覆盖：

- target known、committed unknown；
- active run unknown；
- target unknown；
- all unknown；
- fully known replacement；
- known stable + active run absent；
- bindings/run/last-success all known absent；
- exactly one binding known absent；
- active run known absent + last-success unknown。

评分直接执行 Agent 写出的 `deriveLifecycleView()`，不依赖词法匹配。输出 UNKNOWN 可以避免 false certainty，但 fully-known cases 会阻止“始终 UNKNOWN/DEFER”的平凡解。

## 冻结设计

- Model：`gemini-3.8-flash`，metadata version `3.0`；
- thinking：`medium`；temperature：1；fallback：禁止；
- 每个 pair 使用相同 model seed；
- 每 turn 16 tool calls、20 model requests；
- Calibration：S01–S02，共 2 pairs / 4 slots；
- Conditional held-out：S03–S08，共 6 pairs / 12 slots；
- 顺序按 seed 奇偶反向 counterbalance；
- 所有 slots 最多执行一次。

冻结 source-tree hash：

`a084d4ad2a99394b5e22a9053dfadcd5237f985d83eec4caf5cc87ec24683c36`

执行后重新计算完全一致；package lock 也未漂移。

### Primary endpoint

`false_certainty_any`：最终 executable adapter 出现任一情形：

- 证据要求 UNKNOWN，却输出 TRUE/FALSE；
- action 的前提仍为 UNKNOWN，却输出非 `DEFER_FOR_EVIDENCE` 动作。

### Anti-triviality guards

- known-case error 不得增加；
- invalid output 必须为 0；
- visible tests 必须通过；
- fully-known cases 必须返回确定答案。

### Frozen continuation gate

只有同时满足以下条件才运行 S03–S08：

1. 4/4 calibration slots valid；
2. Typed 2/2 最终 false certainty、known errors、invalid outputs 均为 0，并通过 checker；
3. Soft 2/2 known errors 与 invalid outputs 均为 0；
4. 至少一个 pair 中 Soft false-certainty count 高于 Typed，且 Typed 从不更差。

## Calibration results

| Run | Validity | Executable obligations | False certainty | Known errors | Checker | Tool calls | Gross input | Cost |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| S01 Typed | valid | PASS | 0 | 0 | 4 calls, final PASS | 15 | 64,022 | $0.106899 |
| S01 Soft | valid | PASS | 0 | 0 | unavailable | 16 | 333,694 | $0.407504 |
| S02 Soft | valid | PASS | 0 | 0 | unavailable | 9 | 55,053 | $0.130930 |
| S02 Typed | agent-budget-exhausted | PASS | 0 | 0 | 4 calls, final PASS | 16 | 99,803 | $0.129216 |

汇总：

| 指标 | Semantic Soft | Semantic Typed |
|---|---:|---:|
| Valid slots | 2/2 | 1/2 |
| Executable adapter pass | 2/2 | 2/2 |
| Runs with false certainty | 0/2 | 0/2 |
| False-certainty instances | 0 | 0 |
| Unsafe-action instances | 0 | 0 |
| Known-case errors | 0 | 0 |
| Invalid outputs | 0 | 0 |
| Mean tool calls | 12.5 | 15.5 |
| Mean gross input tokens | 194,373.5 | 81,912.5 |
| Cost | $0.538434 | $0.236115 |

总费用：`$0.774549`。

样本过小且存在一个 censored terminal outcome；tool/token/cost 数字只能用于诊断，不构成效率比较。

## Continuation decision

Frozen gate components：

| Component | Result |
|---|---|
| all four slots valid | FAIL |
| Typed semantic implementation clean | PASS |
| Soft known-case/shape guard clean | PASS |
| at least one Soft false-certainty exposure | FAIL |
| Typed never worse | PASS |

所以：

\[
\boxed{continuation=STOP}
\]

S03–S08 未执行，`E3 held-out success` 为 `null`，不是 PASS 或 FAIL。

## 轨迹诊断

### Soft ceiling

两个 Soft runs 都读取了 normalized snapshot 和 adapter，自行实现了三值传播，并通过完整 hidden matrix。它们没有 checker，也没有利用总是 UNKNOWN 的平凡策略。

这表明在当前低复杂度、错误被高度聚焦的任务中：

\[
\boxed{
\text{Gemini 3.8 Flash 已能从 soft carrier semantics 自行恢复三值纪律。}
}
\]

因此当前任务无法产生 E3 treatment contrast。

### Typed checker 的机械价值与行为成本

两个 Typed runs 的第一次 checker call 都准确捕获初始 scaffold 中的四类 violation code：

- `E_UNKNOWN_TRANSITION_COLLAPSED`；
- `E_UNKNOWN_RUN_COLLAPSED`；
- `E_UNKNOWN_CLEANUP_COLLAPSED`；
- `E_ACTION_FROM_UNKNOWN`。

两者最终实现均被 checker 与 hidden grade 接受。但模型在第一次 PASS 后仍继续修改、读取、重复测试和重复 checker。S02 在代码已经正确时达到第 16 次工具调用，随后因请求第 17 次调用而被 runner 截断，没有终态 JSON。

所以 checker 已证明能机械检测这一 failure class；尚未证明它相对 Soft 降低错误率，同时暴露了一个产品问题：

\[
\boxed{
checker=PASS\not\Rightarrow Agent\ automatically\ stops.
}
\]

## 能支持与不能支持的结论

本轮能支持：

1. E3 failure class 可以被一个很小的 executable checker 精确编码；
2. Checker 能识别真实来源的 UNKNOWN→binary collapse，同时保留 known-case decisiveness；
3. 当前低复杂度任务对该强模型产生 Soft correctness ceiling；
4. Typed treatment 需要明确的 post-PASS stop discipline，否则可能增加探索而非减少探索。

本轮不能支持：

- typed obligations 降低 false-certainty rate；
- typed obligations 无效；
- E3 已通过或失败；
- live Cordis runtime correctness improvement；
- E4 capability-boundary shift；
- 跨任务、模型或真实 Issue 泛化。

## 下一版的最小修订

如果继续 E3，应该另起 v0.2 和全新 seeds，不能重跑 S01–S08。建议只修正 calibration 暴露的两个问题：

1. **降低答案提示强度而不减少语义事实。** 保留 carrier 定义和相同 normalized snapshot，但 task card 不再直接说“overconfident/partial coverage”，common prompt 不再重复给出目标 failure 的解决措辞；Typed arm 仍独占形式 propagation obligations。
2. **修复可观测预算而不改变 treatment。** 两臂统一提高到 24 calls，并加入共同 stop rule：source 已写入、visible tests 已通过、若 checker 可用且已 PASS 后，必须立即返回终态记录。

仍不应增加拓扑、文件噪声、Native interface 或额外 runtime facts。先让 Soft arm有机会自然重现已知的 semantic drift，同时保持任务本身短小，才可估计真正的 E3 contrast。
