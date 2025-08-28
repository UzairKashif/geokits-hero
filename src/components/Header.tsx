'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CardNav from "@/components/ReactBits/CardNav"

const Header = () => {
   const scrollToSection = (sectionId: string) => {
     const element = document.getElementById(sectionId);
     if (element) {
       element.scrollIntoView({ behavior: 'smooth' });
     }
   };

   const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { 
          label: "Company", 
          ariaLabel: "About Company",
          href: "/#about",
          onClick: () => scrollToSection('about')
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
      bgColor: "#170D27",
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
      bgColor: "#271E37", 
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
          href: "/#blog",
          onClick: () => scrollToSection('blog')
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
      logoAlt="Company Logo"
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