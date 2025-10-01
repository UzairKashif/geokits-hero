'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation'
import CardNav from "@/components/ReactBits/CardNav"

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`)
      return
    }
    
    // If we're on the home page, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const items = [
    {
      label: "About",
      bgColor: "#021400",
      textColor: "#fff",
      links: [
        { 
          label: "Home", 
          ariaLabel: "Go to Home",
          href: "/",
        },
        { 
          label: "Company", 
          ariaLabel: "About Company",
          href: "/#about",
          onClick: () => scrollToSection('about')
        },
        { 
          label: "Our Team", 
          ariaLabel: "Meet Our Team",
          href: "/teams"
        },
        { 
          label: "Our Process", 
          ariaLabel: "Our Process",
          href: "/#timeline",
          onClick: () => scrollToSection('timeline')
        }
      ]
    },
    {
      label: "Services", 
      bgColor: "#032800",
      textColor: "#fff",
      links: [
        { 
          label: "Solutions", 
          ariaLabel: "Our Solutions",
          href: "/#solutions",
          onClick: () => scrollToSection('solutions')
        },
        { 
          label: "Services", 
          ariaLabel: "Our Services",
          href: "/#services",
          onClick: () => scrollToSection('services')
        }
      ]
    },
    {
      label: "Contact",
      bgColor: "#053C00", 
      textColor: "#fff",
      links: [
        { 
          label: "Get in Touch", 
          ariaLabel: "Contact Us",
          href: "/contact"
        },
        { 
          label: "Blog", 
          ariaLabel: "Our Blog",
          href: "/blog"
        },
        { 
          label: "Email", 
          ariaLabel: "Email us",
          href: "mailto:contact@geokits.com"
        }
      ]
    }
  ];

  return (
    <CardNav
      logo="/img/eng-trans.png"
      logoAlt="GeoKits - Advanced GIS Solutions"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
}

export default Header;