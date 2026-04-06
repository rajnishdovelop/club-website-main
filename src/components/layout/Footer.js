"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SOCIAL_LINKS, CONTACT_INFO, CLUB_INFO } from "@/constants"
import { NAV_LINKS } from "@/constants"

/**
 * Social link button component
 */
const SocialLinkButton = ({ href, label, icon, index }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
    viewport={{ once: true }}
    aria-label={label}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-60 transition-all duration-300" />
    <div className="relative w-10 h-10 bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-400/30 group-hover:border-cyan-400 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-cyan-300 transition-all duration-300">
      {icon}
    </div>
  </motion.a>
)

/**
 * Quick link item component
 */
const QuickLink = ({ href, label }) => (
  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
    <Link
      href={href}
      className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group text-sm"
    >
      <motion.div className="w-0 h-[2px] bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full group-hover:w-4 transition-all duration-300" />
      {label}
    </Link>
  </motion.div>
)

/**
 * Footer logo component
 */
const FooterLogo = () => (
  <Link href="/" className="flex items-center gap-4 group mb-4">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500 scale-150" />
      <div className="relative bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-0.5 rounded-full">
        <div className="bg-slate-950 rounded-full p-2">
          <motion.img
            src="/logo.png"
            alt="Concreate Club Logo"
            className="h-16 w-16 object-contain"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
    <div>
      <motion.h3
        className="spicy-rice-regular text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        style={{ backgroundSize: "200% 200%" }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        {CLUB_INFO.name}
      </motion.h3>
    </div>
  </Link>
)

/**
 * Floating particles effect
 */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
        animate={{
          x: [0, Math.random() * 100 - 50, 0],
          y: [0, Math.random() * -100, 0],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          delay: i * 0.5,
        }}
        style={{
          left: `${10 + i * 12}%`,
          top: "100%",
        }}
      />
    ))}
  </div>
)

/**
 * Main Footer component
 */
const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <footer className="relative text-white bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl border-t border-slate-700/30 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-cyan-500/10 to-blue-500/5 opacity-50 pointer-events-none" />

        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <FloatingParticles />

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and Brand Section */}
            <motion.div
              className="lg:col-span-2 flex flex-col items-center lg:items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FooterLogo />
              <p className="text-slate-300 text-center lg:text-left max-w-md mb-4 leading-relaxed">
                {CLUB_INFO.tagline}
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{CLUB_INFO.location} • Est. {CLUB_INFO.established}</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="flex flex-col items-center lg:items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-sky-400 to-cyan-500 rounded-full" />
                Quick Links
              </h4>
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <QuickLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>
            </motion.div>

            {/* Connect Section */}
            <motion.div
              className="flex flex-col items-center lg:items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-sky-400 to-cyan-500 rounded-full" />
                Connect With Us
              </h4>

              {/* Social Links */}
              <div className="flex gap-3 mb-6">
                {SOCIAL_LINKS.map((social, index) => (
                  <SocialLinkButton
                    key={social.label}
                    href={social.href}
                    label={social.label}
                    icon={social.icon}
                    index={index}
                  />
                ))}
              </div>

              {/* Contact Email */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{CONTACT_INFO.email}</span>
              </a>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {CLUB_INFO.name}, {CLUB_INFO.location}. All rights reserved.
            </p>

            <motion.p
              className="text-sm bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-medium"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              style={{ backgroundSize: "200% 200%" }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Built with ❤️ by Concreate Team
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </footer>
    </motion.div>
  )
}

export default Footer
