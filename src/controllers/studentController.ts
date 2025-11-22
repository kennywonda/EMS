import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

interface StudentData {
  name: string;
  email: string;
  studentId: string;
  phone: string;
  password: string;
  course?: string;
  department?: string;
  yearOfStudy?: number;
  address?: string;
  dateOfBirth?: string;
}

export async function createStudent(data: StudentData) {
  console.log("🟢 [CONTROLLER] createStudent called with:", {
    name: data.name,
    email: data.email,
    studentId: data.studentId,
    phone: data.phone,
  });

  await connectDB();
  console.log("🟢 [CONTROLLER] DB connected");

  // Validate required fields
  if (!data.name || !data.email || !data.studentId || !data.phone || !data.password) {
    console.log("❌ [CONTROLLER] Missing required fields");
    throw new Error("Name, email, student ID, phone, and password are required.");
  }

  // Check if student already exists by email
  const existingByEmail = await Student.findOne({ email: data.email });
  if (existingByEmail) {
    console.log("❌ [CONTROLLER] Email already exists:", data.email);
    throw new Error("A student with this email already exists.");
  }

  // Check if student already exists by studentId
  const existingByStudentId = await Student.findOne({ studentId: data.studentId });
  if (existingByStudentId) {
    console.log("❌ [CONTROLLER] Student ID already exists:", data.studentId);
    throw new Error("A student with this student ID already exists.");
  }

  // TEMPORARILY DISABLED: Hash password manually
  console.log("⚠️ [CONTROLLER] Storing password as plain text (TEMPORARY)");
  // const hashedPassword = await bcrypt.hash(data.password, 10);
  // console.log("✅ [CONTROLLER] Password hashed:", hashedPassword.substring(0, 20) + "...");

  // Create student with plain text password (TEMPORARY)
  console.log("🟢 [CONTROLLER] Creating student in DB...");
  const student = await Student.create({
    name: data.name,
    email: data.email,
    studentId: data.studentId,
    phone: data.phone,
    password: data.password, // Plain text (TEMPORARY)
    course: data.course,
    department: data.department,
    yearOfStudy: data.yearOfStudy,
    address: data.address,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
  });
  console.log("✅ [CONTROLLER] Student created with ID:", student._id);

  // Remove password from returned object
  const obj = student.toObject() as any;
  delete obj.password;
  return obj;
}
