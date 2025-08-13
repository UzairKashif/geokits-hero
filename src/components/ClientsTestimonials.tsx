"use client";

import { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Transition } from "@headlessui/react";

// Default testimonials data
const defaultTestimonials = [
  {
    img: "/silhouette.png", // Using a placeholder image
    quote:"Thank you for the training as the feedback from the attendees was good. It was good opportunity working with you and I hope there will more work together in the future. Best regards,",
    name: "Dhiyab Alaamri",
    role: "NSA",
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
      "Director GeoKits was a team leader and took ownership/responsibility for executing the project and completing it on time and within budget. After getting a clear understanding of what was needed and reviewing the draft content, he managed the process independently, getting feedback on drafts and adjusting accordingly. We received a professionally designed, concise, and accessible community information flyer. This project also included a mapping component that turned \"static\" data points into a visual story, helping the local community understand the relationship between cases of disease and possible sources of environmental exposure. We had worked with Director GeoKits on a longer-term project and knew he would take full responsibility for the project and would only need broad-level guidance to develop a solution that met our and the community's needs.",
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

export default function FancyTestimonialsSlider({
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
    <>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(16, 185, 129, 0.5) rgba(51, 65, 85, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.7);
        }
      `}</style>
    <section id="testimonials" className="w-full py-16 px-4 bg-gradient-to-b from-gray-900 via-slate-800 to-[#131d2f]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate-300 text-lg">
            Trusted by organizations worldwide for critical geospatial solutions
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl text-center">
          {/* Testimonial image */}
          <div className="relative h-32">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-green-400/25 before:via-emerald-500/5 before:via-25% before:to-green-600/0 before:to-75%">
              <div
                className="h-32"
                style={{
                  maskImage:
                    "linear-gradient(0deg, transparent, white 20%, white)",
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <Transition
                    as="div"
                    key={index}
                    show={active === index}
                    className="absolute inset-0 -z-10 h-full"
                    enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                    enterFrom="opacity-0 -rotate-[60deg]"
                    enterTo="opacity-100 rotate-0"
                    leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                    leaveFrom="opacity-100 rotate-0"
                    leaveTo="opacity-0 rotate-[60deg]"
                    beforeEnter={() => heightFix()}
                  >
                    <Image
                      className="relative left-1/2 top-11 -translate-x-1/2 rounded-full"
                      src={testimonial.img}
                      width={56}
                      height={56}
                      alt={testimonial.name}
                    />
                  </Transition>
                ))}
              </div>
            </div>
          </div>
          {/* Text */}
          <div className="mb-9 transition-all delay-300 duration-150 ease-in-out">
            <div className="relative flex flex-col" ref={testimonialsRef}>
              {testimonials.map((testimonial, index) => (
                <Transition
                  key={index}
                  show={active === index}
                  enter="transition ease-in-out duration-500 delay-200 order-first"
                  enterFrom="opacity-0 -translate-x-4"
                  enterTo="opacity-100 translate-x-0"
                  leave="transition ease-out duration-300 delay-300 absolute"
                  leaveFrom="opacity-100 translate-x-0"
                  leaveTo="opacity-0 translate-x-4"
                  beforeEnter={() => heightFix()}
                >
                  <div className="text-2xl font-bold text-white max-h-[7.5rem] overflow-y-auto custom-scrollbar">
                    {testimonial.quote}
                  </div>
                </Transition>
              ))}
            </div>
          </div>
          {/* Buttons */}
          <div className="-m-1.5 flex flex-wrap justify-center">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                className={`m-1.5 inline-flex justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 ${active === index ? "bg-green-400 text-white shadow-indigo-950/10" : "bg-slate-700 text-slate-200 hover:bg-indigo-100 hover:text-slate-900"}`}
                onClick={() => {
                  setActive(index);
                  setAutorotate(false);
                }}
              >
                <span>{testimonial.name}</span>{" "}
                <span
                  className={`${active === index ? "text-indigo-200" : "text-slate-400"}`}
                >
                  -
                </span>{" "}
                <span>{testimonial.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
