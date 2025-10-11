"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Copy,
  Plus,
  RefreshCw,
  AtSign,
  Inbox,
  Star,
  ShieldAlert,
  Trash2,
  Settings,
  Clock,
} from "lucide-react";

type Message = {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  time: string;
  body: string;
  unread?: boolean;
  tag?: string;
};

const sampleMessages: Message[] = [
  {
    id: "1",
    fromName: "Figma",
    fromEmail: "no-reply@figma.com",
    subject: "Your security code",
    time: "10:24 AM",
    body: "Use the code 824193 to continue. If you didn’t request this, please ignore this message.",
    unread: true,
    tag: "Code",
  },
  {
    id: "2",
    fromName: "GitService",
    fromEmail: "noreply@gitservice.dev",
    subject: "Verify your email address",
    time: "9:02 AM",
    body: "Click the link to verify your email address. If you didn’t request this, ignore this email.",
    unread: true,
    tag: "Verify",
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeAddress, setActiveAddress] = useState("welcome.wave@tempmail.dev");
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [autoRefreshSec, setAutoRefreshSec] = useState(30);

  // auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshSec((s) => {
        if (s <= 1) {
          // simulate refresh
          refreshMessages();
          return 30;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(activeAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.warn("Clipboard error", e);
    }
  }

  function refreshMessages() {
    // small simulation of new messages
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        fromName: "Service",
        fromEmail: "noreply@service.dev",
        subject: "Demo message",
        time: new Date().toLocaleTimeString(),
        body: "This is a simulated message.",
        unread: true,
        tag: "Info",
      },
    ]);
  }

  function markAllRead() {
    setMessages((prev) => prev.map((m) => ({ ...m, unread: false })));
  }

  function purge() {
    setMessages([]);
  }

  return (
    <div className="min-h-screen antialiased bg-white text-neutral-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial' }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="lg:hidden inline-flex items-center justify-center rounded-md border border-neutral-200 px-2.5 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                <Menu className="w-5 h-5" />
              </button>
              <a href="#" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-neutral-900 text-white grid place-items-center tracking-tight text-[11px] font-semibold">T</div>
                <div className="text-[15px] font-medium tracking-tight text-neutral-900">TempMail</div>
                <span className="text-neutral-400">/</span>
                <div className="text-[15px] font-normal text-neutral-600">Inbox</div>
              </a>
            </div>

            <div className="flex-1 max-w-xl hidden md:flex items-center">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="text" placeholder="Search mail…" className="w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 py-2.5 text-[14px] placeholder-neutral-400 focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200 outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard?.writeText(activeAddress)} className="hidden md:inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button onClick={() => setActiveAddress(`addr.${Math.random().toString(36).slice(2, 8)}@tempmail.dev`)} className="hidden sm:inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                <Plus className="w-4 h-4" />
                New Address
              </button>
              <button onClick={() => { refreshMessages(); setAutoRefreshSec(30); }} className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-3 py-2 text-[13px] hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <div className="h-8 w-[1px] bg-neutral-200 mx-1.5"></div>
              <button className="rounded-full overflow-hidden border border-neutral-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                <img src="https://images.unsplash.com/photo-1546456073-6712f79251bb?q=80&w=80&auto=format&fit=facearea&facepad=2&h=80" alt="User" className="h-8 w-8 object-cover" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 z-30 ${sidebarOpen ? 'left-0' : '-left-80'} lg:left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-neutral-200 transition-all`}>
          <nav className="h-full flex flex-col">
            <div className="px-4 py-3">
              <div className="text-[12px] uppercase tracking-wide text-neutral-500 mb-2">Mailbox</div>
              <div className="group flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <AtSign className="w-4 h-4 text-neutral-700" />
                  <div id="sidebarAddr" className="text-[13px] text-neutral-800 truncate max-w-[9rem]">{activeAddress}</div>
                </div>
                <button onClick={copyAddress} className="rounded p-1 hover:bg-neutral-50">
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
                </button>
              </div>
            </div>

            <div className="px-2">
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] bg-neutral-50 text-neutral-900 border border-neutral-200">
                    <Inbox className="w-4 h-4" />
                    Inbox
                    <span className="ml-auto text-[12px] bg-neutral-100 text-neutral-700 border border-neutral-200 rounded px-1.5 py-0.5">{messages.length}</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition">
                    <Star className="w-4 h-4" />
                    Starred
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition">
                    <ShieldAlert className="w-4 h-4" />
                    Spam
                    <span className="ml-auto text-[12px] bg-neutral-100 text-neutral-700 border border-neutral-200 rounded px-1.5 py-0.5">2</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition">
                    <Trash2 className="w-4 h-4" />
                    Trash
                  </a>
                </li>
                <li className="pt-1.5">
                  <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition">
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-auto px-4 py-3 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-neutral-600">
                  <Clock className="w-4 h-4" />
                  <span>Auto-refresh in <span id="refreshCountdown">{autoRefreshSec}</span>s</span>
                </div>
                <button onClick={() => { refreshMessages(); setAutoRefreshSec(30); }} className="rounded-md border border-neutral-200 px-2 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50">Refresh</button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="fixed top-16 left-0 right-0 bottom-0 overflow-auto flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl tracking-tight font-semibold text-neutral-900">Temporary Mail</h1>
                <p className="text-[14px] text-neutral-600 mt-1">Use a disposable email to receive messages. No sign-up required.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveAddress(`addr.${Math.random().toString(36).slice(2, 8)}@tempmail.dev`)} className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                  <Plus className="w-4 h-4" />
                  New Address
                </button>
                <button onClick={copyAddress} className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button onClick={() => { refreshMessages(); setAutoRefreshSec(30); }} className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-3 py-2 text-[13px] hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Address card */}
            <section className="rounded-xl border border-neutral-200 bg-white p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-neutral-200 px-3 py-2.5 bg-white flex items-center gap-2">
                    <AtSign className="w-4 h-4 text-neutral-600" />
                    <div className="text-[14px] font-medium text-neutral-900 tracking-tight" id="activeAddress">{activeAddress}</div>
                  </div>
                  <span id="copiedBadge" className={`${copied ? 'inline-flex' : 'hidden'} text-[12px] rounded px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100`}>Copied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[12px] text-neutral-500">Domain</div>
                  <div className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-[12px] text-neutral-700 bg-neutral-50">tempmail.dev</div>
                </div>
              </div>
            </section>

            {/* Mail layout */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* List */}
              <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden lg:col-span-1">
                <div className="flex items-center justify-between p-3 border-b border-neutral-200">
                  <div className="text-[14px] font-medium text-neutral-900 tracking-tight">Inbox</div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={markAllRead} className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-50">Mark all read</button>
                    <button onClick={purge} className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-50">Purge</button>
                  </div>
                </div>
                <div id="messageList" className="divide-y divide-neutral-200 max-h-[60vh] overflow-auto">
                  {messages.map((m) => (
                    <button key={m.id} className="w-full text-left p-3 hover:bg-neutral-50 transition focus:outline-none group" onClick={() => setMessages((prev) => prev.map(pm => pm.id === m.id ? { ...pm, unread: false } : pm))}>
                      <div className="flex items-start gap-3">
                        <img src={`https://images.unsplash.com/photo-1541537103745-ea3429c65dc7?q=80&w=100&auto=format&fit=crop`} alt="" className="h-8 w-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-[13px] text-neutral-700">{m.fromName}</div>
                            <span className="text-[11px] rounded px-1 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600">{m.tag}</span>
                            <span className="ml-auto text-[12px] text-neutral-500">{m.time}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <div className="truncate text-[14px] font-medium text-neutral-900">{m.subject}</div>
                          </div>
                          <div className="truncate text-[12px] text-neutral-600">{m.body}</div>
                        </div>
                        {m.unread && <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1" title="Unread"></span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview / details (placeholder) */}
              <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-4 min-h-[60vh]">
                <div className="text-neutral-500">Select a message to preview its content here. This pane is intentionally left simple so you can wire it to real data or a markdown/html renderer.</div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
