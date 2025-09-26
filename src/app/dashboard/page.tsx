// app/dashboard/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { IReport } from '@/models/Report'
import ReportCard from '@/components/reports/ReportCard'
import { CheckCircleIcon, XMarkIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline'

type ReportWithVote = IReport & { userVote?: -1 | 0 | 1 }

// A generic component to fetch and display a list of reports
function ReportFeed({ endpoint }: { endpoint: string }) {
    const [reports, setReports] = useState<ReportWithVote[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchReports() {
            setLoading(true)
            try {
                const response = await fetch(endpoint)
                if (response.ok) {
                    const data = await response.json()
                    setReports(data)
                }
            } catch (error) {
                console.error(`Failed to fetch from ${endpoint}:`, error)
            } finally {
                setLoading(false)
            }
        }
        fetchReports()
    }, [endpoint])

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-4">
                        <div className="flex gap-4">
                            <div className="w-14 h-24 bg-slate-200 rounded-xl"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-16 bg-slate-200 rounded-lg mt-2"></div>
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
                <h3 className="text-lg font-semibold text-slate-900">No Reports Found</h3>
                <p className="mt-1 text-slate-600">This feed is empty. Be the first to submit a report!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <ReportCard key={(report as any)._id.toString()} report={report} />
            ))}
        </div>
    )
}

function DashboardContent() {
    const [activeTab, setActiveTab] = useState<'community' | 'my-reports'>('community')
    const searchParams = useSearchParams()
    const successMessage = searchParams.get('message')
    const [isMessageVisible, setMessageVisible] = useState(!!successMessage)

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setMessageVisible(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    return (
        <div className="space-y-6">
            {isMessageVisible && (
                <div className="glass fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl p-4 ring-1 ring-green-300">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <p className="font-medium text-green-800">{successMessage}</p>
                </div>
            )}

            <div className="glass p-2 flex space-x-2 rounded-2xl">
                <button
                    onClick={() => setActiveTab('community')}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${activeTab === 'community' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:bg-white/50'
                        }`}
                >
                    <UsersIcon className="h-5 w-5" />
                    Community Feed
                </button>
                <button
                    onClick={() => setActiveTab('my-reports')}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${activeTab === 'my-reports' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:bg-white/50'
                        }`}
                >
                    <UserIcon className="h-5 w-5" />
                    My Reports
                </button>
            </div>

            {activeTab === 'community' && <ReportFeed endpoint="/api/reports/feed" />}
            {activeTab === 'my-reports' && <ReportFeed endpoint="/api/reports/my-reports" />}
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
