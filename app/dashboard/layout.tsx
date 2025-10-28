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
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex">
              <Sidebar activeAddress={data.activeAddress} domain={data.domain} inboxCount={data.inboxCount} />
              <div className="flex-1 lg:pl-64">
                <div className="max-w-7xl mx-auto">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </div>
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
