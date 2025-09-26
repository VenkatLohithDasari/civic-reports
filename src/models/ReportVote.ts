import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IReportVote extends Document {
    report: Types.ObjectId
    user: Types.ObjectId
    value: 1 | -1
    createdAt: Date
    updatedAt: Date
}

const ReportVoteSchema = new Schema<IReportVote>(
    {
        report: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        value: { type: Number, enum: [1, -1], required: true },
    },
    { timestamps: true }
)

ReportVoteSchema.index({ report: 1, user: 1 }, { unique: true })

export default mongoose.models.ReportVote ||
    mongoose.model<IReportVote>('ReportVote', ReportVoteSchema)
