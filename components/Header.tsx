"use client";
import React from "react";
import { useUser } from "./UserContext";
import Link from "next/link";
import { Menu, Search, RefreshCcw } from "lucide-react";

const Header = () => {
  const { user } = useUser();

  // Generate user initial
  const initial = (() => {
    if (!user) return "U";
    const name = user.name?.trim();
    if (name) {
      const firstWord = name.split(/\s+/)[0];
      if (firstWord && firstWord.length) return firstWord[0].toUpperCase();
    }
    const email = user.email?.trim();
    if (email) {
      const local = email.split("@")[0];
      if (local && local.length) return local[0].toUpperCase();
    }
    return "U";
  })();

  // Avatar color generator
  const bgColors = [
    "bg-neutral-900",
    "bg-blue-600",
    "bg-green-600",
    "bg-indigo-600",
    "bg-pink-600",
    "bg-yellow-500",
    "bg-purple-600",
    "bg-emerald-600",
  ];
  const char = initial || "U";
  const idx = char.charCodeAt(0) % bgColors.length;
  const bg = bgColors[idx];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 z-40 bg-white/90 dark:bg-[#0d0d0d]/90 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">



        {/* ===== Center Search ===== */}
        <div className="flex-1 max-w-xl hidden md:flex items-center">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search mail…"
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0d0d0d] pl-9 pr-3 py-2.5 text-[14px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-neutral-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-gray-700 outline-none transition-colors duration-300"
            />
          </div>
        </div>

        {/* ===== Right Section ===== */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            id="topRefreshBtn"
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-[#1a1a1a] text-white px-3 py-2 text-[13px] hover:bg-neutral-800 dark:hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-neutral-200 dark:bg-neutral-700 mx-1.5" />

          {/* User Avatar */}
          <button
            className="rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition"
            aria-label="User menu"
          >
            <div
              className={`${bg} h-8 w-8 rounded-full grid place-items-center text-white font-semibold uppercase`}
            >
              {char}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
