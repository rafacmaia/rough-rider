import { Cabin, Cabin_Sketch, Calistoga, Gaegu } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import AboutModal from "@/components/AboutModal";

const cabin = Cabin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cabin",
});

const cabin_sketch = Cabin_Sketch({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-cabin-sketch",
});

const calistoga = Calistoga({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-calistoga",
  weight: "400",
});

const gaegu = Gaegu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gaegu",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Rough Riders",
  description: "Match & tournament tracking for Rough Riders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${cabin.variable} ${cabin_sketch.variable} ${calistoga.variable} ${gaegu.variable} relative flex min-h-svh w-screen min-w-80 flex-col overflow-x-hidden bg-background text-foreground`}
      >
        {children}
        <AboutModal />
      </body>
    </html>
  );
}
