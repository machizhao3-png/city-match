import { generateCityReport } from "@/lib/ai";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return invalidAnswers();
  }

  const answers =
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    "answers" in body
      ? (body as { answers?: unknown }).answers
      : undefined;

  if (!Array.isArray(answers) || answers.length !== 6) {
    return invalidAnswers();
  }

  try {
    const report = await generateCityReport(answers);
    return Response.json({ report });
  } catch (error) {
    console.error("generate report failed", {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return Response.json(
      {
        error: "generate_report_failed",
        message:
          error instanceof Error
            ? error.message
            : "城市报告生成失败，请稍后再试。",
      },
      { status: 502 },
    );
  }
}

function invalidAnswers() {
  return Response.json(
    {
      error: "invalid_answers",
      message: "请先完成 6 道题再生成报告。",
    },
    { status: 400 },
  );
}
