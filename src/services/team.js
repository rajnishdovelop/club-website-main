/**
 * Team members API service
 */

import { get, post, put, del } from "./api"

/**
 * Fetch all team members (public)
 * @returns {Promise<object>} - Team members data
 */
export async function getTeamMembers() {
  return get("/api/team")
}

/**
 * Fetch all team members for admin (includes inactive)
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Team members data
 */
export async function getAdminTeamMembers(params = {}) {
  return get("/api/admin/team", { includeInactive: true, ...params })
}

/**
 * Fetch single team member by ID
 * @param {string} id - Team member ID
 * @returns {Promise<object>} - Team member data
 */
export async function getTeamMemberById(id) {
  return get(`/api/admin/team/${id}`)
}

/**
 * Create new team member
 * @param {object} memberData - Team member data
 * @returns {Promise<object>} - Created team member
 */
export async function createTeamMember(memberData) {
  return post("/api/admin/team", memberData)
}

/**
 * Update team member
 * @param {string} id - Team member ID
 * @param {object} memberData - Updated team member data
 * @returns {Promise<object>} - Updated team member
 */
export async function updateTeamMember(id, memberData) {
  return put(`/api/admin/team/${id}`, memberData)
}

/**
 * Delete team member
 * @param {string} id - Team member ID
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteTeamMember(id) {
  return del(`/api/admin/team/${id}`)
}

/**
 * Group team members by role/position
 * @param {Array} members - All team members
 * @returns {object} - Grouped members
 */
export function groupMembersByRole(members) {
  if (!members) return {}

  const groups = {
    "Faculty Advisor": [],
    "Club Coordinator": [],
    "Core Team": [],
    Member: [],
  }

  members.forEach((member) => {
    if (member.position?.toLowerCase().includes("faculty")) {
      groups["Faculty Advisor"].push(member)
    } else if (member.position?.toLowerCase().includes("coordinator")) {
      groups["Club Coordinator"].push(member)
    } else if (member.position?.toLowerCase().includes("core") || member.position?.toLowerCase().includes("head") || member.position?.toLowerCase().includes("lead")) {
      groups["Core Team"].push(member)
    } else {
      groups["Member"].push(member)
    }
  })

  return groups
}

/**
 * Get active team members only
 * @param {Array} members - All team members
 * @returns {Array} - Active team members
 */
export function getActiveMembers(members) {
  if (!members) return []
  return members.filter((m) => m.isActive)
}

export default {
  getTeamMembers,
  getAdminTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  groupMembersByRole,
  getActiveMembers,
}
