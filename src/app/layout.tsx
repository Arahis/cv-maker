import type { Metadata } from "next";
import { Inter, Outfit, Source_Code_Pro, Cantata_One } from "next/font/google";
import "./globals.css";
import "./main.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

const tech = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-tech",
  display: "swap",
});

const cantata = Cantata_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cantata",
  display: "swap",
});

export const metadata: Metadata = {
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
      <body
        className={`${inter.className} ${outfit.variable} ${tech.variable} ${cantata.variable} antialiased`}
      >
        {children}

        <GoogleAnalytics />
      </body>
    </html>
  );
}
