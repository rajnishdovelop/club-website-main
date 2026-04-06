"use client"

import React from "react"
import { motion } from "framer-motion"
import { parseLinks } from "@/utils/parseLinks"

/**
 * Modal content for displaying event details
 * @param {object} props - Component props
 * @param {object} props.event - Event data
 * @param {function} props.onRegister - Register button click handler
 * @param {function} props.onJoin - Join button click handler
 */
const EventModalContent = ({ event, onRegister, onJoin }) => {
  if (!event) return null

  // For Upcoming Events
  if (event.type === "upcoming") {
    return (
      <div className="space-y-4">
        {event.category && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Category</h3>
            <p className="text-white text-lg">{event.category}</p>
          </div>
        )}

        {event.date && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Date & Time</h3>
            <p className="text-white text-lg">{event.date}</p>
            {event.time && <p className="text-sky-400">{event.time}</p>}
          </div>
        )}

        {event.venue && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Venue</h3>
            <p className="text-white text-lg">{event.venue}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Description</h3>
          <p className="text-slate-300 leading-relaxed">{parseLinks(event.description)}</p>
        </div>

        {event.registrations && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-sky-400">{event.registrations}</span> students have already registered for this event!
            </p>
          </div>
        )}

        {event.registrationEnabled && (
          <motion.button
            onClick={onRegister}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register Now
          </motion.button>
        )}
      </div>
    )
  }

  // For Ongoing Events
  if (event.type === "ongoing") {
    return (
      <div className="space-y-4">
        {event.status && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Status</h3>
            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full border border-green-500/30">
              {event.status}
            </span>
          </div>
        )}

        {event.endDate && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">End Date</h3>
            <p className="text-white text-lg">{event.endDate}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Description</h3>
          <p className="text-slate-300 leading-relaxed">{parseLinks(event.description)}</p>
        </div>

        {(event.participants || event.teams) && (
          <div className="grid grid-cols-2 gap-4">
            {event.participants && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-1">Participants</p>
                <p className="text-xl font-bold text-sky-400">{event.participants}</p>
              </div>
            )}
            {event.teams && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-1">Teams</p>
                <p className="text-xl font-bold text-sky-400">{event.teams}</p>
              </div>
            )}
          </div>
        )}

        {event.registrationEnabled && (
          <motion.button
            onClick={onJoin}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Now
          </motion.button>
        )}
      </div>
    )
  }

  // For Past Events
  if (event.type === "past") {
    return (
      <div className="space-y-4">
        {event.category && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Category</h3>
            <p className="text-white text-lg">{event.category}</p>
          </div>
        )}

        {event.date && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Date</h3>
            <p className="text-white text-lg">{event.date}</p>
          </div>
        )}

        {event.venue && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Venue</h3>
            <p className="text-white text-lg">{event.venue}</p>
          </div>
        )}

        {event.description && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Description</h3>
            <p className="text-slate-300 leading-relaxed">{parseLinks(event.description)}</p>
          </div>
        )}

        {(event.participants || event.duration) && (
          <div className="grid grid-cols-2 gap-4">
            {event.participants && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-1">Participants</p>
                <p className="text-xl font-bold text-sky-400">{event.participants}</p>
              </div>
            )}
            {event.duration && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-1">Duration</p>
                <p className="text-xl font-bold text-sky-400">{event.duration}</p>
              </div>
            )}
          </div>
        )}

        {event.highlights && event.highlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Key Highlights</h3>
            <ul className="space-y-2">
              {event.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 bg-sky-400 rounded-full" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {event.impact && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Impact & Achievements</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              {event.impact}
            </p>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default EventModalContent
