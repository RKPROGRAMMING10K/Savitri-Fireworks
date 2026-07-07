"use client";

import React, { useState, useEffect } from "react";

export default function TypingFireQuote() {
  const quoteText = "We don't just sell crackers, we ignite celebration milestones.";
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < quoteText.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + quoteText.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 70); // Typing speed
      return () => clearTimeout(timer);
    } else {
      // Loop: pause for 4 seconds, then restart
      const restartTimer = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
      }, 5000);
      return () => clearTimeout(restartTimer);
    }
  }, [charIndex]);

  return (
    <div className="space-y-2 text-left py-2">
      <div className="text-xl md:text-2xl font-black tracking-wide leading-relaxed relative flex flex-wrap items-center gap-1.5 min-h-[80px] md:min-h-[64px]">
        {/* The Typed text with glowing fire animations */}
        <span className="animate-text-fire font-sans inline-block drop-shadow-md">
          {displayedText}
        </span>
        
        {/* Blinking Cursor representing a lit fuse spark */}
        <span className="inline-block w-1.5 h-6 bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316] align-middle ml-1" />
        
        {/* Floating Flickering Flame Badge */}
        <span className="inline-flex items-center text-xl animate-bounce" style={{ animationDuration: "3s" }}>
          🔥
        </span>
      </div>
    </div>
  );
}
