import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin - SaaS Toolkit",
  description: "Internal admin console for SaaS Toolkit (INTERNAL USE ONLY)",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <div className="border-b bg-destructive/10">
            <div className="container mx-auto px-4 py-2">
              <p className="text-sm text-destructive font-medium">
                ⚠️ INTERNAL ADMIN CONSOLE - NOT FOR PUBLIC USE
              </p>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
