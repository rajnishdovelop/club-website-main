"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Civil Engineering Background - Animated blueprint-style background
 * Used across pages for consistent visual theme
 */
const CivilEngineeringBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Civil Engineering Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        {/* Blueprint Grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="cyan" strokeWidth="1" />
              <path d="M 12 0 L 12 60 M 24 0 L 24 60 M 36 0 L 36 60 M 48 0 L 48 60" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.6" />
              <path d="M 0 12 L 60 12 M 0 24 L 60 24 M 0 36 L 60 36 M 0 48 L 60 48" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.6" />
            </pattern>
            <pattern id="structural-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="3" fill="sky" opacity="0.4" />
              <path d="M 0 60 L 120 60 M 60 0 L 60 120" stroke="sky" strokeWidth="0.8" opacity="0.3" />
              <path d="M 30 30 L 90 30 L 90 90 L 30 90 Z" fill="none" stroke="sky" strokeWidth="0.6" opacity="0.4" />
              <path d="M 45 45 L 75 45 L 75 75 L 45 75 Z" fill="none" stroke="blue" strokeWidth="0.4" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
          <rect width="100%" height="100%" fill="url(#structural-pattern)" />
        </svg>
      </div>

      {/* Animated Civil Engineering Elements */}
      <div className="absolute inset-0">
        {/* Floating Building Wireframes */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-48 border-2 border-cyan-400/40 shadow-md shadow-cyan-400/10"
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="w-full h-1/3 border-b-2 border-cyan-400/30"></div>
          <div className="w-full h-1/3 border-b-2 border-cyan-400/30"></div>
          <div className="absolute top-3 left-3 w-6 h-6 border-2 border-cyan-400/50 bg-cyan-400/5"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-2 border-cyan-400/50 bg-cyan-400/5"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-2 border-cyan-400/50 bg-cyan-400/5"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-2 border-cyan-400/50 bg-cyan-400/5"></div>
          {/* Additional architectural details */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-400/25 rotate-45"></div>
        </motion.div>

        {/* Second Building */}
        <motion.div
          className="absolute top-32 right-16 w-36 h-44 border-2 border-sky-400/40 shadow-md shadow-sky-400/10"
          animate={{
            y: [0, -15, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          <div className="w-full h-1/4 border-b border-sky-400/30"></div>
          <div className="w-full h-1/4 border-b border-sky-400/30"></div>
          <div className="w-full h-1/4 border-b border-sky-400/30"></div>
          <div className="absolute top-2 left-2 w-4 h-4 border border-sky-400/40 bg-sky-400/5"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border border-sky-400/40 bg-sky-400/5"></div>
        </motion.div>

        {/* Bridge Structure */}
        <motion.div
          className="absolute top-1/3 right-20 w-64 h-20"
          animate={{
            x: [0, 15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <div className="w-full h-2 bg-gradient-to-r from-sky-400/30 to-cyan-400/30 mb-2 shadow-md shadow-sky-400/10"></div>
          <div className="flex justify-between">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1 h-16 bg-sky-400/25"></div>
            ))}
          </div>
          <div className="w-full h-2 bg-gradient-to-r from-sky-400/30 to-cyan-400/30 shadow-md shadow-cyan-400/10"></div>
          {/* Bridge supports */}
          <div className="absolute -bottom-4 left-8 w-2 h-8 bg-sky-400/20"></div>
          <div className="absolute -bottom-4 right-8 w-2 h-8 bg-sky-400/20"></div>
        </motion.div>

        {/* Structural Beams */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-40"
          animate={{
            rotate: [0, 3, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-cyan-400/25 to-sky-400/25 transform rotate-12 shadow-md shadow-cyan-400/10"></div>
          <div className="absolute top-12 left-0 w-full h-3 bg-gradient-to-r from-sky-400/25 to-blue-400/25 transform -rotate-12 shadow-md shadow-sky-400/10"></div>
          <div className="absolute top-24 left-0 w-full h-3 bg-gradient-to-r from-blue-400/25 to-cyan-400/25 transform rotate-6 shadow-md shadow-blue-400/10"></div>
          {/* Connection points */}
          <div className="absolute top-6 left-16 w-3 h-3 bg-cyan-400/40 rounded-full"></div>
          <div className="absolute top-18 right-16 w-3 h-3 bg-sky-400/40 rounded-full"></div>
        </motion.div>

        {/* Construction Crane Silhouette */}
        <motion.div
          className="absolute top-10 right-1/4 w-4 h-80 bg-gradient-to-b from-cyan-400/30 to-transparent shadow-md shadow-cyan-400/10"
          animate={{
            scaleY: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <div className="absolute top-12 -left-20 w-40 h-2 bg-cyan-400/30 shadow-md shadow-cyan-400/10"></div>
          <div className="absolute top-12 -right-12 w-20 h-2 bg-cyan-400/25"></div>
          <div className="absolute top-16 left-16 w-2 h-12 bg-cyan-400/25"></div>
          {/* Crane hook */}
          <motion.div className="absolute top-28 left-12 w-1 h-8 bg-cyan-400/40" animate={{ x: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <div className="absolute bottom-0 -left-1 w-3 h-2 bg-cyan-400/30"></div>
          </motion.div>
        </motion.div>

        {/* Geometric Construction Patterns */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 border-2 border-sky-400/25 shadow-md shadow-sky-400/5"
              style={{
                top: `${15 + i * 8}%`,
                left: `${8 + i * 7}%`,
                transform: `rotate(${i * 30}deg)`,
              }}
              animate={{
                rotate: [i * 30, i * 30 + 360],
                opacity: [0.15, 0.4, 0.15],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-sky-400/30 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-2 left-2 w-2 h-2 bg-sky-400/25 rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-sky-400/25 rounded-full"></div>
            </motion.div>
          ))}
        </div>

        {/* Technical Drawing Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <motion.path d="M 100 100 Q 200 50 300 100 T 500 100" fill="none" stroke="cyan" strokeWidth="2.5" strokeDasharray="8,8" animate={{ strokeDashoffset: [0, -32] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          <motion.path d="M 50 200 L 150 150 L 250 200 L 350 150 L 450 200" fill="none" stroke="sky" strokeWidth="2" strokeDasharray="6,6" animate={{ strokeDashoffset: [0, -24] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
          <motion.path d="M 0 300 Q 100 250 200 300 Q 300 350 400 300 Q 500 250 600 300" fill="none" stroke="blue" strokeWidth="1.5" strokeDasharray="4,8" animate={{ strokeDashoffset: [0, -36] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
          {/* Additional technical lines */}
          <motion.path d="M 0 400 L 100 380 L 200 420 L 300 380 L 400 420 L 500 380" fill="none" stroke="cyan" strokeWidth="1.2" strokeDasharray="3,6" animate={{ strokeDashoffset: [0, -18] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
        </svg>

        {/* Subtle Animated Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl animate-pulse delay-2000" />

        {/* Additional smaller glows */}
        <div className="absolute top-16 right-32 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-32 left-16 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl animate-pulse delay-1500" />
      </div>
    </div>
  )
}

export default CivilEngineeringBackground
