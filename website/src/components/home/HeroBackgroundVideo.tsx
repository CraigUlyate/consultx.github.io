"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SLIDE_MS = 800;
const FREEZE_MS = 10_000;

type HeroBackgroundVideoProps = {
  onCycleStart?: () => void;
};

export function HeroBackgroundVideo({ onCycleStart }: HeroBackgroundVideoProps) {
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCycleStartRef = useRef(onCycleStart);
  const [showSecond, setShowSecond] = useState(false);

  onCycleStartRef.current = onCycleStart;

  const clearTimers = useCallback(() => {
    if (freezeTimerRef.current) {
      clearTimeout(freezeTimerRef.current);
      freezeTimerRef.current = null;
    }
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, []);

  const notifyCycleStart = useCallback(() => {
    onCycleStartRef.current?.();
  }, []);

  const restartCycle = useCallback(() => {
    clearTimers();
    setShowSecond(false);

    const second = secondRef.current;
    if (second) {
      second.pause();
      second.currentTime = 0;
    }

    const first = firstRef.current;
    if (first) {
      first.currentTime = 0;
      first.playbackRate = 2;
      void first.play().catch(() => {});
    }

    notifyCycleStart();
  }, [clearTimers, notifyCycleStart]);

  const handleFirstEnded = useCallback(() => {
    setShowSecond(true);

    slideTimerRef.current = setTimeout(() => {
      const second = secondRef.current;
      if (second) {
        second.currentTime = 0;
        void second.play().catch(() => {});
      }
    }, SLIDE_MS);
  }, []);

  const handleSecondEnded = useCallback(() => {
    const second = secondRef.current;
    if (second) {
      second.pause();
    }

    freezeTimerRef.current = setTimeout(() => {
      restartCycle();
    }, FREEZE_MS);
  }, [restartCycle]);

  useEffect(() => {
    const first = firstRef.current;
    if (!first) return;

    first.playbackRate = 2;
    void first.play().catch(() => {});
    notifyCycleStart();

    return () => {
      clearTimers();
    };
  }, [clearTimers, notifyCycleStart]);

  return (
    <div
      className="pointer-events-none absolute inset-0 top-0 h-full w-full overflow-hidden md:-top-[250px] md:h-[calc(100%+250px)]"
      aria-hidden="true"
    >
      <div
        className="flex h-full w-[200%] ease-in-out"
        style={{
          transform: showSecond ? "translateX(-50%)" : "translateX(0)",
          transition: `transform ${SLIDE_MS}ms ease-in-out`,
        }}
      >
        <video
          ref={firstRef}
          className="h-full w-1/2 object-cover opacity-50"
          muted
          playsInline
          autoPlay
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = 2;
          }}
          onEnded={handleFirstEnded}
        >
          <source src="/assets/hero-background.mp4" type="video/mp4" />
        </video>
        <video
          ref={secondRef}
          className="h-full w-1/2 object-contain opacity-50 md:object-cover"
          muted
          playsInline
          preload="auto"
          onEnded={handleSecondEnded}
        >
          <source src="/assets/hero-take-your-shot.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
