"use client"

import React, { useState, useEffect } from "react"
import TeamSection from "./TeamSection"
import { useTeamMembers } from "@/hooks"
import { PageLoading } from "@/components/common"

/**
 * Team members page component - displays all team members
 */
const TeamMembers = () => {
  const [activeSection, setActiveSection] = useState("leadership")
  const { members, isLoading, error, fetchTeamMembers } = useTeamMembers()

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    const sections = document.querySelectorAll('[id^="section-"]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [members])

  // Group team members by position
  const leadership = members.filter(
    (member) =>
      member.position.toLowerCase().includes("head") ||
      member.position.toLowerCase().includes("president") ||
      member.position.toLowerCase().includes("lead")
  )

  const coreMembers = members.filter(
    (member) =>
      member.position.toLowerCase().includes("core") ||
      member.position.toLowerCase().includes("member")
  )

  const developers = members.filter((member) =>
    member.position.toLowerCase().includes("developer")
  )

  // Loading state
  if (isLoading) {
    return <PageLoading text="Loading our amazing team..." />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={fetchTeamMembers}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (members.length === 0) {
    return (
      <div className="min-h-screen relative">
        <div className="text-center py-16">
          <div className="text-gray-400 text-xl mb-4">No team members found</div>
          <div className="text-gray-500 text-sm">
            Team information will be displayed here once available
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Leadership Section */}
        <TeamSection
          id="section-leadership"
          title="Leadership"
          members={leadership}
          isLeadership={true}
          gradientFrom="sky-400"
          gradientTo="blue-500"
          animationDirection="left"
        />

        {/* Core Members Section */}
        <TeamSection
          id="section-members"
          title="Core Members"
          members={coreMembers}
          isLeadership={false}
          gradientFrom="cyan-400"
          gradientTo="blue-500"
          animationDirection="right"
        />

        {/* Developer Section */}
        <TeamSection
          id="section-developer"
          title="Development Team"
          members={developers}
          isLeadership={true}
          gradientFrom="sky-400"
          gradientTo="cyan-400"
          animationDirection="up"
        />
      </div>
    </div>
  )
}

export default TeamMembers
