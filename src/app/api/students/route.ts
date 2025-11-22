import { NextRequest, NextResponse } from "next/server";
import { createStudent } from "@/controllers/studentController";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

// GET all students
export async function GET(req: NextRequest) {
  console.log("🟡 [STUDENT ROUTE] GET /api/students called");
  try {
    await connectDB();
    
    // Get all students, excluding passwords
    const students = await Student.find({}).select("-password").sort({ createdAt: -1 });
    
    console.log(`✅ [STUDENT ROUTE] Found ${students.length} students`);
    return NextResponse.json({ success: true, students }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [STUDENT ROUTE] Error:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

// POST create new student
export async function POST(req: NextRequest) {
  console.log("🟡 [STUDENT ROUTE] POST /api/students called");
  try {
    const data = await req.json();
    console.log("🟡 [STUDENT ROUTE] Payload:", { 
      name: data?.name,
      email: data?.email, 
      studentId: data?.studentId 
    });

    // Basic validation
    if (!data?.name || !data?.email || !data?.studentId || !data?.phone || !data?.password) {
      console.log("❌ [STUDENT ROUTE] Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const student = await createStudent({
      name: data.name,
      email: data.email,
      studentId: data.studentId,
      phone: data.phone,
      password: data.password,
      course: data.course,
      department: data.department,
      yearOfStudy: data.yearOfStudy,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
    });

    return NextResponse.json({ success: true, student }, { status: 201 });
  } catch (error: any) {
    console.error("❌ [STUDENT ROUTE] Error:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
