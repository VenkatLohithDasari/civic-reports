// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { connectToDatabase } from '@/lib/mongodb'
import Report from '@/models/Report'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const category = formData.get('category') as any
        const latitude = formData.get('latitude') as string
        const longitude = formData.get('longitude') as string
        const address = formData.get('address') as string
        const image = formData.get('image') as File | null

        let imageUrl = ''
        if (image) {
            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const response = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                }).end(buffer)
            }) as any

            imageUrl = response.secure_url
        }

        await connectToDatabase()

        const newReport = await Report.create({
            title,
            description,
            category,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            address,
            images: imageUrl ? [imageUrl] : [],
            reportedBy: session.user.id,
        })

        return NextResponse.json(newReport, { status: 201 })
    } catch (error) {
        console.error('Failed to create report:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
