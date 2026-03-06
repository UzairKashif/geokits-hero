"use client";

type Milestone = {
  phase: string;
  title: string;
  description: string;
  outcome: string;
  duration: string;
};

const milestones: Milestone[] = [
  {
    phase: "Phase 01",
    title: "Discovery and Requirements Gathering",
    description:
      "We align with your goals, map current constraints, and define the data, systems, and outcomes needed for delivery.",
    outcome: "A clear engagement scope and measurable success criteria.",
    duration: "Week 1",
  },
  {
    phase: "Phase 02",
    title: "Solution Design and Planning",
    description:
      "We architect the implementation path, finalize technical choices, and sequence execution to minimize delivery risk.",
    outcome: "A practical delivery plan with milestones and ownership.",
    duration: "Week 2",
  },
  {
    phase: "Phase 03",
    title: "Implementation and Development",
    description:
      "We build and integrate the core GIS workflows, dashboards, and automations required for your operational use cases.",
    outcome: "A working solution mapped to your real-world workflows.",
    duration: "Weeks 3-5",
  },
  {
    phase: "Phase 04",
    title: "Testing and Quality Assurance",
    description:
      "We validate outputs, harden reliability, and run scenario-based QA to ensure stable behavior in production conditions.",
    outcome: "A verified release candidate with reduced operational risk.",
    duration: "Week 6",
  },
  {
    phase: "Phase 05",
    title: "Delivery and Ongoing Support",
    description:
      "We launch, onboard your team, and provide iterative support to scale adoption, performance, and long-term value.",
    outcome: "Confident handover, training, and sustained improvement.",
    duration: "Post-launch",
  },
];

export default function ProjectTimeline() {
  return (
    <section className="w-full bg-white px-4 py-20 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-left md:mb-16">
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
              Engagement Roadmap
            </span>
          </div>
          <h2 className="mb-8 text-6xl font-extralight leading-none text-[#021400] md:text-7xl">
            Project
            <br />
            <span className="font-light">journey</span>
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            A structured path from discovery to deployment, designed to keep
            execution clear, outcomes measurable, and collaboration smooth across
            every phase.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-[#021400]/35 via-[#021400]/15 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-6 md:space-y-8">
            {milestones.map((milestone, index) => {
              const isRight = index % 2 === 1;

              return (
                <div key={milestone.phase} className="relative">
                  <div className="md:grid md:grid-cols-2 md:gap-12">
                    <div className={`pl-12 md:pl-0 ${isRight ? "md:col-start-2" : ""}`}>
                      <article className="rounded-2xl border border-[#021400]/15 bg-white p-5 shadow-[0_8px_30px_rgba(2,20,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,20,0,0.1)] md:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="inline-flex items-center border border-[#021400]/20 bg-[#021400]/5 px-3 py-1 text-xs font-light tracking-wide text-[#021400]">
                            {milestone.phase}
                          </span>
                          <span className="text-xs font-light tracking-wide text-gray-500">
                            {milestone.duration}
                          </span>
                        </div>

                        <h3 className="text-xl font-light leading-tight text-[#021400] md:text-2xl">
                          {milestone.title}
                        </h3>
                        <p className="mt-3 text-sm font-light leading-relaxed text-gray-600 md:text-base">
                          {milestone.description}
                        </p>

                        <div className="mt-5 border-t border-[#021400]/10 pt-4">
                          <p className="text-xs font-light uppercase tracking-[0.16em] text-gray-500">
                            Outcome
                          </p>
                          <p className="mt-1 text-sm font-light text-[#021400] md:text-base">
                            {milestone.outcome}
                          </p>
                        </div>
                      </article>
                    </div>
                  </div>

                  <div className="absolute left-5 top-8 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#021400]/25 bg-white">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#021400]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
