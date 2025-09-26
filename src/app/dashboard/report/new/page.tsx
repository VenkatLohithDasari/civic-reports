// app/dashboard/report/new/page.tsx
'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, MapPinIcon, ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline'
import CategorySelect from '@/components/ui/CategorySelect'

// Dynamic import for the map
const LocationPickerMap = dynamic(() => import('@/components/maps/LocationPickerMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-xl bg-slate-200/80 ring-1 ring-slate-300 animate-pulse grid place-content-center text-slate-600">Loading map…</div>,
})

const categories = ['Pothole', 'Streetlight', 'Sanitation', 'Water Leakage', 'Other']

export default function NewReportPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [location, setLocation] = useState<{ lat: number; lon: number; address: string } | null>(null)
    const [category, setCategory] = useState(categories[0])
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const addressRef = useRef<HTMLInputElement>(null)

    // State for multiple files and their previews
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Limit to 5 images total
        const newFiles = [...files, ...acceptedFiles].slice(0, 5);
        setFiles(newFiles);

        // Clean up old previews before creating new ones to prevent memory leaks
        previews.forEach(url => URL.revokeObjectURL(url));
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    }, [files, previews]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
        maxFiles: 5,
    });

    const removeFile = (indexToRemove: number) => {
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(previews[indexToRemove]);

        setFiles(currentFiles => currentFiles.filter((_, index) => index !== indexToRemove));
        setPreviews(currentPreviews => currentPreviews.filter((_, index) => index !== indexToRemove));
    };

    // This callback now only updates the *hidden* location state
    const handleLocationChange = useCallback((lat: number, lon: number, address: string) => {
        setLocation({ lat, lon, address })
    }, [])

    // This is the explicit action to fill the input
    const handleUseAddressFromPin = () => {
        if (location?.address && addressRef.current) {
            addressRef.current.value = location.address
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!location) {
            setError('Please set a location on the map.')
            return
        }
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        formData.append('latitude', location.lat.toString())
        formData.append('longitude', location.lon.toString())

        // Append all selected files to the form data under the same key 'images'
        files.forEach(file => {
            formData.append('images', file);
        });

        // Ensure the old single 'image' field is not present
        formData.delete('image');

        try {
            const response = await fetch('/api/reports', { method: 'POST', body: formData })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data.error || 'Failed to submit report')
            }
            router.push('/dashboard?message=Report submitted successfully')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div className="relative glass p-6">
                <h1 className="text-xl font-semibold text-slate-900">Submit a New Report</h1>
                <p className="mt-1 text-slate-700">Add details, a photo, and a precise location to help resolve issues faster.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Details section */}
                <div className="glass relative z-10 p-6 space-y-4">
                    <div>
                        <label className="block text-[0.95rem] font-semibold text-slate-800">Title</label>
                        <input id="title" name="title" required placeholder="e.g., Large pothole on Ring Road" className="mt-1 w-full rounded-xl border-slate-400 bg-white px-3 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <div>
                        <label className="block text-[0.95rem] font-semibold text-slate-800">Description</label>
                        <textarea id="description" name="description" rows={5} required placeholder="Describe the issue, its impact, and any nearby landmarks." className="mt-1 w-full rounded-xl border-slate-400 bg-white px-3 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <CategorySelect value={category} onChange={setCategory} options={categories} name="category" label="Category" />
                </div>

                {/* Photo section */}
                <div className="glass relative z-0 p-6">
                    <h3 className="text-[0.95rem] font-semibold text-slate-800">Photos (up to 5)</h3>

                    <div
                        {...getRootProps()}
                        className={`mt-3 flex justify-center rounded-xl border-2 border-dashed  px-6 py-10 transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-400 bg-white hover:border-slate-500'}`}
                    >
                        <input {...getInputProps()} />
                        <div className="text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <p className="mt-2 text-sm text-slate-600">
                                {isDragActive ? 'Drop the files here...' : 'Drag & drop photos here, or click to select'}
                            </p>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB each</p>
                        </div>
                    </div>

                    {previews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {previews.map((preview, index) => (
                                <div key={preview} className="relative group">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="aspect-square w-full rounded-md object-cover ring-1 ring-slate-200" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                        aria-label="Remove image"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Location section */}
                <div className="glass relative z-0 p-6 space-y-4">
                    <div>
                        <h3 className="text-[0.95rem] font-semibold text-slate-800">Location</h3>
                        <p className="text-xs text-slate-600">The map will try to find you. Click or drag the pin to adjust.</p>
                    </div>
                    <LocationPickerMap onLocationChange={handleLocationChange} />
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <div>
                            <label className="block text-[0.95rem] font-semibold text-slate-800">Address</label>
                            <input ref={addressRef} id="address" name="address" required placeholder="Enter address manually or use pin" className="mt-1 w-full rounded-xl border-slate-400 bg-white px-3 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300" />
                        </div>
                        <button type="button" onClick={handleUseAddressFromPin} disabled={!location} className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60">
                            <ArrowPathIcon className="h-5 w-5" />
                            Use address from pin
                        </button>
                    </div>
                    {location && (
                        <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4 text-blue-600" />
                                <span>Coordinates captured: Lat: {location.lat.toFixed(5)}, Lon: {location.lon.toFixed(5)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {error && <p className="rounded-lg border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                <button type="submit" disabled={loading || !location} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50">
                    {loading ? 'Submitting…' : 'Submit report'}
                </button>
            </form>
        </div>
    )
}
