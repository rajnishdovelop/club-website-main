"use client"

import { useState, useEffect, useRef } from "react"

/**
 * Custom hook for animated counter effect
 * Animates numbers from 0 to target values
 * 
 * @param {Object} targets - Object with keys as counter names and values as target numbers
 * @param {number} duration - Animation duration in ms (default: 2000)
 * @param {number} steps - Number of animation steps (default: 50)
 * @returns {Object} Current counter values
 * 
 * @example
 * const counters = useCounterAnimation({ projects: 100, awards: 50 })
 * // counters.projects will animate from 0 to 100
 * // counters.awards will animate from 0 to 50
 */
export const useCounterAnimation = (targets, duration = 2000, steps = 50) => {
  const [counters, setCounters] = useState({})
  const animationIntervalRef = useRef(null)

  useEffect(() => {
    if (!targets || Object.keys(targets).length === 0) return

    const stepTime = duration / steps
    const initialCounters = {}

    Object.keys(targets).forEach((key) => {
      initialCounters[key] = 0
    })

    setCounters(initialCounters)

    const intervalId = setInterval(() => {
      setCounters((prev) => {
        const newCounters = { ...prev }
        let allReached = true

        Object.keys(targets).forEach((key) => {
          if (newCounters[key] < targets[key]) {
            newCounters[key] = Math.min(
              newCounters[key] + Math.ceil(targets[key] / steps),
              targets[key]
            )
            allReached = false
          }
        })

        if (allReached) {
          clearInterval(intervalId)
          animationIntervalRef.current = null
        }

        return newCounters
      })
    }, stepTime)

    animationIntervalRef.current = intervalId

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [targets, duration, steps])

  return counters
}
