'use client';

import Footer from '../src/components/footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAuthPage =
    pathname === '/home' ||
    pathname === '/' ||
    pathname === '/manager' ||
    pathname === '/gymmember' ||
    /(login|register)/.test(pathname);

  return (
    <>
      {/* Navbar removed from layout */}
      <main className="flex-grow-1">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
