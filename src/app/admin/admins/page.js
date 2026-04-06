"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdminManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "admin",
    super: false,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && !session?.user?.super) {
      router.push("/admin")
    } else if (status === "authenticated") {
      fetchAdmins()
    }
  }, [status, session, router])

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/admins", { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setAdmins(data.data)
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error("Error fetching admins:", error)
      setError("Failed to fetch admins")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Admin added successfully!")
        setShowAddModal(false)
        setFormData({ email: "", name: "", role: "admin", super: false })
        fetchAdmins()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error("Error adding admin:", error)
      setError("Failed to add admin")
    }
  }

  const handleDeleteAdmin = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return

    try {
      const response = await fetch(`/api/admin/admins/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Admin deleted successfully!")
        fetchAdmins()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error("Error deleting admin:", error)
      setError("Failed to delete admin")
    }
  }

  const handleToggleStatus = async (admin) => {
    try {
      const response = await fetch(`/api/admin/admins/${admin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isActive: !admin.isActive,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Admin ${admin.isActive ? "deactivated" : "activated"} successfully!`)
        fetchAdmins()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error("Error updating admin:", error)
      setError("Failed to update admin")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session?.user?.super) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">Admin Management</h1>
              <p className="text-slate-400">Manage administrator accounts and permissions</p>
            </div>
            <motion.button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-400/25 transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              + Add Admin
            </motion.button>
          </div>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
            <p className="text-green-300">{success}</p>
          </motion.div>
        )}

        {/* Admins Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Super Admin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{admin.name || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-300">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-sm">{admin.role}</span>
                    </td>
                    <td className="px-6 py-4">{admin.super ? <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Yes</span> : <span className="px-3 py-1 bg-slate-500/20 text-slate-300 rounded-full text-sm">No</span>}</td>
                    <td className="px-6 py-4">{admin.isActive ? <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Active</span> : <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">Inactive</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleStatus(admin)} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm" disabled={admin.email === session?.user?.email}>
                          {admin.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => handleDeleteAdmin(admin._id)} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm" disabled={admin.email === session?.user?.email}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Admin</h2>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>

                <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-sky-400">Role:</span> Admin
                  </p>
                  <p className="text-xs text-slate-400 mt-1">New admins will be created with standard admin privileges</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setError("")
                    }}
                    className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                    Add Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
