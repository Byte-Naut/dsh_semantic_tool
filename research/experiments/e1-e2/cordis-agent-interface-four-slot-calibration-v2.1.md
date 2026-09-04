# Cordis Agent Interface v2.1：4-slot interface-first calibration

## 结论

本轮 4-slot calibration 的六个预注册门全部通过。它在一个中间复杂度、真实可执行的 Cordis/dsh 任务上支持如下局部结论：

\[
\boxed{
\text{interface-first semantic access reproduced earlier evidence closure}
\Rightarrow
\text{lower trajectory burden}
}
\]

这仍不是一般 treatment-effect 估计，也没有证明 capability-boundary shift。两臂最终都正确，因而本轮证据针对的是信息访问与轨迹效率，而非正确率优势。

## 冻结设计

### 实验问题

本轮只校准两个机制：

- \(E_1\)：semantic normalization 是否减少关键事实闭包所需观察；
- \(E_2\)：interface-first 是否把更早的事实闭包转化为更短、更便宜的完整轨迹。

同时保留一个窄 \(E_3\) probe：失败更新后，Agent 是否以 `KNOWN_ABSENT` 保存 active-run 强缺失，并以枚举 semantic action IDs 表达恢复步骤。完整的 UNKNOWN 下游实现纪律不在本轮测试范围。

### 中间复杂度任务

任务仅在原 L1 failed-update recovery 上增加一个真实语义维度：transitive dependency impact。

1. 动态 Plugin 的 `pkg-1` 曾成功运行并发布主 service；
2. 一个 direct consumer 使用主 service，并发布 derived service；
3. 一个 transitive consumer 使用 derived service；
4. `pkg-2` 在 publish 之前抛错，update 失败；
5. runtime 保留 `last_successful=pkg-1`、`failed_target=pkg-2`，但 `active_run` 强缺失；
6. Agent 必须识别 direct/transitive consumers 与 tracked effects，检查失败源码，然后依次显式恢复 `pkg-1`、定义一个新的不可变修复 Package、update 到修复 Package，并验证两层 consumer。

本轮有意不加入 external effect ownership、并发 LOADING replacement 或完整 UNKNOWN adapter repair，避免再次从 L1 跳到过难的 L2/L3。

### 两臂边界

| 能力 | Native | Semantic |
|---|---:|---:|
| raw timeline / dynamic inventory | 是 | 否 |
| raw service / Fiber / bindings / tracked effects | 是 | 否 |
| composed semantic query | 否 | 是 |
| Package-source oracle | 是 | 是 |
| 三项 lifecycle action tools | 是 | 是 |
| task card、workspace、预算、模型 seed | 相同 | 相同 |

因此 treatment 是：

\[
\text{Native interface}
\quad\text{vs.}\quad
\text{Semantic interface + explicit source-oracle escape},
\]

而不是上一轮实际形成的 `Native` vs `Native + Relational`。

### 样本与控制

- 2 个确定性 fixture seeds × 2 arms = 4 slots；
- 固定执行顺序：S1-Semantic、S1-Native、S2-Native、S2-Semantic；
- `gemini-3.8-flash`，thinking `medium`，temperature 1，pair 内 model seed 相同；
- 每 turn 40 tool calls、44 requests；无 fallback，每个请求只尝试一次；
- 相同 task card、runtime、workspace、source oracle、actions 与 timeout；
- 只执行冻结的四个 slots 一次，不补跑、不看结果改题或改评分；
- action scorer 使用 `RESTORE_LAST_SUCCESSFUL`、`DEFINE_REPAIRED_PACKAGE`、`UPDATE_TO_REPAIRED_PACKAGE` 三个枚举 ID，不做工具名称或自然语言别名匹配。

## 执行前验证

- 冻结 source-tree SHA-256：`475f2bce6867a0d4133848756b0132e0f56dd1ae805ae9fbdbcc334efb122a5e`；
- 12 seeds × 2 interfaces = 24 个离线 arm-cases 全部通过；
- 每个 arm-case 的真实 Cordis/dsh reference recovery 均通过隐藏 runtime grade；
- pair 内 Agent-readable workspace 字节一致；
- Semantic schema 未暴露 raw runtime 工具，只保留共同 Package-source oracle；
- parser 回归、信息防火墙、typed absence 与 enumerated-action scorer 审计通过；
- 运行响应均报告 `gemini-3.8-flash`；模型 metadata 为 `models/gemini-3.8-flash`，metadata version `3.0`；
- 未在任何生成文件中发现 API key 模式。

## 结果

### 单 slot

| Seed | Arm | Validity | Primary | Runtime | Evidence calls | Total calls | Raw native domains | Gross input | 估算费用 |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| S1 | Semantic | valid | 通过 | 通过 | 2 | 6 | 0 | 50,489 | $0.063633 |
| S1 | Native | valid | 通过 | 通过 | 10 | 17 | 5 | 152,933 | $0.148259 |
| S2 | Native | valid | 通过 | 通过 | 11 | 22 | 5 | 196,247 | $0.176683 |
| S2 | Semantic | valid | 通过 | 通过 | 2 | 6 | 0 | 43,507 | $0.053086 |

4/4 在预算内完成；无 censored slot、无 infrastructure-invalid slot、无 critical semantic error。总估算费用为 `$0.441661`。

### 配对与均值

| 指标 | Native 均值 | Semantic 均值 | Semantic 相对变化 |
|---|---:|---:|---:|
| calls to evidence closure | 10.5 | 2.0 | -81.0% |
| total tool calls | 19.5 | 6.0 | -69.2% |
| observation calls | 16.5 | 3.0 | -81.8% |
| calls after evidence closure | 9.0 | 4.0 | -55.6% |
| raw native domains touched | 5.0 | 0.0 | -100% |
| gross input tokens | 174,590 | 46,998 | -73.1% |
| output + thinking tokens | 8,407.5 | 6,163 | -26.7% |
| tool-result bytes | 17,272.5 | 5,537 | -67.9% |
| repeated observation calls | 4.0 | 0.0 | -100% |
| 估算费用 | $0.324942 | $0.116719 | -64.1% |

逐 pair：

- S1：Semantic evidence closure 提前 8 calls，总调用少 11，gross input 少 102,444；
- S2：Semantic evidence closure 提前 9 calls，总调用少 16，gross input 少 152,740。

Semantic 两条轨迹的工具序列完全相同：

1. composed incident query；
2. failed-Package source oracle；
3. restore last successful；
4. define repaired Package；
5. update repaired Package；
6. composed verification query。

Native 分别使用 17 与 22 次调用，涉及 timeline、dynamic package、Fiber list、Fiber bindings/effects 与 services 五个 raw domains，并出现重复 Fiber/Package inspection。对原始 tool outputs 的复核确认：Native 在 evidence closure 前确实已读取 D0 direct/transitive bindings/effects 与失败 `pkg-2` 源码，因此 10/11-call closure 不是仅由 telemetry tag 误判造成。

## 对四个机制命题的更新

### \(E_1\)：semantic normalization reduces reconstruction burden

在本轮两个 pair 上得到一致的局部正证据。关键 evidence closure 从 10/11 calls 降到 2 calls。

### \(E_2\)：interface-first converts access into trajectory efficiency

本轮首次真正实施 treatment，并在两个 pair 上得到一致的局部正证据。Semantic 不再机械访问全部 native domains，更早的闭包传导为更少总调用、更少 post-closure 调用、更少 gross input 和更低估算费用。

### \(E_3\)：typed semantic obligations reduce downstream drift

只通过了窄 probe：4/4 均保留 `active_run={kind: KNOWN_ABSENT, package_id: null}`，计划和实际动作均通过枚举 ID 对齐。它不等于已经解决 `UNKNOWN` 输入进入普通二值表达式时的语义降级；那个 Hard failure 仍需要独立 checker experiment。

### \(E_4\)：capability boundary shift

仍未检验。两臂都是 2/2 primary/runtime pass，本轮不能声称 Semantic 更正确或提升能力上限。

## 预注册门

| Gate | 结果 |
|---|---|
| 至少 3/4 完成，且每臂至少一个完成 | PASS |
| 每个可比 pair 中 Semantic evidence closure 更早 | PASS |
| Semantic 不访问 raw native domains | PASS |
| 完成 pair 中 Semantic 总调用与 gross input 均更低 | PASS |
| scorer 无 lexical alias 依赖 | PASS |
| 无 infrastructure-invalid，parser 回归通过 | PASS |

## 可支持与不可支持的结论

当前可支持：

\[
\boxed{
\begin{aligned}
&\text{At this calibrated intermediate task point, an interface-first semantic}\
&\text{boundary reproduced earlier evidence closure in both pairs and converted}\
&\text{it into substantially lower observed trajectory burden.}
\end{aligned}
}
\]

当前不可支持：

- Semantic interface 一般性提高 Gemini 的正确率；
- 69% 或 73% 是可推广到其他任务/seed/model 的稳定效应量；
- typed obligations 已解决任意 UNKNOWN preservation；
- general lifecycle coverage、bounded model-checking correctness 或 runtime authority；
- Agent capability boundary 已发生位移。

最主要限制是只有两个 pair、一个任务家族和一个模型版本。接口的信息密度差异是 treatment 本身，但本轮无法区分其在其他真实任务上的稳定性，也不能进行总体统计推断。

## Gate decision

本轮达到了“可扩大预注册复制”的条件。最保守的下一步是保持本任务、接口、评分和预算不变，使用尚未付费执行的独立 seeds 做更大的 paired replication；不要在同一个 confirmatory batch 中同时加入完整 UNKNOWN checker 或更高难度任务。E3 checker 与 E4 boundary localization 应作为后续独立实验。
