import '../styles/globals.css';

export const metadata = {
  title: 'Passport Profile Automation Tools',
  description: 'Automates creating a user profile from a scanned Nepali passport image, extracts passport fields, generates an email, and optionally guides through FEIMS foreign-employment login.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
