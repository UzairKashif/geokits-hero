"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Lazy load components for better performance
const ClientsTestimonials = dynamic(() => import("@/components/ClientsTestimonials"), {
  loading: () => (
    <div className="min-h-screen bg-[#021400] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b border-white/30 mb-4 mx-auto"></div>
        <p className="font-light tracking-wide">Loading testimonials...</p>
      </div>
    </div>
  ),
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-48 bg-gray-900 animate-pulse" />,
});

export default function TestimonialsPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#021400] text-white">
      {/* Navigation Header */}
      <div className="relative z-10 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <Suspense fallback={
        <div className="min-h-screen bg-[#021400] flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b border-white/30 mb-4 mx-auto"></div>
            <p className="font-light tracking-wide">Loading testimonials...</p>
          </div>
        </div>
      }>
        <ClientsTestimonials />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-48 bg-gray-900 animate-pulse" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
