"use client"

import { useState, useEffect, useCallback } from "react"
import { getEvents, filterEventsByType, getActiveEvents } from "@/services/events"

/**
 * Custom hook for fetching and managing events
 * @returns {object} - Events state and actions
 */
export function useEvents() {
  const [allEvents, setAllEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [ongoingEvents, setOngoingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getEvents()

      if (data.success) {
        const active = getActiveEvents(data.data)
        const upcoming = filterEventsByType(data.data, "upcoming")
        const ongoing = filterEventsByType(data.data, "ongoing")
        const past = filterEventsByType(data.data, "past")

        setAllEvents(active)
        setUpcomingEvents(upcoming)
        setOngoingEvents(ongoing)
        setPastEvents(past)
      }
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    allEvents,
    upcomingEvents,
    ongoingEvents,
    pastEvents,
    isLoading,
    error,
    fetchEvents,
    refetch: fetchEvents,
  }
}

export default useEvents
