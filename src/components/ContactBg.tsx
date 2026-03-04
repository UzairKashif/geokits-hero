"use client";

import ColorBends from "./color-bends";

export const ContactBg = () => {
  return (
    <div className="absolute inset-0 h-full w-full">
      <ColorBends
        colors={["#ff0000", "#0000ff", "#00ff00"]}
        rotation={0}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        parallax={0.5}
        noise={0.1}
        transparent
        autoRotate={0}
        color=""
      />
    </div>
  );
};
