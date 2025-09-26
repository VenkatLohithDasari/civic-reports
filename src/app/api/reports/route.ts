// app/api/reports/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Report from '@/models/Report'
import ReportVote from '@/models/ReportVote'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload a single file buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'civic-reports' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        // Get all files using .getAll() which returns an array
        const images = formData.getAll('images') as File[];
        const imageUrls: string[] = [];

        if (images.length > 0) {
            // Create an array of upload promises
            const uploadPromises = images.map(async (image) => {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const result = await uploadToCloudinary(buffer);
                return result.secure_url;
            });

            // Wait for all uploads to complete concurrently
            const resolvedUrls = await Promise.all(uploadPromises);
            imageUrls.push(...resolvedUrls);
        }

        await connectToDatabase();

        const newReport = await Report.create({
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as any,
            address: formData.get('address') as string,
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(formData.get('longitude') as string),
                    parseFloat(formData.get('latitude') as string),
                ],
            },
            images: imageUrls, // Save the array of URLs
            reportedBy: session.user.id,
            score: 1, // Start with a score of 1 from the creator
        });

        // Create the initial upvote from the creator
        await ReportVote.create({
            report: newReport._id,
            user: session.user.id,
            value: 1,
        });

        return NextResponse.json(newReport, { status: 201 });
    } catch (error) {
        console.error('Failed to create report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
