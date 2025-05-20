// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CST Gym',
  description: 'College of Science and Technology Gym',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {/* Navbar removed from layout */}
        {children}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" async></script>
      </body>
    </html>
  );
}
