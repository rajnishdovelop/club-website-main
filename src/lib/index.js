/**
 * Library index - export all utility functions and configurations
 */

// Database
export { default as dbConnect } from "./dbConnect"

// Cloudinary
export { 
  default as cloudinary, 
  uploadToCloudinary, 
  deleteFromCloudinary,
  getOptimizedImageUrl,
  extractPublicId,
  isCloudinaryConfigured 
} from "./cloudinary"

// Auth utilities
export { validateAdminSession, requireAdmin } from "./adminAuth"
export { verifyToken, createToken } from "./authUtils"
export { verifyTokenEdge } from "./edgeAuth"

// Validation schemas
export { 
  projectSchema, 
  eventSchema, 
  achievementSchema, 
  validateBody 
} from "./validations"
