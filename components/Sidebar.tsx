"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface Props {
  activeAddress: string;
  domain: string;
  inboxCount: number;
}

export default function Sidebar({ activeAddress, domain, inboxCount }: Props) {
  const pathname = usePathname();
  const isInboxActive =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/index");
  const isProfileActive = pathname?.startsWith("/dashboard/profile");

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-[#0d0d0d] transition-colors duration-300">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center py-3 border-b border-neutral-100 dark:border-neutral-800"
      >
        <img
          src="/logo.png"
          alt="PpaTools Logo"
          width={130}
          height={25}
          className="object-contain"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4 space-y-2">
        <div className="text-[12px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 px-2 mb-1">
          Dashboard
        </div>

        <ul className="space-y-1">
          {/* Index */}
          <li>
            <Link
              href="/dashboard/index"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-all duration-200 ${isInboxActive
                ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-[#161616]/70  font-medium"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]"
                }`}
            >
              Index
            </Link>
          </li>

          {/* Inbox */}
          <li>
            <Link
              href="/dashboard/inbox"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-all duration-200 ${pathname?.startsWith("/dashboard/inbox")
                ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-[#161616]/70 font-medium"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]"
                }`}
            >
              <span>Inbox</span>
              <span className="ml-auto text-[12px] bg-neutral-100 dark:bg-[#2b2b2b] text-neutral-700 dark:text-neutral-300 rounded px-1.5 py-0.5">
                {inboxCount}
              </span>
            </Link>
          </li>

          {/* Profile */}
          <li>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-all duration-200 ${isProfileActive
                ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-[#161616]/70 font-medium"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]"
                }`}
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between text-[12px] text-neutral-600 dark:text-neutral-400">
          <span>
            Auto-refresh in <span className="font-medium">30s</span>
          </span>
          <button className="rounded-md px-2 py-1 text-[12px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition">
            Refresh
          </button>
        </div>
      </div>
    </aside>
  );
}
