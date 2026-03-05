"use client";

import { motion } from "framer-motion";

export default function SocialProof1() {
  const companies = [
    {
      name: "Planning",
      logo: "/img/geokits%20clients%20images/Planning.png",
      logoClassName: "max-w-[100%] max-h-[98%]",
    },
    {
      name: "WFP",
      logo: "/img/geokits%20clients%20images/WFPnewlogo_english_standard_BLUE_RGB.png",
      logoClassName: "max-w-[110%] max-h-[110%] scale-[1.2]",
    },
    {
      name: "IFAD",
      logo: "/img/geokits%20clients%20images/IFAD.png",
      logoClassName: "max-w-[86%] max-h-[82%]",
    },
    {
      name: "NSA",
      logo: "/img/geokits%20clients%20images/NSA.png",
      logoClassName: "max-w-[100%] max-h-[100%]",
    },
    {
      name: "Texas",
      logo: "/img/geokits%20clients%20images/texas.png",
      logoClassName: "max-w-[82%] max-h-[100%]",
    },
  ];

  return (
    <section className="w-full bg-white py-16 dark:bg-neutral-950 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-lg font-medium text-neutral-900 dark:text-neutral-100 sm:text-xl">
          Trusted by organizations around the world
        </h2>

        <div className="grid grid-cols-1 border border-neutral-200 dark:border-neutral-800 md:grid-cols-3 lg:grid-cols-5">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center justify-center border-b border-neutral-200 bg-white px-6 py-5 last:border-b-0 dark:border-neutral-800 dark:bg-neutral-950 sm:px-8 sm:py-6 md:border-r md:[&:nth-child(3n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(5n)]:border-r-0 lg:[&:nth-last-child(-n+5)]:border-b-0"
            >
              <div className="flex h-[84px] w-full items-center justify-center sm:h-[100px]">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className={`h-full w-full object-contain opacity-90 transition-opacity duration-200 hover:opacity-100 ${company.logoClassName}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
