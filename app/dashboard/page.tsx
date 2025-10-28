
"use client";
import { useUser } from '@/components/UserContext';

function StatsCard({ title, value, description, icon }: {
  title: string;
  value: string | number;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
          <p className="text-2xl font-semibold mt-1 text-neutral-900 dark:text-white">{value}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, description, icon, onClick }: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white dark:bg-[#161616] rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition-colors duration-200 w-full text-left"
    >
      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="font-medium text-neutral-900 dark:text-white">{title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{description}</p>
      </div>
    </button>
  );
}

function RecentActivity({ time, action, status }: {
  time: string;
  action: string;
  status: 'success' | 'pending' | 'error';
}) {
  const statusClasses = {
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    pending: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    error: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
  };

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-24 text-sm text-neutral-600 dark:text-neutral-400">{time}</div>
      <div className="flex-1 text-neutral-900 dark:text-white">{action}</div>
      <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Here's what's happening with your passport applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161616] rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-4 sm:mb-6">Recent Activity</h2>
          <div className="space-y-2 sm:space-y-3">
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
          <button className="mt-6 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
            View all activity →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#161616] rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-4 sm:mb-6">Quick Actions</h2>
          <div className="space-y-3 sm:space-y-4">
            <QuickAction
              title="New Application"
              description="Start a new passport application"
              icon="➕"
              onClick={() => console.log('New application')}
            />
            <QuickAction
              title="Track Status"
              description="Check existing application status"
              icon="🔍"
              onClick={() => console.log('Track status')}
            />
            <QuickAction
              title="Upload Documents"
              description="Submit required documentation"
              icon="📎"
              onClick={() => console.log('Upload documents')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
