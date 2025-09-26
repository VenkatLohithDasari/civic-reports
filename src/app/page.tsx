'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  MapPinIcon,
  CameraIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40">
        <nav className="container mt-4">
          <div className="glass flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold">
                CR
              </div>
              <span className="text-lg font-semibold tracking-tight">CivicReport</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-slate-700">
              <a href="#features" className="hover:text-slate-900">Features</a>
              <a href="#how" className="hover:text-slate-900">How it works</a>
              <a href="#impact" className="hover:text-slate-900">Impact</a>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Get Started
                <BoltIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container pt-16 md:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
              <ShieldCheckIcon className="h-4 w-4" />
              <span className="text-xs font-medium">Built for cities and citizens</span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Report civic issues in seconds.
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Track progress in real time.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Snap a photo, auto-tag your location, and submit. Get updates from acknowledgment to resolution—all in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
              >
                Start reporting
                <CameraIcon className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50"
              >
                See features
                <ChartBarIcon className="h-5 w-5" />
              </a>
            </div>

            <ul className="mt-6 grid max-w-lg grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                One-tap location tagging
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                Photo and voice notes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                Live status updates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                Community upvotes
              </li>
            </ul>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 sm:max-w-md">
              <div className="glass px-4 py-3 text-center">
                <div className="text-xl font-bold">10K+</div>
                <div className="text-xs text-slate-600">Reports submitted</div>
              </div>
              <div className="glass px-4 py-3 text-center">
                <div className="text-xl font-bold">24h</div>
                <div className="text-xs text-slate-600">Avg. acknowledgment</div>
              </div>
              <div className="glass px-4 py-3 text-center">
                <div className="text-xl font-bold">95%</div>
                <div className="text-xs text-slate-600">User satisfaction</div>
              </div>
            </div>
          </div>

          {/* Hero visual mockup */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-violet-200/30 blur-2xl animate-glow" />
            <div className="relative glass p-4 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Report card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
                      <CameraIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Pothole on Ring Rd</p>
                        <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">Submitted</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        Large pothole near Sector 7. Risky for two-wheelers, needs urgent fix.
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <MapPinIcon className="h-4 w-4" />
                        Akash Nagar, Chhattisgarh
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map pin mock */}
                <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                  <div className="h-36 w-full rounded-xl bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.18),transparent_45%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-float rounded-full bg-red-500 p-2 text-white shadow-lg">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Status timeline */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Acknowledged by Public Works
                        <span className="text-xs text-slate-500">2h ago</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        Task assigned to field team
                        <span className="text-xs text-slate-500">1h ago</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        In progress
                        <span className="text-xs text-slate-500">Just now</span>
                      </div>
                    </div>
                    <div className="hidden md:block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      Real-time updates
                    </div>
                  </div>
                </div>

                {/* Notification mock */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
                      <BellAlertIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">You’ll be notified</p>
                      <p className="text-sm text-slate-600">When status changes to Resolved</p>
                    </div>
                  </div>
                </div>

                {/* Trust card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Verified departments</p>
                      <p className="text-sm text-slate-600">Auto-routed to the right team</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Powerful features, simple to use
          </h2>
          <p className="mt-3 text-slate-600">
            Everything you need to capture, prioritize, and resolve civic issues—fast.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<CameraIcon className="h-6 w-6" />}
            title="Photo-first reports"
            desc="Capture the issue with clear photos and optional voice notes for context."
          />
          <FeatureCard
            icon={<MapPinIcon className="h-6 w-6" />}
            title="Auto location"
            desc="Precise GPS tagging and smart address hints for accurate routing."
          />
          <FeatureCard
            icon={<BellAlertIcon className="h-6 w-6" />}
            title="Real-time updates"
            desc="From submission to resolution, stay informed at each step."
          />
          <FeatureCard
            icon={<BoltIcon className="h-6 w-6" />}
            title="Fast uploads"
            desc="Optimized, resilient uploads even on slow connections."
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="h-6 w-6" />}
            title="Verified routing"
            desc="Send to the right department automatically based on category."
          />
          <FeatureCard
            icon={<ChartBarIcon className="h-6 w-6" />}
            title="Transparency"
            desc="Track performance metrics and community impact over time."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container pb-20 md:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From report to resolution
          </h2>
          <p className="mt-3 text-slate-600">
            Three simple steps to make your neighborhood better.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step
            step="1"
            title="Capture"
            desc="Take a photo, add a short note, and confirm your location."
          />
          <Step
            step="2"
            title="Submit"
            desc="Your report is auto-categorized and routed to the right department."
          />
          <Step
            step="3"
            title="Track"
            desc="Receive notifications as your issue moves to resolution."
          />
        </div>
      </section>

      {/* Impact / CTA */}
      <section id="impact" className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white md:p-12">
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">
                Join thousands improving their cities
              </h3>
              <p className="mt-2 text-blue-100">
                It takes less than a minute to submit a report. Your voice drives action.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-blue-50"
              >
                Create free account
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-white hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center text-xs font-bold">
              CR
            </div>
            <span className="text-sm text-slate-600">© {new Date().getFullYear()} CivicReport</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <Link href="/auth/signup" className="hover:text-slate-900">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  )
}

function Step({
  step,
  title,
  desc,
}: {
  step: string
  title: string
  desc: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-100/60 blur-xl" />
      <div className="relative z-10">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          {step}
        </div>
        <h4 className="mt-4 text-lg font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  )
}
