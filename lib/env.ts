export interface AiEnv {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function getAiEnv(): AiEnv {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL;

  const missing = [
    ["AI_API_KEY", apiKey],
    ["AI_BASE_URL", baseUrl],
    ["AI_MODEL", model],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`缺少 AI 环境变量：${missing.join(", ")}`);
  }

  return {
    apiKey: apiKey!,
    baseUrl: baseUrl!.replace(/\/+$/, ""),
    model: model!,
  };
}
