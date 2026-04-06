"use client"

import { useState, useEffect, useCallback } from "react"
import { getProjects, filterProjectsByType, getActiveProjects } from "@/services/projects"

/**
 * Custom hook for fetching and managing projects
 * @returns {object} - Projects state and actions
 */
export function useProjects() {
  const [allProjects, setAllProjects] = useState([])
  const [ongoingProjects, setOngoingProjects] = useState([])
  const [completedProjects, setCompletedProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProjects()

      if (data.success) {
        const active = getActiveProjects(data.data)
        const ongoing = filterProjectsByType(data.data, "ongoing")
        const completed = filterProjectsByType(data.data, "completed")

        setAllProjects(active)
        setOngoingProjects(ongoing)
        setCompletedProjects(completed)
      }
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    allProjects,
    ongoingProjects,
    completedProjects,
    isLoading,
    error,
    fetchProjects,
    refetch: fetchProjects,
  }
}

export default useProjects
