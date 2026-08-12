import type { Metadata } from "next";
import "./globals.css";
import "./main.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieBanner from "@/components/analytics/CookieBanner";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://cvoop.com"),
  title: {
    default: "Cvoop – Free Resume Builder",
    template: "%s | Cvoop",
  },
  description:
    "Free resume and CV builder with modern templates. Create and download your resume instantly without registration.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <Providers>{children}</Providers>
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  );
}
