import { NextRequest, NextResponse } from "next/server";
import { enrollStudent, removeStudent } from "@/controllers/courseController";

// POST - Enroll a student in a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const result = await enrollStudent(id, body.studentId);

    if (result.success) {
      return NextResponse.json(
        { message: "Student enrolled successfully", course: result.course },
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

// DELETE - Remove a student from a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const result = await removeStudent(id, studentId);

    if (result.success) {
      return NextResponse.json(
        { message: "Student removed successfully", course: result.course },
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
