"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Individual field of excellence card
 */
const FieldCard = ({ field, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 group"
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="text-center mb-6">
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
        {field.title}
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed">{field.description}</p>
    </div>

    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white mb-3">Key Achievements:</h4>
      {field.achievements.map((achievement, idx) => (
        <motion.div
          key={idx}
          className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <span
            className={`text-sm font-medium bg-gradient-to-r ${field.color} bg-clip-text text-transparent`}
          >
            {achievement}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

/**
 * Fields of Excellence section
 */
const FieldsOfExcellence = ({ achievementFields }) => (
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
        Fields of Excellence
      </motion.h2>
      <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievementFields.map((field, index) => (
          <FieldCard key={index} field={field} index={index} />
        ))}
      </div>
    </div>
  </motion.div>
)

export default FieldsOfExcellence
export { FieldCard }
