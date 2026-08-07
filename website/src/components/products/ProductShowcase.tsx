"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { MobileProductCarousel } from "@/components/products/MobileProductCarousel";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductContextPanel } from "@/components/products/ProductContextPanel";

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelLocked, setWheelLocked] = useState(false);

  function setActive(index: number) {
    setActiveIndex(((index % products.length) + products.length) % products.length);
  }

  function next() {
    setActive(activeIndex + 1);
  }

  function previous() {
    setActive(activeIndex - 1);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % products.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + products.length) % products.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let touchY: number | null = null;

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth < 1280 || wheelLocked) return;
      setWheelLocked(true);
      if (event.deltaY > 0) {
        setActiveIndex((current) => (current + 1) % products.length);
      } else {
        setActiveIndex((current) => (current - 1 + products.length) % products.length);
      }
      window.setTimeout(() => setWheelLocked(false), 450);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchY === null) return;
      const delta = (event.changedTouches[0]?.clientY ?? touchY) - touchY;
      if (Math.abs(delta) > 60) {
        if (delta < 0) {
          setActiveIndex((current) => (current + 1) % products.length);
        } else {
          setActiveIndex((current) => (current - 1 + products.length) % products.length);
        }
      }
      touchY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [wheelLocked]);

  const product = products[activeIndex];

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 lg:py-16">
      <div className="grid min-h-[650px] gap-8 xl:grid-cols-[390px_1fr_330px] xl:gap-12">
        <ProductCarousel
          activeIndex={activeIndex}
          onSelect={setActive}
          onPrevious={previous}
          onNext={next}
        />
        <MobileProductCarousel activeIndex={activeIndex} onSelect={setActive} />
        <ProductDetails product={product} />
        <ProductContextPanel product={product} />
      </div>
    </section>
  );
}
