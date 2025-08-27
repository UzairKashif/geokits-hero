'use client'

import { useState, useEffect } from 'react';
import { Services, ServicesUnit } from '@/data/services';

export const ServicesSection = () => {
    const [imgUrl, setImgUrl] = useState<string>(Services[0].imageUrl);
    const [activeService, setActiveService] = useState<number>(0);

    const handleServiceInteraction = (index: number, imageUrl: string) => {
        setImgUrl(imageUrl);
        setActiveService(index);
    };

    return (
        <div className="bg-white min-h-screen w-full">
            {/* Header Section */}
            <div className="pt-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="mb-6">

                        </div>
                        <h2 className="text-6xl md:text-7xl font-extralight text-[#021400] mb-8 leading-none">
                            Our
                            <br />
                            <span className="font-light">Services</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 min-h-[70vh]">
                    {/* Services List */}
                    <div className="flex flex-col justify-center">
                        <div className="max-w-xl">
                            <ul className="space-y-8">
                                {Services.map((service: ServicesUnit, index: number) => (
                                    <li 
                                        key={index} 
                                        className={`group cursor-pointer transition-all duration-500 ease-in-out p-6 -m-4 rounded-xl relative overflow-hidden ${
                                            activeService === index 
                                                ? 'bg-gradient-to-r from-gray-50 via-gray-100 to-white border-l-4 border-gray-800 shadow-2xl transform scale-105' 
                                                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:via-gray-100 hover:to-white hover:shadow-xl hover:transform hover:scale-102'
                                        }`}
                                        onMouseEnter={() => handleServiceInteraction(index, service.imageUrl)}
                                        onMouseLeave={() => setImgUrl(Services[activeService].imageUrl)}
                                        onClick={() => handleServiceInteraction(index, service.imageUrl)}
                                        onTouchStart={() => handleServiceInteraction(index, service.imageUrl)}
                                    >
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                                        
                                        {/* Wave animation overlay */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-15 transition-all duration-700 ease-out transform translate-x-full group-hover:translate-x-0 group-hover:animate-pulse"
                                                style={{
                                                    backgroundImage: 'url(/img/wave.png)',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    filter: 'contrast(1.5) brightness(0.7)',
                                                    mixBlendMode: 'multiply'
                                                }}
                                            ></div>
                                            {/* Secondary wave for more dynamic effect */}
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-8 transition-all duration-1000 ease-out transform translate-x-full group-hover:translate-x-0 delay-200"
                                                style={{
                                                    backgroundImage: 'url(/img/wave.png)',
                                                    backgroundSize: '120%',
                                                    backgroundPosition: 'center',
                                                    filter: 'contrast(1.2) brightness(0.8)',
                                                    mixBlendMode: 'multiply'
                                                }}
                                            ></div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="mb-2">
                                                <span className={`text-sm font-light tracking-wide transition-colors duration-300 ${
                                                    activeService === index 
                                                        ? 'text-gray-600' 
                                                        : 'text-gray-500 group-hover:text-gray-600'
                                                }`}>
                                                    {String(index + 1).padStart(2, "0")} / {String(Services.length).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <h3 className={`text-2xl md:text-3xl font-light mb-3 leading-tight tracking-tight transition-all duration-300 ${
                                                activeService === index 
                                                    ? 'text-gray-900 transform translate-x-2' 
                                                    : 'text-[#021400] group-hover:text-gray-900 group-hover:transform group-hover:translate-x-2'
                                            }`}>
                                                {service.serviceName}
                                            </h3>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Services Images */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-2xl">
                            <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                                {imgUrl && (
                                    <img
                                        src={imgUrl}
                                        alt="Service"
                                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}