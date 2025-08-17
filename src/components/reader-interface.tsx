"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2,
  Mic,
  LogOut,
  Settings,
  Zap,
  MessageCircle,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  History,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"

interface UserSettings {
  email: string
  feedTimeWindow: string
  blueskyConnected: boolean
  lastFeedRefresh: string | null
}

export function ReaderInterface() {
  const { data: session, status } = useSession()
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [generatingContent, setGeneratingContent] = useState<string | null>(null)
  const [contentDialog, setContentDialog] = useState<{
    open: boolean
    title: string
    content: string
    type: string
  }>({
    open: false,
    title: "",
    content: "",
    type: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserSettings()
    }
  }, [status])

  const fetchUserSettings = async () => {
    try {
      const response = await fetch("/api/user/settings")
      if (response.ok) {
        const data = await response.json()
        setUserSettings(data.settings)
      } else {
        setMessage({ type: "error", text: "Failed to load user settings" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setLoading(false)
    }
  }

  const updateFeedTimeWindow = async (newWindow: string) => {
    setUpdating(true)
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedTimeWindow: newWindow }),
      })

      if (response.ok) {
        setUserSettings((prev) => (prev ? { ...prev, feedTimeWindow: newWindow } : null))
        setMessage({ type: "success", text: "Feed time window updated" })
      } else {
        setMessage({ type: "error", text: "Failed to update settings" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setUpdating(false)
    }
  }

  const connectBlueSky = async () => {
    setUpdating(true)
    try {
      // Placeholder for BlueSky connection logic
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUserSettings((prev) => (prev ? { ...prev, blueskyConnected: true } : null))
      setMessage({ type: "success", text: "BlueSky account connected successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to connect BlueSky account" })
    } finally {
      setUpdating(false)
    }
  }

  const generateContent = async (type: "quick" | "whats-going-on" | "deep-dive") => {
    if (!userSettings?.blueskyConnected) {
      setMessage({ type: "error", text: "Please connect your BlueSky account first" })
      return
    }

    setGeneratingContent(type)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          feedTimeWindow: userSettings.feedTimeWindow,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        const titles = {
          quick: "Quick Catchup",
          "whats-going-on": "What's Going On?",
          "deep-dive": "Let's Go Deep!",
        }

        setContentDialog({
          open: true,
          title: titles[type],
          content: data.content,
          type,
        })

        // Update last refresh time
        setUserSettings((prev) =>
          prev
            ? {
                ...prev,
                lastFeedRefresh: new Date().toISOString(),
              }
            : null,
        )
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Failed to generate content" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setGeneratingContent(null)
    }
  }

  const getTimeWindowLabel = (window: string) => {
    switch (window) {
      case "1hour":
        return "1 Hour"
      case "4hours":
        return "4 Hours"
      case "8hours":
        return "8 Hours"
      case "24hours":
        return "24 Hours"
      default:
        return window
    }
  }

  const formatLastRefresh = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>Please sign in to access the reader.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold font-serif">PapillonCast</h1>
            </Link>
            <Badge variant="secondary">{session.user.email}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reader/history">
                <History className="w-4 h-4 mr-2" />
                History
              </Link>
            </Button>
            {session.user.isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {message && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-destructive/50 bg-destructive/10" : "border-green-500/50 bg-green-500/10"}`}
          >
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <AlertDescription className={message.type === "error" ? "text-destructive" : "text-green-400"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* BlueSky Connection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              BlueSky Connection
            </CardTitle>
            <CardDescription>Connect your BlueSky account to start generating AI summaries</CardDescription>
          </CardHeader>
          <CardContent>
            {userSettings?.blueskyConnected ? (
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Your BlueSky account is connected and ready to use
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button onClick={connectBlueSky} disabled={updating} className="bg-blue-600 hover:bg-blue-700">
                  {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                  Connect BlueSky Account
                </Button>
                <span className="text-sm text-muted-foreground">
                  Connect to access your personalized feed summaries
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Feed Settings
            </CardTitle>
            <CardDescription>Customize your feed summary preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Feed Time Window</label>
                <Select
                  value={userSettings?.feedTimeWindow || "4hours"}
                  onValueChange={updateFeedTimeWindow}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">Last 1 Hour</SelectItem>
                    <SelectItem value="4hours">Last 4 Hours</SelectItem>
                    <SelectItem value="8hours">Last 8 Hours</SelectItem>
                    <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Last Refresh</label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatLastRefresh(userSettings?.lastFeedRefresh || null)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:bg-card/80 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Quick Catchup</CardTitle>
              <CardDescription>
                Get a fun, engaging summary of your feed from the last{" "}
                {getTimeWindowLabel(userSettings?.feedTimeWindow || "4hours").toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generateContent("quick")}
                disabled={!userSettings?.blueskyConnected || generatingContent !== null}
                className="w-full"
              >
                {generatingContent === "quick" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Generate Summary
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:bg-card/80 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-serif">What's Going On?</CardTitle>
              <CardDescription>
                Get a podcast-style presentation of trending topics and viral content from your feed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generateContent("whats-going-on")}
                disabled={!userSettings?.blueskyConnected || generatingContent !== null}
                className="w-full"
              >
                {generatingContent === "whats-going-on" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4 mr-2" />
                )}
                What's Trending?
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:bg-card/80 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Let's Go Deep!</CardTitle>
              <CardDescription>
                Get an in-depth conversation between two AI personalities analyzing your feed content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generateContent("deep-dive")}
                disabled={!userSettings?.blueskyConnected || generatingContent !== null}
                className="w-full"
              >
                {generatingContent === "deep-dive" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Deep Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Dialog */}
      <Dialog open={contentDialog.open} onOpenChange={(open) => setContentDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{contentDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">{contentDialog.content}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
