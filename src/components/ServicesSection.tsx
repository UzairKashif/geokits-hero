'use client'

import { useState, useEffect, useRef } from 'react';
import { Services, ServicesUnit } from '@/data/services';
import SpotlightCard from './SpotlightCard';

export const ServicesSection = () => {
    const [imgUrl, setImgUrl] = useState<string>(Services[0].imageUrl);
    const [activeService, setActiveService] = useState<number>(0);
    const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);



    // Smart preloading when section comes into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Preload all service images when section is visible
                        Services.forEach((service) => {
                            if (!imageLoaded[service.imageUrl]) {
                                const img = new window.Image();
                                img.onload = () => {
                                    setImageLoaded(prev => ({ ...prev, [service.imageUrl]: true }));
                                };
                                img.src = service.imageUrl;
                            }
                        });
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [imageLoaded]);

    const handleServiceInteraction = (index: number, imageUrl: string) => {
        if (imageUrl === imgUrl) return;

        setIsTransitioning(true);
        
        // Smooth transition
        if (imageRef.current) {
            imageRef.current.style.opacity = '0.5';
        }

        setTimeout(() => {
            setImgUrl(imageUrl);
            setActiveService(index);
            
            setTimeout(() => {
                if (imageRef.current) {
                    imageRef.current.style.opacity = '1';
                }
                setIsTransitioning(false);
            }, 50);
        }, 150);
    };

    return (
        <div ref={sectionRef} className="bg-white min-h-screen w-full">
            

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
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 min-h-[50vh] lg:min-h-[70vh]">
                    {/* Services List */}
                    <div className="flex flex-col justify-center">
                        <div className="max-w-xl">
                            <ul className="space-y-4 lg:space-y-8">
                                {Services.map((service: ServicesUnit, index: number) => (
                                    <li key={index}>
                                        <SpotlightCard
                                            className={`service-item cursor-pointer transition-all duration-300 ${
                                                activeService === index ? 'active' : ''
                                            }`}
                                            spotlightColor="rgba(255, 255, 255, 0.15)"
                                            spotlightSize={400}
                                        >
                                            <div 
                                                className="relative z-10 p-3 lg:p-4"
                                                onMouseEnter={() => handleServiceInteraction(index, service.imageUrl)}
                                                onMouseLeave={() => setImgUrl(Services[activeService].imageUrl)}
                                                onClick={() => handleServiceInteraction(index, service.imageUrl)}
                                                onTouchStart={() => handleServiceInteraction(index, service.imageUrl)}
                                            >
                                                <h3 className={`service-title text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light leading-tight tracking-tight transition-all duration-300 ${
                                                    activeService === index 
                                                        ? 'text-white' 
                                                        : 'text-gray-400'
                                                }`}>
                                                    {service.serviceName}
                                                </h3>
                                            </div>
                                        </SpotlightCard>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Services Images */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-2xl">
                            <div className="aspect-[4/3] bg-gray-200 overflow-hidden rounded-lg relative">
                                <img
                                    ref={imageRef}
                                    src={imgUrl}
                                    alt="Service"
                                    className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                                    style={{ 
                                        opacity: isTransitioning ? 0.5 : 1,
                                        transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out'
                                    }}
                                />
                                
                                {/* Subtle transition overlay */}
                                {isTransitioning && (
                                    <div className="absolute inset-0 bg-gray-200/20 transition-opacity duration-300"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}