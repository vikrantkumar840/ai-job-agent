import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/components/providers/AuthProvider";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "ResuApply — Your resume, run by eight AI agents",
  description:
    "Upload your resume once. ResuApply parses it, finds matching roles, tailors your resume, writes the cover letter, rehearses the interview, and applies — all through an orchestrated AI agent pipeline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-ink text-paper min-h-screen font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
