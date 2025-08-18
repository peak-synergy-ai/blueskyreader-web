import React from "react";
import Link from "next/link";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
  );
}
