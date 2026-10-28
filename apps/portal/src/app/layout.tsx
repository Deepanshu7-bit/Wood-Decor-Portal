import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Woods Decor — Central Management Portal",
  description: "Enterprise management portal for KS Woods Decor across Mohali, Kharar, and Australia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
