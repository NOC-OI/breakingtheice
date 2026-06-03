import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const testSohne = localFont({
  src: '../public/TestSohne-Kraftig-BF663d89cd37e26.otf',
  variable: '--font-test-sohne',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Breaking the Ice',
  description: '3D Modelling Decades of Change'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${testSohne.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gdk0ajh.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
