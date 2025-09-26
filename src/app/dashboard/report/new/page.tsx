'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PhotoIcon, MapPinIcon } from '@heroicons/react/24/outline'

const categories = ['Pothole', 'Streetlight', 'Sanitation', 'Water Leakage', 'Other']

export default function NewReportPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [location, setLocation] = useState<{ lat: number; lon: number; address: string } | null>(null)
    const [isLocating, setIsLocating] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(f)
    }

    const getLocation = () => {
        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                setLocation({
                    lat: latitude,
                    lon: longitude,
                    address: `Near ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
                })
                setIsLocating(false)
            },
            () => {
                setError('Could not get location. Please enable location services.')
                setIsLocating(false)
            }
        )
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!location) {
            setError('Please add a location first.')
            return
        }
        setLoading(true)
        setError('')

        const data = new FormData(e.currentTarget)
        data.append('latitude', location.lat.toString())
        data.append('longitude', location.lon.toString())
        data.append('address', location.address)

        const res = await fetch('/api/reports', { method: 'POST', body: data })
        if (!res.ok) {
            const payload = await res.json().catch(() => ({}))
            setError(payload.error || 'Failed to submit report')
            setLoading(false)
            return
        }
        router.push('/dashboard?message=Report submitted successfully')
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-violet-200/30 blur-2xl" />
                <div className="relative glass rounded-2xl p-6">
                    <h1 className="text-xl font-semibold text-slate-900">Submit a New Report</h1>
                    <p className="mt-1 text-slate-600">Add details, a photo, and precise location to help resolve issues faster.</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Details */}
                <div className="glass rounded-2xl p-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            required
                            placeholder="e.g., Large pothole on Ring Road"
                            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            required
                            placeholder="Provide details about the issue and why it needs attention."
                            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            required
                            className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            {categories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Photo */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-slate-700">Photo</h3>
                    <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300/80 bg-white/70 px-6 py-10">
                        <div className="text-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mx-auto h-36 w-auto rounded-md object-cover shadow-sm ring-1 ring-slate-200"
                                />
                            ) : (
                                <PhotoIcon className="mx-auto h-12 w-12 text-slate-300" />
                            )}
                            <div className="mt-4 text-sm text-slate-600">
                                <label className="cursor-pointer font-semibold text-blue-700 hover:text-blue-600">
                                    <span>Upload a file</span>
                                    <input
                                        ref={fileRef}
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={onImage}
                                    />
                                </label>
                                <span className="px-1">or drag and drop</span>
                                <div className="text-xs text-slate-500">PNG, JPG up to 10MB</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-slate-700">Location</h3>
                    {location ? (
                        <div className="mt-2 rounded-xl bg-white/70 p-3 ring-1 ring-slate-200">
                            <p className="font-medium text-slate-800">{location.address}</p>
                            <p className="text-xs text-slate-600">
                                Lat: {location.lat.toFixed(5)}, Lon: {location.lon.toFixed(5)}
                            </p>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={getLocation}
                            disabled={isLocating}
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                        >
                            <MapPinIcon className="h-5 w-5" />
                            {isLocating ? 'Getting location…' : 'Use my current location'}
                        </button>
                    )}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={loading || !location}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white hover:opacity-95 disabled:opacity-50"
                >
                    {loading ? 'Submitting…' : 'Submit report'}
                </button>
            </form>
        </div>
    )
}
