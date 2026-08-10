# 术语表（中英对照）

> AI4Math 领域核心术语的中英对照与简要解释。

## 数学推理

| 英文 | 中文 | 解释 |
|------|------|------|
| Theorem Proving | 定理证明 | 从已知公理和定理出发，通过逻辑推理得出结论 |
| Automated Theorem Proving (ATP) | 自动定理证明 | 使用计算机自动证明数学定理 |
| Mathematical Reasoning | 数学推理 | 解决数学问题（算术、代数、几何等）的逻辑过程 |
| Chain-of-Thought (CoT) | 思维链 | 逐步推理的提示策略，让 LLM 展示推理过程 |
| Process Reward Model (PRM) | 过程奖励模型 | 对推理的每一步进行评分，而非仅对最终答案评分 |

## 形式化数学

| 英文 | 中文 | 解释 |
|------|------|------|
| Formal Mathematics | 形式化数学 | 使用形式化语言严格表述数学定义和证明 |
| Interactive Theorem Prover (ITP) | 交互式定理证明器 | 用户与计算机交互完成证明的工具 |
| Autoformalization | 自动形式化 | 将自然语言数学自动翻译为形式化语言 |
| Proof Repair | 证明修复 | 自动修复不完全或错误的形式化证明 |
| Tactic | 策略 | ITP 中用于推进证明状态的命令 |

## 方法

| 英文 | 中文 | 解释 |
|------|------|------|
| Reinforcement Learning (RL) | 强化学习 | 通过奖励信号训练智能体做决策 |
| Neuro-Symbolic | 神经符号 | 结合神经网络和符号推理的方法 |
| SMT (Satisfiability Modulo Theories) | 可满足性模理论 | 判定一阶逻辑公式在特定理论下可满足性 |
| Graph Neural Network (GNN) | 图神经网络 | 处理图结构数据的神经网络 |

## 评估

| 英文 | 中文 | 解释 |
|------|------|------|
| Pass@k | 通过率@k | 生成 k 个候选中至少有一个正确的概率 |
| Accuracy | 准确率 | 模型正确解答的比例 |
| Proof Length | 证明长度 | 形式化证明的步骤数 |