import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getOnboardingProgress, saveOnboardingProgress } from "@/lib/redis"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const progress = await getOnboardingProgress(userId)
  return NextResponse.json({ progress })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  await saveOnboardingProgress(userId, body)
  return NextResponse.json({ success: true })
}
