import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

// GET - Check all students in database
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const students = await Student.find({})
      .select('name email studentId isActive createdAt')
      .lean();

    console.log("📊 [CHECK] Total students in DB:", students.length);
    
    students.forEach((student: any, index: number) => {
      console.log(`📋 [CHECK] Student ${index + 1}:`, {
        email: student.email,
        isActive: student.isActive,
        isActiveType: typeof student.isActive,
        createdAt: student.createdAt
      });
    });

    return NextResponse.json(
      {
        count: students.length,
        students: students.map((s: any) => ({
          email: s.email,
          name: s.name,
          studentId: s.studentId,
          isActive: s.isActive,
          isActiveType: typeof s.isActive,
          createdAt: s.createdAt
        }))
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [CHECK] Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
