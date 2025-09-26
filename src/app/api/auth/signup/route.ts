import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        await connectToDatabase()

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            )
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject()

        return NextResponse.json(
            { message: 'User created successfully', user: userWithoutPassword },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Signup error:', error)

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
