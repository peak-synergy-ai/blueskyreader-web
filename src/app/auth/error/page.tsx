"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Access denied. Your account may not be active or you may not be in our system. Please join the waitlist first."
      case "Configuration":
        return "There was a problem with the server configuration. Please contact support."
      case "Verification":
        return "The verification link was invalid or has expired."
      default:
        return "An unexpected error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-destructive">Authentication Error</CardTitle>
            <CardDescription>There was a problem signing you in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">{getErrorMessage(error)}</AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/signin">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Join Waitlist</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
