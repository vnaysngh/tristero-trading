import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Tristero Trading Interface",
  description: "Simulated crypto trading interface with real-time price data"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
