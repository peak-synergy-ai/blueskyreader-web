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

    // Get all history keys for this user
    const keys = await kv.keys(`history:${session.user.email}:*`)
    const history = []

    for (const key of keys) {
      const item = await kv.hgetall(key)
      if (item && Object.keys(item).length > 0) {
        history.push({
          id: key,
          ...item,
        })
      }
    }

    // Sort by creation date (newest first)
    history.sort((a, b) => {
      const dateA = new Date(a.createdAt as string).getTime()
      const dateB = new Date(b.createdAt as string).getTime()
      return dateB - dateA
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error("History fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, action } = await request.json()

    if (action === "toggle-favorite") {
      const item = await kv.hgetall(id)
      if (item) {
        await kv.hset(id, {
          favorited: !item.favorited,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("History update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
