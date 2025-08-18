import React from "react";

const year = new Date().getFullYear();

interface FooterProps {
  sticky?: boolean;
}

export default function Footer({ sticky = true }: FooterProps) {
  return (
    <footer
      className={
        `${sticky ? "fixed bottom-0 left-0 w-full z-30 pb-safe-bottom" : "w-full"} py-4 text-center text-sm border-t border-border bg-card`
      }
      style={sticky ? { pointerEvents: "auto" } : {}}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center gap-2 justify-center text-muted-foreground">
            <span>© {year} PapillonCast</span>
            <span>•</span>
            <span>Powered by <a href="https://www.peaksynergyai.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Peak Synergy AI</a></span>
          </span>
          <span className="text-xs text-muted-foreground">
            <a href="https://www.peaksynergyai.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors mx-1">Terms of Service</a>
            |
            <a href="https://www.peaksynergyai.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors mx-1">Privacy Policy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
