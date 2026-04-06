"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Modal } from "@/components/common"

/**
 * Dynamic form field renderer for registration forms
 */
const DynamicFormField = ({ field, value, onChange }) => {
  const { fieldName, fieldLabel, fieldType, required, options, placeholder } = field

  const commonClasses =
    "w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"

  switch (fieldType) {
    case "textarea":
      return (
        <textarea
          name={fieldName}
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={placeholder || fieldLabel}
          required={required}
          rows={4}
          className={commonClasses}
        />
      )

    case "select":
      return (
        <select
          name={fieldName}
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          required={required}
          className={commonClasses}
        >
          <option value="">Select {fieldLabel}</option>
          {options?.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      )

    case "checkbox":
      return (
        <div className="space-y-2">
          {options?.map((option, idx) => (
            <label key={idx} className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                name={fieldName}
                value={option}
                checked={value?.includes(option) || false}
                onChange={(e) => {
                  const currentValues = value || []
                  const newValues = e.target.checked
                    ? [...currentValues, option]
                    : currentValues.filter((v) => v !== option)
                  onChange(fieldName, newValues)
                }}
                className="w-4 h-4 accent-sky-500"
              />
              {option}
            </label>
          ))}
        </div>
      )

    case "radio":
      return (
        <div className="space-y-2">
          {options?.map((option, idx) => (
            <label key={idx} className="flex items-center gap-2 text-slate-300">
              <input
                type="radio"
                name={fieldName}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(fieldName, e.target.value)}
                required={required}
                className="w-4 h-4 accent-sky-500"
              />
              {option}
            </label>
          ))}
        </div>
      )

    default:
      return (
        <input
          type={fieldType}
          name={fieldName}
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={placeholder || fieldLabel}
          required={required}
          className={commonClasses}
        />
      )
  }
}

/**
 * Event registration modal component
 */
const RegistrationModal = ({ isOpen, onClose, event }) => {
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      // Validate required fields
      const requiredFields = event.registrationForm.filter((field) => field.required)
      for (const field of requiredFields) {
        if (!formData[field.fieldName] || formData[field.fieldName].toString().trim() === "") {
          setMessage({ type: "error", text: `${field.fieldLabel} is required` })
          setIsSubmitting(false)
          return
        }
      }

      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Registration submitted successfully!" })
        setFormData({})
        setTimeout(() => {
          onClose()
          setMessage({ type: "", text: "" })
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.message || "Failed to submit registration" })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!event || !event.registrationForm) return null

  const sortedFields = [...event.registrationForm].sort((a, b) => a.order - b.order)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Register for ${event.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {sortedFields.map((field) => (
          <div key={field.fieldName}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {field.fieldLabel}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <DynamicFormField
              field={field}
              value={formData[field.fieldName]}
              onChange={handleInputChange}
            />
          </div>
        ))}

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </motion.button>
      </form>
    </Modal>
  )
}

export default RegistrationModal
export { DynamicFormField }
