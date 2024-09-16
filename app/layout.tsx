'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Sidebar from '@/components/layout/Sidebar'
import NotificationHandler from '@/components/shared/NotificationHandler'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkPubkey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider publishableKey={clerkPubkey}>
      <QueryClientProvider client={queryClient}>
        <html lang="en" className="h-full bg-gray-50">
          <body className={`${inter.className} h-full`}>
            <div className="flex h-full">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                  <NotificationHandler />
                  {children}
                </div>
              </main>
            </div>
            <Toaster />
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  )
}