"use client";
import React, { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  serviceInterest: string;
  projectDescription: string;
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
    hearAbout: "",
    subscribe: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    setErrorMessage("");

    try {
      // Check Turnstile token
      if (!turnstileToken) {
        setSubmitStatus("error");
        setErrorMessage("Please complete the security verification.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, turnstileToken }),
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
          hearAbout: "",
          subscribe: false,
        });
        // Reset Turnstile for next submission
        setTurnstileToken(null);
        turnstileRef.current?.reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus("error");
        setErrorMessage(errorData.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="white-forest p-12 rounded-b-2xl rounded-t-none lg:rounded-2xl lg:rounded-l-none lg:rounded-r-2xl overflow-hidden">
      <h2 className="text-2xl font-light mb-8 tracking-tight">
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-light mb-2 tracking-wide"
            >
              First Name <span>*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-light mb-2 tracking-wide"
            >
              Last Name <span>*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-light mb-2 tracking-wide"
            >
              Email Address <span>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-light mb-2 tracking-wide"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
              placeholder="(+xx) xxx xxxxxxx"
            />
          </div>
        </div>

        {/* Company and Job Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-light mb-2 tracking-wide"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-light mb-2 tracking-wide"
            >
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
              placeholder="Your job title"
            />
          </div>
        </div>

        {/* Service Interest */}
        <div>
          <label
            htmlFor="serviceInterest"
            className="block text-sm font-light mb-2 tracking-wide"
          >
            Service Interest <span>*</span>
          </label>
          <select
            id="serviceInterest"
            name="serviceInterest"
            required
            value={formData.serviceInterest}
            onChange={handleChange}
            className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
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
            className="block text-sm font-light mb-2 tracking-wide"
          >
            Project Description <span>*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            required
            rows={4}
            value={formData.projectDescription}
            onChange={handleChange}
            className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all resize-none"
            placeholder="Please describe your project or inquiry..."
          />
        </div>

        {/* How did you hear */}
        <div>
          <label
            htmlFor="hearAbout"
            className="block text-sm font-light mb-2 tracking-wide"
          >
            How did you hear about us?
          </label>
          <select
            id="hearAbout"
            name="hearAbout"
            value={formData.hearAbout}
            onChange={handleChange}
            className="w-full px-4 py-3 border focus:outline-none focus:border-gray-400 transition-all"
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

        {/* Newsletter Subscription */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            className="mt-1 w-4 h-4 border-gray-300 focus:ring-0"
          />
          <label
            htmlFor="subscribe"
            className="text-sm text-gray-400 font-light"
          >
            I&apos;d like to receive updates about GIS solutions, industry news,
            and exclusive offers.
          </label>
        </div>

        {/* Cloudflare Turnstile */}
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => {
              setTurnstileToken(null);
              setErrorMessage("Security verification failed. Please try again.");
            }}
            onExpire={() => setTurnstileToken(null)}
            options={{
              theme: "light",
              size: "normal",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-soft-curve btn-primary w-full font-light py-4 px-6 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            color: "white",
          }}
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
          <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg">
            <p className="text-sm font-light" style={{ color: "white" }}>
              Thank you! Your message has been sent successfully. We&apos;ll get
              back to you soon.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg">
            <p className="text-sm font-light" style={{ color: "white" }}>
              {errorMessage || "Sorry, there was an error sending your message. Please try again or contact us directly."}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
