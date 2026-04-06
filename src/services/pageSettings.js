/**
 * Page settings API service
 */

import { get, put } from "./api"

/**
 * Fetch page settings by page name
 * @param {string} page - Page name (home, achievements, etc.)
 * @returns {Promise<object>} - Page settings data
 */
export async function getPageSettings(page) {
  return get("/api/page-settings", { page })
}

/**
 * Update page settings
 * @param {string} page - Page name
 * @param {object} settings - Page settings data
 * @returns {Promise<object>} - Updated settings
 */
export async function updatePageSettings(page, settings) {
  return put("/api/admin/page-settings", { page, ...settings })
}

/**
 * Get home page settings
 * @returns {Promise<object>} - Home page settings
 */
export async function getHomeSettings() {
  return getPageSettings("home")
}

/**
 * Get achievements page settings
 * @returns {Promise<object>} - Achievements page settings
 */
export async function getAchievementsSettings() {
  return getPageSettings("achievements")
}

export default {
  getPageSettings,
  updatePageSettings,
  getHomeSettings,
  getAchievementsSettings,
}
