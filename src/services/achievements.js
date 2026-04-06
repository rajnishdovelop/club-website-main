/**
 * Achievements API service
 */

import { get, post, put, del } from "./api"

/**
 * Fetch all achievements (public)
 * @returns {Promise<object>} - Achievements data
 */
export async function getAchievements() {
  return get("/api/achievements")
}

/**
 * Fetch all achievements for admin (includes inactive)
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Achievements data
 */
export async function getAdminAchievements(params = {}) {
  return get("/api/admin/achievements", { includeInactive: true, ...params })
}

/**
 * Fetch single achievement by ID
 * @param {string} id - Achievement ID
 * @returns {Promise<object>} - Achievement data
 */
export async function getAchievementById(id) {
  return get(`/api/admin/achievements/${id}`)
}

/**
 * Create new achievement
 * @param {object} achievementData - Achievement data
 * @returns {Promise<object>} - Created achievement
 */
export async function createAchievement(achievementData) {
  return post("/api/admin/achievements", achievementData)
}

/**
 * Update achievement
 * @param {string} id - Achievement ID
 * @param {object} achievementData - Updated achievement data
 * @returns {Promise<object>} - Updated achievement
 */
export async function updateAchievement(id, achievementData) {
  return put(`/api/admin/achievements/${id}`, achievementData)
}

/**
 * Delete achievement
 * @param {string} id - Achievement ID
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteAchievement(id) {
  return del(`/api/admin/achievements/${id}`)
}

/**
 * Group achievements by year
 * @param {Array} achievements - All achievements
 * @returns {Array} - Grouped achievements by year (sorted descending)
 */
export function groupAchievementsByYear(achievements) {
  if (!achievements) return []

  const grouped = achievements.reduce((acc, achievement) => {
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

  return Object.values(grouped).sort((a, b) => b.year.localeCompare(a.year))
}

/**
 * Get active achievements only
 * @param {Array} achievements - All achievements
 * @returns {Array} - Active achievements
 */
export function getActiveAchievements(achievements) {
  if (!achievements) return []
  return achievements.filter((a) => a.isActive)
}

export default {
  getAchievements,
  getAdminAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  groupAchievementsByYear,
  getActiveAchievements,
}
