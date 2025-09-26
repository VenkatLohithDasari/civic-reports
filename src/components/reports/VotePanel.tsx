'use client'

import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

export default function VotePanel({
    reportId,
    initialScore,
    initialUserVote,
    onChange,
}: {
    reportId: string
    initialScore: number
    initialUserVote: -1 | 0 | 1
    onChange?: (payload: { score: number; userVote: -1 | 0 | 1 }) => void
}) {
    const [score, setScore] = useState(initialScore)
    const [vote, setVote] = useState<-1 | 0 | 1>(initialUserVote)
    const [pending, setPending] = useState(false)

    async function sendVote(next: -1 | 0 | 1) {
        setPending(true)
        // optimistic delta
        let delta = 0
        if (vote === next) delta = 0
        else if (vote === 0 && next !== 0) delta = next
        else if (vote !== 0 && next === 0) delta = -vote
        else if (vote !== 0 && next !== 0) delta = next - vote

        const prev = { score, vote }
        setScore(s => s + delta)
        setVote(next)

        try {
            const res = await fetch(`/api/reports/${reportId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: next }),
            })
            if (!res.ok) throw new Error('Vote failed')
            const data = await res.json()
            setScore(data.score)
            setVote(data.userVote)
            onChange?.({ score: data.score, userVote: data.userVote })
        } catch {
            // revert on failure
            setScore(prev.score)
            setVote(prev.vote)
        } finally {
            setPending(false)
        }
    }

    const upActive = vote === 1
    const downActive = vote === -1

    return (
        <div className="flex h-full w-14 flex-col items-center justify-start gap-1 rounded-xl border border-slate-200/80 bg-white/80 py-2 text-slate-700 shadow-sm ring-1 ring-white/40">
            <button
                type="button"
                aria-label="Upvote"
                aria-pressed={upActive}
                disabled={pending}
                onClick={() => sendVote(upActive ? 0 as 0 : 1 as 1)}
                className={`grid h-8 w-8 place-items-center rounded-md transition ${upActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
                    }`}
            >
                <ChevronUpIcon className="h-5 w-5" />
            </button>

            <div className="select-none text-sm font-semibold tabular-nums">{score}</div>

            <button
                type="button"
                aria-label="Downvote"
                aria-pressed={downActive}
                disabled={pending}
                onClick={() => sendVote(downActive ? 0 as 0 : -1 as -1)}
                className={`grid h-8 w-8 place-items-center rounded-md transition ${downActive ? 'bg-rose-600 text-white' : 'hover:bg-slate-100'
                    }`}
            >
                <ChevronDownIcon className="h-5 w-5" />
            </button>
        </div>
    )
}
