import './globals.css';

export const metadata = {
  title: 'Temp Mail Dashboard',
  description: 'Temporary mail system with a clean UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
