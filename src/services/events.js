/**
 * Events API service
 */

import { get, post, put, del } from "./api"

/**
 * Fetch all events (public)
 * @returns {Promise<object>} - Events data
 */
export async function getEvents() {
  return get("/api/events")
}

/**
 * Fetch all events for admin (includes inactive)
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Events data
 */
export async function getAdminEvents(params = {}) {
  return get("/api/admin/events", { includeInactive: true, ...params })
}

/**
 * Fetch single event by ID
 * @param {string} id - Event ID
 * @returns {Promise<object>} - Event data
 */
export async function getEventById(id) {
  return get(`/api/admin/events/${id}`)
}

/**
 * Create new event
 * @param {object} eventData - Event data
 * @returns {Promise<object>} - Created event
 */
export async function createEvent(eventData) {
  return post("/api/admin/events", eventData)
}

/**
 * Update event
 * @param {string} id - Event ID
 * @param {object} eventData - Updated event data
 * @returns {Promise<object>} - Updated event
 */
export async function updateEvent(id, eventData) {
  return put(`/api/admin/events/${id}`, eventData)
}

/**
 * Delete event
 * @param {string} id - Event ID
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteEvent(id) {
  return del(`/api/admin/events/${id}`)
}

/**
 * Register for event
 * @param {string} eventId - Event ID
 * @param {object} registrationData - Registration form data
 * @returns {Promise<object>} - Registration result
 */
export async function registerForEvent(eventId, registrationData) {
  return post("/api/events/register", { eventId, ...registrationData })
}

/**
 * Filter events by type
 * @param {Array} events - All events
 * @param {string} type - Event type (upcoming, ongoing, past)
 * @returns {Array} - Filtered events
 */
export function filterEventsByType(events, type) {
  if (!events) return []
  return events.filter((e) => e.type === type && e.isActive)
}

/**
 * Get active events only
 * @param {Array} events - All events
 * @returns {Array} - Active events
 */
export function getActiveEvents(events) {
  if (!events) return []
  return events.filter((e) => e.isActive)
}

export default {
  getEvents,
  getAdminEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  filterEventsByType,
  getActiveEvents,
}
