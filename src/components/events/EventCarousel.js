"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Image carousel for event galleries
 * @param {object} props - Component props
 * @param {Array} props.images - Array of image objects with url property
 * @param {number} props.currentIndex - Current active index
 * @param {function} props.onNext - Next slide handler
 * @param {function} props.onPrev - Previous slide handler
 * @param {function} props.onGoToSlide - Go to specific slide handler
 * @param {string} props.title - Image alt text
 */
const EventCarousel = ({ images, currentIndex = 0, onNext, onPrev, onGoToSlide, title = "" }) => {
  if (!images || images.length === 0) return null

  const showControls = images.length > 1

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: "500px" }}>
        <motion.div
          className="relative w-full h-full"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={images[currentIndex]?.url || "/recent/Bimg1.jpg"}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Previous Button */}
        {showControls && (
          <motion.button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-sm transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        {/* Next Button */}
        {showControls && (
          <motion.button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-sm transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Carousel Indicators */}
      {showControls && (
        <div className="flex justify-center gap-2 p-4 bg-slate-900/50">
          {images.map((_, imgIndex) => (
            <motion.button
              key={imgIndex}
              onClick={() => onGoToSlide(imgIndex)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === imgIndex ? "bg-sky-400 w-8" : "bg-slate-600 w-2 hover:bg-slate-500"
              }`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to image ${imgIndex + 1}`}
              aria-current={currentIndex === imgIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default EventCarousel
