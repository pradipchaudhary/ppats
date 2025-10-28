"use client";
import React from 'react';
import { useUser } from './UserContext';
import Link from 'next/link';

const Header = () => {
  const { user } = useUser();
  // Prefer the first letter of the user's first name; fall back to the email's local-part, then 'U'
  const initial = (() => {
    if (!user) return 'U';
    const name = user.name?.trim();
    if (name) {
      const firstWord = name.split(/\s+/)[0];
      if (firstWord && firstWord.length) return firstWord[0].toUpperCase();
    }
    const email = user.email?.trim();
    if (email) {
      const local = email.split('@')[0];
      if (local && local.length) return local[0].toUpperCase();
    }
    return 'U';
  })();
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              id="sidebarToggle"
              className="lg:hidden inline-flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 px-2.5 py-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition"
            >
              <i data-lucide="menu" className="w-5 h-5"></i>
            </button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="PpaTools Logo" width={90} height={25} className="block" />
            </Link>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-xl hidden md:flex items-center">
            <div className="relative w-full">
              <i
                data-lucide="search"
                className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              ></i>
              <input
                type="text"
                placeholder="Search mail…"
                className="w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0d0d0d] pl-9 pr-3 py-2.5 text-[14px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-neutral-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-gray-700 outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">

            <button
              id="topRefreshBtn"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-[#0d0d0d] text-white px-3 py-2 text-[13px] hover:bg-neutral-800 dark:hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition"
            >
              <i data-lucide="refresh-ccw" className="w-4 h-4"></i>
              Refresh
            </button>

            <div className="h-8 w-[1px] bg-neutral-200 dark:bg-neutral-700 mx-1.5"></div>

            <button
              className="rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition"
              aria-label="User menu"
            >
              {/* Letter avatar generated from user's first name/email initial */}
              {(() => {
                const bgColors = [
                  'bg-neutral-900',
                  'bg-blue-600',
                  'bg-green-600',
                  'bg-indigo-600',
                  'bg-pink-600',
                  'bg-yellow-500',
                  'bg-purple-600',
                  'bg-emerald-600',
                ];
                const char = initial || 'U';
                const idx = char.charCodeAt(0) % bgColors.length;
                const bg = bgColors[idx];
                return (
                  <div className={`${bg} h-8 w-8 rounded-full grid place-items-center text-white font-semibold uppercase`}>{char}</div>
                );
              })()}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
