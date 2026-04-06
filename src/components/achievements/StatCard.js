"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Individual statistic card with animated counter
 */
const StatCard = ({ stat, index, counterValue }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center hover:border-cyan-400/50 transition-all duration-500 group"
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
      {counterValue || 0}
      {stat.suffix}
    </div>
    <div className="text-white font-semibold mb-2">{stat.label}</div>
    <div className="text-slate-400 text-sm leading-relaxed">{stat.description}</div>
  </motion.div>
)

/**
 * Statistics grid section
 */
const StatisticsSection = ({ statistics, counters }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 py-16"
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statistics.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            index={index}
            counterValue={counters[`stat${index}`]}
          />
        ))}
      </div>
    </div>
  </motion.div>
)

export default StatisticsSection
export { StatCard }
