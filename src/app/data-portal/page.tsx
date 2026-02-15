"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import Image from 'next/image'

const DataPortalLogin = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)
      router.push('/data-portal/dashboard')
    } catch (err: unknown) {
      setLoading(false)
      let message = 'Failed to sign in'
      type ErrWithMessage = { message?: unknown }
      const maybeErr = err as ErrWithMessage
      if (maybeErr && typeof maybeErr.message === 'string') {
        message = maybeErr.message
      }
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left Panel - Hero Image & Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0">
          {/* Replace src with your hero image */}
          <Image
            src="/img/login-hero.jpg"
            alt="Geospatial visualization"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/img/only-graphics.png"
                alt="Geokits"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white text-xl font-semibold tracking-wide">
              Geokits
            </span>
          </div>

          {/* Hero Text */}
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-[#32de84]" />
              <span className="text-[#32de84] text-sm font-medium tracking-widest uppercase">
                Data Portal
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Geospatial Intelligence,{' '}
              <span className="text-[#32de84]">Delivered</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Access your geospatial datasets, visualize environmental insights, 
              and explore the data powering critical decisions.
            </p>
          </div>

          {/* Bottom Stats */}
          <div className="flex gap-12">
            <div>
              <div className="text-3xl font-bold text-white mb-1">17+</div>
              <div className="text-white/40 text-sm">Data Layers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">4</div>
              <div className="text-white/40 text-sm">Base Maps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">25yr</div>
              <div className="text-white/40 text-sm">Temporal Coverage</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#32de84]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#32de84]/5 rounded-full blur-2xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="relative h-8 w-8">
              <Image
                src="/img/GEOKITSWHITE.png"
                alt="Geokits"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white text-lg font-semibold">Geokits</span>
          </div>

          {/* Form Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome back</h2>
            <p className="text-white/50">Sign in to access your data portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 
                           focus:outline-none focus:border-[#32de84]/50 focus:ring-1 focus:ring-[#32de84]/50 
                           transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 
                           focus:outline-none focus:border-[#32de84]/50 focus:ring-1 focus:ring-[#32de84]/50 
                           transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#32de84] hover:bg-[#2bc975] text-black font-semibold rounded-xl 
                       transition-all duration-200 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-[#32de84]/20 hover:shadow-[#32de84]/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Back to Site */}
          <Link
            href="/"
            className="w-full py-3.5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 
                     font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to main site</span>
          </Link>

          {/* Footer */}
          <p className="mt-12 text-center text-white/30 text-sm">
            Need access?{' '}
            <a href="mailto:contact@geokits.com" className="text-[#32de84] hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataPortalLogin