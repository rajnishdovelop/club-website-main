"use client"

import React from "react"
import { motion } from "framer-motion"
import TeamMemberCard from "./TeamMemberCard"

/**
 * Team section component for displaying a group of team members
 * @param {object} props - Component props
 * @param {string} props.id - Section ID for navigation
 * @param {string} props.title - Section title
 * @param {Array} props.members - Array of team members
 * @param {boolean} props.isLeadership - Whether cards should use leadership sizing
 * @param {string} props.gradientFrom - Gradient start color
 * @param {string} props.gradientTo - Gradient end color
 * @param {string} props.animationDirection - Animation direction (left, right, up)
 */
const TeamSection = ({
  id,
  title,
  members,
  isLeadership = false,
  gradientFrom = "sky-400",
  gradientTo = "blue-500",
  animationDirection = "left",
}) => {
  if (!members || members.length === 0) return null

  const animationProps = {
    left: { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
    up: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
  }

  const animation = animationProps[animationDirection] || animationProps.left

  const containerClass = isLeadership
    ? "flex flex-wrap justify-center gap-8 max-w-7xl mx-auto"
    : "flex flex-wrap justify-center gap-6 max-w-6xl mx-auto"

  return (
    <section id={id} className="mb-24">
      <motion.div
        initial={animation.initial}
        whileInView={animation.animate}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
        <div className={`w-24 h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} mx-auto rounded-full`} />
      </motion.div>

      <div className={containerClass}>
        {members.map((member, index) => (
          <TeamMemberCard
            key={member._id}
            member={member}
            index={index}
            isLeadership={isLeadership}
          />
        ))}
      </div>
    </section>
  )
}

export default TeamSection
