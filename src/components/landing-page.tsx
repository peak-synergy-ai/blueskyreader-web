"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Headphones, Zap, Users, Clock, Sparkles } from "lucide-react"
import { WaitlistForm } from "@/components/waitlist-form"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-serif">PapillonCast</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/signin">Login</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Feed Summaries
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
            Your Daily Digest:
            <br />
            <span className="text-primary">Stay in the Loop!</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Catch up in minutes with AI-generated highlights from your BlueSky feed. Transform your social media
            consumption into podcast-style content.
          </p>

          <WaitlistForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold font-serif text-center mb-12">Everything You Need to Stay Connected</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Personal Feed Reading</CardTitle>
                <CardDescription>
                  Connect your BlueSky account and let AI read through your personalized feed
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">AI-Generated Summaries</CardTitle>
                <CardDescription>
                  Get intelligent, engaging summaries of your feed activity from the last day
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Daily Audio Podcasts</CardTitle>
                <CardDescription>
                  Transform your feed into podcast-style audio content for on-the-go listening
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Social Context</CardTitle>
                <CardDescription>
                  Understand what&apos;s trending and viral in your network with intelligent analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Flexible Time Windows</CardTitle>
                <CardDescription>
                  Choose from 1, 4, 8, or 24-hour feed summaries based on your preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Deep Analysis</CardTitle>
                <CardDescription>
                  Advanced AI analyzes images, follows links, and creates conversational content
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-serif mb-4">Ready to Transform Your Feed?</h2>
          <p className="text-muted-foreground mb-8">
            Join the waitlist and be among the first to experience AI-powered social media consumption.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 PapillonCast. Powered by AI.</p>
        </div>
      </footer>
    </div>
  )
}
