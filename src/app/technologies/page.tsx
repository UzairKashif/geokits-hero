'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface Technology {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

const technologies: Technology[] = [
  {
    name: "ArcGIS Pro",
    category: "Desktop GIS",
    description: "Advanced desktop GIS application for professional mapping and spatial analysis",
    imageUrl: "/rar/Png/ArcGISPro.png"
  },
  {
    name: "ArcGIS Enterprise",
    category: "Enterprise GIS",
    description: "Complete platform for enterprise GIS deployment and collaboration",
    imageUrl: "/rar/Png/Arcgis Enterperise.png"
  },
  {
    name: "QGIS",
    category: "Open Source GIS",
    description: "Free and open-source geographic information system for all your mapping needs",
    imageUrl: "/rar/Png/Qgis.png"
  },
  {
    name: "Google Earth Engine",
    category: "Cloud Computing",
    description: "Planetary-scale platform for environmental data & analysis in the cloud",
    imageUrl: "/rar/Png/Google Earth Engine.png"
  },
  {
    name: "Google Earth",
    category: "Visualization",
    description: "Explore satellite imagery and 3D terrain of the entire globe",
    imageUrl: "/rar/Png/Google Earth.png"
  },
  {
    name: "PostGIS",
    category: "Spatial Database",
    description: "Spatial database extender for PostgreSQL object-relational database",
    imageUrl: "/rar/Png/postgis-logo_trans.png"
  },
  {
    name: "GeoServer",
    category: "Web Services",
    description: "Open source server for sharing geospatial data using open standards",
    imageUrl: "/rar/Png/geoserver-logo.png"
  },
  {
    name: "MapServer",
    category: "Web Mapping",
    description: "Open source platform for publishing spatial data and interactive mapping",
    imageUrl: "/rar/Png/mapserver.png"
  },
  {
    name: "GDAL",
    category: "Data Processing",
    description: "Geospatial Data Abstraction Library for raster and vector geospatial data formats",
    imageUrl: "/rar/Png/Gdal.png"
  },
  {
    name: "GRASS GIS",
    category: "Open Source GIS",
    description: "Geographic Resources Analysis Support System for geospatial data management",
    imageUrl: "/rar/Png/Grassgis.png"
  },
  {
    name: "PIX4D",
    category: "Photogrammetry",
    description: "Professional drone mapping and photogrammetry software suite",
    imageUrl: "/rar/Png/PIX4D.png"
  },
  {
    name: "ENVI",
    category: "Remote Sensing",
    description: "Advanced image analysis software for processing and analyzing geospatial imagery",
    imageUrl: "/rar/Png/envi_logo_v2.png"
  },
  {
    name: "Oracle Spatial",
    category: "Enterprise Database",
    description: "Enterprise spatial database technology for location intelligence",
    imageUrl: "/rar/Png/oracle-logo-orange.png"
  },
  {
    name: "Cesium",
    category: "3D Visualization",
    description: "Open platform for 3D geospatial visualization and virtual globe applications",
    imageUrl: "/rar/Png/cesium.png"
  }
];

const categories = ["All", "Desktop GIS", "Open Source GIS", "Enterprise GIS", "Cloud Computing", "Spatial Database", "Web Services", "Web Mapping", "Data Processing", "Photogrammetry", "Remote Sensing", "Enterprise Database", "3D Visualization", "Visualization"];

export default function TechnologiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTechnologies = selectedCategory === "All" 
    ? technologies 
    : technologies.filter(tech => tech.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-5xl md:text-7xl font-extralight text-[#021400] mb-8 leading-none">
              <span className="font-light">Tools & Technologies</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Cutting-edge tools and platforms that power our geospatial solutions and drive innovation in GIS technology
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#021400] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Technologies Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTechnologies.map((tech, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              {/* Image Container */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background pattern */}
                <div 
                  className="absolute inset-0 opacity-5 hover:opacity-10 transition-opacity duration-500"
                  style={{
                    backgroundImage: 'url(/img/wave.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'contrast(1.2) brightness(0.8)',
                    mixBlendMode: 'multiply'
                  }}
                ></div>
                
                <img
                  src={tech.imageUrl}
                  alt={tech.name}
                  className="w-full h-full object-contain hover:filter hover:brightness-110 transition-all duration-300 relative z-10"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3 bg-[#021400] text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tech.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#021400] mb-2 group-hover:text-gray-700 transition-colors duration-300">
                  {tech.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tech.description}
                </p>
                
                {/* Accent line */}
                <div className="mt-4 w-full h-1 bg-gradient-to-r from-[#021400] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-lg">
            Showing {filteredTechnologies.length} of {technologies.length} technologies
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-light text-[#021400] mb-6">
            Ready to leverage these technologies?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our expert team can help you choose and implement the right technology stack for your geospatial projects
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-[#021400] text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
