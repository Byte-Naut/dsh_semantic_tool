# E3 Typed Semantic Discipline：v0.2 cue-reduced calibration report

## 最终判定

E3 v0.2 已按冻结协议执行完毕。两项预定 calibration 修正均成功：

1. Task card 与 common prompt 不再直接点名 overconfidence、partial coverage 或 UNKNOWN-preservation 解法；
2. 两臂统一使用 24-call budget，并在验证通过后立即返回终态。

执行结果为 4/4 slots valid、4/4 executable adapters 正确、0 false certainty、0 known-case errors。由于 `Semantic Soft` 仍然 2/2 正确，预注册 continuation gate 的“Soft error exposure”条件失败，S11–S16 held-out 阶段未执行。

因此当前 E3 状态仍是：

\[
\boxed{
E_3:\ \text{not estimated because the compact Soft task remains at ceiling}
}
\]

这不是 Typed treatment 的正结果，也不是负结果。v0.2 的主要信息是：已经排除 v0.1 的提示泄漏与 16-call censoring，但该单一 adapter transformation 对 Gemini 3.8 Flash 仍然过于容易。

## 相对 v0.1 的冻结修正

| 维度 | v0.1 | v0.2 |
|---|---|---|
| Task card | 直接描述 “overconfident / partial coverage” | 只陈述 adapter 不满足 observation contract |
| Common prompt | 直接要求不得把 UNKNOWN 当 null/absence | 只指向共同 carrier contract |
| Stop rule | 无强制 post-PASS stop | 验证通过后立即提交终态 |
| Tool budget | 16 | 24，两臂相同 |
| Calibration seeds | S01–S02 | 全新 S09–S10 |
| Conditional holdout | S03–S08 | 全新 S11–S16 |
| Model-seed range | 73001–73008 | 87009–87016 |

保持不变且经 byte comparison 核验的部分：

- normalized snapshot 结构；
- hidden epistemic matrix；
- executable oracle；
- scorer；
- ordinary tools 与 Typed checker 实现；
- false-certainty primary endpoint；
- known-case/invalid-output anti-triviality guards；
- staged continuation 与不补跑纪律。

## 因果对照

两个 arm 获得相同：

- task card；
- workspace 与 buggy adapter；
- normalized lifecycle facts；
- Gemini model/version、thinking、temperature 与 pair seed；
- `list_files`、`read_file`、`write_file`、`run_visible_tests`、`software_semantic_query`；
- 24 tool calls 与相同 stop rule。

唯一 treatment 是 `semantic_typed` 增加一个 checker。该 checker 不读取额外 runtime facts，只机械验证：

- UNKNOWN comparison/presence/receipt propagation；
- UNKNOWN-dependent action deferral；
- KNOWN_ABSENT 与 UNKNOWN 分离；
- known inputs 必须保持 decisive。

## 冻结设计

- Experiment ID：`cordis-agent-semantic-discipline-e3-v02`；
- Model：`gemini-3.8-flash`，thinking `medium`，temperature 1，fallback 禁止；
- Calibration：S09–S10，2 pairs / 4 slots；
- Conditional held-out：S11–S16，6 pairs / 12 slots；
- Pair 内 arm 顺序按 seed 奇偶反转；
- 每个 slot 只允许执行一次；
- 没有 early stopping、失败替换或选择性补跑。

冻结 source-tree hash：

`7facc6fdbd368ae2258c4982e4c45e4544095e220ac4d3eec65afa8fbca1d6f1`

## 离线验证

8/8 预生成 seeds 均满足：

- cue audit 通过；
- 两臂 task、workspace、normalized facts 和普通工具一致；
- Soft arm 不含 Typed checker；
- 初始 scaffold 在 visible/known cases 中无错误；
- 初始 scaffold 在 hidden matrix 中产生 13 个 false-certainty/unsafe-action instances；
- Typed checker 拒绝初始 scaffold；
- reference implementation 同时通过 checker、visible tests 和 hidden matrix。

这保证了 v0.2 没有通过降低 oracle 难度或删除 UNKNOWN cases 制造 ceiling。

## Calibration results

| Run | Validity | Executable pass | False certainty | Known errors | Checker | Calls | Gross input | Cost |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| S09 Typed | valid | PASS | 0 | 0 | FAIL→PASS | 10 | 27,855 | $0.041081 |
| S09 Soft | valid | PASS | 0 | 0 | unavailable | 9 | 55,525 | $0.103155 |
| S10 Soft | valid | PASS | 0 | 0 | unavailable | 9 | 46,213 | $0.099970 |
| S10 Typed | valid | PASS | 0 | 0 | FAIL→PASS | 9 | 33,156 | $0.051019 |

Arm 汇总：

| 指标 | Semantic Soft | Semantic Typed |
|---|---:|---:|
| Valid | 2/2 | 2/2 |
| Primary/executable pass | 2/2 | 2/2 |
| Runs with false certainty | 0/2 | 0/2 |
| False-certainty instances | 0 | 0 |
| Unsafe-action instances | 0 | 0 |
| Known-case errors | 0 | 0 |
| Invalid outputs | 0 | 0 |
| Mean tool calls | 9.0 | 9.5 |
| Mean gross input tokens | 50,869 | 30,505.5 |
| Cost | $0.203125 | $0.092100 |

总费用：`$0.295225`。

样本仅有两对且 primary 全部为 0，tool/token/cost 不能解释为 treatment efficiency effect。

## Frozen continuation gate

| Gate component | Result |
|---|---|
| 4/4 slots valid | PASS |
| Typed 2/2 clean and checker PASS | PASS |
| Soft 2/2 known-case/shape clean | PASS |
| 至少一个 pair 暴露 Soft false certainty | **FAIL** |
| Typed never worse | PASS |

因此：

\[
\boxed{continuation=STOP}
\]

S11–S16 从未调用模型，`heldOutExecuted=false`，`e3HeldOutSuccess=null`。

## 两项 calibration 修正的效果

### Cue reduction

Cue audit 确认 common prompt/task card 不含 v0.1 的目标答案措辞。然而两个 Soft agents 仍从 carrier contract、normalized snapshot 和 buggy source 自行构造了正确的三值 adapter。

所以 v0.1 的 Soft 2/2 不只是显式提示造成；当前更强解释是：

\[
\boxed{
\text{该局部 adapter 的 semantic transformation depth 低于模型的自发纪律能力。}
}
\]

### Budget 与 stop discipline

修正明确成功：

- v0.1 Typed 每 run 调用 checker 4 次，平均 15.5 calls，并有 1 次 terminal censoring；
- v0.2 Typed 每 run 仅调用 checker 2 次，平均 9.5 calls，2/2 正常生成终态；
- checker 在初始代码上返回 FAIL，Agent 修复后返回 PASS，随后停止，没有 post-PASS rewrite loop。

这说明共同 stop rule 解决了已观察到的 harness 行为问题。

## 当前可支持结论

1. 小型 typed checker 继续稳定捕获初始 UNKNOWN→binary collapse，并接受正确实现；
2. v0.2 已消除提示泄漏与 budget censoring 两个主要 calibration confound；
3. 即便降低提示强度，Gemini 3.8 Flash 在该单一 adapter 任务上仍可仅凭 soft semantic contract 得到完全正确实现；
4. 因为两臂都是 0 error，没有任何可估计的 E3 error-rate contrast。

不能支持：

- Typed obligations 降低 Agent false certainty；
- Typed obligations 无效；
- E3 已通过或失败；
- tool/token/cost 优势；
- E4 capability-boundary shift；
- 跨任务或跨模型泛化。

## 下一步含义

不应继续用更多 lexical seeds 重复这一相同 adapter；那只会更精确地测量 0 对 0。

如果继续 E3，应保持世界事实和文件规模不变，只沿 **downstream semantic transformation depth** 做校准，例如：

1. 单步比较/存在判断（当前 Tier 0，已 ceiling）；
2. 两到三步三值组合，如 `transitioning AND cleanupComplete`；
3. 由多个三值前提共同约束一个 lifecycle action；
4. 仍使用完全相同 facts 的 Soft vs Typed 对照。

这增加的是 E3 本身的语义保持负担，而不是 E1/E2 的信息检索负担或无关噪声。找到 Soft 开始漂移但 Typed 仍闭合的最小 transformation depth 后，才值得冻结新的 held-out E3 protocol。
