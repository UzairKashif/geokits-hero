"use client"

import { useState } from "react"
import { Shield } from "lucide-react"

const faqs = [
  {
    question: "What is your SLA and uptime guarantee?",
    answer:
      "We guarantee 99.9% uptime with automatic failover and redundancy. SLA includes response time commitments, downtime credits, and 24/7 incident response.",
  },
  {
    question: "How do you handle data backup and recovery?",
    answer:
      "Automated daily backups with point-in-time recovery, cross-region replication, and disaster recovery procedures. RTO of 4 hours and RPO of 1 hour guaranteed.",
  },
  {
    question: "Can I migrate my existing codebase?",
    answer:
      "Yes, we provide migration tools, code analysis, dependency mapping, and dedicated migration engineers. Supports gradual migration with zero-downtime deployments.",
  },
  {
    question: "Do you offer white-label solutions?",
    answer:
      "Yes, enterprise customers can fully customize branding, domains, and user interfaces. Includes custom authentication, SSO integration, and dedicated infrastructure.",
  },
  {
    question: "What compliance certifications do you have?",
    answer:
      "SOC 2 Type II, ISO 27001, GDPR, HIPAA, and PCI DSS compliant. Regular security audits, penetration testing, and compliance reporting available.",
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto bg-slate-950 p-8 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
        <Shield className="w-6 h-6 text-emerald-400" />
        <h2 className="text-2xl font-mono font-bold text-white">Enterprise & Security</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-xs font-mono text-slate-400">SECURE</span>
        </div>
      </div>

      <div className="space-y-1">
        {faqs.map((faq, index) => (
          <div key={index} className="group border-b border-slate-800 last:border-b-0">
            <button
              className="w-full py-6 text-left flex items-center justify-between focus:outline-none focus:bg-slate-900/50 hover:bg-slate-900/50 transition-colors duration-200 px-4 -mx-4 rounded-lg"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-lg font-mono font-medium text-emerald-300 pr-8 group-hover:text-emerald-200 transition-colors">
                {faq.question}
              </span>
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "border-emerald-400 bg-emerald-400"
                      : "border-slate-600 group-hover:border-emerald-400"
                  }`}
                >
                  <div className={`transition-all duration-300 ${openIndex === index ? "rotate-45" : ""}`}>
                    <div
                      className={`w-3 h-0.5 transition-colors duration-300 ${openIndex === index ? "bg-slate-950" : "bg-slate-400 group-hover:bg-emerald-400"}`}
                    ></div>
                    <div
                      className={`w-3 h-0.5 rotate-90 -mt-0.5 transition-colors duration-300 ${openIndex === index ? "bg-slate-950" : "bg-slate-400 group-hover:bg-emerald-400"}`}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 font-mono text-sm text-slate-300 leading-relaxed bg-slate-900/30 rounded-lg p-4 border-l-2 border-emerald-400">
                <span className="text-slate-500">{"# Security Response:"}</span>
                <br />
                <span className="text-slate-300">{faq.answer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
