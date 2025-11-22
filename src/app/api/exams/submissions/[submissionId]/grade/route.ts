import { NextRequest, NextResponse } from "next/server";
import { gradeSubmission } from "@/controllers/examController";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await context.params;
    const body = await req.json();

    const { grades } = body;

    if (!grades || !Array.isArray(grades)) {
      return NextResponse.json(
        { error: "Grades array is required" },
        { status: 400 }
      );
    }

    // Validate grade structure
    for (const grade of grades) {
      if (
        typeof grade.questionNumber !== "number" ||
        typeof grade.pointsAwarded !== "number"
      ) {
        return NextResponse.json(
          {
            error:
              "Each grade must have questionNumber and pointsAwarded as numbers",
          },
          { status: 400 }
        );
      }
    }

    const result = await gradeSubmission(submissionId, grades);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.submission,
    });
  } catch (error: any) {
    console.error("Error grading submission:", error);
    return NextResponse.json(
      { error: error.message || "Failed to grade submission" },
      { status: 500 }
    );
  }
}
