import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dropbox Lite",
  description: "A simple file storage system",
  keywords: [
    "file storage",
    "file sharing",
    "file upload",
    "file download",
    "file management",
    "file storage system",
    "cloud storage",
    "ysskrishna",
    "dropbox",
    "dropbox lite"
  ],
  authors: [
    {
      name: "Y. Siva Sai Krishna",
      url: "https://github.com/ysskrishna",
    },
  ],
  creator: "Y. Siva Sai Krishna",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
