// Import React to fix 'Cannot find namespace React' error on line 13
import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenYou – Learning Passport",
  description: "Hành trình thấu hiểu bản thân và học tập thông minh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Patrick+Hand&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-paper antialiased">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
             style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        {children}
      </body>
    </html>
  );
}