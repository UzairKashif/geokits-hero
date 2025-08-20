import ContactForm from "@/app/contact/ContactForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm font-light tracking-wide">Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pt-14 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-left">
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Get In Touch
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none">
            Contact
            <br />
            <span className="font-light">information</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide">
            Ready to transform your infrastructure monitoring? Get in touch with
            our experts today.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-px bg-gray-800">
          {/* Contact Information */}
          <div className="bg-gray-800 p-12">
            <h2 className="text-2xl font-light text-white mb-8 tracking-tight">
              Contact Information
            </h2>

            <div className="space-y-8">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-light text-white mb-1 tracking-tight">
                    Our Location
                  </h3>
                  <p className="text-gray-400 font-light">
                    G 9/4, Islamabad, Pakistan
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-light text-white mb-1 tracking-tight">
                    Phone
                  </h3>
                  <p className="text-gray-400 font-light">(+92) 303 7239083</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-light text-white mb-1 tracking-tight">
                    Email
                  </h3>
                  <p className="text-gray-400 font-light">contact@geokits.co</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-light text-white mb-1 tracking-tight">
                    Working Hours
                  </h3>
                  <div className="text-gray-400 font-light">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
