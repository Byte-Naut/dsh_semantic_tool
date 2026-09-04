# Cordis Agent Interface A/B：Gemini 3.8 Flash 12-run Pilot 审计

日期：2026-09-03  
实验：`cordis-agent-interface-gemini38-pilot-v1`

## 结论先行

本轮成功完成了一个严格同构、真实 runtime、无 fallback 的 12-run pilot。它给出了值得继续研究的效率信号，但**尚未建立确认性结论**：

\[
E:\quad \text{semantic interface causes a measurable benefit under a fixed independent strong model}
\]

冻结自动指标为：

- Native：4/6 primary pass；
- Relational：5/6 primary pass；
- 配对结果：Relational 胜 1、平 5、Native 胜 0；
- 12/12 hidden runtime grade 通过；
- 12/12 无 critical semantic error；
- Relational 平均少 1 次 tool call，少 16,987 gross input tokens，估算费用低 8.4%。

但 T1/T2 为 8/8 ceiling，且 T3 的三个自动 primary failure 都是“Turn 1 是否用冻结词法模式明确写出 `mode=run`”未命中；这三个 run 在 Turn 2 实际都按正确顺序执行了 `run(v1, mode=run)`，并通过 hidden runtime grade。因此，5/6 对 4/6 的正确性差异对 rubric 表达方式敏感，不应作为效应证明。

建议：**暂不按当前协议直接扩到 72 runs**。先修复两项 pilot instrumentation，并用新 seed 做一次小型 v2 pilot；效率方向可以保留为下一轮的预注册假设。

## 执行有效性

| 门控 | 结果 |
|---|---:|
| 预生成 main-study seeds | 36/36 通过 reference closure |
| Pilot model runs | 12/12 完成 |
| 基础设施 invalid | 0 |
| 请求模型 | `gemini-3.8-flash` |
| 每次响应报告的 modelVersion | `gemini-3.8-flash`，全部一致 |
| Model metadata name | `models/gemini-3.8-flash` |
| Model metadata version 字段 | `3.0`（Google 返回值，不能解释为精确后端 build） |
| Thinking | `medium` |
| Temperature | `1` |
| HTTP attempts | 1 |
| Fallback | 禁止，实际未发生 |
| Hidden runtime grade | 12/12 通过 |
| Critical semantic errors | 0 |

每个 run 使用独立 Gemini chat、独立 workspace、独立真实 Cordis/dsh runtime。两臂的 task card、采样 seed、系统提示、预算、timeout 和审批消息相同；Relational arm 只多一个只读 `software_semantic_query`。

信息防火墙已执行：模型未收到理论论文、Companion、完整 mirror rationale、reference delta、hidden oracle、grader、另一臂轨迹或历史轨迹。API Key 只作为 Google API 认证信息进入客户端进程，没有写入任务上下文或模型消息。

## 总体描述性结果

| 指标 | Native | Relational | Relational − Native |
|---|---:|---:|---:|
| Valid runs | 6 | 6 | 0 |
| 冻结 primary pass | 4 | 5 | +1 |
| Hidden runtime pass | 6 | 6 | 0 |
| Critical errors | 0 | 0 | 0 |
| 平均 tool calls | 21.33 | 20.33 | −1.00 |
| 平均 native observation calls | 12.00 | 10.00 | −2.00 |
| 平均 relational calls | 0 | 1.50 | +1.50 |
| 平均 gross input tokens | 152,688 | 135,701 | −16,987（−11.1%） |
| 平均 output + thinking tokens | 10,556 | 10,489 | −66 |
| 平均 wall time | 75.1 s | 77.7 s | +2.6 s |
| 总估算费用 | $0.9246 | $0.8467 | −$0.0779（−8.4%） |

这些是 n=6/arm 的描述性统计，不是显著性检验。

## 分任务结果

| Task | Arm | Primary | Runtime | 平均 tools | 平均 input | output+thinking | 费用 |
|---|---|---:|---:|---:|---:|---:|---:|
| T1 provider withdrawal | Native | 2/2 | 2/2 | 24.0 | 192,966 | 10,651 | $0.3693 |
| T1 provider withdrawal | Relational | 2/2 | 2/2 | 25.5 | 183,698 | 10,729 | $0.3560 |
| T2 LOADING replacement | Native | 2/2 | 2/2 | 16.5 | 91,984 | 10,282 | $0.2151 |
| T2 LOADING replacement | Relational | 2/2 | 2/2 | 15.0 | 99,141 | 13,683 | $0.2513 |
| T3 failed update | Native | 0/2 | 2/2 | 23.5 | 173,115 | 10,734 | $0.3402 |
| T3 failed update | Relational | 1/2 | 2/2 | 20.5 | 124,264 | 7,056 | $0.2393 |

T3 是唯一出现 primary 差异、并同时呈现较一致效率改善的任务；T1/T2 的正确性已经触顶。T2 的两个 seed 方向相反，说明小样本平均值不稳定。

## 配对轨迹

| Seed | Primary Δ | Tool Δ | Input-token Δ | Cost Δ | Relational query calls |
|---|---:|---:|---:|---:|---:|
| T1 s01 | 0 | −1 | −15,251 | −$0.0176 | 2 |
| T1 s02 | 0 | +4 | −3,285 | +$0.0043 | 2 |
| T2 s01 | 0 | −6 | −39,950 | −$0.0176 | 1 |
| T2 s02 | 0 | +3 | +54,264 | +$0.0538 | 1 |
| T3 s01 | 0 | −4 | −66,865 | −$0.0631 | 2 |
| T3 s02 | +1 | −2 | −30,836 | −$0.0378 | 1 |

Relational 在 5/6 配对中减少 gross input tokens，在 4/6 配对中减少 tool calls，在 4/6 配对中降低费用。Wall time 为 3 胜 3 负，未出现一致优势。

## Pilot 发现的两项 instrumentation 问题

### 1. Record-compliance 解析器缺陷

冻结解析器会从回答中较早的任意 fenced code block 开始匹配到末尾 JSON，因此当回答先包含 `javascript` 或 `diff` fence 时误报 JSON 解析失败。独立、只读取最后 `json` fence 的审计得到：

- Turn 1：12/12 是合法、唯一、终止 JSON；
- Turn 2：12/12 是合法、唯一、终止 JSON。

原报告中的 Native 1/6、Relational 3/6 record compliance 是 parser artifact。该字段不是 primary pass 的组成部分；完整回答文本仍被诊断检查读取，因此不改变本轮冻结 primary 计数。原始结果不被覆盖，修正只作为 post-hoc audit 报告。

### 2. T3 `explicitRestore` 判据过度词法化

冻结判据要求 Turn 1 文本命中特定 `explicit ... run` / `mode ... run` 词法形式。三个被判 primary failure 的回答都正确区分了 `pkg-1`、失败 `pkg-3` 与 active-run absence，并提出先恢复 pkg-1；随后实际动作均为：

1. 检查失败 Package 源码；
2. `run(pkg-1, mode=run)`；
3. 在同一 Plugin 定义唯一新 Package；
4. `update(newPackage)`；
5. decoy 不变，最终服务值正确。

因此冻结 primary 必须保留为 4/6 vs 5/6，但人工语义审计表明这一差异不能稳健解释为 relational correctness benefit。

## 72-run 预算

本 pilot 实际计量：

- gross input：1,730,335 tokens；
- candidate output：32,950 tokens；
- thinking：93,319 tokens；
- 按当前 Standard 费率估算：$1.7713。

官方在 2026-12-31 前的 Gemini 3.8 Flash Standard 费率为 input $0.75/M、output（含 thinking）$3.75/M。按本轮真实轨迹：

| 72-run 推算 | 金额 |
|---|---:|
| 按观察均值 | $10.63 |
| 按观察最大单 run × 72 | $14.05 |
| 建议当前预留（含约 20% buffer） | **$17** |

Google 公布 2027-01-01 起上述 Standard 费率翻倍；若届时执行，同样轨迹约为 $21.26–$28.11，建议预留约 $34。

计费来源：<https://ai.google.dev/gemini-api/docs/pricing>。模型稳定版本与能力来源：<https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash>。

## Gate 决策

本轮通过：

\[
\boxed{\text{自动 A/B harness 可运行，信息防火墙与真实 differential grader 可工作}}
\]

本轮没有通过：

\[
\boxed{\text{按当前 task/rubric 直接扩大到 72 runs}}
\]

建议 v2 在看到新模型输出前预注册并冻结：

1. 修复 terminal-JSON parser，并加入“前面存在 javascript/diff fences”的回归测试；
2. 在 Turn 1 结构化记录中加入 `planned_lifecycle_actions`，直接评分 `{pluginId, packageId, mode}`，移除词法猜测；
3. 保留 T3，重新校准 T1/T2 以避免 100% ceiling；
4. 继续记录 gross/trajectory tokens，不使用显式 context cache；
5. 先用全新 seed 做一次小型 v2 calibration，门控通过后再执行 72-run confirmatory study。

## 安全说明

扫描未发现 API Key 被写入源码、workspace、日志或实验产物。由于 Key 曾以明文出现在对话消息中，实验完成后仍应立即在 Google AI Studio 撤销并轮换。
