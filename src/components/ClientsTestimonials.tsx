// 'use client'

// import React, { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import Image from 'next/image'

// const logos = ['nsa-oman', 'aws', 'xprize']  // place these in /public/logos/*.png
// const testimonials = [
//   {
//     quote:
//       '“GeoKits’ early warning alerts saved lives during the Cyclone Alpha event—our team couldn’t have responded so quickly without them.”',
//     author: 'Emergency Response Coordinator, Country X',
//   },
//   {
//     quote:
//       '“The cooling tower detection system revolutionized our inspection workflow, reducing manual checks by 80%.”',
//     author: 'Public Health Inspector, Country Y',
//   },
//   {
//     quote:
//       '“Their training initiative upskilled our surveyors in Pix4D and GIS, enabling us to launch autonomous drone missions.”',
//     author: 'Lead Surveyor, NSA Oman',
//   },
// ]

// export default function ClientsTestimonials() {
//   const [idx, setIdx] = useState(0)

//   useEffect(() => {
//     const iv = setInterval(() => {
//       setIdx((i) => (i + 1) % testimonials.length)
//     }, 6000)
//     return () => clearInterval(iv)
//   }, [])

//   return (
//     <section id="testimonials" className="w-full py-16 px-4">
//       <div className="max-w-6xl mx-auto text-center">
//         <div className="flex items-center justify-center space-x-8 mb-8">
//           {logos.map((name) => (
//             <div key={name} className="h-12 w-auto">
//               <Image
//                 src={`/logos/${name}.png`}
//                 alt={name}
//                 width={100}
//                 height={48}
//               />
//             </div>
//           ))}
//         </div>
//         <div className="relative h-40">
//           <AnimatePresence initial={false}>
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.5 }}
//               className="absolute inset-0 px-4"
//             >
//               <p className="italic text-lg text-white/80">
//                 {testimonials[idx].quote}
//               </p>
//               <p className="mt-4 font-semibold text-white">
//                 — {testimonials[idx].author}
//               </p>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   )
// }



"use client";

import { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Transition } from "@headlessui/react";

// Default testimonials data
const defaultTestimonials = [
  {
    img: "/silhouette.png" as any, // Using a placeholder image
    quote: "GeoKits' early warning alerts saved lives during the Cyclone Alpha event—our team couldn't have responded so quickly without them.",
    name: "Sarah Johnson",
    role: "Emergency Response Coordinator",
  },
  {
    img: "/silhouette.png" as any,
    quote: "The cooling tower detection system revolutionized our inspection workflow, reducing manual checks by 80%.",
    name: "Dr. Ahmed Hassan",
    role: "Public Health Inspector",
  },
  {
    img: "/silhouette.png" as any,
    quote: "Their training initiative upskilled our surveyors in Pix4D and GIS, enabling us to launch autonomous drone missions.",
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
      setActive(
        active + 1 === testimonials.length ? 0 : (active) => active + 1,
      );
    }, autorotateTiming);
    return () => clearInterval(interval);
  }, [active, autorotate]);

  const heightFix = () => {
    if (testimonialsRef.current && testimonialsRef.current.parentElement)
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section id="testimonials" className="w-full py-16 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
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
            <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-indigo-500/25 before:via-indigo-500/5 before:via-25% before:to-indigo-500/0 before:to-75%">
              <div className="h-32" style={{ maskImage: 'linear-gradient(0deg, transparent, white 20%, white)' }}>
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
                  <div className="text-2xl font-bold text-white before:content-['\201C'] after:content-['\201D']">
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
                className={`m-1.5 inline-flex justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 ${active === index ? "bg-indigo-500 text-white shadow-indigo-950/10" : "bg-slate-700 text-slate-200 hover:bg-indigo-100 hover:text-slate-900"}`}
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
  );
}