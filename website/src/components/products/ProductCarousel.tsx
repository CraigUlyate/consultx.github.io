"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { products } from "@/data/products";
import { ProductIcon } from "@/components/products/ProductIcons";

type ProductCarouselProps = {
  activeIndex: number;
  showScrollHint: boolean;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

function wrappedDistance(index: number, activeIndex: number, length: number) {
  let distance = index - activeIndex;
  if (Math.abs(distance) > length / 2) {
    distance = distance > 0 ? distance - length : distance + length;
  }
  return distance;
}

export function ProductCarousel({
  activeIndex,
  showScrollHint,
  onSelect,
  onPrevious,
  onNext,
}: ProductCarouselProps) {
  return (
    <aside className="relative hidden min-h-[620px] xl:block" aria-label="Products carousel">
      <svg
        className="absolute inset-y-0 left-8 h-full w-72"
        viewBox="0 0 280 700"
        fill="none"
        aria-hidden="true"
      >
        <path d="M20 40 C250 180, 250 520, 20 660" stroke="#E5E7EB" strokeWidth="2" />
        {[120, 230, 340, 450, 560].map((y) => (
          <circle key={y} cx={Math.max(40, 180 - Math.abs(y - 350) * 0.18)} cy={y} r="3" fill="#E5E7EB" />
        ))}
      </svg>

      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-16 top-2 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-consultx-border bg-white shadow-soft transition hover:border-consultx-green"
        aria-label="Previous product"
      >
        <ChevronUp className="h-5 w-5 text-consultx-grey" />
      </button>

      <div className="absolute inset-0 left-8">
        {products.map((product, index) => {
          const distance = wrappedDistance(index, activeIndex, products.length);
          if (Math.abs(distance) > 3) return null;

          const y = 300 + distance * 115;
          const x = 175 - Math.pow(distance, 2) * 11;
          const scale = distance === 0 ? 1.28 : Math.max(0.74, 1 - Math.abs(distance) * 0.09);
          const opacity = Math.max(0.45, 1 - Math.abs(distance) * 0.16);
          const active = distance === 0;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(index)}
              className="absolute flex items-center gap-5 transition-all duration-500 ease-out focus:outline-none"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                zIndex: active ? 30 : 10,
              }}
              aria-current={active ? "true" : undefined}
            >
              <ProductIcon product={product} active={active} />
              <span
                className={`whitespace-nowrap text-sm ${
                  active ? "font-bold text-consultx-green" : "font-semibold text-consultx-charcoal"
                }`}
              >
                {product.name}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="absolute bottom-2 left-16 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-consultx-border bg-white shadow-soft transition hover:border-consultx-green"
        aria-label="Next product"
      >
        <ChevronDown className="h-5 w-5 text-consultx-grey" />
      </button>

      <div
        className={`pointer-events-none absolute top-1/2 left-0 z-[40] w-[4.5rem] -translate-y-1/2 text-center text-[11px] leading-4 text-consultx-grey transition-all duration-300 ${
          showScrollHint ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
        }`}
        aria-hidden={!showScrollHint}
      >
        <div className="mb-2 text-sm">↑</div>
        <div className="rounded-md bg-white/90 px-1 py-1 backdrop-blur-[2px]">
          Scroll to
          <br />
          explore
        </div>
        <div className="mt-2 text-sm">↓</div>
      </div>
    </aside>
  );
}
