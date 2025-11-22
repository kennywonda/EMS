import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/controllers/authController";

export async function POST(req: NextRequest) {
  console.log("🟢 [SIGNUP ROUTE] Signup request received");
  
  try {
    const data = await req.json();
    console.log("🟢 [SIGNUP ROUTE] Request data received:", {
      adminName: data.adminName,
      email: data.email,
      institutionName: data.institutionName,
      phone: data.phone,
      password: "***"
    });
    
    // Validate required fields
    if (!data.adminName || !data.email || !data.password || !data.institutionName || !data.phone) {
      console.log("❌ [SIGNUP ROUTE] Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Map the form data to match our User model
    const userData = {
      name: data.adminName, // We use adminName as the name
      email: data.email,
      password: data.password,
      institutionName: data.institutionName,
      phone: data.phone
    };

    console.log("🟢 [SIGNUP ROUTE] Calling createUser controller...");
    const user = await createUser(userData);
    console.log("✅ [SIGNUP ROUTE] User created successfully");
    
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("❌ [SIGNUP ROUTE] Signup error:", error.message);
    return NextResponse.json(
      { error: error.message || "Error during signup" },
      { status: 500 }
    );
  }
}