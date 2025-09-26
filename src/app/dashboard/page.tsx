// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { IReport } from '@/models/Report'
import ReportCard from '@/components/reports/ReportCard'
import { ArrowUpOnSquareIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

// A small component to handle the async data fetching
function ReportList() {
    const [reports, setReports] = useState<IReport[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await fetch('/api/reports/my-reports')
                if (response.ok) {
                    const data = await response.json()
                    setReports(data)
                }
            } catch (error) {
                console.error("Failed to fetch user's reports:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReports()
    }, [])

    if (loading) {
        return (
            <div className="grid gap-4 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-5">
                        <div className="grid gap-4 sm:grid-cols-[180px_1fr] animate-pulse">
                            <div className="aspect-[4/3] rounded-xl bg-slate-200/80" />
                            <div className="space-y-3">
                                <div className="h-6 w-3/4 rounded bg-slate-200/80" />
                                <div className="h-4 w-full rounded bg-slate-200/70" />
                                <div className="h-4 w-5/6 rounded bg-slate-200/70" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (reports.length === 0) {
        return (
            <div className="glass rounded-2xl p-10 text-center">
                <h3 className="text-lg font-semibold text-slate-900">No reports yet</h3>
                <p className="mt-1 text-slate-600">Create the first report to get started and track progress here.</p>
                <a
                    href="/dashboard/report/new"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white hover:opacity-95"
                >
                    Submit a report
                </a>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reports.map((r) => (
                <ReportCard key={(r as any)._id.toString()} report={r as any} />
            ))}
        </div>
    )
}

// Main dashboard page component
function DashboardContent() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const successMessage = searchParams.get('message')
    const [isMessageVisible, setMessageVisible] = useState(!!successMessage)

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setMessageVisible(false), 5000) // Hide after 5 seconds
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    return (
        <div className="space-y-6">
            {isMessageVisible && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="rounded-xl border border-emerald-300/60 bg-emerald-50/90 px-4 py-3 text-emerald-900 shadow-md backdrop-blur-md ring-1 ring-white/40 animate-[slideUp_180ms_ease-out]">
                        <div className="flex items-center gap-3">
                            <svg viewBox="0 0 20 20" className="h-5 w-5 text-emerald-700" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4Z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium">{successMessage}</p>
                            <button
                                onClick={() => setMessageVisible(false)}
                                className="ml-2 rounded-md px-1.5 py-0.5 text-sm text-emerald-800 hover:bg-emerald-100"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Card */}
            <div className="relative glass rounded-3xl p-6 md:p-8">
                <h1 className="text-2xl font-bold text-slate-900">Welcome, {session?.user?.name}</h1>
                <p className="mt-1 text-slate-600">Submit a new report or review progress on past submissions.</p>
            </div>

            <ReportList />
        </div>
    )
}

// Export a component that uses Suspense
export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
