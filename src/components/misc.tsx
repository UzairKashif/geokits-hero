"use client"

import { useState, useEffect, useRef } from "react"

export default function CompanyDescriptionSection() {
  const [currentText, setCurrentText] = useState("")
  const [isSection2Active, setIsSection2Active] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [scrollLocked, setScrollLocked] = useState(false)
  const [sequenceComplete, setSequenceComplete] = useState(false)

  const section2Ref = useRef<HTMLDivElement>(null)
  const scrollAccumulator = useRef(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const savedScrollPosition = useRef(0)

  const texts = ["","learn", "understand", "deliver"]
  const SCROLL_THRESHOLD = 100

  // Complete cleanup function
  const completeCleanup = () => {
    // Remove all event listeners
    window.removeEventListener("wheel", handleWheel)
    window.removeEventListener("keydown", handleKeyDown)

    // Disconnect observer
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // Reset all states
    setIsSection2Active(false)
    setScrollLocked(false)
    setSequenceComplete(true)

    // Simply restore overflow without touching position or scroll
    document.body.style.overflow = ""

    // Reset scroll accumulator
    scrollAccumulator.current = 0
  }

  // Wheel event handler
  const handleWheel = (e: WheelEvent) => {
    if (!isSection2Active || sequenceComplete) return

    e.preventDefault()
    e.stopPropagation()

    scrollAccumulator.current += Math.abs(e.deltaY)

    if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
      scrollAccumulator.current = 0

      if (textIndex < texts.length - 1) {
        const newIndex = textIndex + 1
        setTextIndex(newIndex)
        setCurrentText(texts[newIndex])
      } else {
        // Sequence complete - full cleanup
        setTimeout(() => {
          completeCleanup()
        }, 1) // Small delay to show final text
      }
    }
  }

  // Keyboard event handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isSection2Active || sequenceComplete) return

    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Space"].includes(e.key)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  useEffect(() => {
    const section2Element = section2Ref.current
    if (!section2Element || sequenceComplete) return

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.7 && !sequenceComplete) {
          setIsSection2Active(true)
          setScrollLocked(true)
          document.body.style.overflow = "hidden"
        }
      },
      {
        threshold: [0.9],
        rootMargin: "0px",
      },
    )

    observerRef.current.observe(section2Element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [sequenceComplete])

  useEffect(() => {
    if (!isSection2Active || sequenceComplete) return

    // Add event listeners with passive: false for wheel
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true })
    window.addEventListener("keydown", handleKeyDown, { passive: false, capture: true })

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true })
      window.removeEventListener("keydown", handleKeyDown, { capture: true })
    }
  }, [isSection2Active, textIndex, sequenceComplete])



  return (
    <div className="relative">
      {/* Status indicator */}
      {/* {sequenceComplete && (
        <div className="fixed top-4 left-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Sequence Complete - Normal scrolling restored
        </div>
      )} */}

     
      <section
        ref={section2Ref}
        className="h-screen w-full bg-black flex items-center justify-center relative"
      >
        <div className="text-center text-white">
          <h2 className="text-5xl md:text-8xl font-bold mb-8 transition-all duration-500 ease-in-out transform">
           At Geokits, we <span className="text-[#32de84]">{currentText}</span>
          </h2>
          {/* {!sequenceComplete ? (
            <>
              <p className="text-lg md:text-xl opacity-80 mb-4">
                Scroll to change text ({textIndex + 1}/{texts.length})
              </p>
              {isSection2Active && (
                <div className="text-sm opacity-60">Scroll locked - Use mouse wheel to change text</div>
              )}
            </>
          ) : (
            <p className="text-lg md:text-2xl opacity-80 mb-4">Sequence complete! Normal scrolling restored.</p>
          )} */}
        </div>

        {/* Progress indicator */}
        {/* {!sequenceComplete && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {texts.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= textIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        )} */}
      </section>

      {/* Section 3 */}
     
    </div>
  )
}
