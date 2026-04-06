"use client"

import React from "react"
import { motion } from "framer-motion"
import AchievementCard from "./AchievementCard"

/**
 * Year marker on the timeline
 */
const YearMarker = ({ year }) => (
  <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center">
    <span className="text-white font-bold text-sm">{year}</span>
  </div>
)

/**
 * Get grid classes based on achievement count
 */
const getGridClasses = (count) => {
  if (count === 1) return "grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-md mx-auto"
  if (count === 2) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto"
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
}

/**
 * Achievements timeline section
 */
const AchievementTimeline = ({ timelineAchievements, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 py-16"
  >
    <div className="max-w-7xl mx-auto px-6">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center text-white mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Major Achievements Timeline
      </motion.h2>
      <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full mb-12" />

      {isLoading ? (
        <div className="text-center text-white text-xl py-12">Loading achievements...</div>
      ) : timelineAchievements.length === 0 ? (
        <div className="text-center text-gray-400 text-xl py-12">No achievements added yet.</div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 to-blue-500" />

          <div className="space-y-12">
            {timelineAchievements.map((yearData, yearIndex) => (
              <motion.div
                key={yearData.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: yearIndex * 0.2 }}
                className="relative"
              >
                <YearMarker year={yearData.year} />

                <div className="ml-20 md:ml-0">
                  <div className={`grid gap-6 ${getGridClasses(yearData.achievements.length)}`}>
                    {yearData.achievements.map((achievement, achievementIndex) => (
                      <AchievementCard
                        key={achievementIndex}
                        achievement={achievement}
                        index={achievementIndex}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
)

export default AchievementTimeline
