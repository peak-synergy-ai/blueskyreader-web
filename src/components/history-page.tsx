"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ArrowLeft, Eye, Heart, Clock, FileText } from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  id: string
  type: string
  feedTimeWindow: string
  content: string
  createdAt: string
  wordCount: number
  readingTime: number
  favorited?: boolean
}

export function HistoryPage() {
  const { status } = useSession()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<HistoryItem | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory()
    }
  }, [status])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/user/history")
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const response = await fetch("/api/user/history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle-favorite" }),
      })

      if (response.ok) {
        setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, favorited: !item.favorited } : item)))
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "quick":
        return "Quick Catchup"
      case "whats-going-on":
        return "What's Going On?"
      case "deep-dive":
        return "Deep Dive"
      default:
        return type
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      quick: "bg-green-500/10 text-green-500 border-green-500/20",
      "whats-going-on": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "deep-dive": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    }
    return <Badge className={colors[type as keyof typeof colors] || ""}>{getTypeLabel(type)}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/reader">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reader
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-serif">Content History</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Content</CardTitle>
            <CardDescription>View and manage all your AI-generated feed summaries and analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content generated yet</p>
                <p className="text-sm">Start by generating your first feed summary!</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Feed Window</TableHead>
                      <TableHead>Word Count</TableHead>
                      <TableHead>Reading Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.feedTimeWindow.replace("hours", "h").replace("hour", "h")}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.wordCount.toLocaleString()} words</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readingTime} min
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedContent(item)}
                              className="h-8 px-2"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFavorite(item.id)}
                              className={`h-8 px-2 ${item.favorited ? "text-red-500" : ""}`}
                            >
                              <Heart className={`w-3 h-3 ${item.favorited ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {selectedContent && getTypeLabel(selectedContent.type)}
            </DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="mt-4 prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">{selectedContent.content}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
