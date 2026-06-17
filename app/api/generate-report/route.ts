import { mockReport } from "@/lib/mock-report";

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

  return Response.json({ report: mockReport });
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
