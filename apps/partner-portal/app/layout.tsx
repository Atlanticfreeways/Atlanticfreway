import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atlanticfreway Partner Portal',
  description: 'Partner dashboard for Atlanticfreway affiliate program',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
