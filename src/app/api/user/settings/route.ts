import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { kv } from "@vercel/kv"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userSettings = await kv.hgetall(`user:${session.user.email}`)

    if (!userSettings || Object.keys(userSettings).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      settings: {
        email: userSettings.email,
        feedTimeWindow: userSettings.feedTimeWindow || "4hours",
        blueskyConnected: userSettings.blueskyConnected === "true" || userSettings.blueskyConnected === true,
        lastFeedRefresh: userSettings.lastFeedRefresh || null,
      },
    })
  } catch (error) {
    console.error("User settings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { feedTimeWindow, blueskyConnected } = await request.json()

    const updates: Record<string, unknown> = {}

    if (feedTimeWindow && ["1hour", "4hours", "8hours", "24hours"].includes(feedTimeWindow)) {
      updates.feedTimeWindow = feedTimeWindow
    }

    if (typeof blueskyConnected === "boolean") {
      updates.blueskyConnected = blueskyConnected
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid updates provided" }, { status: 400 })
    }

    updates.updatedAt = new Date().toISOString()

    await kv.hset(`user:${session.user.email}`, updates)

    return NextResponse.json({ success: true, message: "Settings updated successfully" })
  } catch (error) {
    console.error("User settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
