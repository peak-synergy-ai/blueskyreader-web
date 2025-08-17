"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react"

type WaitlistStatus = "idle" | "loading" | "success" | "error" | "already-exists"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<WaitlistStatus>("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.alreadyExists) {
          setStatus("already-exists")
          setMessage(data.message)
        } else {
          setStatus("success")
          setMessage("Successfully added to waitlist!")
          setEmail("")
        }
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={status === "loading" || !email} className="px-6">
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Join Waitlist
            </>
          )}
        </Button>
      </form>

      {status === "success" && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-400">{message}</AlertDescription>
        </Alert>
      )}

      {status === "already-exists" && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-400">{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
