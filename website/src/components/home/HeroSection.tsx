"use client";

import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import "./hero-slides.css";

const FREEZE_MS = 10_000;

type HeroSlide = {
  id: string;
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  cta: string;
  href: string;
  videoSrc: string;
  playbackRate?: number;
  videoObjectClass: string;
};

const slides: HeroSlide[] = [
  {
    id: "business-science",
    kicker: "Chartered Accountant · Consulting · AI",
    titleLine1: "It's not rocket science,",
    titleLine2: "it's business science.",
    body: "Unlock efficiency across finance and operations with consulting expertise and intelligent product tools built for South African businesses.",
    cta: "Explore Products",
    href: "/products/",
    videoSrc: "/assets/hero-background.mp4",
    playbackRate: 2,
    videoObjectClass: "object-cover",
  },
  {
    id: "automation",
    kicker: "Finance Automation",
    titleLine1: "Automate the work.",
    titleLine2: "Keep the control.",
    body: "Practical AI and automation solutions for modern finance teams — designed around how your business actually operates.",
    cta: "Explore Solutions",
    href: "/products/workflow-automation/",
    videoSrc: "/assets/hero-take-your-shot.mp4",
    videoObjectClass: "object-contain md:object-cover",
  },
];

export function HeroSection() {
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const bgRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotionRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const clearFreeze = useCallback(() => {
    if (freezeTimerRef.current) {
      clearTimeout(freezeTimerRef.current);
      freezeTimerRef.current = null;
    }
  }, []);

  const animateContentIn = useCallback((slide: HTMLElement) => {
    const elements = slide.querySelectorAll<HTMLElement>("[data-hero-animate]");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
  }, []);

  const prepareSlides = useCallback(() => {
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      gsap.set(slide, { autoAlpha: index === 0 ? 1 : 0, zIndex: index === 0 ? 2 : 1 });
      const bg = bgRefs.current[index];
      if (bg) gsap.set(bg, { scale: index === 0 ? 1 : 1.04 });
    });
  }, []);

  const playVideo = useCallback((index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        const rate = slides[i]?.playbackRate ?? 1;
        video.playbackRate = rate;
        void video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  const transitionTo = useCallback(
    (nextIndex: number) => {
      const oldSlide = slideRefs.current[currentRef.current];
      const newSlide = slideRefs.current[nextIndex];
      const oldBg = bgRefs.current[currentRef.current];
      const newBg = bgRefs.current[nextIndex];
      if (!oldSlide || !newSlide || !oldBg || !newBg) return;

      timelineRef.current?.kill();

      if (reduceMotionRef.current) {
        gsap.set(oldSlide, { autoAlpha: 0, zIndex: 1 });
        gsap.set(newSlide, { autoAlpha: 1, zIndex: 2 });
        gsap.set(oldBg, { scale: 1 });
        gsap.set(newBg, { scale: 1 });
        currentRef.current = nextIndex;
        setActiveIndex(nextIndex);
        playVideo(nextIndex);
        return;
      }

      gsap.set(newSlide, { autoAlpha: 1, zIndex: 2, opacity: 0 });
      gsap.set(oldSlide, { zIndex: 1 });
      gsap.set(newBg, { scale: 1.04 });

      playVideo(nextIndex);

      const tl = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
          gsap.set(oldSlide, { autoAlpha: 0 });
        },
      });
      timelineRef.current = tl;

      tl.fromTo(newSlide, { opacity: 0 }, { opacity: 1, duration: 1.25, ease: "power2.inOut" }, 0);
      tl.to(newBg, { scale: 1, duration: 1.8, ease: "power2.out" }, 0);
      tl.to(oldBg, { scale: 1.035, duration: 1.35, ease: "power2.inOut" }, 0);
      tl.to(oldSlide, { opacity: 0, duration: 1.15, ease: "power2.inOut" }, 0);
      tl.call(() => animateContentIn(newSlide), undefined, 0.35);

      currentRef.current = nextIndex;
      setActiveIndex(nextIndex);
    },
    [animateContentIn, playVideo],
  );

  const handleVideoEnded = useCallback(
    (index: number) => {
      if (index !== currentRef.current) return;

      if (index < slides.length - 1) {
        transitionTo(index + 1);
        return;
      }

      clearFreeze();
      freezeTimerRef.current = setTimeout(() => {
        transitionTo(0);
      }, FREEZE_MS);
    },
    [clearFreeze, transitionTo],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);

    prepareSlides();
    playVideo(0);
    const first = slideRefs.current[0];
    if (first && !media.matches) {
      animateContentIn(first);
    }

    const slidesAtMount = slideRefs.current.filter(Boolean);
    const bgsAtMount = bgRefs.current.filter(Boolean);

    return () => {
      media.removeEventListener("change", sync);
      clearFreeze();
      timelineRef.current?.kill();
      gsap.killTweensOf(slidesAtMount);
      gsap.killTweensOf(bgsAtMount);
    };
  }, [animateContentIn, clearFreeze, playVideo, prepareSlides]);

  return (
    <section className="cx-hero" aria-roledescription="carousel" aria-label="ConsultX highlights">
      {slides.map((slide, index) => (
        <article
          key={slide.id}
          className="hero-slide"
          ref={(node) => {
            slideRefs.current[index] = node;
          }}
          aria-hidden={index !== activeIndex}
        >
          <div
            className="hero-bg"
            ref={(node) => {
              bgRefs.current[index] = node;
            }}
          >
            <video
              ref={(node) => {
                videoRefs.current[index] = node;
              }}
              className={`h-full w-full opacity-50 ${slide.videoObjectClass}`}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => {
                if (slide.playbackRate) {
                  event.currentTarget.playbackRate = slide.playbackRate;
                }
              }}
              onEnded={() => handleVideoEnded(index)}
            >
              <source src={slide.videoSrc} type="video/mp4" />
            </video>
          </div>

          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="hero-kicker" data-hero-animate>
              {slide.kicker}
            </span>
            <h1 data-hero-animate>
              {slide.titleLine1}
              <span className="block text-consultx-green">{slide.titleLine2}</span>
            </h1>
            <p data-hero-animate>{slide.body}</p>
            <Link href={slide.href} className="hero-button" data-hero-animate>
              {slide.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
