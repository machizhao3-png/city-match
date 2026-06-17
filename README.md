# city-match

算一算你适合居住的城市

## 项目简介

city-match 是一个“单页问卷 + AI 报告生成器”。用户回答 6 道趣味问题后，后端会调用 Bob API / OpenAI-compatible API，让 AI 根据用户偏好推荐适合居住的城市，并生成带雷达图的城市报告卡片。

报告会展示城市名、匹配度、3 个 Tag、用户偏好 vs 城市表现雷达图，以及一段有趣犀利的推荐理由。

## 功能列表

- 6 道趣味问卷题
- 自动进入下一题
- 生成 AI 城市报告
- 展示城市名、匹配度、3 个 Tag
- 展示用户偏好 vs 城市表现雷达图
- 重新测试
- 加载状态和错误提示

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI-compatible API
- Bob API / 国内模型

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

## 环境变量配置

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

在 `.env.local` 中填写：

```env
AI_PROVIDER=custom
AI_API_KEY=你的 API Key
AI_BASE_URL=https://bobdong.cn/v1
AI_MODEL=DeepSeek-V3.2
```

注意：

- 不要提交 `.env.local`
- 不要把真实 API Key 上传到 GitHub

## 核心接口

### POST `/api/generate-report`

请求：

```json
{
  "answers": ["...", "..."]
}
```

返回：

```json
{
  "report": {
    "city": "厦门",
    "matchScore": 92,
    "tags": ["xxx", "xxx", "xxx"],
    "userProfile": {},
    "cityProfile": {},
    "reason": "..."
  }
}
```

## 项目结构

```text
app/page.tsx
app/api/generate-report/route.ts
components/report-card.tsx
components/radar-chart.tsx
lib/questions.ts
lib/city-knowledge.ts
lib/ai/openai-compatible.ts
lib/env.ts
```

## 后续计划

- 增加截图分享海报
- 增加更多城市知识库
- 支持切换阿里云百炼 / 火山方舟等国内模型
- 后续可部署到国内云平台
