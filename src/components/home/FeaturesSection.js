"use client"

import React from "react"
import { motion } from "framer-motion"
import { getIcon } from "./icons"

/**
 * Feature card component
 * @param {object} props - Component props
 * @param {object} props.feature - Feature data
 * @param {number} props.index - Index for staggered animation
 */
const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-sky-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/15 h-full">
      <div className="mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
        {getIcon(feature.iconType)}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature.description}</p>
    </div>
  </motion.div>
)

/**
 * Features section component - "What Makes Us Unique"
 * @param {object} props - Component props
 * @param {Array} props.features - Array of feature cards
 */
const FeaturesSection = ({ features = [] }) => {
  if (!features || features.length === 0) return null

  return (
    <motion.section
      id="unique"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            What Makes Us Unique
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full" />
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default FeaturesSection
