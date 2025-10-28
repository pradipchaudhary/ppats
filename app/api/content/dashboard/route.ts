// app/api/content/dashboard/route.ts
import { NextResponse } from 'next/server';

export const GET = async () => {
  // Sample content used by the dashboard. Replace with DB calls or CMS fetches.
  const payload = {
    activeAddress: 'welcome.wave@tempmail.dev',
    domain: 'tempmail.dev',
    inboxCount: 6,
    messages: [
      {
        id: '1',
        fromName: 'Figma',
        fromEmail: 'no-reply@figma.com',
        subject: 'Your security code',
        time: '10:24 AM',
        tag: 'Code',
        body: 'Use the code 824193 to continue. If you didn’t request this, please ignore this message.',
        unread: true
      },
      {
        id: '2',
        fromName: 'GitService',
        fromEmail: 'noreply@gitservice.dev',
        subject: 'Verify your email address',
        time: '9:02 AM',
        tag: 'Verify',
        body: 'Click the link to verify your email address. If you didn’t request this, ignore this email.',
        unread: true
      }
    ]
  };

  return NextResponse.json(payload);
};
