import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { kv } from "@vercel/kv"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email?.endsWith("@peaksynergyai.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all user keys
    const keys = await kv.keys("user:*")
    const users = []

    for (const key of keys) {
      const userData = await kv.hgetall(key)
      if (userData && Object.keys(userData).length > 0) {
        users.push(userData)
      }
    }

    // Sort by creation date (newest first)
    users.sort((a, b) => {
      const dateA = new Date(a.createdAt as string).getTime()
      const dateB = new Date(b.createdAt as string).getTime()
      return dateB - dateA
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin users fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email?.endsWith("@peaksynergyai.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { email, status } = await request.json()

    if (!email || !status) {
      return NextResponse.json({ error: "Email and status are required" }, { status: 400 })
    }

    if (!["active", "waitlist", "disabled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await kv.hgetall(`user:${email}`)

    if (!existingUser || Object.keys(existingUser).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user status
    await kv.hset(`user:${email}`, {
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email,
    })

    return NextResponse.json({ success: true, message: `User ${email} updated to ${status}` })
  } catch (error) {
    console.error("Admin user update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
