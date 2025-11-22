import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

// DELETE ALL - Remove all students (for testing only!)
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    console.log("🗑️ [RESET] Deleting all students...");
    
    const result = await Student.deleteMany({});
    
    console.log(`✅ [RESET] Deleted ${result.deletedCount} students`);

    return NextResponse.json(
      {
        message: `Successfully deleted ${result.deletedCount} students`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [RESET] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
