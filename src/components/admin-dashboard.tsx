"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, UserCheck, UserX, Search, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface User {
  email: string
  status: string
  createdAt: string
  lastLogin: string | null
  lastFeedRefresh: string | null
  feedTimeWindow: string
  blueskyConnected: boolean
}

export function AdminDashboard() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers()
    }
  }, [status])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        setMessage({ type: "error", text: "Failed to fetch users" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (email: string, newStatus: string) => {
    setUpdating(email)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status: newStatus }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: `User ${email} updated to ${newStatus}` })
        fetchUsers()
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Failed to update user" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
      case "waitlist":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Waitlist</Badge>
      case "disabled":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Disabled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>You don&apos;t have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go Home</Link>
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
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold font-serif">Admin Dashboard</h1>
            </Link>
            <Badge variant="secondary">{session.user.email}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reader">Reader</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {users.filter((u) => u.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {users.filter((u) => u.status === "waitlist").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disabled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {users.filter((u) => u.status === "disabled").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {message && (
              <Alert
                className={`mb-4 ${message.type === "error" ? "border-destructive/50 bg-destructive/10" : "border-green-500/50 bg-green-500/10"}`}
              >
                <AlertDescription className={message.type === "error" ? "text-destructive" : "text-green-400"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Last Refresh</TableHead>
                      <TableHead>Feed Window</TableHead>
                      <TableHead>BlueSky</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.email}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>{formatDate(user.lastLogin)}</TableCell>
                          <TableCell>{formatDate(user.lastFeedRefresh)}</TableCell>
                          <TableCell>{getTimeWindowLabel(user.feedTimeWindow)}</TableCell>
                          <TableCell>
                            {user.blueskyConnected ? (
                              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Connected</Badge>
                            ) : (
                              <Badge variant="secondary">Not Connected</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {user.status === "waitlist" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateUserStatus(user.email, "active")}
                                  disabled={updating === user.email}
                                  className="h-8 px-2"
                                >
                                  {updating === user.email ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <UserCheck className="w-3 h-3" />
                                  )}
                                </Button>
                              )}
                              {user.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateUserStatus(user.email, "disabled")}
                                  disabled={updating === user.email}
                                  className="h-8 px-2"
                                >
                                  {updating === user.email ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <UserX className="w-3 h-3" />
                                  )}
                                </Button>
                              )}
                              {user.status === "disabled" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateUserStatus(user.email, "active")}
                                  disabled={updating === user.email}
                                  className="h-8 px-2"
                                >
                                  {updating === user.email ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <UserCheck className="w-3 h-3" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
