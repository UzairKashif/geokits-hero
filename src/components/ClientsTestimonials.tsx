"use client";

import { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Transition } from "@headlessui/react";

// Default testimonials data
const defaultTestimonials = [
  {
    img: "/silhouette.png",
    quote:
      "Thank you for the training as the feedback from the attendees was good. It was good opportunity working with you and I hope there will more work together in the future.",
    name: "Dhiyab Alaamri",
    role: "National Survey Authority",
  },
  {
    img: "/silhouette.png",
    quote:
      "Director Geokits is very professional and pays attention to every detail. He delivered a remarkable GIS application project that exceeded my expectation. I highly recommend him in the sphere of GIS development.",
    name: "Dr. Ahmed Hassan",
    role: "Public Health Inspector",
  },
  {
    img: "/silhouette.png",
    quote:
      "Director Geokits was a team leader and took ownership for executing the project and completing it on time and within budget. We received a professionally designed, concise, and accessible community information flyer with a mapping component that turned static data points into a visual story.",
    name: "Mark Thompson",
    role: "Lead Surveyor, NSA Oman",
  },
];

interface Testimonial {
  img: StaticImageData | string;
  quote: string;
  name: string;
  role: string;
}

export default function ClientsTestimonials({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(0);
  const [autorotate, setAutorotate] = useState<boolean>(true);
  const autorotateTiming: number = 7000;

  useEffect(() => {
    if (!autorotate) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1 === testimonials.length ? 0 : prev + 1));
    }, autorotateTiming);
    return () => clearInterval(interval);
  }, [autorotate, testimonials.length]);

  const heightFix = () => {
    if (testimonialsRef.current && testimonialsRef.current.parentElement)
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section id="testimonials" className="w-full py-40 px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-24">
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none">
            What our clients
            <br />
            <span className="font-light">are saying</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide">
            Trusted by organizations worldwide for delivering critical
            geospatial solutions that drive real results.
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="grid md:grid-cols-2 gap-px bg-gray-800">
          {/* Active Testimonial - Left Side */}
          <div className="bg-gray-800 p-12">
            <div className="max-w-md">
              {/* Quote */}
              <div className="mb-8">
                <div className="relative flex flex-col" ref={testimonialsRef}>
                  {testimonials.map((testimonial, index) => (
                    <Transition
                      as="div"
                      key={index}
                      show={active === index}
                      enter="transition ease-in-out duration-500 delay-200 order-first"
                      enterFrom="opacity-0 -translate-y-4"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-out duration-300 absolute"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-4"
                      beforeEnter={() => heightFix()}
                    >
                      <blockquote className="text-xl font-light text-gray-300 leading-relaxed tracking-wide italic">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>
                    </Transition>
                  ))}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {testimonials.map((testimonial, index) => (
                    <Transition
                      as="div"
                      key={index}
                      show={active === index}
                      className="absolute inset-0"
                      enter="transition ease-in-out duration-500"
                      enterFrom="opacity-0 scale-90"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-out duration-300"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-90"
                    >
                      <Image
                        className="w-12 h-12 rounded-full "
                        src={testimonial.img}
                        width={48}
                        height={48}
                        alt={testimonial.name}
                      />
                    </Transition>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                </div>

                <div>
                  {testimonials.map((testimonial, index) => (
                    <Transition
                      as="div"
                      key={index}
                      show={active === index}
                      enter="transition ease-in-out duration-500 delay-100"
                      enterFrom="opacity-0 translate-x-4"
                      enterTo="opacity-100 translate-x-0"
                      leave="transition ease-out duration-300 absolute"
                      leaveFrom="opacity-100 translate-x-0"
                      leaveTo="opacity-0 translate-x-4"
                    >
                      <div className="text-white font-light tracking-tight">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 text-sm font-light tracking-wide">
                        {testimonial.role}
                      </div>
                    </Transition>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation - Right Side */}
          <div className="bg-gray-800 p-12">
            <div className="space-y-4">
              <div className="mb-8">
                <h3 className="text-lg font-light text-white mb-2 tracking-tight">
                  Select testimonial
                </h3>
                <div className="w-12 h-px bg-gray-600"></div>
              </div>

              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  className={`group w-full text-left p-4 border transition-all duration-300 ${active === index
                      ? "border-gray-600 bg-gray-700/50"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-700/20"
                    }`}
                  onClick={() => {
                    setActive(index);
                    setAutorotate(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-light transition-colors duration-300 ${active === index
                            ? "bg-white text-gray-900"
                            : "bg-gray-600 text-gray-300 group-hover:bg-gray-500"
                          }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-light tracking-tight transition-colors duration-300 ${active === index
                            ? "text-white"
                            : "text-gray-300 group-hover:text-white"
                          }`}
                      >
                        {testimonial.name}
                      </div>
                      <div
                        className={`text-sm font-light mt-1 transition-colors duration-300 ${active === index ? "text-gray-300" : "text-gray-400"
                          }`}
                      >
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-light tracking-wide">
                <span>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(testimonials.length).padStart(2, "0")}
                </span>
                <div className="flex-1 h-px bg-gray-700">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{
                      width: `${((active + 1) / testimonials.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
