import { generateCityReportWithOpenAiCompatible } from "@/lib/ai/openai-compatible";
import type { CityReport } from "@/lib/mock-report";

export async function generateCityReport(
  answers: string[],
): Promise<CityReport> {
  return generateCityReportWithOpenAiCompatible(answers);
}
