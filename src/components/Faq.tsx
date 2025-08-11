'use client'

import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'

const faqs = [
  {
    q: 'What data privacy measures do you follow?',
    a: 'We adhere to industry best practices, encrypt data at rest and in transit, and comply with GDPR and other regional regulations.',
  },
  {
    q: 'What is your typical project timeline?',
    a: 'Most proofs of concept take 4–6 weeks; full deployments range from 3–6 months depending on scope.',
  },
  {
    q: 'How is pricing structured?',
    a: 'We offer fixed‑price pilots, subscription‑based deployments, and custom quotes for large‑scale projects.',
  },
  {
    q: 'Do you provide training and support?',
    a: 'Yes—our engagement models include training packages and ongoing support options tailored to your team’s needs.',
  },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 text-indigo-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function Faq() {
  return (
    <section id="faq" className="w-full py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="mt-2 text-slate-300">Quick answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Disclosure key={i} as="div" className="group">
              {({ open }) => (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm transition-colors duration-150 hover:bg-white/10">
                  <Disclosure.Button className="w-full rounded-xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white font-medium">{f.q}</span>
                      <Chevron open={open} />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 -translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-1"
                  >
                    <Disclosure.Panel className="px-5 pb-5 text-white/80">
                      {f.a}
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  )
}
