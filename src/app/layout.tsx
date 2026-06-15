import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodyClassName = [plusJakartaSans.variable, ibmPlexMono.variable].join(" ");

export const metadata: Metadata = {
  title: "Insurance Plan Pricing",
  description:
    "Compare insurance plan benefits, limits, and pricing with a responsive recommendation-first layout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bodyClassName}>
      <body>{children}</body>
    </html>
  );
}
