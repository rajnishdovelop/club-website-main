"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

/**
 * Gradient button component with hover/tap animations
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, outline)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 * @param {function} props.onClick - Click handler
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2"

  const variants = {
    primary:
      "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-400/25",
    secondary:
      "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600/50",
    outline:
      "border-2 border-sky-400/50 text-sky-400 hover:bg-sky-400/10 backdrop-blur-sm",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800/50",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer"

  return (
    <motion.button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], disabledStyles, className)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
