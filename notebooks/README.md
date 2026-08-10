# 交互式实践 Notebook

## 实践路线

| 编号 | 方向 | 目录 | 说明 |
|------|------|------|------|
| 01 | 定理证明实践 | [01-theorem-proving-practice/](01-theorem-proving-practice/) | 使用 Lean 4 进行定理证明入门 |
| 02 | LLM 推理实践 | [02-llm-reasoning-practice/](02-llm-reasoning-practice/) | 使用 LLM 进行数学推理实验 |
| 03 | 形式化证明实践 | [03-formal-proof-practice/](03-formal-proof-practice/) | 形式化数学证明的实操 |

## 环境要求

```bash
# 安装 Lean 4
curl https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh -sSf | sh

# Python 环境
pip install torch transformers datasets lean-dojo
```