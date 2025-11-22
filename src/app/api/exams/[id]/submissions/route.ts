import { NextRequest, NextResponse } from "next/server";
import { getExamSubmissions } from "@/controllers/examController";

// GET - Fetch all submissions for an exam
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getExamSubmissions(id);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.submissions },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
