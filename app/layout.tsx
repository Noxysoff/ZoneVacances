import type { Metadata } from "next";
import { env } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: env.siteName,
  description:
    "France and Belgium school holiday dashboard with localized routes, detailed country maps and real-time countdowns.",
  applicationName: env.siteName,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
