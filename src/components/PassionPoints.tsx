"use client"

import {useState, useRef, useEffect} from 'react'


export default function PassionPoints(){
    const divRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)


    useEffect(()=>{
        const divObserver = new IntersectionObserver((entries)=>{
            const entry = entries[0];
            const rect = entry.boundingClientRect;
            const windowPort = window.innerHeight;
            const isFullyVisible = rect.top < windowPort+10 && rect.bottom > -10;
            setIsVisible(isFullyVisible);
        })
    })



    return(
        <div ref={divRef} className='h-screen w-screen'>

        </div>
    )
}