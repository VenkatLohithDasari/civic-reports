import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    await connectToDatabase()

                    const user = await User.findOne({ email: credentials.email }).select('+password')

                    if (!user) {
                        return null
                    }

                    const isPasswordValid = await user.comparePassword(credentials.password)

                    if (!isPasswordValid) {
                        return null
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!
                session.user.role = token.role as string
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
})

export { handler as GET, handler as POST }
