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

    await connectToDatabase()

    const reports = await Report.find({ reportedBy: session.user.id })
        .sort({ createdAt: -1 })
        .lean()

    const ids = reports.map(r => new Types.ObjectId(r._id))
    const votes = await ReportVote.find({
        user: session.user.id,
        report: { $in: ids },
    }).lean()

    const voteMap = new Map<string, 1 | -1>()
    votes.forEach(v => voteMap.set(String(v.report), v.value as 1 | -1))

    const withVote = reports.map(r => ({
        ...r,
        userVote: voteMap.get(String(r._id)) ?? 0,
        score: r.score ?? 0,
    }))

    return NextResponse.json(withVote)
}
