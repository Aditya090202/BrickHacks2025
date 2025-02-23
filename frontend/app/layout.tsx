import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeTrack",
  description: "Next-generation security monitoring system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.className} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`}
      >
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
