import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Check if Cloudinary is properly configured
export const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
}

// Upload image to Cloudinary
export const uploadToCloudinary = async (fileBuffer, fileName, folder = "team-members") => {
  try {
    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary is not properly configured. Please check your environment variables.")
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: folder,
            public_id: fileName,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )
        .end(fileBuffer)
    })
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`)
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary is not properly configured")
    }

    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`)
  }
}

// Generate optimized URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  if (!isCloudinaryConfigured() || !publicId) {
    return null
  }

  const defaultOptions = {
    width: 400,
    height: 400,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    fetch_format: "auto",
  }

  const finalOptions = { ...defaultOptions, ...options }

  return cloudinary.url(publicId, finalOptions)
}

// Extract public ID from Cloudinary URL
export const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== "string") {
    return null
  }

  // Extract public ID from Cloudinary URL
  const matches = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)$/i)
  return matches ? matches[1] : null
}

export default cloudinary
