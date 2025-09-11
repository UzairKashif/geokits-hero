export interface TeamMember {
  id: number
  name: string
  role: string
  description: string
  imageUrl: string
  linkedIn?: string
  
  category: 'leader' | 'team'
  team?: 'tech' | 'operations'
}

export const teamMembers: TeamMember[] = [
  // Leaders
  {
    id: 1,
    name: "Uzair Kashif",
    role: "Founder & CEO, GIS Engineer",
    description: "Visionary leader with 3+  years in GIS and geospatial technologies. Leading innovation in spatial intelligence solutions.",
    imageUrl: "/team/uzair.png",
    linkedIn: "https://www.linkedin.com/in/uzairkashif/",
    
    category: "leader"
  },
  {
    id: 2,
    name: "Amir Liaquat Baig",
    role: "GIS Analyst",
    description: "Technical architect specializing in large-scale geospatial systems and data infrastructure solutions.",
    imageUrl: "/team/ld.jpeg",
    
    category: "leader"
  },
    {
    id: 10,
    name: "Mirza Imran Baig",
    role: "Director Operations",
    description: "Visionary leader with 3+  years in GIS and geospatial technologies. Leading innovation in spatial intelligence solutions.",
    imageUrl: "/team/uzir.png",
    
    category: "leader"
  },
  {
    id: 11,
    name: "Kashif Khalil",
    role: "Managing Director",
    description: "Technical architect specializing in large-scale geospatial systems and data infrastructure solutions.",
    imageUrl: "/team/lr.jpeg",
    
    category: "leader"
  },
  // Team Members
  {
    id: 3,
    name: "Muhammad Omer Tarar",
    role: "HR Manager",
    description: "Expert in web mapping applications and spatial data visualization with focus on performance optimization.",
    imageUrl: "/team/char.jpeg",
    category: "team",
    team: "operations"
  },
  {
    id: 4,
    name: "Talha Waheed",
    role: "GIS + Backend Developer",
    description: "Specialized in remote sensing, environmental monitoring, and predictive modeling for climate solutions.",
    imageUrl: "/team/y.webp",
    category: "team",
    team: "tech"
  },
  {
    id: 5,
    name: "Arslan Tariq",
    role: "FUll-Stack + AI Engineer",
    description: "Building scalable web applications and API integrations for geospatial data processing pipelines.",
    imageUrl: "/team/ma.jpeg",
    linkedIn: "https://www.linkedin.com/in/arslan-tariq-5a566a26b/",
    category: "team",
    team: "tech"
  },
  {
    id: 6,
    name: "Kumail Hassan",
    role: "Financial Manager",
    description: "Creating intuitive interfaces for complex geospatial tools and data visualization platforms.",
    imageUrl: "/team/fr.webp",
    category: "team",
    team: "operations"
  },
  {
    id: 7,
    name: "Asawir Fatima",
    role: "UI/UX developer",
    description: "Machine learning and AI applications for spatial pattern recognition and predictive analytics.",
    imageUrl: "/team/ar.jpeg",
    category: "team",
    team: "tech"
  },
  {
    id: 8,
    name: "Rahema Khushbakht",
    role: "GIS Analyst + Content Writer",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 9,
    name: "Tahreem Fatima",
    role: "GIS Engineer",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 12,
    name: "Eman Abrar",
    role: "GIS Engineer",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 13,
    name: "Taha Kashif",
    role: "Data Analyst",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 14,
    name: "Abdullah Sial",
    role: "Public Relations",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "operations"
  },
    {
    id: 15,
    name: "Fasi Ur Rehman",
    role: "Financial Data Analyst",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 16,
    name: "Shameekh Naveed",
    role: "Full-Stack Engineer + SWE",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaw.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 17,
    name: "Arham Atif",
    role: "Health Data Analyst ",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/twomaww.jpg",
    category: "team",
    team: "tech"
  },
    {
    id: 18,
    name: "Suleiman Adil",
    role: "Social Media Manager",
    description: "Coordinating complex GIS projects and ensuring seamless delivery of client solutions.",
    imageUrl: "/team/ko.jpg",
    category: "team",
    team: "operations"
  },

  
]

export const getLeaders = () => teamMembers.filter(member => member.category === 'leader')
export const getTeamMembers = () => teamMembers.filter(member => member.category === 'team')

// Get team members by team type using the team field
export const getTechTeamMembers = () => teamMembers.filter(member => 
  member.category === 'team' && member.team === 'tech'
)

export const getOperationsTeamMembers = () => teamMembers.filter(member => 
  member.category === 'team' && member.team === 'operations'
)
