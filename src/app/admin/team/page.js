"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/forms/ImageUpload"

export default function AdminTeamPage() {
  const [user, setUser] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    skills: [],
    image: "",
    imagePublicId: "",
    social: {
      insta: "",
      linkedin: "",
      email: "",
    },
    isActive: true,
    order: 0,
  })
  const [skillInput, setSkillInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchTeamMembers()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
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

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/admin/team?includeInactive=true", {
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setTeamMembers(data.data)
      }
    } catch (error) {
      console.error("Fetch team members error:", error)
      setMessage({ type: "error", text: "Failed to fetch team members" })
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith("social.")) {
      const socialField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value,
        },
      }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      }))
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      department: "",
      skills: [],
      image: "",
      imagePublicId: "",
      social: {
        insta: "",
        linkedin: "",
        email: "",
      },
      isActive: true,
      order: 0,
    })
    setSkillInput("")
    setEditingMember(null)
    setShowForm(false)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      position: member.position,
      department: member.department,
      skills: member.skills || [],
      image: member.image,
      imagePublicId: member.imagePublicId || "",
      social: member.social || { insta: "", linkedin: "", email: "" },
      isActive: member.isActive,
      order: member.order || 0,
    })
    setShowForm(true)
  }

  const handleImageUpload = (imageUrl, publicId) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
      imagePublicId: publicId || "",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      const url = editingMember ? `/api/admin/team/${editingMember._id}` : "/api/admin/team"

      const method = editingMember ? "PUT" : "POST"

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
        setMessage({
          type: "success",
          text: editingMember ? "Team member updated successfully" : "Team member created successfully",
        })
        resetForm()
        fetchTeamMembers()
      } else {
        setMessage({ type: "error", text: data.message || "Operation failed" })
      }
    } catch (error) {
      console.error("Submit error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Team member deleted successfully" })
        fetchTeamMembers()
      } else {
        setMessage({ type: "error", text: data.message || "Delete failed" })
      }
    } catch (error) {
      console.error("Delete error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
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
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push("/admin")} className="text-gray-300 hover:text-white">
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-bold text-white">Team Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.name || user?.email}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Team Members</h2>
          <button onClick={() => setShowForm(!showForm)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
            {showForm ? "Cancel" : "Add New Member"}
          </button>
        </div>

        {/* Message */}
        {message.text && <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 border border-green-500/50 text-green-300" : "bg-red-500/20 border border-red-500/50 text-red-300"}`}>{message.text}</div>}

        {/* Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">{editingMember ? "Edit Team Member" : "Add New Team Member"}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter full name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Core Member, Lead"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Civil Engineering"
                  />
                </div>

                <div>
                  <ImageUpload currentImage={formData.image} onImageUpload={handleImageUpload} isUploading={isUploading} />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a skill and press Enter"
                  />
                  <button type="button" onClick={addSkill} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-blue-200 hover:text-white">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Social Links</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Instagram</label>
                    <input
                      type="url"
                      name="social.insta"
                      value={formData.social.insta}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      name="social.linkedin"
                      value={formData.social.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="social.email"
                      value={formData.social.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                  <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                  <label className="ml-2 text-sm text-gray-300">Active (visible on website)</label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors duration-200">
                  {isSubmitting ? "Saving..." : editingMember ? "Update Member" : "Add Member"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Members List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div 
            className="overflow-auto max-h-[calc(100vh-280px)]"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'auto' }}
          >
            <table className="w-full min-w-[600px]">
              <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-lg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {teamMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          onError={(e) => {
                            e.target.src = "/team/default-avatar.jpg"
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{member.name}</div>
                          <div className="text-sm text-gray-400">{member.social?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{member.isActive ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(member)} className="text-blue-400 hover:text-blue-300 mr-4">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(member._id, member.name)} className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {teamMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No team members found</div>
                <div className="text-gray-500 text-sm mt-2">Add your first team member to get started</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
