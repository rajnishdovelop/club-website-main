"use client"

import { useState, useEffect, useCallback } from "react"
import { getTeamMembers, groupMembersByRole, getActiveMembers } from "@/services/team"

/**
 * Custom hook for fetching and managing team members
 * @returns {object} - Team members state and actions
 */
export function useTeamMembers() {
  const [members, setMembers] = useState([])
  const [groupedMembers, setGroupedMembers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getTeamMembers()

      if (data.success) {
        const active = getActiveMembers(data.data)
        setMembers(active)
        setGroupedMembers(groupMembersByRole(active))
      }
    } catch (err) {
      console.error("Error fetching team members:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    members,
    groupedMembers,
    isLoading,
    error,
    fetchTeamMembers,
    refetch: fetchTeamMembers,
  }
}

export default useTeamMembers
