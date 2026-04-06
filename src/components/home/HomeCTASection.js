"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

/**
 * Home page Call-to-Action section
 * (Different from the common CTASection for special home page styling)
 */
const HomeCTASection = () => {
  return (
    <motion.section
      id="join"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-12 sm:py-16 lg:py-20 relative z-10"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 hover:border-sky-400/50 transition-all duration-500">
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Shape the Future?
          </motion.h3>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join our community of innovative civil engineers and be part of groundbreaking projects that build tomorrow's sustainable infrastructure. From concept to construction, we're building the future together.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/achievements" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm sm:text-base font-semibold rounded-full hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Work
              </motion.button>
            </Link>
            <Link href="/recentActivities" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-sky-400/50 text-sky-400 text-sm sm:text-base font-semibold rounded-full hover:bg-sky-400/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Recent Activities
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HomeCTASection
