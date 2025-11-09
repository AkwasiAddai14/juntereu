"use client"

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import GetAccessModal from './GetAccessModal'

interface PricingCardWithModalProps {
  monthlyLabel: string
  yearlyLabel: string
  monthlyPrice: string
  yearlyPrice: string
  usp: string[]
  invoiceText: string
}

export default function PricingCardWithModal({
  monthlyLabel,
  yearlyLabel,
  monthlyPrice,
  yearlyPrice,
  usp,
  invoiceText,
}: PricingCardWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-2xl bg-gray-50 py-10 text-center inset-ring inset-ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
        <div className="mx-auto max-w-xs px-8">
          {/* Monthly price (default visible) */}
          <div className="block group-has-[input[name='frequency'][value='annually']:checked]/tiers:hidden">
            <p className="text-base font-semibold text-gray-600">
              {monthlyLabel}
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-xl font-semibold tracking-tight text-gray-900">
                {monthlyPrice}
              </span>
            </p>
          </div>

          {/* Yearly price (hidden until yearly checked) */}
          <div className="hidden group-has-[input[name='frequency'][value='annually']:checked]/tiers:block">
            <p className="text-base font-semibold text-gray-600">
              {yearlyLabel}
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-xl font-semibold tracking-tight text-gray-900">
                {yearlyPrice}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsModalOpen(true)
            }}
            className="mt-10 block w-full rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get access
          </button>
          <p className="mt-6 text-xs/5 text-gray-600">
            {invoiceText}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6">
            {usp.map((feature) => (
              <div key={feature} className="flex gap-x-3">
                <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-sky-600" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
      <GetAccessModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}

