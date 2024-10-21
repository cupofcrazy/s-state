import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/header";
import { SessionProvider } from "next-auth/react";
import { TrackAudioContextProvider } from "@/contexts/AudioProvider";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Spotify Stats",
  description: "Spotify Stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <TrackAudioContextProvider>
          <body className={`${inter.className} bg-neutral-50`}>
            <Header />
            {children}
            <Toaster />
          </body>
        </TrackAudioContextProvider>
      </SessionProvider>
    </html>
  );
}
