import { NextRequest, NextResponse } from "next/server";
import { submitExam, getExamForStudent } from "@/controllers/examController";

// POST - Submit exam answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.examId || !body.studentId || !body.answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { error: "Answers array is required" },
        { status: 400 }
      );
    }

    const result = await submitExam(body);

    if (result.success) {
      return NextResponse.json(
        {
          message: "Exam submitted successfully",
          submission: result.submission,
        },
        { status: 201 }
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
