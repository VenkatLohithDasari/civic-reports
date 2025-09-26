import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { NextAuthProvider } from '@/components/providers/NextAuthProvider'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CivicReport — Report civic issues, effortlessly',
  description: 'A modern, mobile-first platform to report potholes, broken streetlights, sanitation issues, and more. Track progress and see real change.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} antialiased text-slate-800`}>
        <NextAuthProvider>
          {/* Background layers */}
          <div className="pointer-events-none fixed inset-0 -z-20">
            <div className="absolute -top-24 right-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-gradient-to-tr from-blue-300/35 via-indigo-300/25 to-violet-300/25 blur-3xl" />
            <div className="absolute top-[40%] left-[-10%] h-[55vmax] w-[55vmax] rounded-full bg-gradient-to-tr from-cyan-300/25 via-teal-300/20 to-emerald-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          </div>
          <div className="pointer-events-none fixed inset-0 -z-10 bg-noise opacity-[0.06]" />

          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
