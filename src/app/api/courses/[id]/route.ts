import { NextRequest, NextResponse } from "next/server";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
} from "@/controllers/courseController";

// GET - Fetch course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getCourseById(id);

    if (result.success) {
      return NextResponse.json({ course: result.course }, { status: 200 });
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

// PUT - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateCourse(id, body);

    if (result.success) {
      return NextResponse.json(
        { message: "Course updated successfully", course: result.course },
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

// DELETE - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteCourse(id);

    if (result.success) {
      return NextResponse.json(
        { message: "Course deleted successfully" },
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
