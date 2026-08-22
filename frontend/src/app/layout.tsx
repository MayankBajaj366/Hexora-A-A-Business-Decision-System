import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hexora A&A Business Systems",
  description: "Autonomous Business Decision System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FDFCFB] text-[#36454F] min-h-screen flex`}>
        <Providers>
          <Sidebar />
          <main className="flex-1 p-8 bg-[#FDFCFB] overflow-y-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
