'use client';

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const loadingTexts = [
  "Analyzing your essence...",
  "Consulting the chronomancers...",
  "Crossing the mists of time...",
  "Painting your past life...",
  "Unveiling your historical doppelgänger...",
];

export function LoadingScreen() {
  const [text, setText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setText(prevText => {
        const currentIndex = loadingTexts.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center animate-in fade-in duration-1000">
      <div className="relative w-24 h-24">
        <Loader className="w-24 h-24 text-accent animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary animate-ping"></div>
        </div>
      </div>
      <p className="text-xl font-headline text-white/90 transition-all duration-500">{text}</p>
    </div>
  );
}
