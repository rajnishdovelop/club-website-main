"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import { fadeInUp, gradientAnimation } from "@/constants/animations"

/**
 * Reusable page hero section with animated title
 * @param {object} props - Component props
 * @param {string} props.title - Hero title
 * @param {string} props.subtitle - Optional subtitle
 * @param {string} props.className - Additional CSS classes
 */
const PageHero = ({ title, subtitle, className = "" }) => {
  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ duration: 0.8 }}
      className={cn("relative z-10 pt-16 pb-8", className)}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
          style={{ backgroundSize: "200% 200%" }}
          animate={gradientAnimation.animate}
          transition={gradientAnimation.transition}
        >
          {title}
        </motion.h1>
        <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full"></div>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default PageHero
