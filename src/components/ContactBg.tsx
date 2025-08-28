import PrismaticBurst from "./ReactBits/PrismaticBurst";

export const ContactBg = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <div className="w-full h-full">
                <PrismaticBurst
                    animationType="rotate3d"
                    intensity={1.5}
                    speed={0.3}
                    distort={2.0}
                    paused={false}
                    offset={{ x: 0, y: 0 }}
                    hoverDampness={0.25}
                    rayCount={16}
                    mixBlendMode="lighten"
                    colors={['#021400', '#054d1e', '#ffffff', '#32de84']}
                />
            </div>
        </div>
    )
}