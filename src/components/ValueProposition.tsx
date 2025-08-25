export default function ValueProposition() {
  const values = [
    {
      title: "GIS Expertise",
      description: "Deep technical knowledge in Geographic Information Systems with years of specialized experience delivering precise spatial solutions."
    },
    {
      title: "Custom Applications",
      description: "Tailored software solutions built specifically for your unique business requirements and operational workflows."
    },
    {
      title: "Cross-Platform Delivery",
      description: "Seamless deployment across web, mobile, and desktop platforms ensuring your solution works everywhere you need it."
    },
    {
      title: "Rapid Turnaround",
      description: "Efficient development processes that deliver high-quality results quickly without compromising on precision or reliability."
    }
  ]

  return (
    <section className="py-40 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-24">
          <div className="mb-6">
            <span className="text-xs font-light tracking-[0.2em] text-gray-400 uppercase">Our Value</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-extralight text-[#021400] mb-8 leading-none">
            Why choose our
            <br />
            <span className="font-light">GIS solutions</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed tracking-wide">
            We combine technical excellence with practical understanding to deliver geographic solutions that drive real business results.
          </p>
        </div>

        {/* Value Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-gray-100">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white p-12 hover:bg-gray-50 transition-all duration-500"
            >
              <div className="max-w-sm">
                <div className="mb-8">
                  <span className="text-sm font-light text-gray-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-light text-[#021400] tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed tracking-normal">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24">
          <div className="flex items-center gap-12">
            <button className="px-10 py-4 bg-[#021400] text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300">
              Start your project
            </button>
            <a href="#contact" className="text-gray-600 font-light tracking-wide hover:text-[#021400] transition-colors duration-300">
              Schedule consultation →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
  