'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getLeaders, getTechTeamMembers, getOperationsTeamMembers, TeamMember } from '@/data/teams'
import Footer from '@/components/Footer'

const TeamCard: React.FC<{ member: TeamMember; isLeader?: boolean }> = ({ member, isLeader = false }) => {
  const [showFallback, setShowFallback] = React.useState(!member.imageUrl)

  // Generate initials for fallback
  const initials = member.name.split(' ').map(n => n[0]).join('')

  const handleImageError = () => {
    setShowFallback(true)
  }

  const handleImageLoad = () => {
    setShowFallback(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative w-64 mx-auto"
    >
      {/* Glass morphism card - Square aspect ratio */}
      <div className={`relative overflow-hidden transition-all duration-500 h-80 ${
        isLeader 
          ? 'bg-white/80 ' 
          : 'bg-white/10 '
      }`}>
        
        {/* Profile Image - 75% of card height */}
        <div className="relative overflow-hidden h-[75%]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10"></div>
          
          {/* Image - only render if we have a URL */}
          {member.imageUrl && (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                showFallback ? 'hidden' : 'block'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
          
          {/* Fallback - show when no image URL or image fails to load */}
          {showFallback && (
            <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${
              isLeader ? 'from-[#021400]/20 to-[#021400]/40' : 'from-[#021400]/40 to-[#021400]/60'
            } flex items-center justify-center`}>
              <span className={`${
                isLeader ? 'text-[#021400]/80' : 'text-white/80'
              } text-4xl font-light`}>
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Content - 25% of card height */}
        <div className="h-[25%] pt-5 flex flex-col justify-center items-start text-left relative">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-[#021400] mb-0.5 leading-tight tracking-tight">
              {member.name}
            </h3>
            
            <p className="text-xs font-normal text-[#021400]/70 leading-tight">
              {member.role}
            </p>
          </div>
          
          {/* Always visible arrow at top right - 45 degree angle */}
          <motion.a
            href={member.linkedIn}
            target={member.linkedIn ? "_blank" : "_self"}
            rel={member.linkedIn ? "noopener noreferrer" : undefined}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 text-[#021400]/60 hover:text-[#021400] transition-colors duration-300"
          >
            <svg 
              className="w-8 h-8 transform translate-x-2 rotate-315" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </motion.a>
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
  const techTeamMembers = getTechTeamMembers()
  const operationsTeamMembers = getOperationsTeamMembers()

  return (
    <div className="min-h-screen">
      {/* Leaders Section - Light Mode */}
      <section className="bg-white py-20 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-light text-[#021400] mb-4 leading-tight tracking-tight">
              Our Leadership
            </h2>
            <p className="text-base text-[#021400]/70 max-w-2xl mx-auto leading-relaxed">
              Visionary leaders with proven track records in scaling geospatial technology companies and delivering enterprise solutions.
            </p>
          </motion.div>

          {/* Leaders Grid - Custom layout for 4 cards */}
          <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
            {/* First row - 1 card centered
            {leaders.length > 0 && (
              <div className="flex justify-center">
                <TeamCard key={leaders[0].id} member={leaders[0]} isLeader={true} />
              </div>
            )} */}

           <div className="flex flex-wrap justify-center gap-6">
              {leaders.slice(0, 2).map((leader) => (
                <TeamCard key={leader.id} member={leader} isLeader={true} />
              ))}
            </div>
            {/* Second row - 3 cards */}
            <div className="flex flex-wrap justify-center gap-6">
              {leaders.slice(2, 4).map((leader) => (
                <TeamCard key={leader.id} member={leader} isLeader={true} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Tech and Operations Subsections */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Team Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-light text-[#021400] mb-4 leading-tight tracking-tight">
              Our Team
            </h2>
            <p className="text-base text-[#021400]/70 max-w-2xl mx-auto leading-relaxed mb-8">
              A carefully assembled team of specialists driving innovation across technology and operations.
            </p>
          </motion.div>

          {/* Tech Team Subsection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-light text-[#021400] mb-3 leading-tight tracking-tight">
                Tech Team
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center max-w-6xl mx-auto">
              {techTeamMembers.map((member: TeamMember, index: number) => (
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
          </motion.div>

          {/* Operations Team Subsection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-light text-[#021400] mb-3 leading-tight tracking-tight">
                Operations Team
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center max-w-6xl mx-auto">
              {operationsTeamMembers.map((member: TeamMember, index: number) => (
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
          </motion.div>
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
            <h3 className="text-5xl md:text-6xl font-light text-white mb-4 leading-tight tracking-tight">
              Ready to Work With Our Expert Team?
            </h3>
            <p className="text-base text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
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
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#021400] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-100 shadow-lg hover:shadow-xl"
              >
                Start Your Project
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              
              <motion.a
                href="mailto:contact@geokits.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white hover:text-[#021400]"
              >
                Get in Touch
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>  
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Teams;