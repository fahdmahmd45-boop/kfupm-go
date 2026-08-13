import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KFUPM GO — Campus Navigation",
  description: "Find your way around KFUPM. Search a building or service and start walking.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex h-full min-h-full flex-col overflow-hidden bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
