import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "Apilary — Your AI Integration Architect",
  description: "Describe what you're building. Apilary analyzes technical trade-offs, recommends the top APIs, provides the architect verdict, and generates production integration code.",
  keywords: ["api recommendation", "software architecture", "api matcher", "developer tools", "integration code", "system design", "arquitectura de software", "integración de apis"],
  authors: [{ name: "Apilary" }],
  openGraph: {
    title: "Apilary — Your AI Integration Architect",
    description: "Describe what you're building and get senior architectural recommendations, technical trade-offs, and integration snippets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
