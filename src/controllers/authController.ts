
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface SignupData {
  name: string;
  email: string;
  password: string;
  institutionName: string;
  phone: string;
}

// ==================== SIGNUP FUNCTION ====================
export async function createUser(data: SignupData) {
  console.log("🟢 [CONTROLLER] createUser called with:", { 
    name: data.name, 
    email: data.email,
    institutionName: data.institutionName,
    phone: data.phone 
  });
  
  await connectDB();
  console.log("🟢 [CONTROLLER] Database connected");

  // Basic validation
  if (!data.name || !data.email || !data.password) {
    console.log("❌ [CONTROLLER] Validation failed - missing fields");
    throw new Error("Name, email, and password are required.");
  }

  // Check if user already exists
  console.log("🟢 [CONTROLLER] Checking if user exists with email:", data.email);
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    console.log("❌ [CONTROLLER] User already exists");
    throw new Error("Email already in use.");
  }

  // Hash password
  console.log("🟢 [CONTROLLER] Hashing password...");
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  console.log("🟢 [CONTROLLER] Creating new user in database...");
  const user = await User.create({
    name: data.name,
    email: data.email,
    institutionName: data.institutionName,
    phone: data.phone,
    password: hashedPassword,
  });
  console.log("✅ [CONTROLLER] User created successfully with ID:", user._id);

  // Remove password from returned user object
  const userObj = user.toObject() as Omit<typeof user, "password"> & { password?: string };
  delete userObj.password;
  return userObj;
}

// ==================== LOGIN FUNCTION ====================
export async function loginUser(email: string, password: string) {
  console.log("🔵 [CONTROLLER] loginUser called with email:", email);
  
  await connectDB();
  console.log("🔵 [CONTROLLER] Database connected");

  // Try Teacher collection first so teachers with overlapping emails are treated as teachers
  console.log("🔵 [CONTROLLER] Searching for teacher in Teacher collection...");
  const Teacher = (await import("@/models/Teacher")).default;
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    console.log("🔵 [CONTROLLER] Teacher found:", { id: teacher._id, name: teacher.name, email: teacher.email });
    // Compare password
    console.log("🔵 [CONTROLLER] Comparing passwords for teacher...");
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      console.log("❌ [CONTROLLER] Invalid password for teacher:", email);
      throw new Error("Invalid email or password");
    }
    console.log("✅ [CONTROLLER] Password is valid for teacher");
    const teacherObj = teacher.toObject() as Omit<typeof teacher, "password"> & { password?: string };
    delete teacherObj.password;
    const token = Buffer.from(`${teacher._id}:${Date.now()}`).toString('base64');
    console.log("✅ [CONTROLLER] Login successful for teacher, token generated");
    return { user: teacherObj, token, role: "teacher" };
  }

  // Try User collection if not found in Teacher
  console.log("🔵 [CONTROLLER] Not found in Teacher, searching for user in User collection...");
  let user = await User.findOne({ email });
  if (user) {
    console.log("🔵 [CONTROLLER] User found:", { id: user._id, name: user.name, email: user.email });
    // Compare password
    console.log("🔵 [CONTROLLER] Comparing passwords for user...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ [CONTROLLER] Invalid password for user:", email);
      throw new Error("Invalid email or password");
    }
    console.log("✅ [CONTROLLER] Password is valid for user");
    const userObj = user.toObject() as Omit<typeof user, "password"> & { password?: string };
    delete userObj.password;
    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');
    console.log("✅ [CONTROLLER] Login successful for user, token generated");
    return { user: userObj, token, role: "user" };
  }

  // Not found in either collection
  console.log("❌ [CONTROLLER] No user or teacher found with email:", email);
  throw new Error("Invalid email or password");
}
