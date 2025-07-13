import type { Metadata } from "next";
import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";
import Provider from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const poopins = Poppins({
  weight:'400',
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T4 Chat",
  description: "It is a LLM interface made with SHADCN and TweakCn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${poopins.className}  antialiased`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
