import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOnboardingProgress, saveOnboardingProgress } from "@/lib/redis";

// Ensure this route is dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await getOnboardingProgress(userId);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error getting onboarding progress:", error);
    // Return empty progress instead of error to allow onboarding to continue
    return NextResponse.json({ progress: null });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await saveOnboardingProgress(userId, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    // Still return success since Redis failures shouldn't block onboarding
    return NextResponse.json({ success: true });
  }
}
