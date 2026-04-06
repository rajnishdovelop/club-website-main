"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Modern form input field
 */
const FormField = ({ label, name, type = "text", value, onChange, required, maxLength, placeholder, disabled, rows }) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const baseClasses = `w-full px-4 py-3.5 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 
    focus:outline-none transition-all duration-300 ${
      isFocused 
        ? "border-sky-500/50 ring-2 ring-sky-500/20" 
        : "border-slate-700/50 hover:border-slate-600"
    }`

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-400 mb-2">
        {label} {required && <span className="text-sky-400">*</span>}
      </label>
      {type === "textarea" ? (
        <div className="relative">
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            rows={rows || 5}
            maxLength={maxLength}
            className={`${baseClasses} resize-none`}
            placeholder={placeholder}
            disabled={disabled}
          />
          {maxLength && (
            <div className="absolute bottom-3 right-3">
              <span className={`text-xs ${value.length > maxLength * 0.9 ? 'text-amber-400' : 'text-slate-600'}`}>
                {value.length}/{maxLength}
              </span>
            </div>
          )}
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          maxLength={maxLength}
          className={baseClasses}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  )
}

/**
 * Status message component
 */
const StatusMessage = ({ status }) => {
  if (!status.message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
          status.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        {status.type === "success" ? (
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="text-sm">{status.message}</span>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Submit button component
 */
const SubmitButton = ({ isSubmitting }) => (
  <motion.button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 
      disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed 
      text-white font-semibold rounded-xl transition-all duration-300 
      flex items-center justify-center gap-3 relative overflow-hidden group"
    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
  >
    {/* Shine effect */}
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    
    {isSubmitting ? (
      <>
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Sending...</span>
      </>
    ) : (
      <>
        <span>Send Message</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </>
    )}
  </motion.button>
)

/**
 * Contact form component
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (submitStatus.message) {
      setSubmitStatus({ type: "", message: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: "", message: "" })

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message,
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        let errorMessage = data.message || "Failed to send message"
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorDetails = data.errors.map((err) => err.message || err).join(", ")
          errorMessage = errorDetails
        }
        setSubmitStatus({
          type: "error",
          message: errorMessage,
        })
      }
    } catch (error) {
      console.error("Submit error:", error)
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Form card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/50 p-8 md:p-10">
        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/5 to-transparent" />
        
        <div className="relative">
          {/* Form header */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Send a Message
            </h3>
            <p className="text-slate-500 text-sm">
              Fill out the form below and we will get back to you shortly.
            </p>
          </div>

          <StatusMessage status={submitStatus} />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone & Subject row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                maxLength={20}
                placeholder="+91 9876543210"
                disabled={isSubmitting}
              />
              <FormField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="How can we help?"
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <FormField
              label="Message"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              maxLength={2000}
              placeholder="Tell us about your project, idea, or inquiry..."
              disabled={isSubmitting}
            />

            {/* Submit */}
            <div className="pt-2">
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactForm
export { FormField, StatusMessage, SubmitButton }
