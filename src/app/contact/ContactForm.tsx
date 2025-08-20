"use client";
import React, { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  serviceInterest: string;
  projectDescription: string;
  budget: string;
  hearAbout: string;
  subscribe: boolean;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    serviceInterest: "",
    projectDescription: "",
    budget: "",
    hearAbout: "",
    subscribe: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact-resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          jobTitle: "",
          serviceInterest: "",
          projectDescription: "",
          budget: "",
          hearAbout: "",
          subscribe: false,
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-12">
      <h2 className="text-2xl font-light text-white mb-8 tracking-tight">
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              First Name <span className="text-gray-300">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              Last Name <span className="text-gray-300">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              Email Address <span className="text-gray-300">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="+92 xxx xxxxxxx"
            />
          </div>
        </div>

        {/* Company and Job Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="Your job title"
            />
          </div>
        </div>

        {/* Service Interest */}
        <div>
          <label
            htmlFor="serviceInterest"
            className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
          >
            Service Interest <span className="text-gray-300">*</span>
          </label>
          <select
            id="serviceInterest"
            name="serviceInterest"
            required
            value={formData.serviceInterest}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-gray-600 transition-all"
          >
            <option value="">Select a service</option>
            <option value="infrastructure-monitoring">
              Infrastructure Monitoring
            </option>
            <option value="gis-solutions">GIS Solutions</option>
            <option value="ai-training">AI Training & Implementation</option>
            <option value="early-warning-systems">Early Warning Systems</option>
            <option value="data-analytics">
              Data Analytics & Visualization
            </option>
            <option value="consulting">Consulting Services</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Project Description */}
        <div>
          <label
            htmlFor="projectDescription"
            className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
          >
            Project Description <span className="text-gray-300">*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            required
            rows={4}
            value={formData.projectDescription}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all resize-none"
            placeholder="Please describe your project or inquiry..."
          />
        </div>

        {/* Budget and How did you hear */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              Estimated Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-gray-600 transition-all"
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
            <label
              htmlFor="hearAbout"
              className="block text-sm font-light text-gray-400 mb-2 tracking-wide"
            >
              How did you hear about us?
            </label>
            <select
              id="hearAbout"
              name="hearAbout"
              value={formData.hearAbout}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-gray-600 transition-all"
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
            className="mt-1 w-4 h-4 text-gray-300 bg-gray-900 border-gray-700 focus:ring-0"
          />
          <label
            htmlFor="subscribe"
            className="text-sm text-gray-400 font-light"
          >
            I&apos;d like to receive updates about GIS solutions, industry news,
            and exclusive offers.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-gray-900 hover:bg-gray-200 font-light py-4 px-6 tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending Message...
            </>
          ) : (
            "Submit Message"
          )}
        </button>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="p-4 bg-gray-700 border border-gray-600">
            <p className="text-gray-300 text-sm font-light">
              Thank you! Your message has been sent successfully. We&apos;ll get
              back to you soon.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-gray-700 border border-gray-600">
            <p className="text-gray-300 text-sm font-light">
              Sorry, there was an error sending your message. Please try again
              or contact us directly.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
