"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    value: "80%+",
    label: "Faster processing reported in a recent enterprise case study",
  },
  {
    value: "500 hrs",
    label: "Monthly effort at 10,000 invoices × 3 minutes each",
  },
  {
    value: "250 hrs",
    label: "Capacity released by a 50% automation improvement",
  },
];

export function BlogKeyMetrics() {
  return (
    <div className="my-12 grid gap-6 border-y border-consultx-border py-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-consultx-border">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.value}
          className="sm:px-6 first:sm:pl-0 last:sm:pr-0"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
        >
          <p className="text-3xl font-extrabold tracking-tight text-consultx-green sm:text-4xl">
            {metric.value}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600">{metric.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
