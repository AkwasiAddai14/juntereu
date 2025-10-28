"use client";

import { useState } from 'react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import type { Locale } from '@/app/[lang]/dictionaries';

const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "How do I get started?",
    answer: "You can get started by creating an account and filling out your profile information.",
  },
  {
    question: "What services do you offer?",
    answer: "We offer various services including job matching, scheduling, and payment processing.",
  },
]

export default function VeelgesteldeVragen({ lang, dashboard }: { lang: Locale; dashboard: any }) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {dashboard?.werknemersPage?.FAQ?.['headTitle:'] || 'Frequently Asked Questions'}
          </h2>
          <dl className="mt-16 divide-y divide-gray-900/10">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <button
                    onClick={() => toggleItem(index)}
                    className="group flex w-full items-start justify-between text-left text-gray-900"
                  >
                    <span className="text-base/7 font-semibold">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      {openItems.includes(index) ? (
                        <MinusSmallIcon aria-hidden="true" className="size-6" />
                      ) : (
                        <PlusSmallIcon aria-hidden="true" className="size-6" />
                      )}
                    </span>
                  </button>
                </dt>
                {openItems.includes(index) && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base/7 text-gray-600">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}