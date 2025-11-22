import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

// POST - Register a new student
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    console.log("📝 [REGISTER] Registration attempt for:", body.email);
    console.log("📝 [REGISTER] Password received:", body.password);
    console.log("📝 [REGISTER] Password length:", body.password?.length);

    // Validate required fields
    if (!body.name || !body.email || !body.studentId || !body.password || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, studentId, password, phone" },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email: body.email.toLowerCase() }, { studentId: body.studentId }],
    });

    if (existingStudent) {
      console.log("❌ [REGISTER] Student already exists");
      return NextResponse.json(
        { error: "Student with this email or student ID already exists" },
        { status: 409 }
      );
    }

    // TEMPORARILY DISABLED: Hash password manually
    console.log("⚠️ [REGISTER] Storing password as plain text (TEMPORARY)");
    // const hashedPassword = await bcrypt.hash(body.password, 10);
    // console.log("✅ [REGISTER] Password hashed:", hashedPassword.substring(0, 20) + "...");

    // Create new student with plain text password (TEMPORARY)
    const student = await Student.create({
      name: body.name,
      email: body.email.toLowerCase(),
      studentId: body.studentId,
      phone: body.phone,
      password: body.password, // Plain text (TEMPORARY)
      course: body.course || "",
      department: body.department || "",
      yearOfStudy: body.yearOfStudy || 1,
      address: body.address || "",
      dateOfBirth: body.dateOfBirth || null,
      isActive: true,
    });

    console.log("✅ [REGISTER] Student created:", student._id);
    console.log("✅ [REGISTER] Student isActive:", student.isActive);
    console.log("✅ [REGISTER] Full student object:", JSON.stringify({
      _id: student._id,
      email: student.email,
      isActive: student.isActive,
      hasPassword: !!student.password,
      passwordLength: student.password?.length
    }));

    // Return student data (exclude password)
    const studentData = {
      _id: student._id,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      department: student.department,
      course: student.course,
      yearOfStudy: student.yearOfStudy,
      phone: student.phone,
      address: student.address,
    };

    return NextResponse.json(
      {
        message: "Student registered successfully",
        student: studentData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
