import connectDB from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import bcrypt from "bcryptjs";

interface TeacherData {
  name: string;
  password: string;
  email: string;
  phone: string;
  subject?: string;
  department?: string;
  employeeId: string;
  address?: string;
}

export async function createTeacher(data: TeacherData) {
  console.log("🟣 [CONTROLLER] createTeacher called with:", {
    name: data.name,
    password: "***",
    email: data.email,
    phone: data.phone,
    employeeId: data.employeeId,
  });

  await connectDB();
  console.log("🟣 [CONTROLLER] DB connected");

  if (!data.name || !data.password || !data.email || !data.phone || !data.employeeId) {
    console.log("❌ [CONTROLLER] Missing required fields");
    throw new Error("Name, password, email, phone and employee ID are required.");
  }

  const existingByEmail = await Teacher.findOne({ email: data.email });
  if (existingByEmail) {
    console.log("❌ [CONTROLLER] Email already exists:", data.email);
    throw new Error("A teacher with this email already exists.");
  }

  const existingByEmpId = await Teacher.findOne({ employeeId: data.employeeId });
  if (existingByEmpId) {
    console.log("❌ [CONTROLLER] Employee ID already exists:", data.employeeId);
    throw new Error("A teacher with this employee ID already exists.");
  }

  console.log("🟣 [CONTROLLER] Hashing password...");
  const hashedPassword = await bcrypt.hash(data.password, 10);

  console.log("🟣 [CONTROLLER] Creating teacher in DB...");
  const teacher = await Teacher.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    department: data.department,
    employeeId: data.employeeId,
    address: data.address,
    password: hashedPassword,
  });
  console.log("✅ [CONTROLLER] Teacher created with ID:", teacher._id);

  const obj = teacher.toObject() as any;
  delete obj.password;
  return obj;
}
