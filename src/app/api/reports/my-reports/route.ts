// app/api/reports/my-reports/route.ts (This is the dedicated user-only endpoint)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Report from '@/models/Report'
import ReportVote from '@/models/ReportVote'
import { Types } from 'mongoose'

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await connectToDatabase()

        const reports = await Report.find({ reportedBy: session.user.id })
            .sort({ createdAt: -1 })
            .lean()

        const reportIds = reports.map(r => new Types.ObjectId(r._id))
        const userVotes = await ReportVote.find({
            user: session.user.id,
            report: { $in: reportIds },
        }).lean()

        const voteMap = new Map<string, 1 | -1>()
        userVotes.forEach(v => voteMap.set(String(v.report), v.value as 1 | -1))

        const reportsWithVotes = reports.map(report => ({
            ...report,
            userVote: voteMap.get(String(report._id)) ?? 0,
        }))

        return NextResponse.json(reportsWithVotes)
    } catch (error) {
        console.error('Failed to fetch user reports:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
