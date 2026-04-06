"use client"

import React, { useState, useEffect } from "react"
import { Modal } from "@/components/common"
import { PageHero } from "@/components/common"
import { CTASection } from "@/components/common"
import { TabNavigation } from "@/components/common"
import ProjectGrid from "./ProjectGrid"
import ProjectModalContent from "./ProjectModalContent"
import { useProjects } from "@/hooks"

/**
 * Projects page component - displays all club projects
 */
const Projects = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use custom hooks
  const { allProjects, ongoingProjects, completedProjects, isLoading, fetchProjects } = useProjects()

  useEffect(() => {
    fetchProjects()
  }, [])

  // Event handlers
  const handleViewDetails = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  // Tab configuration
  const tabs = [
    { id: "all", label: "All Projects", count: allProjects.length },
    { id: "ongoing", label: "Ongoing Projects", count: ongoingProjects.length },
    { id: "completed", label: "Completed Projects", count: completedProjects.length },
  ]

  // CTA section configuration
  const ctaButtons = [
    { label: "Propose a Project", href: "/message-us", variant: "primary" },
    { label: "Join Our Team", href: "/team", variant: "outline" },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <PageHero title="Our Projects" />

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Project categories"
        className="mb-12"
      />

      {/* Content Sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        {/* All Projects - 3 columns */}
        {activeTab === "all" && (
          <ProjectGrid
            projects={allProjects}
            onViewDetails={handleViewDetails}
            variant="default"
            columns={3}
          />
        )}

        {/* Ongoing Projects - 2 columns */}
        {activeTab === "ongoing" && (
          <ProjectGrid
            projects={ongoingProjects}
            onViewDetails={handleViewDetails}
            variant="ongoing"
            columns={2}
          />
        )}

        {/* Completed Projects - 3 columns */}
        {activeTab === "completed" && (
          <ProjectGrid
            projects={completedProjects}
            onViewDetails={handleViewDetails}
            variant="completed"
            columns={3}
          />
        )}
      </div>

      {/* Bottom CTA Section */}
      <CTASection
        title="Have a Project Idea?"
        description="Join our research community and contribute to cutting-edge projects in civil engineering. Let's build the future together with innovative solutions."
        buttons={ctaButtons}
      />

      {/* Project Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject?.title}
      >
        <ProjectModalContent project={selectedProject} />
      </Modal>
    </div>
  )
}

export default Projects
