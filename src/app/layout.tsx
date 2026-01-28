import type { Metadata } from "next";
import { Inter, Outfit, Source_Code_Pro } from "next/font/google";
import Navbar from "./(main)/components/Navbar";
import "./globals.css";
import "./main.css";

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

export const metadata: Metadata = {
  title: {
    absolute: "Free resume builder",
    template: "%s | Free resume builder",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  description: "Free resume templates to build your coolest resume Now.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${outfit.variable} ${tech.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
