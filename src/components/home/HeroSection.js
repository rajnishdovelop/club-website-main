"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

/**
 * Stat item component
 * @param {object} props - Component props
 * @param {string} props.number - Stat number
 * @param {string} props.label - Stat label
 */
const StatItem = ({ number, label }) => (
  <div className="text-center">
    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-sky-400">{number}</div>
    <div className="text-xs sm:text-sm text-gray-400 mt-1">{label}</div>
  </div>
)

/**
 * Image slider with thumbnails
 * @param {object} props - Component props
 * @param {Array} props.images - Array of image URLs
 * @param {number} props.currentIndex - Current active index
 * @param {function} props.setCurrentIndex - Set current index function
 */
const ImageSlider = ({ images, currentIndex, setCurrentIndex }) => {
  if (!images || images.length === 0) return null

  return (
    <>
      {/* Main Image Container */}
      <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500/20 to-blue-600/20 backdrop-blur-sm border border-white/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.3) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Image Slider */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                scale: index === currentIndex ? 1 : 1.05,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <img
                src={image}
                alt={`Civil Engineering Project ${index + 1}`}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent rounded-xl sm:rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-sky-400 w-6 sm:w-8 shadow-lg shadow-sky-400/50"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-24 sm:h-24 bg-sky-400/20 rounded-full blur-xl" />
      <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-blue-500/20 rounded-full blur-2xl" />

      {/* Thumbnail Selectors */}
      <div className="mt-3 sm:mt-4 flex justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative flex-shrink-0 w-12 h-9 sm:w-14 sm:h-10 lg:w-16 lg:h-12 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === currentIndex
                ? "border-sky-400 shadow-lg shadow-sky-400/30"
                : "border-white/30 hover:border-white/60"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            {index === currentIndex && <div className="absolute inset-0 bg-sky-400/20" />}
          </motion.button>
        ))}
      </div>
    </>
  )
}

/**
 * Hero section component for the home page
 * @param {object} props - Component props
 * @param {object} props.settings - Page settings containing hero data
 * @param {Array} props.heroImages - Array of hero image URLs
 */
const HeroSection = ({ settings, heroImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-rotate images
  useEffect(() => {
    if (heroImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [heroImages.length])

  const stats = [
    { number: settings?.heroSection?.studentsCount || "500+", label: "Students" },
    { number: settings?.heroSection?.projectsCount || "50+", label: "Projects" },
    { number: settings?.heroSection?.awardsCount || "25+", label: "Awards" },
  ]

  return (
    <div id="hero" className="relative min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-3 sm:space-y-4 lg:space-y-6 order-2 lg:order-1"
          >
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-2 sm:space-y-3"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {settings?.heroSection?.title || "Concreate Club"}
              </h1>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-sky-300 font-medium">
                {settings?.heroSection?.subtitle || "Civil Engineering Student Club - IIT Indore"}
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed"
            >
              {settings?.heroSection?.description ||
                "Driving hands-on learning, innovation, and collaboration. Through workshops, student-led projects, competitions, and the flagship CivilX Series, we bridge classroom knowledge with real-world engineering challenges."}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-2 sm:py-3"
            >
              {stats.map((stat, index) => (
                <StatItem key={index} number={stat.number} label={stat.label} />
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1"
            >
              <Link href="/team" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Meet Our Team
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.button>
              </Link>
              <Link href="/message-us" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-sky-400/50 text-sky-400 text-sm sm:text-base font-semibold rounded-xl hover:bg-sky-400/10 backdrop-blur-sm transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get In Touch
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[450px] xl:h-[500px] order-1 lg:order-2 mb-4 lg:mb-0"
          >
            <ImageSlider
              images={heroImages}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on small screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="hidden md:flex absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-sky-400">
          <span className="text-xs uppercase tracking-wider">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-sky-400/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-sky-400 rounded-full mt-2" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection
