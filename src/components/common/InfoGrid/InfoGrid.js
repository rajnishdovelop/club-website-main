"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

/**
 * Info grid item with icon
 * @param {object} props - Component props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.label - Item label
 * @param {string|number} props.value - Item value
 * @param {string} props.className - Additional CSS classes
 */
const InfoGridItem = ({ icon, label, value, className = "" }) => {
  return (
    <div className={cn("text-center md:text-left", className)}>
      <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
        {icon && <span className="text-sky-400">{icon}</span>}
        <span className="text-slate-400 text-sm font-medium">{label}</span>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

/**
 * Info grid component for displaying stats/details
 * @param {object} props - Component props
 * @param {Array} props.items - Array of items { icon, label, value }
 * @param {number} props.columns - Number of columns
 * @param {string} props.className - Additional CSS classes
 */
const InfoGrid = ({ items, columns = 3, className = "" }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-6", gridCols[columns] || gridCols[3], className)}>
      {items.map((item, index) => (
        <InfoGridItem key={index} icon={item.icon} label={item.label} value={item.value} />
      ))}
    </div>
  )
}

/**
 * Stat card with large number
 * @param {object} props - Component props
 * @param {string|number} props.value - Stat value
 * @param {string} props.label - Stat label
 * @param {string} props.description - Optional description
 * @param {string} props.suffix - Value suffix
 */
const StatCard = ({ value, label, description, suffix = "", index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center hover:border-cyan-400/50 transition-all duration-500 group"
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
        {value}
        {suffix}
      </div>
      <div className="text-white font-semibold mb-2">{label}</div>
      {description && <div className="text-slate-400 text-sm leading-relaxed">{description}</div>}
    </motion.div>
  )
}

export { InfoGrid, InfoGridItem, StatCard }
export default InfoGrid
