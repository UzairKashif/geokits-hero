'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CardNav from "@/components/ReactBits/CardNav"


const logo = ()=>{
  <Image
  src="/eng-trans-black.png"
  alt="Geokits Logo"
  width={120}
  height={40}
  className="h-8 w-auto filter invert"
  priority
  />
  }


export const Header=()=>{
   const items = [

    {

      label: "About",

      bgColor: "#0D0716",

      textColor: "#fff",

      links: [

        { label: "Company", ariaLabel: "About Company" },

        { label: "Careers", ariaLabel: "About Careers" }

      ]

    },

    {

      label: "Projects", 

      bgColor: "#170D27",

      textColor: "#fff",

      links: [

        { label: "Featured", ariaLabel: "Featured Projects" },

        { label: "Case Studies", ariaLabel: "Project Case Studies" }

      ]

    },

    {

      label: "Contact",

      bgColor: "#271E37", 

      textColor: "#fff",

      links: [

        { label: "Email", ariaLabel: "Email us" },

        { label: "Twitter", ariaLabel: "Twitter" },

        { label: "LinkedIn", ariaLabel: "LinkedIn" }

      ]

    }

  ];


  return (

    <CardNav

      logo={logo}

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

