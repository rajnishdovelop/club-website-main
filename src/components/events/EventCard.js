"use client"

import React from "react"
import { motion } from "framer-motion"
import { parseLinks } from "@/utils/parseLinks"

// Icon components
const CalendarIcon = () => (
  <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
)

/**
 * Get badge color based on event type
 * @param {string} type - Event type (upcoming, ongoing, past)
 * @returns {string} - Tailwind classes for badge color
 */
const getTypeBadgeColor = (type) => {
  const colors = {
    upcoming: "bg-sky-500/90",
    ongoing: "bg-green-500/90",
    past: "bg-slate-500/90",
  }
  return colors[type] || colors.past
}

/**
 * Event card component for displaying event summary
 * @param {object} props - Component props
 * @param {object} props.event - Event data
 * @param {number} props.index - Index for staggered animation
 * @param {function} props.onViewDetails - View details click handler
 * @param {boolean} props.showTypeBadge - Whether to show type badge
 */
const EventCard = ({ event, index = 0, onViewDetails, showTypeBadge = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-sky-400/50 transition-all duration-500 group"
      whileHover={{ y: -5 }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.images?.[0]?.url || "/recent/techexpo1.jpg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Type Badge */}
        {showTypeBadge && event.type && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${getTypeBadgeColor(event.type)}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
        )}

        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-full">
              {event.category}
            </span>
          </div>
        )}

        {/* Status Badge for ongoing */}
        {event.type === "ongoing" && event.status && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-green-500/90 text-white text-sm font-semibold rounded-full">
              {event.status || "In Progress"}
            </span>
          </div>
        )}

        {/* Registrations Badge */}
        {event.registrations && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-full">
              {event.registrations} registered
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-slate-400 text-sm mb-3 leading-relaxed line-clamp-2">
            {parseLinks(event.description)}
          </p>
        )}

        {/* Date & Venue Info */}
        <div className="space-y-2 mb-4 text-slate-300">
          {event.date && (
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span className="text-sm">{event.date}</span>
            </div>
          )}
          {event.endDate && event.type === "ongoing" && (
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span className="text-sm">Ends: {event.endDate}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-2">
              <LocationIcon />
              <span className="text-sm">{event.venue}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <motion.button
          onClick={() => onViewDetails(event)}
          className="w-full px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
}

export default EventCard
