"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PageHero } from "@/components/common"
import { useCounterAnimation } from "@/hooks"
import StatisticsSection from "./StatCard"
import AchievementTimeline from "./AchievementTimeline"
import FieldsOfExcellence from "./FieldsOfExcellence"

/**
 * Achievements page component
 */
const AchievementsPage = () => {
  const [statistics, setStatistics] = useState([])
  const [achievementFields, setAchievementFields] = useState([])
  const [timelineAchievements, setTimelineAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [counterTargets, setCounterTargets] = useState({})

  const counters = useCounterAnimation(counterTargets)

  useEffect(() => {
    fetchPageSettings()
    fetchAchievements()
  }, [])

  const fetchPageSettings = async () => {
    try {
      const response = await fetch("/api/page-settings?page=achievements")
      const data = await response.json()

      if (data.success) {
        // Set stats cards
        const sortedStats = (data.data.statsCards || []).sort((a, b) => a.order - b.order)
        setStatistics(sortedStats)

        // Build counter targets
        const targets = {}
        sortedStats.forEach((stat, index) => {
          targets[`stat${index}`] = stat.number
        })
        setCounterTargets(targets)

        // Set fields of excellence
        const sortedFields = (data.data.fieldsOfExcellence || []).sort((a, b) => a.order - b.order)
        setAchievementFields(sortedFields)
      }
    } catch (error) {
      console.error("Error fetching page settings:", error)
    }
  }

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/achievements")
      const data = await response.json()

      if (data.success) {
        // Group achievements by year
        const grouped = data.data.reduce((acc, achievement) => {
          const year = achievement.year
          if (!acc[year]) {
            acc[year] = {
              year: year,
              achievements: [],
            }
          }
          acc[year].achievements.push(achievement)
          return acc
        }, {})

        // Convert to array and sort by year descending
        const groupedArray = Object.values(grouped).sort((a, b) => b.year.localeCompare(a.year))
        setTimelineAchievements(groupedArray)
      }
    } catch (error) {
      console.error("Error fetching achievements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <PageHero title="Our Achievements" />

      <StatisticsSection statistics={statistics} counters={counters} />

      <AchievementTimeline timelineAchievements={timelineAchievements} isLoading={isLoading} />

      <FieldsOfExcellence achievementFields={achievementFields} />
    </div>
  )
}

export default AchievementsPage
