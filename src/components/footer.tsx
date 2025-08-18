import React from "react";

const year = new Date().getFullYear();

interface FooterProps {
  sticky?: boolean;
}

export default function Footer({ sticky = true }: FooterProps) {
  return (
    <footer
      className={
        `${sticky ? "fixed bottom-0 left-0 w-full z-30 pb-safe-bottom" : "w-full"} py-1 text-center text-xs bg-gradient-to-r
        from-emerald-500 via-teal-500 to-cyan-500 text-white
        dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-900 dark:text-white
        rounded-t-2xl shadow-md`
      }
      style={sticky ? { pointerEvents: "auto" } : {}}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="flex items-center gap-2 justify-center">
          <span>© {year} PapillonCast</span>
          <span>•</span>
          <span>Powered by <a href="https://www.peaksynergyai.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white mx-1">Peak Synergy AI</a></span>
        </span>
        <span>
          <a href="https://www.peaksynergyai.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-white mx-1">Terms of Service</a>
          |
          <a href="https://www.peaksynergyai.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white mx-1">Privacy Policy</a>
        </span>
      </div>
    </footer>
  );
}
