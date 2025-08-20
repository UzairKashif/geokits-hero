"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const models = [
  {
    title: "Pilot Program",
    description:
      "Short-term proof of concept to demonstrate value and feasibility.",
    features: [
      "Risk Assessment",
      "ROI Analysis",
      "Technical Validation",
      "Team Training",
    ],
    timeline: "2-4 weeks",
  },
  {
    title: "Full-Scale Deployment",
    description:
      "Comprehensive rollout across your organization with complete integration.",
    features: [
      "Enterprise Integration",
      "Workflow Automation",
      "Data Migration",
      "Support & Maintenance",
    ],
    timeline: "3-6 months",
  },
  {
    title: "Custom Training Packages",
    description:
      "Tailored GIS and photogrammetry training for your technical teams.",
    features: [
      "Hands-on Workshops",
      "Certification Programs",
      "Best Practices",
      "Ongoing Support",
    ],
    timeline: "1-2 months",
  },
];

export default function EngagementModels() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <section
      ref={ref}
      id="engagement"
      className="w-full py-40 px-6 bg-gray-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-left mb-24"
        >
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Our Approach
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-extralight text-white mb-8 leading-none">
            Engagement
            <br />
            <span className="font-light">models</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed tracking-wide">
            Choose the engagement model that best fits your organizational needs
            and project timeline.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-px bg-gray-800"
        >
          {models.map((model, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group bg-gray-800 p-12 hover:bg-gray-700 transition-all duration-500"
            >
              {/* Timeline badge */}
              <div className="mb-8">
                <span className="text-sm font-light text-gray-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-light text-white mb-6 tracking-tight">
                {model.title}
              </h3>

              {/* Description */}
              <p className="text-base text-gray-300 leading-relaxed mb-8 tracking-normal">
                {model.description}
              </p>

              {/* Timeline */}
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-light text-gray-400 uppercase tracking-wide">
                    Timeline
                  </span>
                  <div className="h-px flex-1 bg-gray-600"></div>
                </div>
                <div className="mt-2">
                  <span className="text-white font-light tracking-tight">
                    {model.timeline}
                  </span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-3">
                <h4 className="text-white font-light text-sm uppercase tracking-wide mb-4">
                  Key Features
                </h4>
                {model.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + index * 0.2 + featureIndex * 0.1,
                    }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-1 h-1 bg-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 text-sm font-light">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-24">
          <div className="flex items-center gap-12">
            <button className="px-10 py-4 bg-white text-gray-900 font-light tracking-wide hover:bg-gray-200 transition-all duration-300">
              Discuss your project
            </button>
            <a
              href="#contact"
              className="text-gray-400 font-light tracking-wide hover:text-white transition-colors duration-300"
            >
              Schedule consultation →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
