'use client'

import { useSession } from 'next-auth/react'
import { CheckCircleIcon, ClockIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'

export default function DashboardPage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-6">
            {/* Welcome / CTA card */}
            <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-violet-200/30 blur-2xl" />
                <div className="relative glass rounded-3xl p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome, {session?.user?.name}
                    </h1>
                    <p className="mt-1 text-slate-600">
                        Submit a new report or review progress on past submissions.
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/dashboard/report/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white hover:opacity-95"
                        >
                            New Report
                            <ArrowUpOnSquareIcon className="h-5 w-5" />
                        </a>
                        <a
                            href="#my-reports"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-slate-700 hover:bg-slate-50"
                        >
                            View My Reports
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="glass rounded-2xl p-5">
                    <div className="text-sm text-slate-600">Total reports</div>
                    <div className="mt-1 text-2xl font-bold">0</div>
                </div>
                <div className="glass rounded-2xl p-5">
                    <div className="text-sm text-slate-600">In progress</div>
                    <div className="mt-1 text-2xl font-bold">0</div>
                </div>
                <div className="glass rounded-2xl p-5">
                    <div className="text-sm text-slate-600">Resolved</div>
                    <div className="mt-1 text-2xl font-bold">0</div>
                </div>
            </div>

            {/* Empty state */}
            <div id="my-reports" className="glass rounded-2xl p-8">
                <div className="text-center">
                    <ClockIcon className="mx-auto h-10 w-10 text-slate-400" />
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">No reports yet</h3>
                    <p className="mt-1 text-slate-600">Create the first report to get started.</p>
                    <a
                        href="/dashboard/report/new"
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800"
                    >
                        Submit a report
                        <CheckCircleIcon className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </div>
    )
}
