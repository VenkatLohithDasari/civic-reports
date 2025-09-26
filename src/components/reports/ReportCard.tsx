'use client'

import { IReport } from '@/models/Report'
import { formatDistanceToNow } from 'date-fns'
import { MapPinIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline'
import VotePanel from './VotePanel'

type ReportWithVote = IReport & { userVote?: -1 | 0 | 1 }

export default function ReportCard({ report }: { report: ReportWithVote }) {
    const created = formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-sm ring-1 ring-white/40 transition hover:shadow-md">
            <div className="grid grid-cols-[56px_1fr] gap-4">
                <VotePanel
                    reportId={String((report as any)._id)}
                    initialScore={report.score ?? 0}
                    initialUserVote={(report.userVote ?? 0) as -1 | 0 | 1}
                />

                <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="truncate text-base font-semibold text-slate-900">{report.title}</h3>
                        <span
                            className={`shrink-0 inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${report.status === 'Resolved'
                                    ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/20'
                                    : report.status === 'In Progress'
                                        ? 'bg-indigo-50 text-indigo-800 ring-indigo-600/20'
                                        : report.status === 'Acknowledged'
                                            ? 'bg-amber-50 text-amber-900 ring-amber-600/20'
                                            : report.status === 'Rejected'
                                                ? 'bg-rose-50 text-rose-800 ring-rose-600/20'
                                                : 'bg-blue-50 text-blue-800 ring-blue-600/20'
                                }`}
                        >
                            {report.status}
                        </span>
                    </div>

                    <p className="mt-1 line-clamp-3 text-sm text-slate-700">{report.description}</p>

                    {report.images?.[0] ? (
                        <div className="mt-3 overflow-hidden rounded-lg ring-1 ring-slate-200/80">
                            <img
                                src={report.images[0]}
                                alt={report.title}
                                className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                            />
                        </div>
                    ) : null}

                    <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-blue-600" />
                            <span className="truncate">{report.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TagIcon className="h-4 w-4 text-indigo-600" />
                            <span>{report.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4 text-slate-500" />
                            <span>Reported {created}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
