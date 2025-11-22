import { NextRequest, NextResponse } from "next/server";
import { createTeacher } from "@/controllers/teacherController";
import connectDB from "@/lib/mongodb";
import Teacher from "@/models/Teacher";

// GET all teachers
export async function GET(req: NextRequest) {
  console.log("🟡 [TEACHER ROUTE] GET /api/teachers called");
  try {
    await connectDB();
    
    // Get all teachers, excluding passwords
    const teachers = await Teacher.find({}).select("-password").sort({ createdAt: -1 });
    
    console.log(`✅ [TEACHER ROUTE] Found ${teachers.length} teachers`);
    return NextResponse.json({ success: true, teachers }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [TEACHER ROUTE] Error:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

// POST create new teacher
export async function POST(req: NextRequest) {
  console.log("🟡 [TEACHER ROUTE] POST /api/teachers called");
  try {
    const data = await req.json();
    console.log("🟡 [TEACHER ROUTE] Payload:", { ...data, email: data?.email, employeeId: data?.employeeId });

    // Basic validation
    if (!data?.name || !data?.email || !data?.phone || !data?.employeeId || !data?.password) {
      console.log("❌ [TEACHER ROUTE] Missing fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const teacher = await createTeacher({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      subject: data.subject,
      department: data.department,
      employeeId: data.employeeId,
      address: data.address,
    });

    return NextResponse.json({ success: true, teacher }, { status: 201 });
  } catch (error: any) {
    console.error("❌ [TEACHER ROUTE] Error:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
