"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function CompanyDescriptionSection() {
  // Scroll‑scrubbed pinned section: words change as you scroll; you can't leave until done
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0) // 0..1 through the pinned section
  const [textIndex, setTextIndex] = useState(0)

  const texts = ["analyze", "innovate", "deliver"]

  // Tie progress to scroll position within wrapper (sticky pin for 220vh)
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const total = el.offsetHeight - vh // scrollable span while the section is pinned
        const y = Math.min(Math.max(-rect.top, 0), total)
        const p = total > 0 ? y / total : 0
        setProgress(p)
      })
    }
    const onResize = onScroll
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  // Derive which word to show from progress (stable, no jitter)
  useEffect(() => {
    const idx = Math.min(texts.length - 1, Math.floor(progress * texts.length + 0.0001))
    if (idx !== textIndex) setTextIndex(idx)
  }, [progress])

  return (
    <div ref={wrapperRef} className="relative h-[220vh]">
      <section className="sticky top-0 h-screen w-full forest-bg flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-8 tracking-tight">
            At Geokits, we {" "}
            <span className="inline-block relative align-baseline">
              <span className="relative inline-flex h-[1.2em] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={textIndex}
                    initial={{ y: "60%", opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-60%", opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.34, ease: "easeOut" }}
                    className="text-white font-light"
                  >
                    {texts[textIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h2>

          {/* Optional progress pills (kept minimal) */}
          {/* <div className="mt-6 flex gap-2 justify-center">
            {texts.map((_, i) => (
              <div key={i} className={`h-[6px] w-8 rounded-full ${i <= textIndex ? 'bg-emerald-400' : 'bg-white/20'}`} />
            ))}
          </div> */}
        </div>
      </section>
    </div>
  )
}
