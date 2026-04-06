"use client"

import React from "react"
import { motion } from "framer-motion"
import { InfiniteMovingCardsDemo } from "@/components/demos"

/**
 * Marvels section - Iconic Civil Engineering structures showcase
 */
const MarvelsSection = () => {
  return (
    <motion.div
      id="marvels"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative z-10 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 lg:mb-16">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Iconic Civil Engineering Marvels
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-300 text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Discover the world's most remarkable civil engineering achievements that continue to inspire our work and vision for the future.
        </motion.p>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full" />
      </div>
      <InfiniteMovingCardsDemo />
    </motion.div>
  )
}

export default MarvelsSection
