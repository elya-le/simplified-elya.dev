import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Inconsolata, Lato } from "next/font/google";

const mono = Inconsolata({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

const sans = Lato({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Elya | Creative Developer",
  description:
    "Full-stack developer blending UI/UX, motion design, and 3D art to create secure, intentional digital experiences rooted in care, equity, and community empowerment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body className="font-[var(--font-sans)]">
        <Header />
        {children}
      </body>
    </html>
  );
}

