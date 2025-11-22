import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

// PUT - Update student password (for fixing plain text passwords)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const { email, newPassword } = await request.json();

    console.log("🔧 [FIX PASSWORD] Fixing password for:", email);

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    // Find student
    const student = await Student.findOne({ email: email.toLowerCase() });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    console.log("✅ [FIX PASSWORD] Student found:", student.name);
    console.log("🔑 [FIX PASSWORD] Old password:", student.password);

    // Hash the new password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log("🔑 [FIX PASSWORD] New hashed password:", hashedPassword.substring(0, 20) + "...");

    // Update password directly without triggering pre-save hook
    student.password = hashedPassword;
    await student.save();

    console.log("✅ [FIX PASSWORD] Password updated successfully");

    // Test the password immediately
    const testCompare = await bcrypt.compare(newPassword, student.password);
    console.log("🧪 [FIX PASSWORD] Test comparison:", testCompare);

    return NextResponse.json(
      {
        message: "Password updated successfully",
        testResult: testCompare,
        passwordHashPreview: hashedPassword.substring(0, 20) + "...",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [FIX PASSWORD] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
