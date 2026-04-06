"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Individual achievement card for timeline
 */
const AchievementCard = ({ achievement, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-sky-400/50 transition-all duration-500 group"
    whileHover={{ y: -5 }}
  >
    <div className="mb-3">
      <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-semibold rounded-full border border-sky-500/30">
        {achievement.category}
      </span>
    </div>
    <h4 className="text-lg font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
      {achievement.title}
    </h4>
    <p className="text-slate-300 text-sm mb-3 leading-relaxed">{achievement.description}</p>
    <div className="border-t border-slate-700/50 pt-3">
      <p className="text-xs text-slate-400">
        <span className="text-sky-400 font-semibold">Impact:</span> {achievement.impact}
      </p>
    </div>
  </motion.div>
)

export default AchievementCard
