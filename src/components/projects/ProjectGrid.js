"use client"

import React from "react"
import { motion } from "framer-motion"
import ProjectCard from "./ProjectCard"

/**
 * Project grid component to display project cards
 * @param {object} props - Component props
 * @param {Array} props.projects - Array of projects
 * @param {function} props.onViewDetails - View details click handler
 * @param {string} props.variant - Card variant (default, ongoing, completed)
 * @param {number} props.columns - Number of columns (2 or 3)
 */
const ProjectGrid = ({ projects, onViewDetails, variant = "default", columns = 3 }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No projects found in this category.</p>
      </div>
    )
  }

  const gridClass = columns === 2 
    ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={gridClass}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project._id}
            project={project}
            index={index}
            onViewDetails={onViewDetails}
            variant={variant}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default ProjectGrid
