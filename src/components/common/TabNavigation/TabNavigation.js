"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

/**
 * Tab button component
 * @param {object} props - Component props
 * @param {string} props.id - Tab ID
 * @param {string} props.label - Tab label
 * @param {number} props.count - Optional count badge
 * @param {boolean} props.isActive - Active state
 * @param {function} props.onClick - Click handler
 */
const TabButton = ({ id, label, count, isActive, onClick }) => {
  return (
    <motion.button
      onClick={() => onClick(id)}
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2",
        isActive
          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-400/25"
          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600/50"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs",
            isActive ? "bg-white/20" : "bg-slate-600/50"
          )}
        >
          {count}
        </span>
      )}
    </motion.button>
  )
}

/**
 * Tab navigation component
 * @param {object} props - Component props
 * @param {Array} props.tabs - Array of tab objects { id, label, count }
 * @param {string} props.activeTab - Active tab ID
 * @param {function} props.onTabChange - Tab change handler
 * @param {string} props.className - Additional CSS classes
 */
const TabNavigation = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={cn("relative z-10 max-w-6xl mx-auto px-6 mb-12", className)}
    >
      <div className="flex flex-wrap justify-center gap-4" role="tablist" aria-label="Content tabs">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            count={tab.count}
            isActive={activeTab === tab.id}
            onClick={onTabChange}
          />
        ))}
      </div>
    </motion.div>
  )
}

export { TabNavigation, TabButton }
export default TabNavigation
