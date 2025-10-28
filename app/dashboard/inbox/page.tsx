import MailList, { Message } from '@/components/MailList';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface ContentPayload {
  activeAddress: string;
  domain: string;
  inboxCount: number;
  messages: Message[];
}

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

export default async function InboxPage() {
  const apiUrl = process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/content/dashboard`
    : '/api/content/dashboard';

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch inbox content', res.statusText);
      return <AuthError title="Error" message="Failed to load inbox data" />;
    }

    const data = (await res.json()) as ContentPayload;

    return (
      <div className="min-h-screen">
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Sidebar activeAddress={data.activeAddress} domain={data.domain} inboxCount={data.inboxCount} />

          <main className="flex-1 top-16 left-0 right-0 bottom-0 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <MailList messages={data.messages} />
            </div>
          </main>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Inbox error', err);
    return <AuthError title="Error" message="An error occurred while loading the inbox" />;
  }
}
