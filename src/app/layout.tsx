import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./rtl.css"; // Import RTL styles
import { LanguageProvider } from "../components/LanguageProvider";
import ClientWrapper from "./ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "RDMC | Portal",
  description: "RDMC Portal for active employees",
  applicationName: "RDMC Portal",
  authors: { name: "RDMC Digital team", },
  generator: "Mobility Cairo",
  keywords: ["RDMC", "Portal", "Mobility Cairo"],
  creator: "RDMC Digital team",
  publisher: "Mobility Cairo",
  robots: { index: false, follow: false },
  icons: [{ rel: "icon", url: "https://rdmc-portal.com/icon.png" }, { rel: "apple-touch-icon", url: "https://rdmc-portal.com/icon.png" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
