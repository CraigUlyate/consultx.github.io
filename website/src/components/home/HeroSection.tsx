"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroBackgroundVideo } from "@/components/home/HeroBackgroundVideo";

const TEXT_HOLD_MS = 3_000;
const TEXT_SLIDE_MS = 700;

export function HeroSection() {
  const [exited, setExited] = useState(false);
  const [sliding, setSliding] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enableSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (enableSlideTimerRef.current) {
      clearTimeout(enableSlideTimerRef.current);
      enableSlideTimerRef.current = null;
    }
  }, []);

  const handleCycleStart = useCallback(() => {
    clearHoldTimer();
    // Snap text back on-screen without a reverse slide.
    setSliding(false);
    setExited(false);

    enableSlideTimerRef.current = setTimeout(() => {
      setSliding(true);
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      setExited(true);
    }, TEXT_HOLD_MS);
  }, [clearHoldTimer]);

  useEffect(() => {
    return () => {
      clearHoldTimer();
    };
  }, [clearHoldTimer]);

  const slideStyle = {
    transform: exited ? "translateX(-110%)" : "translateX(0)",
    transition: sliding ? `transform ${TEXT_SLIDE_MS}ms ease-in-out` : "none",
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f5f6f7_48%,#f1f8e8_100%)]">
      <div className="absolute inset-0">
        <HeroBackgroundVideo onCycleStart={handleCycleStart} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(114,198,0,0.16),transparent_42%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[72vh] max-w-[1500px] flex-col justify-center px-5 py-20 md:px-8">
        <div className="will-change-transform" style={slideStyle}>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-consultx-black sm:text-5xl lg:text-6xl">
            It&apos;s not rocket science,
            <span className="block text-consultx-green">it&apos;s business science.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
            Unlock efficiency across finance and operations with consulting expertise and
            intelligent product tools built for South African businesses.
          </p>
        </div>
        <div className="mt-10">
          <Link
            href="/products/"
            className="inline-flex items-center gap-2 rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-consultx-green-dark"
          >
            Explore Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
