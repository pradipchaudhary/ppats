"use client";
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  activeAddress: string;
  domain: string;
  inboxCount: number;
}

export default function Sidebar({ activeAddress, domain, inboxCount }: Props) {
  const pathname = usePathname();
  const isInboxActive = pathname === '/dashboard' || pathname?.startsWith('/dashboard/inbox');
  const isProfileActive = pathname?.startsWith('/dashboard/profile');

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <nav className="flex flex-1 flex-col border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0d0d0d] pt-16 transition-colors duration-300">

        {/* Mailbox Info */}
        <div className="px-4 py-4">
          <div className="text-[12px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">Dashboard</div>

        </div>

        {/* Mailbox Links */}
        <div className="px-2">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/inbox"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-colors duration-300 ${isInboxActive ? 'bg-neutral-100 dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-700 dark:border-neutral-700 border-l-emerald-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]'}`}>
                <span>Inbox</span>
                <span className="ml-auto text-[12px] bg-neutral-100 dark:bg-[#333333] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#444444] rounded px-1.5 py-0.5 transition-colors duration-300">{inboxCount}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-colors duration-300 ${isProfileActive ? 'bg-neutral-100 dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-700 dark:border-neutral-700 border-l-emerald-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]'}`}>
                Profile
              </Link>
            </li>

          </ul>
        </div>

        {/* Footer */}
        <div className="mt-auto px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-neutral-600 dark:text-neutral-400">
              <i className="w-4 h-4" />
              <span>Auto-refresh in <span className="font-medium">30s</span></span>
            </div>
            <button className="rounded-md border border-neutral-200 dark:border-neutral-700 px-2 py-1 text-[12px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors duration-300">Refresh</button>
          </div>
        </div>

      </nav>
    </aside>
  );
}
