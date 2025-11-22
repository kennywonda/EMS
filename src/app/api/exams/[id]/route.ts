import { NextRequest, NextResponse } from "next/server";
import {
  getExamById,
  deleteExam,
  updateExam,
  getExamSubmissions,
} from "@/controllers/examController";

// GET - Fetch exam by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getExamById(id);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.exam }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update exam
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateExam(id, body);

    if (result.success) {
      return NextResponse.json(
        { message: "Exam updated successfully", exam: result.exam },
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

// DELETE - Delete exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteExam(id);

    if (result.success) {
      return NextResponse.json(
        { message: "Exam deleted successfully" },
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
