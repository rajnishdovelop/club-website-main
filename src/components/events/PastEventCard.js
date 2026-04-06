"use client"

import React from "react"
import { motion } from "framer-motion"
import EventCarousel from "./EventCarousel"
import { parseLinks } from "@/utils/parseLinks"

// Icon components
const ParticipantsIcon = () => (
  <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M1 4a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V4zm2 0h14v12H3V4z" clipRule="evenodd" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

/**
 * Past event card with full details and image carousel
 * @param {object} props - Component props
 * @param {object} props.event - Event data
 * @param {number} props.index - Index for staggered animation
 * @param {number} props.currentImageIndex - Current carousel image index
 * @param {function} props.onNextImage - Next image handler
 * @param {function} props.onPrevImage - Previous image handler
 * @param {function} props.onGoToImage - Go to specific image handler
 */
const PastEventCard = ({
  event,
  index = 0,
  currentImageIndex = 0,
  onNextImage,
  onPrevImage,
  onGoToImage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden hover:border-sky-400/50 transition-all duration-500 group"
      whileHover={{ y: -5 }}
    >
      {/* Image Gallery Section */}
      <div className="relative">
        <EventCarousel
          images={event.images}
          currentIndex={currentImageIndex}
          onNext={onNextImage}
          onPrev={onPrevImage}
          onGoToSlide={onGoToImage}
          title={event.title}
        />

        {/* Overlay content on carousel */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Year Badge */}
          {event.year && (
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-sky-500/90 text-white text-lg font-bold rounded-full">
                {event.year}
              </span>
            </div>
          )}

          {/* Outcome Badge */}
          {event.outcome && (
            <div className="absolute top-6 right-6">
              <span className="px-4 py-2 bg-green-500/90 text-white text-sm font-semibold rounded-full">
                {event.outcome}
              </span>
            </div>
          )}

          {/* Title and Date Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
              {event.title}
            </h3>
            {event.date && (
              <p className="text-sky-300 text-lg font-semibold">{event.date}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-8">
        {/* Event Info Grid */}
        {(event.participants || event.venue || event.duration) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {event.participants && (
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <ParticipantsIcon />
                  <span className="text-slate-400 text-sm font-medium">Participants</span>
                </div>
                <div className="text-2xl font-bold text-white">{event.participants}</div>
              </div>
            )}
            {event.venue && (
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <LocationIcon />
                  <span className="text-slate-400 text-sm font-medium">Venue</span>
                </div>
                <div className="text-lg font-semibold text-white">{event.venue}</div>
              </div>
            )}
            {event.duration && (
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <ClockIcon />
                  <span className="text-slate-400 text-sm font-medium">Duration</span>
                </div>
                <div className="text-lg font-semibold text-white">{event.duration}</div>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <p className="text-slate-300 text-lg leading-relaxed">
              {parseLinks(event.description)}
            </p>
          </div>
        )}

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-4">Key Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {event.highlights.map((highlight, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-sky-400/30 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Section */}
        {event.impact && (
          <div className="border-t border-slate-700/50 pt-6">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <CheckIcon />
              Impact & Achievements
            </h4>
            <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              {event.impact}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PastEventCard
