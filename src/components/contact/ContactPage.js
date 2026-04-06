"use client"

import React from "react"
import { motion } from "framer-motion"
import ContactInfo from "./ContactInfo"
import ContactForm from "./ContactForm"

/**
 * Animated grid background
 */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated gradient orbs */}
    <motion.div
      className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    <motion.div
      className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 10, repeat: Infinity }}
    />
    <motion.div
      className="absolute -bottom-20 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{ duration: 12, repeat: Infinity }}
    />
    
    {/* Grid lines */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgb(148 163 184) 1px, transparent 1px),
          linear-gradient(rgb(148 163 184) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
)

/**
 * Floating geometric shapes
 */
const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-sky-400/20 rounded-full"
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      />
    ))}
  </div>
)

/**
 * Contact page component - Modern professional design
 */
const ContactPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <GridBackground />
      <FloatingShapes />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-px w-12 bg-gradient-to-r from-sky-400 to-transparent" />
              <span className="text-sm font-medium text-sky-400 uppercase tracking-widest">
                Contact Us
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.15] pb-2"
            >
              Let's Build
              <span className="block mt-2 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent leading-[1.2] pb-1">
                Something Great
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl"
            >
              Have a project in mind, want to collaborate, or simply curious about what we do? 
              We're always open to new ideas and partnerships.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content - Contact Form & Info */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left column - Contact Info */}
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>
            
            {/* Right column - Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 border-t border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-12 md:p-16">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="180" fill="none" stroke="url(#ctaGrad)" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="url(#ctaGrad)" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="url(#ctaGrad)" strokeWidth="0.5" />
              </svg>
            </div>
            
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Join Our Community
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Connect with fellow engineers, participate in workshops, and be part of 
                  innovative projects shaping the future of civil engineering.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                <motion.a
                  href="/projects"
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Projects
                </motion.a>
                <motion.a
                  href="/team"
                  className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-xl text-center hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Meet the Team
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default ContactPage
