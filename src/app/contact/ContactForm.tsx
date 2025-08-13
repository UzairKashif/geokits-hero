'use client'
import React, { useState } from 'react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  serviceInterest: string
  projectDescription: string
  budget: string
  hearAbout: string
  subscribe: boolean
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    serviceInterest: '',
    projectDescription: '',
    budget: '',
    hearAbout: '',
    subscribe: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          jobTitle: '',
          serviceInterest: '',
          projectDescription: '',
          budget: '',
          hearAbout: '',
          subscribe: false
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
        Send Us a Message
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
              First Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
              Last Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address <span className="text-emerald-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="+92 xxx xxxxxxx"
            />
          </div>
        </div>

        {/* Company and Job Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Your job title"
            />
          </div>
        </div>

        {/* Service Interest */}
        <div>
          <label htmlFor="serviceInterest" className="block text-sm font-medium text-slate-300 mb-2">
            Service Interest <span className="text-emerald-400">*</span>
          </label>
          <select
            id="serviceInterest"
            name="serviceInterest"
            required
            value={formData.serviceInterest}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="">Select a service</option>
            <option value="infrastructure-monitoring">Infrastructure Monitoring</option>
            <option value="gis-solutions">GIS Solutions</option>
            <option value="ai-training">AI Training & Implementation</option>
            <option value="early-warning-systems">Early Warning Systems</option>
            <option value="data-analytics">Data Analytics & Visualization</option>
            <option value="consulting">Consulting Services</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-300 mb-2">
            Project Description <span className="text-emerald-400">*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            required
            rows={4}
            value={formData.projectDescription}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            placeholder="Please describe your project or inquiry..."
          />
        </div>

        {/* Budget and How did you hear */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
              Estimated Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Select budget range</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-25k">$10,000 - $25,000</option>
              <option value="25k-50k">$25,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="over-100k">Over $100,000</option>
            </select>
          </div>
          <div>
            <label htmlFor="hearAbout" className="block text-sm font-medium text-slate-300 mb-2">
              How did you hear about us?
            </label>
            <select
              id="hearAbout"
              name="hearAbout"
              value={formData.hearAbout}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Select an option</option>
              <option value="google">Google Search</option>
              <option value="social-media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="industry-event">Industry Event</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-emerald-500 bg-slate-900/50 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
          />
          <label htmlFor="subscribe" className="text-sm text-slate-400">
            I&apos;d like to receive updates about GIS solutions, industry news, and exclusive offers.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Message...
            </>
          ) : (
            'Submit Message'
          )}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-emerald-400 text-sm">
              Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">
              Sorry, there was an error sending your message. Please try again or contact us directly.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
