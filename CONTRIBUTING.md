# 贡献指南

感谢你对 AI4Math 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 论文收录建议

如果你发现值得收录的论文：

1. 查看 [papers/](papers/) 目录确认论文是否已被收录
2. 在 [Issues](https://github.com/YOUR_USERNAME/AI4Math/issues) 中选择 **论文收录建议** 模板
3. 填写论文标题、链接、所属分类、推荐理由

### 论文收录 PR 流程

1. **Fork** 本仓库
2. 在对应分类目录下创建或更新论文条目
3. **论文条目模板**（以 Markdown 文件形式）：

```markdown
# [论文标题]

- **链接**: [arXiv](https://arxiv.org/abs/XXXX.XXXXX) | [PDF](https://...)
- **作者**: 作者1, 作者2, ...
- **发表**: 会议/期刊, 年份
- **关键词**: 关键词1, 关键词2
- **简介**: 1-2 段中文简介
- **亮点**: 列出主要贡献
- **相关论文**: 引用其他相关论文
```

4. 更新 `papers/INDEX.md` 中的索引
5. 提交 PR，等待 Review

### 讲解文章投稿

1. 在 `explainers/` 目录下创建 Markdown 文件
2. 参考 `explainers/_template.md` 模板
3. 提交 PR

### 其他贡献

- 修复 Broken Links 或错误
- 改进可视化
- 添加 Notebook 示例
- 更新资源清单

## 提交规范

- 分支命名: `feat/xxx`, `fix/xxx`, `docs/xxx`
- Commit 信息: 简洁描述改动内容
- 一个 PR 专注一个主题