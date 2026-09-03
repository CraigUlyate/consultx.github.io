"use client";

import { useEffect, useRef } from "react";
import { products } from "@/data/productCatalog";
import { ProductIcon } from "@/components/products/ProductIcons";

type MobileProductCarouselProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function MobileProductCarousel({ activeIndex, onSelect }: MobileProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const ignoreScrollRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const node = itemRefs.current[activeIndex];
    if (!node) return;
    ignoreScrollRef.current = true;
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const timer = window.setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      if (ignoreScrollRef.current) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(itemCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      onSelectRef.current(closest);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 pb-4 xl:hidden"
      aria-label="Products"
    >
      {products.map((product, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={product.id}
            type="button"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onClick={() => onSelect(index)}
            className={`flex snap-center shrink-0 flex-col items-center gap-3 transition ${
              active ? "scale-105" : "opacity-70"
            }`}
          >
            <ProductIcon product={product} active={active} size="sm" />
            <span
              className={`max-w-24 text-center text-xs font-semibold ${
                active ? "text-consultx-green" : "text-consultx-charcoal"
              }`}
            >
              {product.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
