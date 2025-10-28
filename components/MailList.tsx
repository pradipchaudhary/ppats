"use client";
import React, { useState } from "react";

export interface Message {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  time: string;
  tag?: string;
  body: string;
  unread?: boolean;
}

export default function MailList({ messages }: { messages: Message[] }) {
  const [activeId, setActiveId] = useState<string | null>(messages?.[0]?.id ?? null);
  const active = messages.find((m) => m.id === activeId) || messages[0];

  return (
    <div className="rounded-2xl border border-neutral-300 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] shadow-sm transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-[#1a1a1a] bg-neutral-50 dark:bg-[#101010]">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Inbox</h2>
        <div className="flex items-center gap-2">
          <button className="text-xs rounded-md border border-neutral-300 dark:border-[#2a2a2a] px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-all">
            Mark all read
          </button>
          <button className="text-xs rounded-md border border-neutral-300 dark:border-[#2a2a2a] px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-all">
            Purge
          </button>
        </div>
      </div>

      {/* Message List */}
      <div
        id="messageList"
        className="divide-y divide-neutral-200 dark:divide-[#222222] max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#333333]"
      >
        {messages.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            className={`group w-full text-left px-4 py-3 flex gap-3 items-start transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-[#161616] ${activeId === m.id
              ? "bg-neutral-100 dark:bg-[#161616] border-l-4 border-emerald-500"
              : "border-l-4 border-transparent"
              }`}
          >
            {/* Avatar Circle */}
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-green-400 grid place-items-center text-sm font-semibold text-white uppercase">
              {m.fromName?.[0] ?? "U"}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {m.fromName}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{m.time}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="truncate text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                  {m.subject}
                </p>
                {m.tag && (
                  <span className="text-[10px] font-medium rounded-full px-1.5 py-0.5 bg-emerald-50 dark:bg-[#1a3a2a] text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-[#1a3a2a]">
                    {m.tag}
                  </span>
                )}
              </div>
              <p className="truncate text-[12px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug">
                {m.body}
              </p>
            </div>

            {/* Unread Dot */}
            {m.unread && (
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500 mt-1 group-hover:scale-110 transition-transform" title="Unread"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
