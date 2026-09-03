"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/productCatalog";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { MobileProductCarousel } from "@/components/products/MobileProductCarousel";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductContextPanel } from "@/components/products/ProductContextPanel";

const DESKTOP_CAROUSEL_MIN = 1280;

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelLocked, setWheelLocked] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  function dismissHint() {
    setShowScrollHint(false);
  }

  function setActive(index: number) {
    const nextIndex = ((index % products.length) + products.length) % products.length;
    if (nextIndex !== activeIndex) dismissHint();
    setActiveIndex(nextIndex);
  }

  function next() {
    dismissHint();
    setActiveIndex((current) => (current + 1) % products.length);
  }

  function previous() {
    dismissHint();
    setActiveIndex((current) => (current - 1 + products.length) % products.length);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (window.innerWidth < DESKTOP_CAROUSEL_MIN) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        dismissHint();
        setActiveIndex((current) => (current + 1) % products.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        dismissHint();
        setActiveIndex((current) => (current - 1 + products.length) % products.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onWheelNav = (event: WheelEvent) => {
      if (window.innerWidth < DESKTOP_CAROUSEL_MIN || wheelLocked) return;
      setWheelLocked(true);
      dismissHint();
      if (event.deltaY > 0) {
        setActiveIndex((current) => (current + 1) % products.length);
      } else {
        setActiveIndex((current) => (current - 1 + products.length) % products.length);
      }
      window.setTimeout(() => setWheelLocked(false), 450);
    };

    window.addEventListener("wheel", onWheelNav, { passive: true });
    return () => window.removeEventListener("wheel", onWheelNav);
  }, [wheelLocked]);

  const product = products[activeIndex];

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 lg:py-16">
      <div className="grid min-h-[650px] gap-8 xl:grid-cols-[420px_1fr_330px] xl:gap-12">
        <ProductCarousel
          activeIndex={activeIndex}
          showScrollHint={showScrollHint}
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
