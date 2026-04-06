"use client"

import { useState, useEffect, useCallback } from "react"
import { getPageSettings } from "@/services/pageSettings"

/**
 * Custom hook for fetching page settings
 * @param {string} page - Page name (home, achievements, etc.)
 * @returns {object} - Page settings state and actions
 */
export function usePageSettings(page) {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    if (!page) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await getPageSettings(page)

      if (data.success) {
        setSettings(data.data)
      }
    } catch (err) {
      console.error(`Error fetching ${page} page settings:`, err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    refetch: fetchSettings,
  }
}

export default usePageSettings
