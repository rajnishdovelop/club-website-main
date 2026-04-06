"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "@/components/forms/ImageUpload"

export default function AdminProjectsPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "ongoing",
    expectedOutcomes: [],
    leadMembers: [],
    technologies: [],
    timeline: "",
    progress: 0,
    funding: "",
    status: "",
    results: [],
    impact: "",
    completionDate: "",
    teamSize: 0,
    publications: 0,
    awards: [],
    teamMembers: [],
    category: "",
    image: "",
    images: [],
    isActive: true,
    order: 0,
  })
  const [arrayInputs, setArrayInputs] = useState({
    expectedOutcomes: "",
    leadMembers: "",
    technologies: "",
    results: "",
    awards: "",
    teamMembers: "",
  })
  const [activeArrayField, setActiveArrayField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [activeTab, setActiveTab] = useState("all")

  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProjects()
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

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects?includeInactive=true", { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      const url = editingProject ? `/api/admin/projects/${editingProject._id}` : "/api/admin/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: data.message })
        fetchProjects()
        resetForm()
        setShowForm(false)
      } else {
        setMessage({ type: "error", text: data.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title || "",
      description: project.description || "",
      type: project.type || "ongoing",
      expectedOutcomes: project.expectedOutcomes || [],
      leadMembers: project.leadMembers || [],
      technologies: project.technologies || [],
      timeline: project.timeline || "",
      progress: project.progress || 0,
      funding: project.funding || "",
      status: project.status || "",
      results: project.results || [],
      impact: project.impact || "",
      completionDate: project.completionDate || "",
      teamSize: project.teamSize || 0,
      publications: project.publications || 0,
      awards: project.awards || [],
      teamMembers: project.teamMembers || [],
      category: project.category || "",
      image: project.image || "",
      images: project.images || [],
      isActive: project.isActive ?? true,
      order: project.order || 0,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Project deleted successfully" })
        fetchProjects()
      } else {
        setMessage({ type: "error", text: data.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete project" })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "ongoing",
      expectedOutcomes: [],
      leadMembers: [],
      technologies: [],
      timeline: "",
      progress: 0,
      funding: "",
      status: "",
      results: [],
      impact: "",
      completionDate: "",
      teamSize: 0,
      publications: 0,
      awards: [],
      teamMembers: [],
      category: "",
      image: "",
      images: [],
      isActive: true,
      order: 0,
    })
    setEditingProject(null)
    setArrayInputs({
      expectedOutcomes: "",
      leadMembers: "",
      technologies: "",
      results: "",
      awards: "",
      teamMembers: "",
    })
    setActiveArrayField(null)
  }

  const addToArray = (field) => {
    if (arrayInputs[field]?.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], arrayInputs[field].trim()],
      })
      setArrayInputs({ ...arrayInputs, [field]: "" })
    }
  }

  const removeFromArray = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    })
  }

  const handleImageUpload = (imageUrl, publicId) => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: imageUrl, publicId }],
    })
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const filteredProjects = activeTab === "all" ? projects : projects.filter((p) => p.type === activeTab)

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
              <h1 className="text-xl font-bold text-white">Manage Projects</h1>
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
                  + Create Project
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Projects Management</h2>
          <p className="text-gray-300">Create, edit, and manage all projects</p>
        </div>

        {/* Messages */}
        {message.text && <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 border border-green-500 text-green-200" : "bg-red-500/20 border border-red-500 text-red-200"}`}>{message.text}</div>}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "ongoing", "completed"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
              {tab} ({tab === "all" ? projects.length : projects.filter((p) => p.type === tab).length})
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{editingProject ? "Edit Project" : "Create New Project"}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white mb-2">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
              </div>

              {/* Type */}
              <div>
                <label className="block text-white mb-2">Project Type *</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400">
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white mb-2">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="Enter project description. Use [link text](url) to add clickable links." />
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
                  Tip: Add links using <code className="bg-gray-700 px-1 rounded text-blue-300">[text](https://url)</code> format
                </p>
              </div>

              {/* Conditional Fields Based on Type */}
              {formData.type === "ongoing" ? (
                <>
                  {/* Expected Outcomes */}
                  <div>
                    <label className="block text-white mb-2">Expected Outcomes</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={arrayInputs.expectedOutcomes}
                        onChange={(e) => setArrayInputs({ ...arrayInputs, expectedOutcomes: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("expectedOutcomes"))}
                        placeholder="Add outcome and press Enter"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => addToArray("expectedOutcomes")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.expectedOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{outcome}</span>
                          <button type="button" onClick={() => removeFromArray("expectedOutcomes", index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lead Members */}
                  <div>
                    <label className="block text-white mb-2">Lead Members</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={arrayInputs.leadMembers}
                        onChange={(e) => setArrayInputs({ ...arrayInputs, leadMembers: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("leadMembers"))}
                        placeholder="Add member name and press Enter"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => addToArray("leadMembers")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.leadMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{member}</span>
                          <button type="button" onClick={() => removeFromArray("leadMembers", index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-white mb-2">Technologies</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={arrayInputs.technologies}
                        onChange={(e) => setArrayInputs({ ...arrayInputs, technologies: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("technologies"))}
                        placeholder="Add technology and press Enter"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => addToArray("technologies")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.map((tech, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{tech}</span>
                          <button type="button" onClick={() => removeFromArray("technologies", index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">Timeline</label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g., 18 months"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Progress (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Funding</label>
                      <input type="text" value={formData.funding} onChange={(e) => setFormData({ ...formData, funding: e.target.value })} placeholder="e.g., ₹15 Lakhs" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Status</label>
                      <input type="text" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} placeholder="e.g., In Progress" className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Completed Project Fields */}
                  {/* Results */}
                  <div>
                    <label className="block text-white mb-2">Results</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={arrayInputs.results}
                        onChange={(e) => setArrayInputs({ ...arrayInputs, results: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("results"))}
                        placeholder="Add result and press Enter"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => addToArray("results")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.results.map((result, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{result}</span>
                          <button type="button" onClick={() => removeFromArray("results", index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  <div>
                    <label className="block text-white mb-2">Awards</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={arrayInputs.awards}
                        onChange={(e) => setArrayInputs({ ...arrayInputs, awards: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("awards"))}
                        placeholder="Add award and press Enter"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => addToArray("awards")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.awards.map((award, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{award}</span>
                          <button type="button" onClick={() => removeFromArray("awards", index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <label className="block text-white mb-2">Team Members</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={arrayInputs.teamMembers}
                        onChange={(e) => setArrayInputs({ ...arrayInputs, teamMembers: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("teamMembers"))}
                        placeholder="Add team member name and press Enter"
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => addToArray("teamMembers")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg">
                          <span>{member}</span>
                          <button type="button" onClick={() => removeFromArray("teamMembers", index)} className="text-red-400 hover:text-red-300">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact */}
                  <div>
                    <label className="block text-white mb-2">Impact</label>
                    <textarea value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} rows={3} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">Completion Date</label>
                      <input
                        type="text"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        placeholder="e.g., December 2024"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Team Size</label>
                      <input type="number" min="0" value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Publications</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.publications}
                        onChange={(e) => setFormData({ ...formData, publications: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Structural Engineering"
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Images */}
              <div>
                <label className="block text-white mb-2">Images</label>
                <ImageUpload onImageUpload={handleImageUpload} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img.url} alt={`Project ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                    Active
                  </label>
                </div>
                <div>
                  <label className="block text-white mb-2">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {!showForm && (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:border-blue-400/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${project.type === "ongoing" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"}`}>{project.type}</span>
                      {!project.isActive && <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">Inactive</span>}
                    </div>
                    <p className="text-gray-300 mb-2">{project.description}</p>
                    {project.type === "ongoing" && project.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(project)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm && filteredProjects.length === 0 && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">No projects found</p>
          </div>
        )}
      </div>
    </div>
  )
}
