'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    DocumentPlusIcon,
    BellAlertIcon,
} from '@heroicons/react/24/outline'

const nav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'New Report', href: '/dashboard/report/new', icon: DocumentPlusIcon },
]

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <div className="min-h-screen">
            {/* Desktop sidebar (glass, blurred) */}
            <aside className="fixed left-0 top-0 hidden h-screen w-72 lg:block">
                <div className="h-full p-4">
                    <div className="glass flex h-full flex-col gap-3 rounded-2xl p-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold">
                                CR
                            </div>
                            <span className="text-lg font-semibold tracking-tight">CivicReport</span>
                        </Link>

                        <nav className="mt-2 space-y-1">
                            {nav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        pathname === item.href
                                            ? 'bg-white/70 text-blue-700 ring-1 ring-blue-100'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/60',
                                        'flex items-center gap-3 rounded-xl px-3 py-2'
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto">
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Topbar */}
            <header className="sticky top-0 z-40 lg:pl-72">
                <div className="container py-4">
                    <div className="glass flex h-14 items-center justify-between rounded-xl px-4">
                        <div className="flex items-center gap-2">
                            <button
                                className="lg:hidden -ml-1 p-2 text-slate-700 hover:text-slate-900"
                                onClick={() => setOpen(true)}
                                aria-label="Open navigation"
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                            <Link href="/" className="hidden lg:flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold">
                                    CR
                                </div>
                                <span className="text-lg font-semibold tracking-tight">CivicReport</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="rounded-lg p-2 text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                aria-label="Notifications"
                            >
                                <BellAlertIcon className="h-5 w-5" />
                            </button>
                            <div
                                className="h-8 w-8 rounded-full bg-slate-200 grid place-content-center text-sm font-semibold text-slate-700"
                                title={session?.user?.name || 'Account'}
                            >
                                {session?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile sidebar (glass, blurred) */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setOpen(false)}
                        aria-hidden
                    />
                    <div className="absolute left-0 top-0 h-full w-80 p-4">
                        <div className="glass flex h-full flex-col rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold">
                                        CR
                                    </div>
                                    <span className="text-lg font-semibold tracking-tight">CivicReport</span>
                                </Link>
                                <button
                                    className="rounded-lg p-2 text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close navigation"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <nav className="mt-6 space-y-1">
                                {nav.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            pathname === item.href
                                                ? 'bg-white/70 text-blue-700 ring-1 ring-blue-100'
                                                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60',
                                            'flex items-center gap-3 rounded-xl px-3 py-2'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto">
                                <button
                                    onClick={() => {
                                        setOpen(false)
                                        signOut({ callbackUrl: '/' })
                                    }}
                                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content (kept aligned with topbar; no overlap) */}
            <main className="lg:pl-72">
                <section className="container py-8">{children}</section>
            </main>
        </div>
    )
}
