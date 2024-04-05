import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider, auth } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/nav-components/navbar";
import Sidebar from "@/components/nav-components/sidebar";
import prismadb from "@/lib/prismadb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AFriendI",
  description: "Find your next AI best friend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();
  const friends = await prismadb.companion.findMany({
    where: {
      friendLists: {
        some: {
          friendList: {
            userId: userId || ""
          }
        }
      }
    }
  })

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("bg-secondary", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="h-full">
              <Navbar companions={friends} />
              <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar companions={friends} />
              </div>
              <main className="md:pl-20 pt-16 h-full">
                {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
