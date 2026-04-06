"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Section links for mobile navigation
 */
const SECTION_LINKS = [
  { id: "hero", label: "Home", icon: "🏠" },
  { id: "unique", label: "What Makes Us Unique", icon: "✨" },
  { id: "join", label: "Join Us", icon: "🚀" },
  { id: "marvels", label: "Engineering Marvels", icon: "🏗️" },
]

/**
 * Mobile-only floating section navigation
 * Provides quick access to different sections on the home page
 */
const MobileSectionNav = () => {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-16 right-0 w-64 bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-sky-400/30 shadow-2xl shadow-sky-500/20 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-sky-400/20 bg-gradient-to-r from-sky-500/10 to-blue-500/10">
              <p className="text-sm font-semibold text-sky-400">Quick Navigation</p>
            </div>

            {/* Section Links */}
            <div className="py-2">
              {SECTION_LINKS.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left text-slate-300 hover:text-white hover:bg-sky-500/10 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-sm font-medium">{link.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 border border-sky-400/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
        )}
      </motion.button>

      {/* Pulsing indicator when closed */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-sky-400/50"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  )
}

export default MobileSectionNav
