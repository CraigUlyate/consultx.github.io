"use client";

import { products } from "@/data/products";
import { ProductIcon } from "@/components/products/ProductIcons";

type MobileProductCarouselProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function MobileProductCarousel({ activeIndex, onSelect }: MobileProductCarouselProps) {
  return (
    <div
      className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 xl:hidden"
      aria-label="Products"
    >
      {products.map((product, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={product.id}
            type="button"
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
