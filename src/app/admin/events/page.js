"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "@/components/forms/ImageUpload"

export default function AdminEventsPage() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "upcoming",
    category: "",
    date: "",
    time: "",
    endDate: "",
    venue: "",
    status: "",
    participants: "",
    teams: "",
    registrations: "",
    year: "",
    outcome: "",
    duration: "",
    highlights: [],
    impact: "",
    images: [],
    registrationEnabled: false,
    registrationForm: [],
    isActive: true,
    order: 0,
  })
  const [highlightInput, setHighlightInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [activeTab, setActiveTab] = useState("all")

  // Registration Form Builder State
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [currentField, setCurrentField] = useState({
    fieldName: "",
    fieldLabel: "",
    fieldType: "text",
    required: false,
    options: [],
    placeholder: "",
    order: 0,
  })
  const [optionInput, setOptionInput] = useState("")

  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchEvents()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events?includeInactive=true", { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent._id}` : "/api/admin/events"
      const method = editingEvent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: editingEvent ? "Event updated successfully!" : "Event created successfully!" })
        fetchEvents()
        setTimeout(() => {
          setShowForm(false)
          resetForm()
          setMessage({ type: "", text: "" })
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.message || "Operation failed" })
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        fetchEvents()
        alert("Event deleted successfully")
      } else {
        alert("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("An error occurred")
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      ...event,
      highlights: event.highlights || [],
      images: event.images || [],
      registrationForm: event.registrationForm || [],
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "upcoming",
      category: "",
      date: "",
      time: "",
      endDate: "",
      venue: "",
      status: "",
      participants: "",
      teams: "",
      registrations: "",
      year: "",
      outcome: "",
      duration: "",
      highlights: [],
      impact: "",
      images: [],
      registrationEnabled: false,
      registrationForm: [],
      isActive: true,
      order: 0,
    })
    setEditingEvent(null)
  }

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }))
      setHighlightInput("")
    }
  }

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (imageUrl, publicId) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: imageUrl, publicId: publicId || "" }],
    }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Registration Form Builder Functions
  const addOption = () => {
    if (optionInput.trim()) {
      setCurrentField((prev) => ({
        ...prev,
        options: [...prev.options, optionInput.trim()],
      }))
      setOptionInput("")
    }
  }

  const removeOption = (index) => {
    setCurrentField((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const addFieldToForm = () => {
    if (currentField.fieldName && currentField.fieldLabel) {
      setFormData((prev) => ({
        ...prev,
        registrationForm: [...prev.registrationForm, { ...currentField, order: prev.registrationForm.length }],
      }))
      setCurrentField({
        fieldName: "",
        fieldLabel: "",
        fieldType: "text",
        required: false,
        options: [],
        placeholder: "",
        order: 0,
      })
      setShowFormBuilder(false)
    }
  }

  const removeField = (index) => {
    setFormData((prev) => ({
      ...prev,
      registrationForm: prev.registrationForm.filter((_, i) => i !== index),
    }))
  }

  const filteredEvents = activeTab === "all" ? events : events.filter((e) => e.type === activeTab)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Manage Events</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                ← Dashboard
              </Link>
              {!showForm && (
                <button
                  onClick={() => {
                    resetForm()
                    setShowForm(true)
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  + Create Event
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Events Management</h2>
          <p className="text-gray-300">Create, edit, and manage all events and registrations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "upcoming", "ongoing", "past"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
              {tab} ({tab === "all" ? events.length : events.filter((e) => e.type === tab).length})
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingEvent ? "Edit Event" : "Create New Event"}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Event Type <span className="text-red-400">*</span>
                </label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="Enter event description. Use [link text](url) to add clickable links." />
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
                  Tip: Add links using <code className="bg-gray-700 px-1 rounded text-blue-300">[text](https://url)</code> format
                </p>
              </div>

              {/* Conditional Fields based on type */}
              {formData.type === "upcoming" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                      <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                      <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="e.g., March 15, 2025" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="e.g., 10:00 AM - 5:00 PM"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Venue</label>
                      <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Registrations (display count)</label>
                    <input
                      type="text"
                      value={formData.registrations}
                      onChange={(e) => setFormData({ ...formData, registrations: e.target.value })}
                      placeholder="e.g., 200+"
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </>
              )}

              {formData.type === "ongoing" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
                      <input
                        type="text"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        placeholder="e.g., January 31, 2025"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
                      <input
                        type="text"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        placeholder="e.g., Registration Open"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Participants</label>
                      <input
                        type="text"
                        value={formData.participants}
                        onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                        placeholder="e.g., 150"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Teams</label>
                      <input type="text" value={formData.teams} onChange={(e) => setFormData({ ...formData, teams: e.target.value })} placeholder="e.g., 30" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                </>
              )}

              {formData.type === "past" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
                      <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="e.g., 2024" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Outcome</label>
                      <input
                        type="text"
                        value={formData.outcome}
                        onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                        placeholder="e.g., Best Student Event Award"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                      <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 3 Days" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                      <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="e.g., March 2024" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Venue</label>
                      <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Participants</label>
                    <input
                      type="text"
                      value={formData.participants}
                      onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                      placeholder="e.g., 500+"
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Highlights</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                        placeholder="Add a highlight"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={addHighlight} className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{highlight}</span>
                          <button type="button" onClick={() => removeHighlight(index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Impact</label>
                    <textarea value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} rows={3} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                  </div>
                </>
              )}

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Images</label>
                <ImageUpload onImageUpload={handleImageUpload} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img.url} alt={`Event image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Configuration */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Registration Settings</h3>
                    <p className="text-sm text-gray-400">Enable registration and create custom form</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.registrationEnabled} onChange={(e) => setFormData({ ...formData, registrationEnabled: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                {formData.registrationEnabled && (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-gray-300">Registration Form Fields</label>
                        <button type="button" onClick={() => setShowFormBuilder(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                          + Add Field
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.registrationForm.map((field, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div>
                              <span className="text-white font-medium">{field.fieldLabel}</span>
                              <span className="text-gray-400 text-sm ml-2">({field.fieldType})</span>
                              {field.required && <span className="text-red-400 text-sm ml-2">*</span>}
                            </div>
                            <button type="button" onClick={() => removeField(index)} className="text-red-400 hover:text-red-300">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form Builder Modal */}
                    {showFormBuilder && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                          <h4 className="text-xl font-bold text-white mb-4">Add Form Field</h4>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Field Name (ID)</label>
                              <input
                                type="text"
                                value={currentField.fieldName}
                                onChange={(e) => setCurrentField({ ...currentField, fieldName: e.target.value.replace(/\s/g, "_").toLowerCase() })}
                                placeholder="e.g., full_name"
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Field Label</label>
                              <input type="text" value={currentField.fieldLabel} onChange={(e) => setCurrentField({ ...currentField, fieldLabel: e.target.value })} placeholder="e.g., Full Name" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white" />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Field Type</label>
                              <select value={currentField.fieldType} onChange={(e) => setCurrentField({ ...currentField, fieldType: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white">
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="tel">Phone</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Select Dropdown</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="radio">Radio</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Placeholder</label>
                              <input type="text" value={currentField.placeholder} onChange={(e) => setCurrentField({ ...currentField, placeholder: e.target.value })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white" />
                            </div>

                            {(currentField.fieldType === "select" || currentField.fieldType === "checkbox" || currentField.fieldType === "radio") && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Options</label>
                                <div className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={optionInput}
                                    onChange={(e) => setOptionInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                                    placeholder="Add option"
                                    className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white"
                                  />
                                  <button type="button" onClick={addOption} className="px-4 py-2 bg-sky-500 text-white rounded-lg">
                                    Add
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {currentField.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                                      <span>{option}</span>
                                      <button type="button" onClick={() => removeOption(index)} className="text-red-400">
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <input type="checkbox" checked={currentField.required} onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })} className="w-4 h-4 accent-sky-500" />
                              <label className="text-sm text-gray-300">Required field</label>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button type="button" onClick={addFieldToForm} className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                              Add Field
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowFormBuilder(false)
                                setCurrentField({
                                  fieldName: "",
                                  fieldLabel: "",
                                  fieldType: "text",
                                  required: false,
                                  options: [],
                                  placeholder: "",
                                  order: 0,
                                })
                              }}
                              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Active Status & Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 accent-sky-500" />
                  <label className="text-sm text-gray-300">Active (visible to public)</label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>{message.text}</div>}

              <div className="flex gap-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50">
                  {isSubmitting ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:border-blue-400/50 transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {event.images?.[0] && <img src={event.images[0].url} alt={event.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-sky-500/20 text-blue-400 text-xs rounded-full">{event.type}</span>
                        {event.registrationEnabled && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Registration Enabled</span>}
                        {!event.isActive && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Inactive</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex gap-2 flex-wrap text-xs text-gray-400">
                    {event.date && <span>📅 {event.date}</span>}
                    {event.venue && <span>📍 {event.venue}</span>}
                    {event.category && <span>🏷️ {event.category}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(event)} className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 text-sm">
                    Edit
                  </button>
                  {event.registrationEnabled && (
                    <Link href={`/admin/events/${event._id}/registrations`} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm text-center">
                      Registrations
                    </Link>
                  )}
                  <button onClick={() => handleDelete(event._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-400">
            <p>No events found. Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  )
}
