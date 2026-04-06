"use client"

import React from "react"
import { motion } from "framer-motion"
import { parseLinks } from "@/utils/parseLinks"

// Icon components
const CalendarIcon = () => (
  <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
)

/**
 * Progress bar component
 * @param {object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {boolean} props.showLabel - Whether to show progress label
 */
const ProgressBar = ({ progress, showLabel = true }) => {
  return (
    <div className="mb-4">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs text-sky-400 font-semibold">{progress}%</span>
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Technology tags component
 * @param {object} props - Component props
 * @param {Array} props.technologies - Array of technology strings
 * @param {number} props.limit - Maximum number of tags to show
 */
const TechnologyTags = ({ technologies, limit = 3 }) => {
  if (!technologies || technologies.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {technologies.slice(0, limit).map((tech, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs rounded-md border border-sky-500/30"
        >
          {tech}
        </span>
      ))}
      {technologies.length > limit && (
        <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
          +{technologies.length - limit}
        </span>
      )}
    </div>
  )
}

/**
 * Award tags component
 * @param {object} props - Component props
 * @param {Array} props.awards - Array of award strings
 * @param {number} props.limit - Maximum number of awards to show
 */
const AwardTags = ({ awards, limit = 2 }) => {
  if (!awards || awards.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {awards.slice(0, limit).map((award, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-md border border-amber-500/30"
        >
          {award}
        </span>
      ))}
      {awards.length > limit && (
        <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
          +{awards.length - limit}
        </span>
      )}
    </div>
  )
}

/**
 * Project card component for displaying project summary
 * @param {object} props - Component props
 * @param {object} props.project - Project data
 * @param {number} props.index - Index for staggered animation
 * @param {function} props.onViewDetails - View details click handler
 * @param {string} props.variant - Card variant (default, ongoing, completed)
 */
const ProjectCard = ({ project, index = 0, onViewDetails, variant = "default" }) => {
  const isOngoing = project.type === "ongoing"
  const imageUrl = project.images?.[0]?.url || project.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-sky-400/50 transition-all duration-500 group"
      whileHover={{ y: -5 }}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${
                isOngoing ? "bg-green-500/90" : "bg-sky-500/90"
              }`}
            >
              {variant === "ongoing"
                ? project.status || "Ongoing"
                : variant === "completed"
                ? project.category || "Completed"
                : isOngoing
                ? "Ongoing"
                : "Completed"}
            </span>
          </div>

          {/* Progress Badge for ongoing */}
          {project.progress !== undefined && isOngoing && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-full">
                {project.progress}% Complete
              </span>
            </div>
          )}

          {/* Completed Badge for completed variant */}
          {variant === "completed" && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded-full">
                Completed
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
          {project.title}
        </h3>

        {/* Description for detailed views */}
        {(variant === "ongoing" || variant === "completed") && project.description && (
          <p className="text-slate-400 text-sm mb-3 leading-relaxed line-clamp-2">
            {parseLinks(project.description)}
          </p>
        )}

        {/* Progress Bar for Ongoing */}
        {project.progress !== undefined && isOngoing && <ProgressBar progress={project.progress} />}

        {/* Completion Date for Completed */}
        {variant === "completed" && project.completionDate && (
          <div className="flex items-center gap-2 mb-4 text-slate-300">
            <CalendarIcon />
            <span className="text-sm">Completed: {project.completionDate}</span>
          </div>
        )}

        {/* Technologies for ongoing */}
        {variant === "ongoing" && <TechnologyTags technologies={project.technologies} />}

        {/* Awards for completed */}
        {variant === "completed" && <AwardTags awards={project.awards} />}

        {/* View Details Button */}
        <motion.button
          onClick={() => onViewDetails(project)}
          className="w-full px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
}

export { ProgressBar, TechnologyTags, AwardTags }
export default ProjectCard
