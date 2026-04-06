"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * SVG Icons
 */
const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

/**
 * Contact method item
 */
const ContactMethod = ({ icon, label, value, href, index }) => (
  <motion.a
    href={href}
    target={href?.startsWith('http') ? '_blank' : undefined}
    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300 -mx-4"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:text-sky-300 transition-all duration-300">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 mb-0.5">{label}</p>
      <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
        {value}
      </p>
    </div>
  </motion.a>
)

/**
 * Quick link item
 */
const QuickLink = ({ title, description, href, index }) => (
  <motion.a
    href={href}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
    className="group block p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-sky-500/30 hover:bg-slate-800/50 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-white group-hover:text-sky-400 transition-colors">
        {title}
      </h4>
      <svg 
        className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
    <p className="text-sm text-slate-400">{description}</p>
  </motion.a>
)

/**
 * Contact information sidebar - Modern design
 */
const ContactInfo = () => {
  const contactMethods = [
    {
      icon: <LocationIcon />,
      label: "Visit Us",
      value: "IIT Indore, Simrol, MP 453552",
      href: "https://maps.google.com/?q=IIT+Indore+Simrol",
    },
    {
      icon: <EmailIcon />,
      label: "Email Us",
      value: "concreate@iiti.ac.in",
      href: "mailto:concreate@iiti.ac.in",
    },
    {
      icon: <ClockIcon />,
      label: "Response Time",
      value: "Within 24-48 hours",
      href: null,
    },
  ]

  const quickLinks = [
    {
      title: "Collaboration",
      description: "Partner with us on innovative engineering projects",
      href: "/projects",
    },
    {
      title: "Join the Team",
      description: "Become part of our engineering community",
      href: "/team",
    },
  ]

  const socialLinks = [
    { icon: <LinkedInIcon />, href: "https://linkedin.com/company/concreate-iiti", label: "LinkedIn" },
    { icon: <InstagramIcon />, href: "https://instagram.com/concreate_iiti", label: "Instagram" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      {/* Section heading */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-slate-400 leading-relaxed"
        >
          Whether you have questions, ideas, or want to collaborate, we are here to help.
        </motion.p>
      </div>

      {/* Contact methods */}
      <div className="space-y-2">
        {contactMethods.map((method, index) => (
          <ContactMethod
            key={index}
            icon={method.icon}
            label={method.label}
            value={method.value}
            href={method.href}
            index={index}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />

      {/* Quick links */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Quick Links
        </h3>
        <div className="space-y-3">
          {quickLinks.map((link, index) => (
            <QuickLink
              key={index}
              title={link.title}
              description={link.description}
              href={link.href}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Follow Us
        </h3>
        <div className="flex gap-3">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/30 hover:bg-slate-800 transition-all duration-300"
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ContactInfo
