// models/Report.ts
import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IReport extends Document {
    title: string
    description: string
    category: 'Pothole' | 'Streetlight' | 'Sanitation' | 'Water Leakage' | 'Other'
    location: {
        type: 'Point'
        coordinates: [number, number] // [longitude, latitude]
    }
    address: string
    images: string[]
    status: 'Submitted' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Rejected'
    reportedBy: Types.ObjectId
    createdAt: Date
}

const ReportSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Pothole', 'Streetlight', 'Sanitation', 'Water Leakage', 'Other'],
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    address: { type: String, required: true },
    images: [{ type: String }],
    status: {
        type: String,
        enum: ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Submitted',
    },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
})

ReportSchema.index({ location: '2dsphere' })

export default mongoose.models.Report ||
    mongoose.model<IReport>('Report', ReportSchema)
