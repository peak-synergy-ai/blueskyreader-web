import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await kv.hgetall(`user:${email}`)

    if (existingUser && Object.keys(existingUser).length > 0) {
      const status = existingUser.status as string

      if (status === "active") {
        return NextResponse.json({
          alreadyExists: true,
          message: "Your account is active! Please use the login button to access the app.",
        })
      } else if (status === "disabled") {
        return NextResponse.json({
          alreadyExists: true,
          message: "Your account is currently disabled. Please contact support.",
        })
      } else if (status === "waitlist") {
        return NextResponse.json({
          alreadyExists: true,
          message: "You're already on the waitlist! We'll notify you when access is available.",
        })
      }
    }

    // Add new user to waitlist
    await kv.hset(`user:${email}`, {
      email,
      status: "waitlist",
      createdAt: new Date().toISOString(),
      lastLogin: null,
      lastFeedRefresh: null,
      feedTimeWindow: "4hours",
      blueskyConnected: false,
    })

    // Send notification email (placeholder for now)
    // TODO: Implement Resend integration
    console.log(`New waitlist signup: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist!",
    })
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
