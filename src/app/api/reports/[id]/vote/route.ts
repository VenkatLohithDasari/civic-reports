// app/api/reports/[id]/vote/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Report from '@/models/Report'
import ReportVote from '@/models/ReportVote'
import mongoose from 'mongoose'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: reportId } = await params;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return NextResponse.json({ error: 'Invalid report id' }, { status: 400 })
    }

    const { value: newVoteValue } = await request.json() as { value: -1 | 0 | 1 };
    if (![-1, 0, 1].includes(newVoteValue)) {
        return NextResponse.json({ error: 'Invalid vote value' }, { status: 400 })
    }

    await connectToDatabase()

    const report = await Report.findById(reportId);
    if (!report) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // PREVENT SELF-VOTING
    if (report.reportedBy.toString() === session.user.id) {
        return NextResponse.json({ error: "You cannot vote on your own report." }, { status: 403 });
    }

    const userId = session.user.id;
    const existingVote = await ReportVote.findOne({ report: reportId, user: userId });

    // SIMPLIFIED AND CORRECTED SCORE DELTA LOGIC
    const previousVoteValue = existingVote?.value || 0;
    const scoreDelta = newVoteValue - previousVoteValue;

    // Atomically update the database
    if (scoreDelta !== 0) {
        // Only update if there's a change
        if (existingVote) {
            if (newVoteValue === 0) {
                await existingVote.deleteOne();
            } else {
                existingVote.value = newVoteValue;
                await existingVote.save();
            }
        } else if (newVoteValue !== 0) {
            await ReportVote.create({ report: reportId, user: userId, value: newVoteValue });
        }

        // Apply the score change to the report
        await Report.findByIdAndUpdate(reportId, { $inc: { score: scoreDelta } });
    }

    const updatedReport = await Report.findById(reportId).lean();

    return NextResponse.json({
        score: updatedReport?.score ?? 0,
        userVote: newVoteValue,
    });
}
