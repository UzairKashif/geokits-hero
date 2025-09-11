'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLeaders, getTeamMembers, TeamMember } from '@/data/teams'
import Footer from '@/components/Footer'

const TeamCard: React.FC<{ member: TeamMember; isLeader?: boolean }> = ({ member, isLeader = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className={`group relative ${isLeader ? 'w-full max-w-md' : 'w-full max-w-sm'} mx-auto`}
    >
      {/* Glass morphism card - Square aspect ratio */}
      <div className={`relative overflow-hidden rounded-lg backdrop-blur-xl border transition-all duration-500 aspect-square ${
        isLeader 
          ? 'bg-white/80 border-white/50 shadow-xl hover:bg-white/90 hover:border-white/70 hover:shadow-2xl' 
          : 'bg-white/10 border-gray/20 shadow-2xl hover:bg-white/20 hover:border-gray/30'
      }`}>
        
        {/* Profile Image - 75% of card height */}
        <div className="relative overflow-hidden h-[75%]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10"></div>
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => {
              // Fallback to a placeholder gradient
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement!
              parent.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br ${isLeader ? 'from-gray-300 to-gray-500' : 'from-gray-600 to-gray-800'} flex items-center justify-center">
                  <span class="${isLeader ? 'text-gray-700' : 'text-gray-300'} text-4xl font-light">${member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
              `
            }}
          />
        </div>

        {/* Content - 25% of card height */}
        <div className="h-[25%] p-3 flex flex-col justify-center text-left">
          <h3 className={`font-light mb-1 ${isLeader ? 'text-base text-[#021400]' : 'text-sm text-[#021400]'} transition-colors duration-300 leading-tight`}>
            {member.name}
          </h3>
          
          <p className={`font-normal ${isLeader ? 'text-[#021400]/80' : 'text-[#021400]/80'} ${isLeader ? 'text-xs' : 'text-xs'} leading-tight`}>
            {member.role}
          </p>
          
          {/* Social Links - Only show on hover for cleaner look */}
          <div className="flex justify-start space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            {member.linkedIn && (
              <motion.a
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                  isLeader 
                    ? 'bg-[#021400]/10 hover:bg-[#021400]/20 text-[#021400] hover:shadow-lg' 
                    : 'bg-[#021400]/10 hover:bg-[#021400]/20 text-[#021400] hover:shadow-lg'
                }`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            )}
            
            {member.email && (
              <motion.a
                href={`mailto:${member.email}`}
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                  isLeader 
                    ? 'bg-[#021400]/10 hover:bg-[#021400]/20 text-[#021400] hover:shadow-lg' 
                    : 'bg-[#021400]/10 hover:bg-[#021400]/20 text-[#021400] hover:shadow-lg'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.a>
            )}
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          isLeader 
            ? 'bg-gradient-to-br from-[#021400]/5 via-transparent to-transparent' 
            : 'bg-gradient-to-br from-[#021400]/5 via-transparent to-transparent'
        }`}></div>
      </div>
    </motion.div>
  )
}

const Teams: React.FC = () => {
  const leaders = getLeaders()
  const teamMembers = getTeamMembers()

  return (
    <div className="min-h-screen">
      {/* Hero Section - Compelling Opening */}
      {/* <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h1 className="text-7xl md:text-8xl font-extralight text-[#021400] mb-8 leading-none">
              Meet the
              <br />
              <span className="font-light bg-gradient-to-r from-[#021400] to-green-600 bg-clip-text text-transparent">Minds</span>
              <br />
              <span className="text-5xl md:text-6xl font-extralight">Behind Innovation</span>
            </h1>
            <p className="text-xl text-[#021400]/80 max-w-4xl mx-auto leading-relaxed mb-8">
              Our diverse team of world-class experts combines decades of experience in geospatial technology, 
              data science, and cutting-edge AI to deliver solutions that transform how organizations understand their world.
            </p> */}
            
            {/* Trust Indicators */}
            {/* <div className="flex justify-center items-center space-x-8 text-sm text-[#021400]/60 mb-12">
              <div className="flex items-center space-x-2">
                <span>100+ Projects Delivered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>15+ Years Combined Experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Global Client Base</span>
              </div>
            </div> */}
          {/* </motion.div>
        </div>
      </section> */}

      {/* Leaders Section - White Background */}
      <section className="forest-bg py-32 px-6 h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-extralight  mb-6 leading-none">
              Our
              <br />
              <span className="font-light">Leadership</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Visionary leaders with proven track records in scaling geospatial technology companies and delivering enterprise solutions.
            </p>
          </motion.div>

          {/* Leaders Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {leaders.map((leader) => (
              <TeamCard key={leader.id} member={leader} isLeader={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section - White Background */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-extralight text-[#021400] mb-6 leading-none">
              Our
              <br />
              <span className="font-light">Team</span>
            </h2>
            <p className="text-lg text-[#021400]/70 max-w-3xl mx-auto mb-8">
              A carefully assembled team of specialists who've worked with Fortune 500 companies and cutting-edge startups.
            </p>
            
            {/* Team Stats */}

          </motion.div>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TeamCard member={member} isLeader={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section - Dark Background */}
      <section className="bg-[#021400] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-5xl md:text-6xl font-extralight text-white mb-6 leading-tight">
              Ready to Work With
              <br />
              <span className="font-light bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                Our Expert Team?
              </span>
            </h3>
            <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your geospatial challenges into competitive advantages. Our team delivers 
              enterprise-grade solutions that scale with your business needs.
            </p>
          </motion.div>


          {/* Main CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#021400] rounded-lg font-medium transition-all duration-300 hover:bg-gray-100 shadow-lg hover:shadow-xl"
              >
                Start Your Project
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              
              <motion.a
                href="mailto:hello@geokits.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-medium transition-all duration-300 hover:bg-white hover:text-[#021400]"
              >
                Get in Touch
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.a>
            </div>

            {/* Trust Badge */}

          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Teams
