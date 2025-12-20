import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" // ✅ REQUIRED for toast styles
import AuthWrapper from "@/components/AuthWrapper"
import Chatbot from "@/components/chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Web3Jobs - Decentralized Job Marketplace",
  description: "Find work, hire talent, and make secure payments with our Web3-powered platform.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body className={inter.className}>
        <AuthWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToastContainer position="top-right" autoClose={5000} theme="colored" />
            <Chatbot/>
          </ThemeProvider>
        </AuthWrapper>
      </body>
    </html>
  )
}
