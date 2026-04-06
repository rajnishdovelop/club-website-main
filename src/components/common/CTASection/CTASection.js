"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/utils/cn"
import Button from "../Button"

/**
 * Reusable CTA (Call to Action) section
 * @param {object} props - Component props
 * @param {string} props.title - CTA title
 * @param {string} props.description - CTA description
 * @param {string} props.primaryButtonText - Primary button text
 * @param {string} props.primaryButtonHref - Primary button link
 * @param {string} props.secondaryButtonText - Secondary button text
 * @param {string} props.secondaryButtonHref - Secondary button link
 * @param {string} props.className - Additional CSS classes
 */
const CTASection = ({
  title = "Ready to Join Our Community?",
  description = "Be part of exciting events, competitions, and workshops. Connect with fellow civil engineers and industry experts.",
  primaryButtonText = "Contact Us",
  primaryButtonHref = "/message-us",
  secondaryButtonText = "Meet the Team",
  secondaryButtonHref = "/team",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn("relative z-10 py-16", className)}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 hover:border-cyan-400/50 transition-all duration-500">
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-xl text-slate-300 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {description}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href={primaryButtonHref}>
              <Button variant="primary" size="lg" className="rounded-full">
                {primaryButtonText}
              </Button>
            </Link>
            {secondaryButtonText && secondaryButtonHref && (
              <Link href={secondaryButtonHref}>
                <Button variant="outline" size="lg" className="rounded-full">
                  {secondaryButtonText}
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default CTASection
