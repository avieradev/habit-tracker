import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Seguimiento de hábitos con rachas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-10 animated-gradient" />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
