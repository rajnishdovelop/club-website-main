"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function EventRegistrationsPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id

  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        if (data.user && data.user.role === "admin") {
          fetchRegistrations()
        } else {
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/login")
    }
  }

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching registrations for event:", eventId)
      const response = await fetch(`/api/admin/events/${eventId}/registrations`, { credentials: "include" })
      const data = await response.json()

      console.log("API Response:", data)

      if (data.success) {
        console.log("Event:", data.event)
        console.log("Registrations:", data.registrations)
        setEvent(data.event)
        setRegistrations(data.registrations)
      } else {
        console.error("API Error:", data.message)
        setMessage({ type: "error", text: data.message || "Failed to fetch registrations" })
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setMessage({ type: "error", text: "Error loading registrations" })
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!registrations || !registrations.length) return

    // Get all unique field names from registrations
    const allFields = new Set()
    registrations.forEach((reg) => {
      if (reg.formData) {
        Object.keys(reg.formData).forEach((field) => allFields.add(field))
      }
    })

    // Create CSV header
    const headers = ["Registration Date", "User Email", ...Array.from(allFields)]
    const csvContent = [
      headers.join(","),
      ...registrations.map((reg) => {
        const row = [
          new Date(reg.registeredAt).toLocaleString(),
          reg.userEmail || "N/A",
          ...Array.from(allFields).map((field) => {
            const value = reg.formData[field] || ""
            // Escape commas and quotes in CSV
            return `"${String(value).replace(/"/g, '""')}"`
          }),
        ]
        return row.join(",")
      }),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event?.title || "event"}-registrations.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

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
              <Link href="/admin/events" className="text-white hover:text-gray-300 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">Event Registrations</h1>
            </div>
            <div className="flex items-center space-x-4">
              {registrations && registrations.length > 0 && (
                <button onClick={exportToCSV} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          {event && (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">{event.title}</h2>
              <p className="text-gray-300">Total Registrations: {registrations?.length || 0}</p>
            </>
          )}
        </div>

        {/* Messages */}
        {message.text && <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 border border-green-500 text-green-200" : "bg-red-500/20 border border-red-500 text-red-200"}`}>{message.text}</div>}

        {/* Registrations List */}
        {!registrations || registrations.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl text-gray-400">No registrations yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration, index) => (
              <div key={registration._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400">Registration #{index + 1}</h3>
                    <p className="text-sm text-gray-400">{new Date(registration.registeredAt).toLocaleString()}</p>
                  </div>
                  {registration.userEmail && <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">{registration.userEmail}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registration.formData &&
                    Object.entries(registration.formData).map(([key, value]) => (
                      <div key={key} className="border-l-2 border-gray-700 pl-4">
                        <p className="text-sm text-gray-400 mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                        <p className="text-white">{Array.isArray(value) ? value.join(", ") : value || "N/A"}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Registration Form Preview */}
        {event && event.registrationForm && event.registrationForm.length > 0 && (
          <div className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-2xl font-semibold mb-4">Registration Form Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.registrationForm.map((field, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-blue-300">{field.fieldLabel}</p>
                    {field.required && <span className="text-red-400 text-sm">Required</span>}
                  </div>
                  <p className="text-sm text-gray-400 mb-1">
                    Type: <span className="text-gray-300">{field.fieldType}</span>
                  </p>
                  {field.options && field.options.length > 0 && <p className="text-xs text-gray-500">Options: {field.options.join(", ")}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
