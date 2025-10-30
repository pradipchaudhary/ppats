"use client";
import { useUser } from "@/components/UserContext";
import React from "react";

/* ────────────────────────────── */
/* 📊 STATS CARD */
/* ────────────────────────────── */
function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: string;
}) {
  return (
    <div className="group bg-white dark:bg-[#161616] rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-lg dark:hover:border-emerald-500/40 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xl">
          {icon}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </h3>
          <p className="text-3xl font-bold mt-1 text-neutral-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── */
/* ⚡ QUICK ACTION */
/* ────────────────────────────── */
function QuickAction({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 w-full bg-white dark:bg-[#161616] rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-lg dark:hover:border-emerald-500/40 transition-all duration-300 text-left group"
    >
      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {description}
        </p>
      </div>
    </button>
  );
}

/* ────────────────────────────── */
/* 🕒 RECENT ACTIVITY */
/* ────────────────────────────── */
function RecentActivity({
  time,
  action,
  status,
}: {
  time: string;
  action: string;
  status: "success" | "pending" | "error";
}) {
  const statusClasses = {
    success:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
    pending:
      "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
    error: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500 dark:text-neutral-400 w-28 shrink-0">
          {time}
        </span>
        <span className="text-neutral-900 dark:text-white text-sm sm:text-base">
          {action}
        </span>
      </div>
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

/* ────────────────────────────── */
/* 🏠 DASHBOARD PAGE */
/* ────────────────────────────── */
export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-[#0d0d0d] min-h-screen transition-colors duration-300">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm sm:text-base">
          Here’s a quick summary of your passport applications.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatsCard
          title="Total Applications"
          value="12"
          description="4 pending approval"
          icon="📝"
        />
        <StatsCard
          title="Processing Time"
          value="3.2 days"
          description="Average processing time"
          icon="⏱️"
        />
        <StatsCard
          title="Success Rate"
          value="94%"
          description="Applications approved"
          icon="📈"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161616] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            <RecentActivity
              time="2 hours ago"
              action="Passport application submitted"
              status="success"
            />
            <RecentActivity
              time="5 hours ago"
              action="Document verification in progress"
              status="pending"
            />
            <RecentActivity
              time="1 day ago"
              action="Photo verification failed"
              status="error"
            />
            <RecentActivity
              time="2 days ago"
              action="Application approved"
              status="success"
            />
          </div>
          <button className="mt-6 text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
            View all activity →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <QuickAction
              title="New Application"
              description="Start a new passport application"
              icon="➕"
              onClick={() => console.log("New application")}
            />
            <QuickAction
              title="Track Status"
              description="Check your application progress"
              icon="🔍"
              onClick={() => console.log("Track status")}
            />
            <QuickAction
              title="Upload Documents"
              description="Submit required documentation"
              icon="📎"
              onClick={() => console.log("Upload documents")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
