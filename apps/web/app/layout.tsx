import type { Metadata } from "next";
import { Inter } from "next/font/google"

import "./globals.css";
import { Nav } from "@/components/shared/nav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "W Fits",
  description: "Your AI powered outfit planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <main className="min-h-screen pb-16">
          {children}
        </main>
        <Nav />
        <Toaster />
      </body>
    </html>
  );
}
