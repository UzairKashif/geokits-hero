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
                                        className={`group cursor-pointer transition-all duration-300 p-4 -m-4 rounded-lg ${
                                            activeService === index 
                                                ? 'bg-gray-100 border-l-4 border-[#021400]' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onMouseEnter={() => handleServiceInteraction(index, service.imageUrl)}
                                        onMouseLeave={() => setImgUrl(Services[activeService].imageUrl)}
                                        onClick={() => handleServiceInteraction(index, service.imageUrl)}
                                        onTouchStart={() => handleServiceInteraction(index, service.imageUrl)}
                                    >
                                        <div className="mb-2">
                                            <span className="text-sm font-light text-gray-600 tracking-wide">
                                                {String(index + 1).padStart(2, "0")} / {String(Services.length).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className={`text-2xl md:text-3xl font-light mb-3 leading-tight tracking-tight transition-colors duration-300 ${
                                            activeService === index 
                                                ? 'text-[#032200]' 
                                                : 'text-[#021400] group-hover:text-[#032200]'
                                        }`}>
                                            {service.serviceName}
                                        </h3>

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