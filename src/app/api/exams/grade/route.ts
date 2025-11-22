import { NextRequest, NextResponse } from "next/server";
import { gradeTheoryQuestions } from "@/controllers/examController";

// POST - Grade theory questions in a submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.submissionId || !body.gradedAnswers || !body.gradedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.gradedAnswers)) {
      return NextResponse.json(
        { error: "gradedAnswers must be an array" },
        { status: 400 }
      );
    }

    const result = await gradeTheoryQuestions(
      body.submissionId,
      body.gradedAnswers,
      body.gradedBy
    );

    if (result.success) {
      return NextResponse.json(
        {
          message: "Theory questions graded successfully",
          submission: result.submission,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
