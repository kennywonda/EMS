import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/controllers/authController";

export async function POST(req: NextRequest) {
  console.log("🔵 [LOGIN ROUTE] Login request received");
  
  try {
    const data = await req.json();
    console.log("🔵 [LOGIN ROUTE] Request data:", { email: data.email, password: "***" });
    
    // Validate required fields
    if (!data.email || !data.password) {
      console.log("❌ [LOGIN ROUTE] Missing required fields");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("🔵 [LOGIN ROUTE] Calling loginUser controller...");
    const result = await loginUser(data.email, data.password);
    
    console.log("✅ [LOGIN ROUTE] Login successful for:", data.email);
    return NextResponse.json({ 
      success: true, 
      user: result.user,
      token: result.token,
      role: result.role
    });
  } catch (error: any) {
    console.error("❌ [LOGIN ROUTE] Login error:", error.message);
    return NextResponse.json(
      { error: error.message || "Error during login" },
      { status: 401 }
    );
  }
}
