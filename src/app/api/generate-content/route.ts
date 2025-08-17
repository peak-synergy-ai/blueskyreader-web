import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { kv } from "@vercel/kv"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, feedTimeWindow } = await request.json()

    if (!type || !["quick", "whats-going-on", "deep-dive"].includes(type)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    // Check if user has BlueSky connected
    const userSettings = await kv.hgetall(`user:${session.user.email}`)

    if (!userSettings?.blueskyConnected) {
      return NextResponse.json({ error: "BlueSky account not connected" }, { status: 400 })
    }

    // Placeholder content generation - will be replaced with actual AI generation
    const contentTemplates = {
      quick: `🎯 Quick Catchup Summary (${feedTimeWindow})

Hey there! Here's what's been happening in your BlueSky feed:

📈 **Trending Topics:**
• Climate change discussions are heating up with 47 posts about renewable energy
• Tech layoffs continue to dominate conversations (23 mentions)
• New AI developments causing quite the stir

💬 **Notable Conversations:**
@techguru shared insights about the latest JavaScript framework that got 156 likes
@climatescientist posted a thread about ocean temperatures that's going viral

🔥 **What's Hot:**
The debate about remote work policies is still raging with passionate takes on both sides

That's your feed in a nutshell! Stay informed, stay engaged! 🚀`,

      "whats-going-on": `🎙️ What's Going On? - Your Feed Podcast

Welcome to your personalized feed update! I'm your AI host, and boy do we have some interesting developments today...

**Opening Segment: The Big Stories**
So, let's dive right in! Your network has been absolutely buzzing about the latest developments in sustainable technology. @greenengineer dropped some serious knowledge bombs about solar panel efficiency that had everyone talking. I mean, we're talking 200+ engagements here!

**Trending Now**
But wait, there's more! The ongoing discussion about work-life balance has taken an interesting turn. @worklifebalance shared a thread that basically broke the internet (well, your corner of it anyway). People are sharing their own stories, and honestly, it's getting pretty emotional out there.

**The Viral Moment**
And can we talk about @funnyperson's meme about Monday mornings? It's been shared 89 times in your network alone! Sometimes we all need a good laugh, right?

**Community Spotlight**
Your community is really coming together around local environmental initiatives. There's a grassroots movement gaining momentum, and it's beautiful to see people organizing and taking action.

That's a wrap on today's "What's Going On?" - stay curious, stay connected! 🎧`,

      "deep-dive": `🎭 Deep Dive Conversation: Your Feed Analysis

**Alex** [analytical tone]: Welcome everyone to today's deep dive! I'm Alex, and I'm here with my co-host Sam to break down what's really happening in your BlueSky feed.

**Sam** [enthusiastic tone]: Hey there! I'm Sam, and I'm absolutely fascinated by what we're seeing today. Alex, the data patterns are incredible!

**Alex** [thoughtfully]: You're right, Sam. Let's start with the most interesting trend - the intersection of technology and environmental consciousness. We're seeing a 340% increase in posts linking tech solutions to climate action.

**Sam** [excitedly]: And the engagement rates! People aren't just scrolling past these posts - they're having real conversations. @techforgood's post about carbon-neutral data centers got 47 meaningful replies, not just likes!

**Alex** [analyzing]: What's particularly interesting is the demographic spread. We're seeing engagement across age groups, which suggests this isn't just a generational trend.

**Sam** [laughing]: Speaking of trends, can we talk about the meme evolution happening? That cat video from @petlover has spawned 12 variations already! The creativity in your network is off the charts.

**Alex** [seriously]: But here's what's really fascinating - the memes are actually driving serious conversations. People are using humor as an entry point to discuss mental health and workplace stress.

**Sam** [impressed]: The human element is so strong here. @mentalhealthadvocate's vulnerability in sharing their story has created this ripple effect of support and openness.

**Alex** [concluding]: It's remarkable how your feed reflects both the challenges and the resilience of your community. The balance of serious discourse and lighthearted content creates this unique ecosystem.

**Sam** [warmly]: Your network is engaged, thoughtful, and genuinely supportive. It's the kind of online community we all hope to be part of.

**Alex & Sam** [together]: Thanks for joining us for this deep dive - keep fostering those meaningful connections! 🌟`,
    }

    const content = contentTemplates[type as keyof typeof contentTemplates]

    // Store the generated content in KV for history
    const historyKey = `history:${session.user.email}:${Date.now()}`
    await kv.hset(historyKey, {
      type,
      feedTimeWindow,
      content,
      createdAt: new Date().toISOString(),
      wordCount: content.split(" ").length,
      readingTime: Math.ceil(content.split(" ").length / 200), // ~200 words per minute
    })

    // Update user's last feed refresh
    await kv.hset(`user:${session.user.email}`, {
      lastFeedRefresh: new Date().toISOString(),
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
