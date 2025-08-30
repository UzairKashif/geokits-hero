"use client";
import ContactForm from "@/app/contact/ContactForm";
import Footer from "@/components/Footer";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const ourLocations = [
    "I10, Plot No, 94, 3 Street 7, I-10/3 sector, Islamabad, 44800",
    "483 Green Lanes, London, England, N13 4BS",
  ];

  return (
    <div className="min-h-screen forest-bg overflow-x-hidden">
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
          {/* Logo */}

          <div className="mb-6 ">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Get In Touch
            </span>
          </div>
          <div className="h-auto w-auto flex flex-row items-center justify-between gap-4">
            <h1 className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none break-words">
              Contact
              <br />
              <span className="font-light">Information</span>
            </h1>
            <div className="mb-8 pr-0 flex-shrink-0">
              <Image
                src="/img/GEOKITSWHITE.png"
                alt="Geokits Logo"
                width={400}
                height={120}
                className="h-20 w-auto md:h-[400px] hover:filter"
                priority
              />
            </div>
          </div>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide">
            Ready to transform your project? Get in touch with
            our experts today.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-px bg-transparent lg:bg-gray-800">
          {/* Contact Information */}
          <div className="white-forest p-12 rounded-t-2xl rounded-b-none lg:rounded-2xl lg:rounded-r-none lg:rounded-l-2xl overflow-hidden">
            {/* Mobile Toggle Button */}
            {isMobile && (
              <button
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className="lg:hidden w-full flex items-center justify-between text-left mb-6 p-4 forest-bg rounded-xl hover:bg-opacity-80 transition-all duration-200"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: "0",
                  margin: "0",
                  cursor: "pointer",
                }}
              >
                <span className="text-lg font-light text-white">
                  Contact Information
                </span>
                {isInfoExpanded ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </button>
            )}

            {/* Contact Info Content */}
            <div
              className={`space-y-8 ${
                isMobile && !isInfoExpanded ? "hidden" : "block pt-6"
              }`}
            >
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 forest-bg flex items-center justify-center flex-shrink-0 rounded-xl">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
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
                  <h3 className="text-lg font-light mb-1 tracking-tight">
                    Our Locations
                  </h3>
                  <div className="font-light space-y-1">
                    {ourLocations.map((location) => (
                      <div key={location} className="flex">
                        {/* <span
                          className="mr-2 text-green-400 flex items-start justify-center"
                          style={{ width: "20px", minWidth: "20px" }}
                        >
                          →
                        </span> */}
                        <span className="break-words">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 forest-bg flex items-center justify-center flex-shrink-0 rounded-xl">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
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
                  <h3 className="text-lg font-light mb-1 tracking-tight">
                    Phone
                  </h3>
                  <p className="font-light">(+44) 7446284191</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 forest-bg flex items-center justify-center flex-shrink-0 rounded-xl">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
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
                  <h3 className="text-lg font-light mb-1 tracking-tight">
                    Email
                  </h3>
                  <p className="font-light">contact@geokits.com</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 forest-bg flex items-center justify-center flex-shrink-0 rounded-xl">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
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
                  <h3 className="text-lg font-light mb-1 tracking-tight">
                    Working Hours
                  </h3>
                  <div className="font-light">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
