import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header/Header";
import { QueryProvider } from "@/providers/QueryProvider";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Tristero Trading Interface",
  description: "Crypto trading interface with real-time price data"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakartaSans.variable} antialiased`}>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
