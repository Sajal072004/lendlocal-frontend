import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext"; 
import { Toaster } from "@/components/ui/sonner"; 
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LendLocal",
  description: "Share and borrow within your community.",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
          <Analytics />
          <SpeedInsights />
          {/* Add any additional metadata or scripts here */}
          {/* Main content */}
          {children}
          <Toaster/>
          </SocketProvider>
         
        </AuthProvider>
      </body>
    </html>
  );
}