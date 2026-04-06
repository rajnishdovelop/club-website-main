"use client"

import React from "react"
import { parseLinks } from "@/utils/parseLinks"

// Icon components
const TeamIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const PublicationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

/**
 * Modal content for displaying project details
 * @param {object} props - Component props
 * @param {object} props.project - Project data
 */
const ProjectModalContent = ({ project }) => {
  if (!project) return null

  const isOngoing = project.type === "ongoing"

  return (
    <div className="space-y-5">
      {/* Header with Status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded ${
            isOngoing
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-slate-500/10 text-slate-300 border border-slate-500/20"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-emerald-400" : "bg-slate-400"}`} />
          {isOngoing ? "In Progress" : "Completed"}
        </span>

        {/* Key metrics inline */}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {project.teamSize > 0 && (
            <span className="flex items-center gap-1.5">
              <TeamIcon />
              {project.teamSize}
            </span>
          )}
          {project.publications > 0 && (
            <span className="flex items-center gap-1.5">
              <PublicationIcon />
              {project.publications}
            </span>
          )}
        </div>
      </div>

      {/* Progress for ongoing */}
      {project.progress > 0 && isOngoing && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Progress</span>
            <span className="text-sm font-semibold text-white">{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div>
          <p className="text-slate-300 leading-relaxed text-sm">{parseLinks(project.description)}</p>
        </div>
      )}

      {/* Details Grid */}
      {(project.timeline || project.completionDate || project.funding) && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 border-y border-slate-700/50">
          {(project.timeline || project.completionDate) && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {isOngoing ? "Timeline" : "Completed"}
              </p>
              <p className="text-sm text-white">{project.timeline || project.completionDate}</p>
            </div>
          )}
          {project.funding && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Funding</p>
              <p className="text-sm text-white">{project.funding}</p>
            </div>
          )}
        </div>
      )}

      {/* Lead Members */}
      {project.leadMembers && project.leadMembers.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Project Leads</p>
          <div className="flex flex-wrap gap-2">
            {project.leadMembers.map((member, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-800/80 text-slate-200 text-sm rounded-md border border-slate-700/50"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-800/50 text-slate-300 text-xs font-medium rounded border border-slate-700/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expected Outcomes (for ongoing) */}
      {project.expectedOutcomes && project.expectedOutcomes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Expected Outcomes</p>
          <ul className="space-y-2">
            {project.expectedOutcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-slate-800 text-slate-400 text-xs rounded mt-0.5">
                  {idx + 1}
                </span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Results (for completed) */}
      {project.results && project.results.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Key Results</p>
          <ul className="space-y-2">
            {project.results.map((result, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckIcon />
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Impact */}
      {project.impact && (
        <div className="bg-slate-800/40 rounded-lg p-4 border-l-2 border-sky-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Impact</p>
          <p className="text-sm text-slate-300 leading-relaxed">{project.impact}</p>
        </div>
      )}

      {/* Awards */}
      {project.awards && project.awards.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Recognition</p>
          <div className="space-y-2">
            {project.awards.map((award, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <StarIcon />
                <span className="text-slate-200">{award}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members (for completed projects) */}
      {project.teamMembers && project.teamMembers.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Team Members</p>
          <div className="flex flex-wrap gap-2">
            {project.teamMembers.map((member, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-800/80 text-slate-200 text-sm rounded-md border border-slate-700/50"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectModalContent
