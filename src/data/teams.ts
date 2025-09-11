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
    name: "Sarah Johnson",
    role: "CTO & Co-Founder",
    description: "Technical architect specializing in large-scale geospatial systems and data infrastructure solutions.",
    imageUrl: "/img/team/leader2.jpg",
    linkedIn: "https://linkedin.com/in/sarahjohnson",
    email: "sarah@geokits.com",
    category: "leader"
  },
  
  // Team Members
  {
    id: 3,
    name: "Michael Chen",
    role: "Senior GIS Developer",
    description: "Expert in web mapping applications and spatial data visualization with focus on performance optimization.",
    imageUrl: "/img/team/member1.jpg",
    linkedIn: "https://linkedin.com/in/michaelchen",
    category: "team"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Geospatial Analyst",
    description: "Specialized in remote sensing, environmental monitoring, and predictive modeling for climate solutions.",
    imageUrl: "/img/team/member2.jpg",
    linkedIn: "https://linkedin.com/in/emilyrodriguez",
    category: "team"
  },
  {
    id: 5,
    name: "David Park",
    role: "Full Stack Developer",
    description: "Building scalable web applications and API integrations for geospatial data processing pipelines.",
    imageUrl: "/img/team/member3.jpg",
    linkedIn: "https://linkedin.com/in/davidpark",
    category: "team"
  },
  {
    id: 6,
    name: "Lisa Thompson",
    role: "UI/UX Designer",
    description: "Creating intuitive interfaces for complex geospatial tools and data visualization platforms.",
    imageUrl: "/img/team/member4.jpg",
    linkedIn: "https://linkedin.com/in/lisathompson",
    category: "team"
  },
  {
    id: 7,
    name: "James Wilson",
    role: "Data Scientist",
    description: "Machine learning and AI applications for spatial pattern recognition and predictive analytics.",
    imageUrl: "/img/team/member5.jpg",
    linkedIn: "https://linkedin.com/in/jameswilson",
    category: "team"
  },
  {
    id: 8,
    name: "Anna Martinez",
    role: "Project Manager",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/img/team/member6.jpg",
    linkedIn: "https://linkedin.com/in/annamartinez",
    category: "team"
  }
]

export const getLeaders = () => teamMembers.filter(member => member.category === 'leader')
export const getTeamMembers = () => teamMembers.filter(member => member.category === 'team')
