"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Product } from "@/lib/types";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <section className="flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-3xl"
        >
          <span className="inline-flex rounded-lg bg-consultx-green-soft px-4 py-2 text-xs font-semibold tracking-wide text-consultx-green-dark uppercase">
            {product.status}
          </span>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl lg:text-6xl">
            {product.name}
          </h1>

          <p className="mt-4 text-xl font-semibold text-consultx-green sm:text-2xl">
            {product.category}
          </p>

          <p className="mt-7 max-w-2xl text-base leading-8 text-gray-700 sm:text-lg">
            {product.description}
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-consultx-green text-consultx-green">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-base font-medium text-gray-800">{feature}</span>
              </div>
            ))}
          </div>

          <Link
            href={product.href}
            className="mt-12 inline-flex items-center gap-3 rounded-md bg-gradient-to-r from-consultx-green-dark to-consultx-green px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {product.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
