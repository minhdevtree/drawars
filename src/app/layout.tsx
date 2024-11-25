'use client';

import localFont from 'next/font/local';
import './globals.css';
import { GlobalStateProvider } from '@/components/provider/global-state-provider';
import { Toaster } from '@/components/ui/toaster';
import { SocketProvider } from '@/components/provider/socket-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-bg antialiased transition-colors duration-1000`}
      >
        <GlobalStateProvider>
          <SocketProvider>
            {children}
            <Toaster />
          </SocketProvider>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
