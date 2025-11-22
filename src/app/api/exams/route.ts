import { NextRequest, NextResponse } from "next/server";
import {
  createExam,
  getAllExams,
  getExamById,
  deleteExam,
  updateExam,
} from "@/controllers/examController";

// GET - Fetch all exams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const course = searchParams.get("course") || undefined;
    const department = searchParams.get("department") || undefined;
    const isActive = searchParams.get("isActive");

    const filters: any = {};
    if (course) filters.course = course;
    if (department) filters.department = department;
    if (isActive !== null) filters.isActive = isActive === "true";

    const result = await getAllExams(filters);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.exams },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new exam
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.course || !body.department || !body.questions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json(
        { error: "Exam must have at least one question" },
        { status: 400 }
      );
    }

    const result = await createExam(body);

    if (result.success) {
      return NextResponse.json(
        { message: "Exam created successfully", exam: result.exam },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
