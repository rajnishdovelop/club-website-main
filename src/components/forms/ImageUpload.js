"use client"

import { useState, useRef } from "react"

/**
 * Image upload component with drag-and-drop support
 */
const ImageUpload = ({ currentImage, onImageUpload, isUploading = false }) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, and WebP are allowed.")
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("File size too large. Maximum size is 5MB.")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload file
    try {
      setUploadProgress(0)
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadProgress(100)
        onImageUpload(data.data.url, data.data.publicId)
      } else {
        alert(data.message || "Upload failed")
        setPreview(currentImage)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
      setPreview(currentImage)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setPreview(null)
    onImageUpload("", null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image *</label>

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"
          } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            disabled={isUploading}
          />

          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                />
                {!isUploading && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-sm transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>

              {!isUploading && (
                <div>
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Upload Profile Image</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Drag and drop an image here, or click to select
                </p>
                <button
                  type="button"
                  onClick={onButtonClick}
                  disabled={isUploading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                >
                  {isUploading ? "Uploading..." : "Select Image"}
                </button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* File Requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supported formats: JPEG, PNG, WebP</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Recommended dimensions: 400x400px</p>
          <p>• Images will be automatically optimized and cropped</p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
