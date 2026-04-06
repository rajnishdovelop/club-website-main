"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

/**
 * Mobile-only floating banner promoting CIVITAS'26
 * Shown at top of screen, dismissible, remembered via sessionStorage
 */
const CivitasBanner = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem("civitas_banner_dismissed")
    if (!dismissed) {
      // Small delay so it slides in after page load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem("civitas_banner_dismissed", "1")
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="md:hidden fixed top-16 left-0 right-0 z-[60]"
        >
          <div className="mx-3 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-slate-950/90 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-amber-500/10">
            {/* Pulsing dot */}
            <div className="relative flex-shrink-0">
              <span className="block w-2 h-2 rounded-full bg-amber-400" />
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium leading-none mb-0.5">
                Upcoming Event
              </p>
              <p className="text-sm font-semibold text-white truncate">
                CIVITAS<span className="text-amber-400">'26</span> — The Civil Confluence
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/civitas26"
              onClick={dismiss}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold tracking-wide hover:from-amber-400 hover:to-orange-400 transition-all duration-200"
            >
              Explore
            </Link>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CivitasBanner
