import '@/styles/globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import UserProvider from '@/components/UserContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'Dashboard - PpaTools'
};

function AuthError({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-xl mx-auto mt-20">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-red-600 mb-2">{message}</p>
      <p>
        Please <Link href="/login" className="text-blue-600 hover:underline">login</Link> to continue
      </p>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Prefer relative API path in production so cookies are preserved on same origin.
  const apiUrl = process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/content/dashboard`
    : '/api/content/dashboard';

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch dashboard content', res.statusText);
      return <AuthError title="Error" message="Failed to load dashboard data" />;
    }

    const data = await res.json();

    return (
      <ErrorBoundary>
        <UserProvider>
          <div className="flex min-h-screen bg-gray-50 text-gray-900">
            {/* ===== SIDEBAR ===== */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
              {/* Sidebar Logo */}
              <div className="flex items-center justify-center h-16 border-b border-gray-100">
                <img
                  src="/logo-light.png"
                  alt="App Logo"
                  className="h-8 w-auto"
                />
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {/* <Sidebar /> */}
                <Sidebar activeAddress={data.activeAddress} domain={data.domain} inboxCount={data.inboxCount} />
              </div>
            </aside>

            {/* ===== MAIN AREA ===== */}
            <div className="flex flex-col flex-1 ml-64">
              {/* Fixed Header */}
              <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-6 shadow-sm">
                <Header />
              </header>

              {/* Main Content */}
              <main className="flex-1 pt-16 overflow-y-auto">
                <div className="">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </div>
              </main>
            </div>
          </div>
        </UserProvider>
      </ErrorBoundary>
    );
  } catch (err) {
    console.error('Dashboard error', err);
    return <AuthError title="Error" message="An error occurred while loading the dashboard" />;
  }
}
