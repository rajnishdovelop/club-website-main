"use client"

import { useState, useEffect, useCallback } from "react"
import { getAchievements, groupAchievementsByYear, getActiveAchievements } from "@/services/achievements"

/**
 * Custom hook for fetching and managing achievements
 * @returns {object} - Achievements state and actions
 */
export function useAchievements() {
  const [achievements, setAchievements] = useState([])
  const [timelineAchievements, setTimelineAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAchievements = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAchievements()

      if (data.success) {
        const active = getActiveAchievements(data.data)
        setAchievements(active)
        setTimelineAchievements(groupAchievementsByYear(active))
      }
    } catch (err) {
      console.error("Error fetching achievements:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return {
    achievements,
    timelineAchievements,
    isLoading,
    error,
    refetch: fetchAchievements,
  }
}

export default useAchievements
