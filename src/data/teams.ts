export interface TeamMember {
  id: number
  name: string
  role: string
  description: string
  imageUrl: string
  linkedIn?: string
  email?: string
  category: 'leader' | 'team'
}

export const teamMembers: TeamMember[] = [
  // Leaders
  {
    id: 1,
    name: "Jeffery Epstein",
    role: "Founder & CEO",
    description: "Visionary leader with 15+ years in GIS and geospatial technologies. Leading innovation in spatial intelligence solutions.",
    imageUrl: "/team/epstein.jpg",
    linkedIn: "https://linkedin.com/in/johnsmith",
    email: "john@geokits.com",
    category: "leader"
  },
  {
    id: 2,
    name: "Lana Del Rey",
    role: "CTO & Co-Founder",
    description: "Technical architect specializing in large-scale geospatial systems and data infrastructure solutions.",
    imageUrl: "/team/ldr.jpeg",
    linkedIn: "https://linkedin.com/in/sarahjohnson",
    email: "sarah@geokits.com",
    category: "leader"
  },
  
  // Team Members
  {
    id: 3,
    name: "Charles White",
    role: "Senior GIS Developer",
    description: "Expert in web mapping applications and spatial data visualization with focus on performance optimization.",
    imageUrl: "/team/charlie.jpeg",
    linkedIn: "https://linkedin.com/in/michaelchen",
    category: "team"
  },
  {
    id: 4,
    name: "Idubbbz",
    role: "Geospatial Analyst",
    description: "Specialized in remote sensing, environmental monitoring, and predictive modeling for climate solutions.",
    imageUrl: "/team/idubz.webp",
    linkedIn: "https://linkedin.com/in/emilyrodriguez",
    category: "team"
  },
  {
    id: 5,
    name: "Max MoeFoe",
    role: "Full Stack Developer",
    description: "Building scalable web applications and API integrations for geospatial data processing pipelines.",
    imageUrl: "/team/max.jpeg",
    linkedIn: "https://linkedin.com/in/davidpark",
    category: "team"
  },
  {
    id: 6,
    name: "Filthy Frank",
    role: "UI/UX Designer",
    description: "Creating intuitive interfaces for complex geospatial tools and data visualization platforms.",
    imageUrl: "/team/frank.webp",
    linkedIn: "https://linkedin.com/in/lisathompson",
    category: "team"
  },
  {
    id: 7,
    name: "Arslan Tariq",
    role: "Data Scientist",
    description: "Machine learning and AI applications for spatial pattern recognition and predictive analytics.",
    imageUrl: "/team/ars.jpeg",
    linkedIn: "https://linkedin.com/in/jameswilson",
    category: "team"
  },
  {
    id: 8,
    name: "TwoMad",
    role: "Project Manager",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twoma.jpg",
    linkedIn: "https://linkedin.com/in/annamartinez",
    category: "team"
  }
]

export const getLeaders = () => teamMembers.filter(member => member.category === 'leader')
export const getTeamMembers = () => teamMembers.filter(member => member.category === 'team')
