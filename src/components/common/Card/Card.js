"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

/**
 * Base gradient card component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Enable hover effect
 * @param {function} props.onClick - Click handler
 */
const Card = ({ children, className = "", hoverable = true, onClick, ...props }) => {
  const baseStyles =
    "bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-500"

  const hoverStyles = hoverable ? "hover:border-sky-400/50 hover:shadow-2xl hover:shadow-cyan-400/10" : ""

  const clickableStyles = onClick ? "cursor-pointer" : ""

  return (
    <motion.div
      className={cn(baseStyles, hoverStyles, clickableStyles, className)}
      onClick={onClick}
      whileHover={hoverable ? { y: -5 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Card image section with optional badges
 * @param {object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.height - Image height class
 * @param {React.ReactNode} props.topLeftBadge - Badge in top-left corner
 * @param {React.ReactNode} props.topRightBadge - Badge in top-right corner
 */
const CardImage = ({
  src,
  alt,
  height = "h-48",
  topLeftBadge,
  topRightBadge,
  className = "",
  fallbackSrc = "/placeholder.jpg",
}) => {
  return (
    <div className={cn("relative overflow-hidden group", height, className)}>
      <img
        src={src || fallbackSrc}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          e.target.src = fallbackSrc
        }}
      />
      {topLeftBadge && <div className="absolute top-4 left-4">{topLeftBadge}</div>}
      {topRightBadge && <div className="absolute top-4 right-4">{topRightBadge}</div>}
    </div>
  )
}

/**
 * Card content section
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 */
const CardContent = ({ children, className = "" }) => {
  return <div className={cn("p-6", className)}>{children}</div>
}

/**
 * Card badge component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge variant
 */
const CardBadge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-black/70 text-white",
    primary: "bg-sky-500/90 text-white",
    success: "bg-green-500/90 text-white",
    warning: "bg-yellow-500/90 text-white",
    info: "bg-slate-500/90 text-white",
  }

  return (
    <span className={cn("px-3 py-1 text-sm font-semibold rounded-full", variants[variant], className)}>
      {children}
    </span>
  )
}

export { Card, CardImage, CardContent, CardBadge }
export default Card
