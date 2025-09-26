'use client'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'

function cn(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ')
}

export default function CategorySelect({
    value,
    onChange,
    options,
    name = 'category',
    label = 'Category',
}: {
    value: string
    onChange: (val: string) => void
    options: string[]
    name?: string
    label?: string
}) {
    return (
        <Listbox value={value} onChange={onChange}>
            {({ open }) => (
                <div className={cn('relative', open && 'z-50')}>
                    <label className="block text-[0.95rem] font-semibold text-slate-800 mb-1">{label}</label>
                    <input type="hidden" name={name} value={value} />

                    <Listbox.Button className="w-full rounded-xl border border-slate-400 bg-white px-3 py-2.5 text-left text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <span className="block truncate">{value}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon className="h-5 w-5 text-slate-500" />
                        </span>
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-150"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {options.map((opt) => (
                                <Listbox.Option
                                    key={opt}
                                    value={opt}
                                    className={({ active }) =>
                                        cn(
                                            'relative cursor-pointer select-none px-3 py-2',
                                            active ? 'bg-blue-50 text-blue-800' : 'text-slate-800'
                                        )
                                    }
                                >
                                    {({ selected }) => (
                                        <div className="flex items-center">
                                            {selected ? <CheckIcon className="mr-2 h-4 w-4 text-blue-600" /> : <span className="mr-6" />}
                                            <span className={cn('block truncate', selected && 'font-semibold')}>{opt}</span>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    )
}
