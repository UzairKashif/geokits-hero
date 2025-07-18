'use client'

import React from 'react'

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

export default function Faq() {
  return (
    <section id="faq" className="w-full py-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">FAQ</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="bg-[#04110E] rounded-lg border border-white/20"
          >
            <summary className="px-4 py-3 cursor-pointer text-white font-medium">
              {f.q}
            </summary>
            <div className="px-4 py-3 text-white/80">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
