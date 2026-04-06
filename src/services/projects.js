/**
 * Projects API service
 */

import { get, post, put, del } from "./api"

/**
 * Fetch all projects (public)
 * @returns {Promise<object>} - Projects data
 */
export async function getProjects() {
  return get("/api/projects")
}

/**
 * Fetch all projects for admin (includes inactive)
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Projects data
 */
export async function getAdminProjects(params = {}) {
  return get("/api/admin/projects", { includeInactive: true, ...params })
}

/**
 * Fetch single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<object>} - Project data
 */
export async function getProjectById(id) {
  return get(`/api/admin/projects/${id}`)
}

/**
 * Create new project
 * @param {object} projectData - Project data
 * @returns {Promise<object>} - Created project
 */
export async function createProject(projectData) {
  return post("/api/admin/projects", projectData)
}

/**
 * Update project
 * @param {string} id - Project ID
 * @param {object} projectData - Updated project data
 * @returns {Promise<object>} - Updated project
 */
export async function updateProject(id, projectData) {
  return put(`/api/admin/projects/${id}`, projectData)
}

/**
 * Delete project
 * @param {string} id - Project ID
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteProject(id) {
  return del(`/api/admin/projects/${id}`)
}

/**
 * Filter projects by type
 * @param {Array} projects - All projects
 * @param {string} type - Project type (ongoing, completed)
 * @returns {Array} - Filtered projects
 */
export function filterProjectsByType(projects, type) {
  if (!projects) return []
  return projects.filter((p) => p.type === type && p.isActive)
}

/**
 * Get active projects only
 * @param {Array} projects - All projects
 * @returns {Array} - Active projects
 */
export function getActiveProjects(projects) {
  if (!projects) return []
  return projects.filter((p) => p.isActive)
}

export default {
  getProjects,
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  filterProjectsByType,
  getActiveProjects,
}
