"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./hero-pixel-transition.css";

const FREEZE_MS = 10_000;
const PIXEL_COLS = 18;
const PIXEL_ROWS = 11;
const PIXEL_STAGGER_MS = 520;
const PIXEL_ANIM_MS = 320;
const PIXEL_HOLD_MS = 120;

const PIXEL_COLORS = ["#72c600", "#4fa000", "#00a09a", "#111111", "#343638", "#f1f8e8"] as const;

type PixelPhase = "idle" | "in" | "out";

type HeroBackgroundVideoProps = {
  onCycleStart?: () => void;
};

function cellDelayMs(index: number, total: number) {
  // Deterministic scramble so SSR/client match and the dissolve feels random.
  const scrambled = (index * 47 + 13) % total;
  return (scrambled / total) * PIXEL_STAGGER_MS;
}

export function HeroBackgroundVideo({ onCycleStart }: HeroBackgroundVideoProps) {
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pixelTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onCycleStartRef = useRef(onCycleStart);
  const [showSecond, setShowSecond] = useState(false);
  const [pixelPhase, setPixelPhase] = useState<PixelPhase>("idle");
  const [reduceMotion, setReduceMotion] = useState(false);

  onCycleStartRef.current = onCycleStart;

  const cells = useMemo(() => {
    const total = PIXEL_COLS * PIXEL_ROWS;
    return Array.from({ length: total }, (_, index) => ({
      id: index,
      delay: cellDelayMs(index, total),
      color: PIXEL_COLORS[index % PIXEL_COLORS.length],
    }));
  }, []);

  const clearTimers = useCallback(() => {
    if (freezeTimerRef.current) {
      clearTimeout(freezeTimerRef.current);
      freezeTimerRef.current = null;
    }
    pixelTimersRef.current.forEach(clearTimeout);
    pixelTimersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    pixelTimersRef.current.push(id);
  }, []);

  const notifyCycleStart = useCallback(() => {
    onCycleStartRef.current?.();
  }, []);

  const playSecond = useCallback(() => {
    const second = secondRef.current;
    if (!second) return;
    second.currentTime = 0;
    void second.play().catch(() => {});
  }, []);

  const restartCycle = useCallback(() => {
    clearTimers();
    setPixelPhase("idle");
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

  const runPixelTransition = useCallback(() => {
    clearTimers();
    setPixelPhase("in");

    const switchAt = PIXEL_STAGGER_MS + PIXEL_ANIM_MS + PIXEL_HOLD_MS;
    schedule(() => {
      setShowSecond(true);
      playSecond();
      setPixelPhase("out");
    }, switchAt);

    schedule(() => {
      setPixelPhase("idle");
    }, switchAt + PIXEL_STAGGER_MS + PIXEL_ANIM_MS);
  }, [clearTimers, playSecond, schedule]);

  const handleFirstEnded = useCallback(() => {
    if (reduceMotion) {
      setShowSecond(true);
      playSecond();
      return;
    }
    runPixelTransition();
  }, [playSecond, reduceMotion, runPixelTransition]);

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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

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
      <video
        ref={firstRef}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        style={{ opacity: showSecond ? 0 : 0.5 }}
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
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 md:object-cover"
        style={{ opacity: showSecond ? 0.5 : 0 }}
        muted
        playsInline
        preload="auto"
        onEnded={handleSecondEnded}
      >
        <source src="/assets/hero-take-your-shot.mp4" type="video/mp4" />
      </video>

      {pixelPhase !== "idle" ? (
        <div
          className={`hero-pixel-grid ${pixelPhase === "in" ? "is-in" : "is-out"}`}
          style={{
            gridTemplateColumns: `repeat(${PIXEL_COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${PIXEL_ROWS}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell) => (
            <span
              key={cell.id}
              className="hero-pixel-cell"
              style={{
                backgroundColor: cell.color,
                animationDelay: `${cell.delay}ms`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
