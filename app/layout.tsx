// src/app/layout.tsx
'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  const clerkPubkey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return (
    <ClerkProvider publishableKey={clerkPubkey}>
      <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto  bg-gray-100">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </body>
      </html>
      </QueryClientProvider>
    </ClerkProvider>
  )
}