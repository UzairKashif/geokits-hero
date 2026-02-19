"use client";

import PixelBlast from './ReactBits/PixelBlast';
export const PixelBg = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <div style={{ width: '100%', height: '600px', position: 'relative' }}>
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#217543"
                    patternScale={3.25}
                    patternDensity={0.05}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.5}
                    edgeFade={0.25}
                    transparent
                />
            </div>
        </div>
    )
}


