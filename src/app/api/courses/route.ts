import { NextRequest, NextResponse } from "next/server";
import {
  createCourse,
  getAllCourses,
  getCourseStats,
} from "@/controllers/courseController";

// GET - Fetch all courses or stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") || undefined;
    const semester = searchParams.get("semester") || undefined;
    const isActive = searchParams.get("isActive");
    const teacher = searchParams.get("teacher") || undefined;
    const getStats = searchParams.get("stats");

    // If stats requested, return stats
    if (getStats === "true") {
      const result = await getCourseStats();
      if (result.success) {
        return NextResponse.json({ stats: result.stats }, { status: 200 });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }

    // Otherwise return courses
    const filters: any = {};
    if (department) filters.department = department;
    if (semester) filters.semester = semester;
    if (isActive !== null) filters.isActive = isActive === "true";
    if (teacher) filters.teacher = teacher;

    const result = await getAllCourses(filters);

    if (result.success) {
      return NextResponse.json({ courses: result.courses }, { status: 200 });
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

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.code || !body.department || !body.semester) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!body.credits || body.credits < 1) {
      return NextResponse.json(
        { error: "Credits must be at least 1" },
        { status: 400 }
      );
    }

    if (!body.capacity || body.capacity < 1) {
      return NextResponse.json(
        { error: "Capacity must be at least 1" },
        { status: 400 }
      );
    }

    const result = await createCourse(body);

    if (result.success) {
      return NextResponse.json(
        { message: "Course created successfully", course: result.course },
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
