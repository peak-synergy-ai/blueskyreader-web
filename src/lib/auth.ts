import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { kv } from "@vercel/kv"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      try {
        // Check if user exists in KV store
        const existingUser = await kv.hgetall(`user:${user.email}`)

        if (!existingUser || Object.keys(existingUser).length === 0) {
          // User not in system, deny access
          return false
        }

        const status = existingUser.status as string

        if (status !== "active") {
          // User not active, deny access
          return false
        }

        // Update last login
        await kv.hset(`user:${user.email}`, {
          lastLogin: new Date().toISOString(),
        })

        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        // Add admin flag for peaksynergyai.com domain
        session.user.isAdmin = session.user.email.endsWith("@peaksynergyai.com")
      }
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}
