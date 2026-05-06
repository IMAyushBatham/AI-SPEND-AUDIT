import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Spend Audit — Stop Overpaying for AI Tools',
  description:
    'Audit your AI tool subscriptions and discover how much your startup can save every month.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}