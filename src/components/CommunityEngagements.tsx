"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CommunityPost {
  id: string;
  type: 'instagram' | 'video' | 'image';
  embedCode?: string;
  url?: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export default function CommunityEngagements() {
  const [isClient, setIsClient] = useState(false);
  const [embedsLoaded, setEmbedsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const embedRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Updated community posts with your new embed codes
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      type: 'instagram',
      embedCode: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DNiah8LIji4/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/DNiah8LIji4/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/DNiah8LIji4/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by geokits (@geokits_)</a></p></div></blockquote>`,
      url: 'https://www.instagram.com/reel/DNiah8LIji4/',
      title: 'Latest GIS Project Showcase',
      description: 'Discover our recent geospatial intelligence work and innovative mapping solutions.'
    },
    {
      id: '2',
      type: 'instagram',
      title: 'Advanced Geospatial Analytics',
      embedCode: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DNGZUqsIb3N/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/DNGZUqsIb3N/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/DNGZUqsIb3N/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by geokits (@geokits_)</a></p></div></blockquote>`,
      description: 'Showcasing cutting-edge geospatial analytics, inference and data visualization techniques.',
      url: 'https://www.instagram.com/reel/DNGZUqsIb3N/',
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize animations with delay after embeds load
  useEffect(() => {
    if (!isClient || !embedsLoaded) return;

    // Add a delay to ensure Instagram embeds are fully rendered
    const timeoutId = setTimeout(() => {
      // Disable ScrollTrigger during setup
      ScrollTrigger.batch(".instagram-media", {
        onEnter: () => {},
        onLeave: () => {},
        onEnterBack: () => {},
        onLeaveBack: () => {}
      });

      const ctx = gsap.context(() => {
        // Create animations with reduced ScrollTrigger sensitivity
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            once: true,
            refreshPriority: -1, // Low priority to avoid conflicts
            invalidateOnRefresh: false,
            fastScrollEnd: true,
            preventOverlaps: true,
            // Disable on touch devices to prevent conflicts
            onUpdate: (self) => {
              // Throttle updates to prevent jitter
              if (self.isActive && Math.abs(self.getVelocity()) > 1000) {
                return;
              }
            }
          },
        });

        // Chain all animations
        mainTl
          .from(titleRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
          })
          .from(
            subtitleRef.current,
            {
              opacity: 0,
              scaleX: 0,
              transformOrigin: "left",
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.3"
          );

        // Grid items animation
        if (gridRef.current) {
          const gridItems = gridRef.current.children;
          mainTl.from(
            gridItems,
            {
              opacity: 0,
              y: 30,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.2"
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }, 1000); // Wait 1 second for embeds to fully load

    return () => clearTimeout(timeoutId);
  }, [isClient, embedsLoaded]);

  // Load Instagram embed script
  useEffect(() => {
    if (!isClient) return;
    
    const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
    if (existingScript) {
      const instgrm = (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm;
      if (instgrm) {
        instgrm.Embeds.process();
        setEmbedsLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        const instgrm = (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm;
        if (instgrm) {
          instgrm.Embeds.process();
          setEmbedsLoaded(true);
        }
      }, 500);
    };
    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[src="//www.instagram.com/embed.js"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, [isClient]);

  if (!isClient) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <section 
      ref={sectionRef} 
      id="community" 
      className="w-full py-40 px-6 bg-white relative"
      style={{
        contain: 'layout style',
        willChange: 'auto',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-left mb-24">
          <div className="mb-6">
            <span 
              ref={subtitleRef}
              className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase"
            >
              Community & Projects
            </span>
          </div>
          <h2 
            ref={titleRef}
            className="text-6xl md:text-7xl font-extralight text-[#021400] mb-8 leading-none"
          >
            Our Work in
            <br />
            <span className="font-light">Action</span>
          </h2>
          <div className="max-w-xl">
            <p className="text-lg text-gray-600 leading-relaxed tracking-wide font-light">
              Follow our journey as we transform communities through innovative GIS solutions, 
              spatial intelligence, and cutting-edge technology implementations.
            </p>
          </div>
        </div>

        {/* Community Grid */}
        <div 
          ref={gridRef}
          className="grid lg:grid-cols-2 gap-24 items-start"
        >
          {/* Instagram Embed - Featured */}
          <div className="lg:col-span-1">
            <div className="group">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#4D5A4C] rounded-full flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                    @geokits_
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light text-[#021400] mb-3 tracking-tight">
                  {communityPosts[0].title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {communityPosts[0].description}
                </p>
              </div>
              
              {/* Instagram Embed Container */}
              <div className="relative">
                <div 
                  ref={(el) => { embedRefs.current[0] = el; }}
                  className="instagram-embed-container relative bg-gray-50/50 backdrop-blur-sm border border-gray-200 hover:border-gray-300 transition-all duration-500 rounded-lg overflow-hidden"
                  style={{ 
                    contain: 'layout style paint',
                    isolation: 'isolate',
                    pointerEvents: 'auto',
                    overscrollBehavior: 'contain',
                    touchAction: 'pan-y pinch-zoom',
                    transform: 'translateZ(0)', // Force hardware acceleration
                  }}
                  onMouseEnter={(e) => {
                    // Disable scroll propagation when hovering over Instagram embed
                    e.currentTarget.style.pointerEvents = 'auto';
                    document.body.style.overflowY = 'hidden';
                  }}
                  onMouseLeave={(e) => {
                    // Re-enable scroll propagation when leaving Instagram embed
                    e.currentTarget.style.pointerEvents = 'auto';
                    document.body.style.overflowY = 'auto';
                  }}
                  onWheel={(e) => {
                    // Prevent scroll conflicts
                    e.stopPropagation();
                    const target = e.currentTarget;
                    const scrollTop = target.scrollTop;
                    const scrollHeight = target.scrollHeight;
                    const height = target.clientHeight;
                    const delta = e.deltaY;

                    // Only allow scrolling within the embed container
                    if ((delta < 0 && scrollTop === 0) || 
                        (delta > 0 && scrollTop + height >= scrollHeight)) {
                      e.preventDefault();
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: communityPosts[0].embedCode || '' }}
                />
              </div>
              
              {/* Footer */}
              <div className="mt-6">
                <a
                  href={communityPosts[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-light text-gray-600 hover:text-[#021400] transition-colors duration-300 group/link"
                >
                  View on Instagram
                  <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Second Instagram Post */}
          <div className="lg:col-span-1">
            <div className="group">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#4D5A4C] rounded-full flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                    @geokits_
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light text-[#021400] mb-3 tracking-tight">
                  {communityPosts[1].title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {communityPosts[1].description}
                </p>
              </div>
              
              {/* Instagram Embed Container */}
              <div className="relative">
                <div 
                  ref={(el) => { embedRefs.current[1] = el; }}
                  className="instagram-embed-container relative bg-gray-50/50 backdrop-blur-sm border border-gray-200 hover:border-gray-300 transition-all duration-500 rounded-lg overflow-hidden"
                  style={{ 
                    contain: 'layout style paint',
                    isolation: 'isolate',
                    pointerEvents: 'auto',
                    overscrollBehavior: 'contain',
                    touchAction: 'pan-y pinch-zoom',
                    transform: 'translateZ(0)', // Force hardware acceleration
                  }}
                  onMouseEnter={(e) => {
                    // Disable scroll propagation when hovering over Instagram embed
                    e.currentTarget.style.pointerEvents = 'auto';
                    document.body.style.overflowY = 'hidden';
                  }}
                  onMouseLeave={(e) => {
                    // Re-enable scroll propagation when leaving Instagram embed
                    e.currentTarget.style.pointerEvents = 'auto';
                    document.body.style.overflowY = 'auto';
                  }}
                  onWheel={(e) => {
                    // Prevent scroll conflicts
                    e.stopPropagation();
                    const target = e.currentTarget;
                    const scrollTop = target.scrollTop;
                    const scrollHeight = target.scrollHeight;
                    const height = target.clientHeight;
                    const delta = e.deltaY;

                    // Only allow scrolling within the embed container
                    if ((delta < 0 && scrollTop === 0) || 
                        (delta > 0 && scrollTop + height >= scrollHeight)) {
                      e.preventDefault();
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: communityPosts[1].embedCode || '' }}
                />
              </div>
              
              {/* Footer */}
              <div className="mt-6">
                <a
                  href={communityPosts[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-light text-gray-600 hover:text-[#021400] transition-colors duration-300 group/link"
                >
                  View on Instagram
                  <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-32">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <span className="text-xs font-light tracking-[0.2em] text-gray-500 uppercase">
                Stay Connected
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-extralight text-[#021400] mb-8 leading-tight">
              Follow Our
              <br />
              <span className="font-light">Journey</span>
            </h3>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
              Stay connected with our latest projects, innovations, and community impact. 
              Join us as we continue to push the boundaries of geospatial technology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a
                href="https://www.instagram.com/geokits_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#021400] text-white hover:bg-gray-800 font-light tracking-wide transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5" />
                Follow @geokits_
                <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/contact"
                className="text-gray-500 hover:text-[#021400] font-light tracking-wide transition-colors duration-300"
              >
                Connect with us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}