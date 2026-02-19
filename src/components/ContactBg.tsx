"use client";

import PrismaticBurst from "./ReactBits/PrismaticBurst";

export const ContactBg = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <div className="w-full h-full">
                <PrismaticBurst
                    animationType="rotate3d"
                    intensity={2}
                    speed={0.5}
                    distort={0}
                    paused={false}
                    offset={{ x: -500, y: 0 }}
                    hoverDampness={0.25}
                    rayCount={0}
                    mixBlendMode="lighten"
                    colors={['#029900', '#050a1e', '#2478ed', '#1aba3f']}
                />
            </div>
        </div>
    )
}
