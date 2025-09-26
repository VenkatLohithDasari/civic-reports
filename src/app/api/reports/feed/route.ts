// app/api/reports/feed/route.ts

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
        // Even unauthenticated users can view the feed, but won't have vote data
        // For a fully protected feed, return 401 here. For now, let's allow public view.
    }

    // Add pagination for scalability
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = 10; // 10 reports per page
    const skip = (page - 1) * limit;

    try {
        await connectToDatabase()

        // Fetch a paginated list of all reports, sorted by score and creation date
        const reports = await Report.find({})
            .sort({ score: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        let voteMap = new Map<string, 1 | -1>()

        // If the user is logged in, fetch their votes for the current page of reports
        if (session?.user?.id) {
            const reportIds = reports.map(r => new Types.ObjectId(r._id))
            const userVotes = await ReportVote.find({
                user: session.user.id,
                report: { $in: reportIds },
            }).lean()

            userVotes.forEach(v => voteMap.set(String(v.report), v.value as 1 | -1))
        }

        // Annotate each report with the user's vote (or 0 if not voted)
        const reportsWithVotes = reports.map(report => ({
            ...report,
            userVote: voteMap.get(String(report._id)) ?? 0,
        }))

        return NextResponse.json(reportsWithVotes)
    } catch (error) {
        console.error('Failed to fetch community feed:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
