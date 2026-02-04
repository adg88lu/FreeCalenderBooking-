import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book a Meeting",
  description: "Schedule a time with me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
