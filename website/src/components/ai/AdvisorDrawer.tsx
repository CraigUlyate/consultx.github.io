"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AdvisorChat } from "./AdvisorChat";

export function AdvisorDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event so other components (e.g. Hero buttons) can trigger opening the drawer
  useEffect(() => {
    const handleOpenDrawer = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-advisor-drawer", handleOpenDrawer);
    return () => {
      window.removeEventListener("open-advisor-drawer", handleOpenDrawer);
    };
  }, []);

  return (
    <>
      {/* Floating Action Launcher */}
      {!isOpen && (
        <aside
          aria-label="Ask AnNa AI Advisor"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full bg-consultx-charcoal px-4 py-3 text-white shadow-soft transition-all duration-200 hover:bg-black hover:shadow-active hover:scale-[1.02] border border-gray-700/50"
            aria-expanded={isOpen}
          >
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-consultx-green text-white">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-consultx-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-consultx-green" />
              </span>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                Ask AnNa
                <span className="rounded bg-consultx-green/20 px-1 py-0.2 text-[9px] text-consultx-green font-medium">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-gray-300">Solution Advisor</div>
            </div>
          </button>
        </aside>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <section
            aria-label="Ask AnNa Chat"
            className="relative z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl transition-transform duration-300 animate-in slide-in-from-right"
          >
            <AdvisorChat onClose={() => setIsOpen(false)} />
          </section>
        </div>
      )}
    </>
  );
}
