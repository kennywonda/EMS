import { NextRequest, NextResponse } from "next/server";
import { getSubmissionById } from "@/controllers/examController";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await context.params;

    const result = await getSubmissionById(submissionId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.submission,
    });
  } catch (error: any) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
