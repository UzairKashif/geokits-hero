'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface JobListing {
  id: number
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
  experience: string
  description: string
  requirements: string[]
  benefits: string[]
  featured?: boolean
}

const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Senior GIS Developer",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Full-time",
    experience: "5+ years",
    description: "Lead the development of cutting-edge geospatial applications and mapping solutions for enterprise clients.",
    requirements: [
      "5+ years experience with GIS technologies (ArcGIS, QGIS, PostGIS)",
      "Strong proficiency in Python, JavaScript, and SQL",
      "Experience with web mapping libraries (Leaflet, Mapbox, OpenLayers)",
      "Knowledge of spatial databases and geospatial analysis",
      "Bachelor's degree in GIS, Computer Science, or related field"
    ],
    benefits: [
      "Competitive salary ($90k - $130k)",
      "Equity participation",
      "Flexible working arrangements",
      "Professional development budget",
      "Health and dental coverage"
    ],
    featured: true
  },
  {
    id: 2,
    title: "Geospatial Data Scientist",
    department: "Data Science",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "Apply machine learning and AI techniques to solve complex geospatial problems and extract insights from spatial data.",
    requirements: [
      "PhD or Master's in Data Science, Geography, or related field",
      "3+ years experience with Python, R, and ML frameworks",
      "Experience with remote sensing and satellite imagery analysis",
      "Knowledge of spatial statistics and geostatistics",
      "Strong communication and visualization skills"
    ],
    benefits: [
      "Competitive salary ($85k - $120k)",
      "Research publication opportunities",
      "Conference attendance budget",
      "Flexible PTO",
      "Top-tier equipment"
    ]
  },
  {
    id: 3,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Hybrid",
    type: "Full-time",
    experience: "3+ years",
    description: "Build scalable web applications and APIs that power our geospatial intelligence platform.",
    requirements: [
      "3+ years experience with React, Node.js, and TypeScript",
      "Experience with cloud platforms (AWS, Azure, GCP)",
      "Knowledge of RESTful APIs and microservices architecture",
      "Understanding of database design (PostgreSQL, MongoDB)",
      "Familiarity with DevOps practices and CI/CD"
    ],
    benefits: [
      "Competitive salary ($75k - $110k)",
      "Stock options",
      "Learning and development budget",
      "Flexible schedule",
      "Health benefits"
    ]
  },
  {
    id: 4,
    title: "GIS Analyst Intern",
    department: "Operations",
    location: "Remote",
    type: "Internship",
    experience: "Student",
    description: "Support our team with spatial analysis, data processing, and visualization projects while gaining hands-on industry experience.",
    requirements: [
      "Currently enrolled in GIS, Geography, or related program",
      "Basic knowledge of GIS software (ArcGIS, QGIS)",
      "Understanding of coordinate systems and projections",
      "Strong analytical and problem-solving skills",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive internship stipend",
      "Mentorship program",
      "Real-world project experience",
      "Potential for full-time offer",
      "Flexible schedule around studies"
    ]
  },
  {
    id: 5,
    title: "Product Manager",
    department: "Product",
    location: "Hybrid",
    type: "Full-time",
    experience: "4+ years",
    description: "Drive product strategy and roadmap for our geospatial technology platforms, working closely with engineering and design teams.",
    requirements: [
      "4+ years of product management experience",
      "Understanding of geospatial technologies and workflows",
      "Experience with B2B SaaS products",
      "Strong analytical and strategic thinking skills",
      "Excellent stakeholder management abilities"
    ],
    benefits: [
      "Competitive salary ($95k - $140k)",
      "Equity package",
      "Product development budget",
      "Team leadership opportunities",
      "Comprehensive benefits"
    ]
  },
  {
    id: 6,
    title: "Software Engineering Intern",
    department: "Engineering",
    location: "Remote",
    type: "Internship",
    experience: "Student",
    description: "Join our engineering team to work on real projects, learn from senior developers, and contribute to our technology stack.",
    requirements: [
      "Currently pursuing CS, Software Engineering, or related degree",
      "Knowledge of programming languages (Python, JavaScript, Java)",
      "Understanding of software development fundamentals",
      "Enthusiasm for geospatial technology",
      "Strong problem-solving skills"
    ],
    benefits: [
      "Competitive internship compensation",
      "Code review and mentorship",
      "Access to cutting-edge tools",
      "Career development guidance",
      "Networking opportunities"
    ]
  }
]

const ApplicationForm: React.FC<{ jobTitle: string; onClose: () => void }> = ({ jobTitle, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    resume: null as File | null,
    coverLetter: '',
    portfolio: '',
    experience: '',
    availability: '',
    motivation: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Application submitted:', formData)
    alert('Application submitted successfully!')
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-light text-[#021400]">Apply for {jobTitle}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#021400] mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#021400] mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#021400] mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#021400] mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#021400] mb-2">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedIn}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#021400] mb-2">Resume *</label>
            <input
              type="file"
              required
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX files only (max 5MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#021400] mb-2">Portfolio/GitHub (if applicable)</label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              placeholder="https://github.com/yourusername or https://yourportfolio.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#021400] mb-2">Years of Experience</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-8">5-8 years</option>
              <option value="8+">8+ years</option>
              <option value="student">Student/Recent Graduate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#021400] mb-2">When can you start?</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g., Immediately, 2 weeks notice, After graduation (May 2024)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#021400] mb-2">Cover Letter / Why are you interested in this role? *</label>
            <textarea
              required
              rows={4}
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              placeholder="Tell us about your interest in this role and what makes you a great fit..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-vertical"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

const JobCard: React.FC<{ job: JobListing; onApply: (jobTitle: string) => void }> = ({ job, onApply }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-xl border transition-all duration-500 hover:shadow-2xl group ${
        job.featured 
          ? 'bg-[#021400]/5 border-[#021400]/20 hover:border-[#021400]/40 hover:bg-[#021400]/10' 
          : 'bg-white border-gray-200/50 hover:border-[#021400]/20 hover:bg-gray-50/50'
      }`}
    >
      {job.featured && (
        <div className="absolute -top-3 left-8">
          <span className="bg-[#021400] text-white text-xs font-medium px-4 py-1 rounded-full tracking-wide">
            FEATURED
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-light text-[#021400] mb-3 group-hover:text-black transition-colors duration-300">{job.title}</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-[#021400]/10 text-[#021400] px-3 py-1 rounded-full font-medium">{job.department}</span>
            <span className="bg-[#021400]/10 text-[#021400] px-3 py-1 rounded-full font-medium">{job.location}</span>
            <span className={`px-3 py-1 rounded-full font-medium ${
              job.type === 'Internship' 
                ? 'bg-black/10 text-black' 
                : 'bg-[#021400]/10 text-[#021400]'
            }`}>
              {job.type}
            </span>
            <span className="bg-[#021400]/10 text-[#021400] px-3 py-1 rounded-full font-medium">{job.experience}</span>
          </div>
        </div>
      </div>

      <p className="text-[#021400]/80 mb-6 leading-relaxed text-base">{job.description}</p>

      <div className="mb-6">
        <h4 className="font-light text-[#021400] mb-3 text-lg">Key Requirements</h4>
        <ul className="text-sm text-[#021400]/70 space-y-2">
          {job.requirements.slice(0, 3).map((req, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1 h-1 bg-[#021400] rounded-full mt-2.5 flex-shrink-0"></div>
              {req}
            </li>
          ))}
          {job.requirements.length > 3 && (
            <li className="text-[#021400]/50 italic text-xs">+{job.requirements.length - 3} more requirements</li>
          )}
        </ul>
      </div>

      <div className="mb-8">
        <h4 className="font-light text-[#021400] mb-3 text-lg">Benefits</h4>
        <ul className="text-sm text-[#021400]/70 space-y-2">
          {job.benefits.slice(0, 2).map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1 h-1 bg-black rounded-full mt-2.5 flex-shrink-0"></div>
              {benefit}
            </li>
          ))}
          {job.benefits.length > 2 && (
            <li className="text-[#021400]/50 italic text-xs">+{job.benefits.length - 2} more benefits</li>
          )}
        </ul>
      </div>

      <button
        onClick={() => onApply(job.title)}
        className="w-full bg-[#021400] text-white py-4 rounded-lg font-light text-lg hover:bg-black transition-all duration-300 group-hover:bg-black"
      >
        Apply Now
      </button>
    </motion.div>
  )
}

const CareersPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const fullTimeJobs = jobListings.filter(job => job.type === 'Full-time')
  const internships = jobListings.filter(job => job.type === 'Internship')

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-7xl md:text-8xl font-extralight text-[#021400] mb-8 leading-none">
              Shape the Future of
              <br />
              <span className="font-light">Geospatial Technology</span>
            </h1>
            <p className="text-xl text-[#021400]/70 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join our mission to revolutionize how organizations understand and interact with spatial data. 
              Build cutting-edge solutions that impact millions of users worldwide.
            </p>
            
            <div className="flex justify-center items-center space-x-12 text-sm text-[#021400]/60">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#021400] rounded-full"></div>
                <span className="font-medium">Remote-First Culture</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="font-medium">Competitive Benefits</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#021400] rounded-full"></div>
                <span className="font-medium">Growth Opportunities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 px-6 bg-[#021400]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-extralight text-white mb-6 leading-none">
              Why Join
              <br />
              <span className="font-light">GeoKits?</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Be part of a team that's redefining the future of spatial intelligence and enterprise geospatial solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation at Scale",
                description: "Work on cutting-edge geospatial technologies that serve enterprise clients and impact millions of users globally."
              },
              {
                title: "Remote-First Culture",
                description: "Flexible work arrangements with a global team. Work from anywhere while collaborating on world-changing projects."
              },
              {
                title: "Career Growth",
                description: "Continuous learning opportunities, mentorship programs, and clear advancement paths in a rapidly growing company."
              },
              {
                title: "Ownership Culture",
                description: "Take ownership of projects from conception to deployment. Your ideas and contributions directly shape our products."
              },
              {
                title: "Impact & Purpose",
                description: "Solve real-world problems in climate, urban planning, disaster response, and environmental monitoring."
              },
              {
                title: "Premium Benefits",
                description: "Competitive compensation, equity participation, comprehensive health coverage, and professional development budget."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 group"
              >
                <div className="w-12 h-1 bg-gradient-to-r from-white to-white/70 rounded-full mb-6 group-hover:w-16 transition-all duration-300"></div>
                <h3 className="text-xl font-light text-white mb-4">{benefit.title}</h3>
                <p className="text-white/70 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-extralight text-[#021400] mb-6 leading-none">
              Open
              <br />
              <span className="font-light">Positions</span>
            </h2>
            <p className="text-xl text-[#021400]/70 max-w-3xl mx-auto leading-relaxed">
              Join our team of experts and help shape the future of geospatial technology
            </p>
          </motion.div>

          {/* Full-Time Positions */}
          <div className="mb-16">
            <h3 className="text-3xl font-extralight text-[#021400] mb-8">Full-Time Opportunities</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {fullTimeJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={setSelectedJob} />
              ))}
            </div>
          </div>

          {/* Internships */}
          <div>
            <h3 className="text-3xl font-extralight text-[#021400] mb-8">Internship Programs</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {internships.map((job) => (
                <JobCard key={job.id} job={job} onApply={setSelectedJob} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedJob && (
        <ApplicationForm
          jobTitle={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      <Footer />
    </div>
  )
}

export default CareersPage
