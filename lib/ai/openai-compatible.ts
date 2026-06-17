import { cityKnowledge } from "@/lib/city-knowledge";
import { getAiEnv } from "@/lib/env";
import type { CityReport, Profile } from "@/lib/mock-report";

const PROFILE_KEYS = ["烟火气", "自然感", "文艺值", "搞钱值", "松弛度", "社交力"] as const;

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function generateCityReportWithOpenAiCompatible(
  answers: string[],
): Promise<CityReport> {
  const env = getAiEnv();
  const response = await fetch(`${env.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.model,
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(answers),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `AI 接口调用失败：${response.status} ${response.statusText}${errorText ? `，${errorText.slice(0, 200)}` : ""}`,
    );
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const rawContent = payload.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("AI 接口没有返回报告内容。");
  }

  return parseCityReport(rawContent);
}

function buildSystemPrompt() {
  return `你是“算一算你适合居住的城市”的城市人格报告生成器。

任务：
根据用户 6 道题的答案，从候选城市知识库里选择最匹配的一座城市，并生成一份有趣、犀利、第二人称的城市报告。

输出要求：
1. 只返回 JSON，不要解释，不要 markdown，不要代码块。
2. JSON 必须完全符合这个结构：
{
  "city": "成都",
  "matchScore": 88,
  "tags": ["xxx", "xxx", "xxx"],
  "userProfile": {
    "烟火气": 4.5,
    "自然感": 3.2,
    "文艺值": 3.8,
    "搞钱值": 2.9,
    "松弛度": 4.7,
    "社交力": 4.1
  },
  "cityProfile": {
    "烟火气": 4.8,
    "自然感": 3.6,
    "文艺值": 3.8,
    "搞钱值": 3.2,
    "松弛度": 4.6,
    "社交力": 4.4
  },
  "reason": "第二人称、有趣、犀利、不超过120字"
}
3. city 必须来自候选城市知识库。
4. cityProfile 必须使用该城市知识库里的 6 个维度评分。
5. userProfile 的 6 个维度评分必须是 0 到 5 之间的数字。
6. matchScore 必须是 0 到 100 之间的整数。
7. tags 必须是 3 个中文短标签。
8. reason 必须用“你”开头或以第二人称写作，不超过 120 字。`;
}

function buildUserPrompt(answers: string[]) {
  return JSON.stringify(
    {
      answers: answers.map((answer, index) => ({
        questionNumber: index + 1,
        answer,
      })),
      cityKnowledge,
    },
    null,
    2,
  );
}

function parseCityReport(rawContent: string): CityReport {
  const cleaned = stripCodeBlock(rawContent);

  let value: unknown;
  try {
    value = JSON.parse(cleaned);
  } catch {
    throw new Error("AI 返回内容不是有效 JSON。");
  }

  return validateCityReport(value);
}

function stripCodeBlock(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

function validateCityReport(value: unknown): CityReport {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("AI 返回报告结构无效。");
  }

  const report = value as Partial<CityReport>;
  if (typeof report.city !== "string") {
    throw new Error("AI 返回报告缺少 city。");
  }
  if (!cityKnowledge.some((item) => item.city === report.city)) {
    throw new Error("AI 返回城市不在候选城市知识库中。");
  }
  if (
    typeof report.matchScore !== "number" ||
    !Number.isInteger(report.matchScore) ||
    report.matchScore < 0 ||
    report.matchScore > 100
  ) {
    throw new Error("AI 返回 matchScore 无效。");
  }
  if (
    !Array.isArray(report.tags) ||
    report.tags.length !== 3 ||
    !report.tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error("AI 返回 tags 无效。");
  }
  if (!isValidProfile(report.userProfile)) {
    throw new Error("AI 返回 userProfile 无效。");
  }
  if (!isValidProfile(report.cityProfile)) {
    throw new Error("AI 返回 cityProfile 无效。");
  }
  if (typeof report.reason !== "string" || report.reason.length > 120) {
    throw new Error("AI 返回 reason 无效。");
  }

  return report as CityReport;
}

function isValidProfile(profile: unknown): profile is Profile {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return false;
  }

  const values = profile as Record<string, unknown>;
  return PROFILE_KEYS.every((key) => {
    const value = values[key];
    return typeof value === "number" && value >= 0 && value <= 5;
  });
}
