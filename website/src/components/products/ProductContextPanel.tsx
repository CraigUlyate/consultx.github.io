"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { WorkflowIcon } from "@/components/products/ProductIcons";

type ProductContextPanelProps = {
  product: Product;
};

export function ProductContextPanel({ product }: ProductContextPanelProps) {
  return (
    <aside className="flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full rounded-3xl border border-consultx-border bg-white p-8 shadow-soft"
        >
          <h2 className="text-xl font-bold text-consultx-black">{product.workflowTitle}</h2>

          <div className="relative mt-7 space-y-6">
            <div
              className="absolute top-6 bottom-6 left-6 w-px border-l border-dashed border-consultx-green/40"
              aria-hidden="true"
            />
            {product.workflow.map((step) => (
              <div key={step.title} className="relative flex gap-4">
                <WorkflowIcon icon={step.icon} tone={step.tone} />
                <div>
                  <h3 className="font-semibold text-consultx-black">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
