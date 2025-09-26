'use client'

import Link from 'next/link'

export default function AuthShell({
    title,
    subtitle,
    children,
}: {
    title: string
    subtitle?: string
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid place-items-center py-10 px-4">
            <div className="w-full max-w-md">
                <Link href="/" className="flex justify-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold">
                        CR
                    </div>
                </Link>
                <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">{title}</h1>
                {subtitle ? (
                    <p className="mt-2 text-center text-sm text-slate-600">{subtitle}</p>
                ) : null}
            </div>

            <div className="w-full max-w-md mt-6">
                <div className="glass rounded-2xl p-6 sm:p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    )
}
