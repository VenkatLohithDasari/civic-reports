// components/reports/ReportCard.tsx
'use client'

import { useState, Fragment } from 'react'
import { IReport } from '@/models/Report'
import { formatDistanceToNow } from 'date-fns'
import { MapPinIcon, TagIcon, ClockIcon, PhotoIcon } from '@heroicons/react/24/outline'
import VotePanel from './VotePanel'
import { Dialog, Transition } from '@headlessui/react'

type ReportWithVote = IReport & { userVote?: -1 | 0 | 1 }

// Image Gallery Modal Component
function ImageGalleryModal({ isOpen, setIsOpen, images, title }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, images: string[], title: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">{title}</Dialog.Title>
                                <div className="mt-4 relative h-[70vh]">
                                    {/* Main Image */}
                                    <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="w-full h-full object-contain rounded-lg" />

                                    {/* Navigation Arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={goToPrevious} className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">
                                                &#10094;
                                            </button>
                                            <button onClick={goToNext} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">
                                                &#10095;
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="mt-2 text-center text-sm text-gray-500">
                                    {currentIndex + 1} / {images.length}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default function ReportCard({ report }: { report: ReportWithVote }) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const hasImages = report.images && report.images.length > 0;

    return (
        <>
            <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-sm ring-1 ring-white/40 transition hover:shadow-md">
                <div className="grid grid-cols-[56px_1fr] gap-4">
                    <VotePanel
                        reportId={String((report as any)._id)}
                        initialScore={report.score ?? 0}
                        initialUserVote={(report.userVote ?? 0) as -1 | 0 | 1}
                    />
                    <div className="min-w-0">
                        {/* ... (Title, Status, and Description remain the same) ... */}
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="truncate text-base font-semibold text-slate-900">{report.title}</h3>
                            {/* Status Badge */}
                        </div>
                        <p className="mt-1 line-clamp-3 text-sm text-slate-700">{report.description}</p>

                        {/* UPDATED Image Section */}
                        {hasImages && (
                            <div className="mt-3 relative cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                                <img
                                    src={report.images[0]}
                                    alt={report.title}
                                    className="aspect-[16/9] w-full rounded-lg object-cover ring-1 ring-slate-200/80 transition duration-300 group-hover:scale-[1.01]"
                                />
                                {report.images.length > 1 && (
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-white">
                                        <PhotoIcon className="h-4 w-4" />
                                        <span>1/{report.images.length}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ... (Info grid with MapPin, Tag, Clock remains the same) ... */}
                        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                            <div className="flex items-center gap-2"><MapPinIcon className="h-4 w-4 text-blue-600" /><span className="truncate">{report.address}</span></div>
                            <div className="flex items-center gap-2"><TagIcon className="h-4 w-4 text-indigo-600" /><span>{report.category}</span></div>
                            <div className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-slate-500" /><span>Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span></div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Render the modal */}
            {hasImages && (
                <ImageGalleryModal
                    isOpen={isGalleryOpen}
                    setIsOpen={setIsGalleryOpen}
                    images={report.images}
                    title={report.title}
                />
            )}
        </>
    )
}
