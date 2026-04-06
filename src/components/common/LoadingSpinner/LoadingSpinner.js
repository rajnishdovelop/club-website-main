"use client"

import React from "react"
import { cn } from "@/utils/cn"

/**
 * Loading spinner component
 * @param {object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.text - Loading text
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ size = "md", text = "Loading...", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("animate-spin rounded-full border-4 border-slate-700 border-t-sky-400", sizes[size])} />
      {text && <p className={cn("text-slate-300", textSizes[size])}>{text}</p>}
    </div>
  )
}

/**
 * Full page loading state
 * @param {object} props - Component props
 * @param {string} props.text - Loading text
 */
const PageLoading = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

export { LoadingSpinner, PageLoading }
export default LoadingSpinner
