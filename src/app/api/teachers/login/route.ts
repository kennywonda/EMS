import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    // Remove password before sending
    const teacherObj: { [key: string]: any, password?: string } = teacher.toObject();
    delete teacherObj.password;
    // You can add JWT/session logic here if needed
    return NextResponse.json({ teacher: teacherObj, role: "teacher" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
