"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminAchievements() {
  const router = useRouter()
  const [achievements, setAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    impact: "",
    year: new Date().getFullYear().toString(),
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    checkAuth()
    fetchAchievements()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" })
      if (!response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/login")
    }
  }

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/achievements?includeInactive=true", { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setAchievements(data.data)
      }
    } catch (error) {
      console.error("Error fetching achievements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/admin/achievements/${editingId}` : "/api/admin/achievements"
      const method = editingId ? "PUT" : "POST"

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
        alert(editingId ? "Achievement updated successfully!" : "Achievement created successfully!")
        setShowForm(false)
        setEditingId(null)
        resetForm()
        fetchAchievements()
      } else {
        alert("Error: " + (data.error || "Failed to save achievement"))
      }
    } catch (error) {
      console.error("Error saving achievement:", error)
      alert("Failed to save achievement")
    }
  }

  const handleEdit = (achievement) => {
    setFormData({
      title: achievement.title || "",
      category: achievement.category || "",
      description: achievement.description || "",
      impact: achievement.impact || "",
      year: achievement.year || new Date().getFullYear().toString(),
      isActive: achievement.isActive !== undefined ? achievement.isActive : true,
      order: achievement.order || 0,
    })
    setEditingId(achievement._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return

    try {
      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        alert("Achievement deleted successfully!")
        fetchAchievements()
      } else {
        alert("Error: " + (data.error || "Failed to delete achievement"))
      }
    } catch (error) {
      console.error("Error deleting achievement:", error)
      alert("Failed to delete achievement")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      impact: "",
      year: new Date().getFullYear().toString(),
      isActive: true,
      order: 0,
    })
    setEditingId(null)
  }

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const year = achievement.year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(achievement)
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Achievements</h1>
              <p className="text-gray-300">Create and manage achievement timeline</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => router.push("/admin")} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(!showForm)
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showForm ? "Cancel" : "+ Add Achievement"}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? "Edit Achievement" : "Create New Achievement"}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    placeholder="Enter achievement title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    placeholder="e.g., Research Excellence, Innovation"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Year *</label>
                  <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="e.g., 2024" />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    placeholder="Describe the achievement"
                  />
                </div>

                {/* Impact */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Impact</label>
                  <textarea
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    placeholder="Describe the impact of this achievement"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    placeholder="Display order"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                    <span className="ml-3 text-gray-300">Active (visible on public page)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {editingId ? "Update Achievement" : "Create Achievement"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Achievements List */}
        <div className="space-y-8">
          {Object.keys(groupedAchievements)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <div key={year} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">{year}</h2>
                <div className="space-y-4">
                  {groupedAchievements[year]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((achievement) => (
                      <div key={achievement._id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-blue-400/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-500/30">{achievement.category}</span>
                              {!achievement.isActive && <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full">Inactive</span>}
                            </div>
                            {achievement.description && <p className="text-gray-300 mb-2">{achievement.description}</p>}
                            {achievement.impact && (
                              <p className="text-sm text-gray-400">
                                <span className="font-semibold text-green-400">Impact:</span> {achievement.impact}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">Order: {achievement.order || 0}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => handleEdit(achievement)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(achievement._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

          {achievements.length === 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No achievements yet. Click "Add Achievement" to create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
