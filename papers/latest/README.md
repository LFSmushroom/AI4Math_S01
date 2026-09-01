# 最新动态

> 2025-2026 年 AI 在前沿数学领域的爆炸性突破（按时间倒序）。

---

## 2026

| 日期 | 突破 | 机构 | 分类 | 要点 | 链接 |
|------|------|------|------|------|------|
| 2026-08-24 | **六维球面复结构存在性（Hopf问题，1948）** | Levent Alpöge / Anthropic Claude | 复几何 | 困扰学界 78 年的著名开放问题：六维球面上是否存在真正可积的复结构？Alpöge 和 Claude 给出明确构造：通过 (3,4,∞) 三角群折叠底座 + 挂载复 2-环面纤维 + 三种退化填充完成紧致复三维流形，并证明其微分同胚于S⁶。手稿共 108 页，GPT-5.6 Sol 审查未发现问题。若成立将是菲尔兹级成果。 | [手稿](https://alpo.ge/s6.pdf) <br> [文章](https://www.sina.cn/news/detail/5335503268479334.html) |
| 2026-07-20 | **雅可比猜想（Jacobian Conjecture）三维反例** | Levent Alpöge / Anthropic Claude Fable 5 | 代数几何 | 悬置 87 年的雅可比猜想被 AI 找到明确反例：一个三次多项式映射 F: C³ → C³，Jacobi 行列式恒等于-2，但三个不同点映射到同一点，因此不是可逆映射。反例仅 216 字符，一天内就经独立验证确认。此结果直接推翻三维猜想，并连带解决了 Hessian 猜想在 n ≥ 5 维的情况。 | [反例](https://github.com/dasjoms/jacobian-conjecture-counterexample-exploration) <br> [arXiv](https://arxiv.org/pdf/2607.22198v2) |
| 2026-08-18 | **森多夫猜想 (Sendov's Conjecture) 完全证明** | Lech Mazur / OpenAI GPT-5.6 Pro / 陶哲轩 | 复分析 | 困扰数学界约 70 年的猜想被 AI 完全攻克。Lech Mazur 使用 GPT-5.6 Pro 辅助完成证明，配有约 9 万行 Lean 4 形式化代码。陶哲轩随后将证明简化至 1.5 万行，并发现实际上还证明了更强的 Phelps-Rodriguez 猜想。证明仅依赖代数基本定理、Möbius 变换和 Maclaurin 不等式，惊人的初等。 | - |
| 2026-08-10 | **黎曼 ζ 函数零点比例下界提升至 67.2%** | Anthropic Claude（研究版） | 解析数论 | Claude 未公开研究版在尝试证明黎曼猜想的过程中，将临界线上零点比例的可证明下界从 41.6%（人类 37 年积累）提升至 67.2%。模型自主组织 60 个子 Agent，运行 36 小时，消耗 3100 万输出 Token，执行 2400 条 Shell 命令。提出新的秩-迹不等式，将 Weil 公式限制在有限维 Gabor 函数空间中，将解析数论问题转化为 Hermitian 矩阵问题。 | [官方公告](https://www.anthropic.com/research/riemann-zeta) <br> [论文](https://www-cdn.anthropic.com/95c246936988e43127bc6b2ceb7077c1dad2d68e.pdf) |
| 2026-08-01 | **Astra 十项重大突破（含非sofic群、Connes刚性猜想证伪等）** | OpenAI Astra | 多领域 | OpenAI 下一代模型 Astra 解决了 10 个开放超十年以上的数学难题，涵盖高维球体堆积、编码理论、群论、算子代数、量子复杂度等。核心成果包括：**构造非sofic群**（1999 年 Gromov 提出以来首次）、**证伪 Connes 刚性猜想**、**破解 Erdős 第 183 号多色 Ramsey 数问题**、**突破 1978 年以来高维球体堆积密度上界**。总计算成本约 $2,000，所有证明均配有 Lean 形式化证书。 | [官网](https://openai.com/index/ten-advances-in-mathematics/) <br> [GitHub](https://github.com/openai/ten-proofs) |
| 2026-05-21 | **AlphaProof Nexus 解决 9 个 Erdős 开放问题** | Google DeepMind | 组合数学/数论 | 全新 AI 证明搜索系统，将 Gemini 3.1 Pro 与 Lean 证明验证器深度结合。成功解决 353 个形式化 Erdős 问题中的 9 个（最早可追溯至 56 年前），证明 44 个 OEIS 猜想，并解决了代数几何中悬置 15 年的纯 O-序列对数凹性问题。单题推理成本仅数百美元。 | - |
| 2026-05-20 | **单位距离猜想证伪（Erdős 1946 年问题）** | OpenAI 内部推理模型 | 离散几何 | AI 首次自主解决核心数学未解问题。模型利用代数数论技术，构造出超越传统正方形网格的点集排列，证明 Erdős 关于平面单位距离最大值的猜想错误。菲尔兹奖得主 Timothy Gowers 称其为"AI 数学里程碑"。证明已获独立数学家验证。 | [OpenAI](https://openai.com/index/model-disproves-discrete-geometry-conjecture/) |
| 2026-02 | **Numina-Lean-Agent 证明全部 Putnam 2025 试题** | 中科院数学院 & Numina | 形式化证明 | 开源形式化定理证明系统，成功形式化证明 2025 年 William Lowell Putnam 数学竞赛全部 12 道试题。性能与 AxiomProver 持平，优于 Aristotle 和 Seed-Prover 1.5。还支持人机协作的"vibe proving"，两周内完成一篇论文的形式化。已被 ICML 2026 接收。 | - |

## 2025

| 日期 | 突破 | 机构 | 分类 | 要点 | 链接 |
|------|------|------|------|------|------|
| 2025 | **Erdős #1196 问题被业余爱好者 + ChatGPT 破解** | 业余爱好者 Liam Price / ChatGPT | 数论 | 23 岁英国业余数学爱好者 Liam Price 在 ChatGPT 辅助下，解决了困扰世界顶尖数学家 60 年的 Erdős 第 1196 号问题。ChatGPT 没有采用传统概率论方法，而是直接在原始数论语言中推进证明，隐含建立了数论与概率之间的联系。陶哲轩对此做出正面评价。 | - |
| 2025-11 | **AlphaProof Nature 论文发表** | Google DeepMind | 定理证明 | AlphaProof 系统论文正式发表于 Nature，展示了 3B 参数编码器-解码器 Transformer 模型，通过强化学习在约 8000 万形式化问题上训练，结合 AlphaGeometry 2 在 2024 IMO 中获得银牌水平（28/42 分）。 | [论文](https://www.nature.com/articles/s41586-025-08539-0) |
| 2025-05 | **IMO 2025 金牌级 AI** | Harmonic / 字节跳动 | 定理证明 | Aristotle 和 Seed-Prover 相继在 2025 IMO 中达到金牌水平，标志着 AI 在竞赛数学上已超越人类顶尖选手。 | - |

## 关键趋势总结

1. **从竞赛到前沿**: AI 数学能力已从 IMO 竞赛题跨越到研究级开放问题（Erdős 问题、黎曼猜想、六维球面复结构）
2. **形式化验证成为标配**: Lean 4 成为 AI 数学证明的核心验证工具，多家机构发布 Lean 形式化证书
3. **成本骤降**: AlphaProof Nexus 单题数百美元，Astra 十题仅 $2,000——AI 数学研究的边际成本急剧下降
4. **多智能体协作**: Claude 的 60 Agent 组织架构展示了 AI 自主科研的新范式——大量 Agent 并行探索，少数产出关键突破
5. **跨领域创新能力**: AI 模型展现出跨数学子领域的"迁移"能力，如将代数数论用于离散几何问题

### 业内观点（陶哲轩，2026-09）

> "整个 2026 年，AI 正在以每周数道的速度攻克几十年来无人能解的数学难题……数学界只剩几个月时间来应对 AI 带来的‘证明过剩’危机。"
>
> AI 让数学从"证明稀缺"进入"证明过剩"时代：生成和验证环节加速，但人类"消化"证明（理解、提炼方法）的速度跟不上。陶哲轩建议数学界加速开发 AI 证明自动简化工具，将 AI 产出的"生肉"加工成人类可读的"熟食"。

---

*最后更新: 2026-09-01*