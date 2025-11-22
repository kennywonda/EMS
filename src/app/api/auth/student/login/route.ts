import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    console.log("🔵 [LOGIN] Login attempt for email:", email);
    console.log("🔵 [LOGIN] Password received:", password);
    console.log("🔵 [LOGIN] Password length:", password?.length);
    console.log("🔵 [LOGIN] Password type:", typeof password);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find student by email
    const student = await Student.findOne({ email: email.toLowerCase() });

    if (!student) {
      console.log("❌ [LOGIN] Student not found");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("✅ [LOGIN] Student found:", student.name);
    console.log("🔑 [LOGIN] Password hash starts with:", student.password.substring(0, 10));
    console.log("🔍 [LOGIN] Student isActive value:", student.isActive);
    console.log("🔍 [LOGIN] Student isActive type:", typeof student.isActive);
    console.log("🔍 [LOGIN] Full student data:", JSON.stringify({
      _id: student._id,
      email: student.email,
      isActive: student.isActive,
      name: student.name
    }));

    // Check if student is active
    if (!student.isActive) {
      console.log("❌ [LOGIN] Student account is inactive - isActive is:", student.isActive);
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact administration." },
        { status: 403 }
      );
    }
    
    console.log("✅ [LOGIN] Student account is ACTIVE");

    // TEMPORARILY DISABLED: Verify password with bcrypt
    console.log("⚠️ [LOGIN] Using plain text password comparison (TEMPORARY)");
    console.log("🔐 [LOGIN] Comparing:", password, "with stored:", student.password);
    const isPasswordValid = password === student.password;
    console.log("🔐 [LOGIN] Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ [LOGIN] Password comparison failed");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    console.log("✅ [LOGIN] Password comparison SUCCESS");

    // Generate token (in production, use JWT)
    const token = Buffer.from(`${student._id}:${Date.now()}`).toString("base64");

    // Return student data (exclude sensitive fields)
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
        message: "Login successful",
        student: studentData,
        token: token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Student login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
