"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/forms/ImageUpload"

export default function AdminPageSettings() {
  const router = useRouter()
  const [selectedPage, setSelectedPage] = useState("achievements")
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [activeTab, setActiveTab] = useState("stats")

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (selectedPage) {
      fetchSettings()
    }
  }, [selectedPage])

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

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/page-settings?page=${selectedPage}`, { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/page-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          page: selectedPage,
          ...settings,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Settings saved successfully!")
      } else {
        alert("Error: " + (data.error || "Failed to save settings"))
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    }
  }

  // Stats Cards Management
  const addStatsCard = () => {
    if (settings.statsCards.length >= 4) {
      alert("Maximum 4 stats cards allowed")
      return
    }
    setSettings({
      ...settings,
      statsCards: [
        ...(settings.statsCards || []),
        {
          label: "",
          number: 0,
          suffix: "+",
          description: "",
          order: settings.statsCards.length,
        },
      ],
    })
  }

  const updateStatsCard = (index, field, value) => {
    const updated = [...settings.statsCards]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, statsCards: updated })
  }

  const removeStatsCard = (index) => {
    const updated = settings.statsCards.filter((_, i) => i !== index)
    setSettings({ ...settings, statsCards: updated })
  }

  // Fields of Excellence Management
  const addFieldOfExcellence = () => {
    if (settings.fieldsOfExcellence.length >= 6) {
      alert("Maximum 6 fields of excellence allowed")
      return
    }
    setSettings({
      ...settings,
      fieldsOfExcellence: [
        ...(settings.fieldsOfExcellence || []),
        {
          title: "",
          description: "",
          achievements: [],
          color: "from-sky-400 to-blue-500",
          order: settings.fieldsOfExcellence.length,
        },
      ],
    })
  }

  const updateFieldOfExcellence = (index, field, value) => {
    const updated = [...settings.fieldsOfExcellence]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, fieldsOfExcellence: updated })
  }

  const addAchievementToField = (fieldIndex, achievement) => {
    if (!achievement.trim()) return
    const updated = [...settings.fieldsOfExcellence]
    updated[fieldIndex].achievements = [...(updated[fieldIndex].achievements || []), achievement]
    setSettings({ ...settings, fieldsOfExcellence: updated })
  }

  const removeAchievementFromField = (fieldIndex, achIndex) => {
    const updated = [...settings.fieldsOfExcellence]
    updated[fieldIndex].achievements = updated[fieldIndex].achievements.filter((_, i) => i !== achIndex)
    setSettings({ ...settings, fieldsOfExcellence: updated })
  }

  const removeFieldOfExcellence = (index) => {
    const updated = settings.fieldsOfExcellence.filter((_, i) => i !== index)
    setSettings({ ...settings, fieldsOfExcellence: updated })
  }

  // Home Page Management
  const updateHeroSection = (field, value) => {
    setSettings({
      ...settings,
      heroSection: {
        ...(settings.heroSection || {}),
        [field]: value,
      },
    })
  }

  const addHeroImage = (imageUrl, publicId) => {
    setSettings({
      ...settings,
      heroImages: [
        ...(settings.heroImages || []),
        {
          url: imageUrl,
          publicId: publicId || "",
          alt: `Civil Engineering Project ${(settings.heroImages?.length || 0) + 1}`,
          order: settings.heroImages?.length || 0,
        },
      ],
    })
  }

  const removeHeroImage = (index) => {
    const updated = settings.heroImages.filter((_, i) => i !== index)
    setSettings({ ...settings, heroImages: updated })
  }

  const addUniqueCard = () => {
    setSettings({
      ...settings,
      uniqueCards: [
        ...(settings.uniqueCards || []),
        {
          title: "",
          description: "",
          iconType: "beaker",
          order: settings.uniqueCards?.length || 0,
        },
      ],
    })
  }

  const updateUniqueCard = (index, field, value) => {
    const updated = [...settings.uniqueCards]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, uniqueCards: updated })
  }

  const removeUniqueCard = (index) => {
    const updated = settings.uniqueCards.filter((_, i) => i !== index)
    setSettings({ ...settings, uniqueCards: updated })
  }

  const addMarvelCard = () => {
    setSettings({
      ...settings,
      marvelCards: [
        ...(settings.marvelCards || []),
        {
          name: "",
          title: "",
          quote: "",
          image: { url: "", publicId: "" },
          order: settings.marvelCards?.length || 0,
        },
      ],
    })
  }

  const updateMarvelCard = (index, field, value) => {
    const updated = [...settings.marvelCards]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, marvelCards: updated })
  }

  const handleMarvelImageUpload = (index, imageUrl, publicId) => {
    const updated = [...settings.marvelCards]
    updated[index] = {
      ...updated[index],
      image: { url: imageUrl, publicId: publicId || "" },
    }
    setSettings({ ...settings, marvelCards: updated })
  }

  const removeMarvelCard = (index) => {
    const updated = settings.marvelCards.filter((_, i) => i !== index)
    setSettings({ ...settings, marvelCards: updated })
  }

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
              <h1 className="text-3xl font-bold text-white mb-2">Page Settings</h1>
              <p className="text-gray-300">Manage dynamic content for different pages</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => router.push("/admin")} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Back to Dashboard
              </button>
              <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Page Selector */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Select Page</h2>
          <div className="flex gap-4">
            <button onClick={() => setSelectedPage("achievements")} className={`px-6 py-3 rounded-lg transition-colors ${selectedPage === "achievements" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              Achievements Page
            </button>
            <button onClick={() => setSelectedPage("home")} className={`px-6 py-3 rounded-lg transition-colors ${selectedPage === "home" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              Home Page
            </button>
          </div>
        </div>

        {/* Achievements Page Settings */}
        {selectedPage === "achievements" && settings && (
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <button onClick={() => setActiveTab("stats")} className={`px-6 py-3 rounded-lg transition-colors ${activeTab === "stats" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  Stats Cards (Max 4)
                </button>
                <button onClick={() => setActiveTab("excellence")} className={`px-6 py-3 rounded-lg transition-colors ${activeTab === "excellence" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  Fields of Excellence (Max 6)
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            {activeTab === "stats" && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Stats Cards ({settings.statsCards?.length || 0}/4)</h2>
                  <button onClick={addStatsCard} disabled={settings.statsCards?.length >= 4} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    + Add Stats Card
                  </button>
                </div>

                <div className="space-y-6">
                  {settings.statsCards?.map((card, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white">Card {index + 1}</h3>
                        <button onClick={() => removeStatsCard(index)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Label</label>
                          <input
                            type="text"
                            value={card.label || ""}
                            onChange={(e) => updateStatsCard(index, "label", e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            placeholder="e.g., Events Organized"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Number</label>
                          <input type="number" value={card.number || 0} onChange={(e) => updateStatsCard(index, "number", parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Suffix</label>
                          <input type="text" value={card.suffix || ""} onChange={(e) => updateStatsCard(index, "suffix", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="e.g., +" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Order</label>
                          <input type="number" value={card.order || 0} onChange={(e) => updateStatsCard(index, "order", parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                          <textarea
                            value={card.description || ""}
                            onChange={(e) => updateStatsCard(index, "description", e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fields of Excellence */}
            {activeTab === "excellence" && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Fields of Excellence ({settings.fieldsOfExcellence?.length || 0}/6)</h2>
                  <button onClick={addFieldOfExcellence} disabled={settings.fieldsOfExcellence?.length >= 6} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    + Add Field
                  </button>
                </div>

                <div className="space-y-6">
                  {settings.fieldsOfExcellence?.map((field, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white">Field {index + 1}</h3>
                        <button onClick={() => removeFieldOfExcellence(index)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                          <input
                            type="text"
                            value={field.title || ""}
                            onChange={(e) => updateFieldOfExcellence(index, "title", e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            placeholder="Field title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                          <textarea
                            value={field.description || ""}
                            onChange={(e) => updateFieldOfExcellence(index, "description", e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            placeholder="Field description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Gradient Color</label>
                            <select value={field.color || "from-sky-400 to-blue-500"} onChange={(e) => updateFieldOfExcellence(index, "color", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400">
                              <option value="from-sky-400 to-blue-500">Sky Blue</option>
                              <option value="from-purple-400 to-pink-500">Purple Pink</option>
                              <option value="from-green-400 to-emerald-500">Green</option>
                              <option value="from-amber-400 to-orange-500">Amber Orange</option>
                              <option value="from-red-400 to-rose-500">Red Rose</option>
                              <option value="from-cyan-400 to-teal-500">Cyan Teal</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Order</label>
                            <input type="number" value={field.order || 0} onChange={(e) => updateFieldOfExcellence(index, "order", parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Key Achievements</label>
                          <div className="space-y-2">
                            {field.achievements?.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => {
                                    const updated = [...settings.fieldsOfExcellence]
                                    updated[index].achievements[achIndex] = e.target.value
                                    setSettings({ ...settings, fieldsOfExcellence: updated })
                                  }}
                                  className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                                />
                                <button onClick={() => removeAchievementFromField(index, achIndex)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const achievement = prompt("Enter achievement:")
                                if (achievement) addAchievementToField(index, achievement)
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              + Add Achievement
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Home Page Settings */}
        {selectedPage === "home" && settings && (
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <button onClick={() => setActiveTab("hero")} className={`px-6 py-3 rounded-lg transition-colors ${activeTab === "hero" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  Hero Section
                </button>
                <button onClick={() => setActiveTab("unique")} className={`px-6 py-3 rounded-lg transition-colors ${activeTab === "unique" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  Unique Cards
                </button>
                <button onClick={() => setActiveTab("marvels")} className={`px-6 py-3 rounded-lg transition-colors ${activeTab === "marvels" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  Marvel Cards
                </button>
              </div>
            </div>

            {/* Hero Section */}
            {activeTab === "hero" && (
              <div className="space-y-8">
                {/* Hero Text Content */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Hero Section Content</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                      <input type="text" value={settings.heroSection?.title || ""} onChange={(e) => updateHeroSection("title", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="Concreate" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={settings.heroSection?.subtitle || ""}
                        onChange={(e) => updateHeroSection("subtitle", e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        placeholder="Civil Engineering Student Club - IIT Indore"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                      <textarea
                        value={settings.heroSection?.description || ""}
                        onChange={(e) => updateHeroSection("description", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        placeholder="Brief description of your club"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Students Count</label>
                        <input
                          type="text"
                          value={settings.heroSection?.studentsCount || ""}
                          onChange={(e) => updateHeroSection("studentsCount", e.target.value)}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="500+"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Projects Count</label>
                        <input
                          type="text"
                          value={settings.heroSection?.projectsCount || ""}
                          onChange={(e) => updateHeroSection("projectsCount", e.target.value)}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="50+"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Awards Count</label>
                        <input
                          type="text"
                          value={settings.heroSection?.awardsCount || ""}
                          onChange={(e) => updateHeroSection("awardsCount", e.target.value)}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="25+"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Images */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Hero Section Images</h2>
                  <div className="mb-4">
                    <ImageUpload onImageUpload={addHeroImage} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {settings.heroImages?.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img.url} alt={img.alt || `Hero ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button onClick={() => removeHeroImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Order: {img.order}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Unique Cards */}
            {activeTab === "unique" && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">What Makes Us Unique Cards</h2>
                  <button onClick={addUniqueCard} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    + Add Card
                  </button>
                </div>
                <div className="space-y-6">
                  {settings.uniqueCards?.map((card, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white">Card {index + 1}</h3>
                        <button onClick={() => removeUniqueCard(index)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                          <input type="text" value={card.title || ""} onChange={(e) => updateUniqueCard(index, "title", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                          <textarea value={card.description || ""} onChange={(e) => updateUniqueCard(index, "description", e.target.value)} rows={2} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Icon Type</label>
                            <select value={card.iconType || "beaker"} onChange={(e) => updateUniqueCard(index, "iconType", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400">
                              <option value="beaker">Beaker (Hands-On Learning)</option>
                              <option value="lightning">Lightning (Innovation)</option>
                              <option value="trophy">Trophy (Competition)</option>
                              <option value="users">Users (Community)</option>
                              <option value="heart">Heart (Sustainability)</option>
                              <option value="book">Book (Knowledge)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Order</label>
                            <input type="number" value={card.order || 0} onChange={(e) => updateUniqueCard(index, "order", parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marvel Cards */}
            {activeTab === "marvels" && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Iconic Civil Engineering Marvels</h2>
                  <button onClick={addMarvelCard} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    + Add Marvel
                  </button>
                </div>
                <div className="space-y-6">
                  {settings.marvelCards?.map((card, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white">Marvel {index + 1}</h3>
                        <button onClick={() => removeMarvelCard(index)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                            <input type="text" value={card.name || ""} onChange={(e) => updateMarvelCard(index, "name", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="Eiffel Tower" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                            <input type="text" value={card.title || ""} onChange={(e) => updateMarvelCard(index, "title", e.target.value)} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" placeholder="Paris, France" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                          <textarea
                            value={card.quote || ""}
                            onChange={(e) => updateMarvelCard(index, "quote", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            placeholder="Interesting facts about this marvel"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Image</label>
                          <ImageUpload onImageUpload={(url, publicId) => handleMarvelImageUpload(index, url, publicId)} />
                          {card.image?.url && (
                            <div className="mt-4">
                              <img src={card.image.url} alt={card.name} className="w-full max-w-md h-48 object-cover rounded-lg" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Order</label>
                          <input type="number" value={card.order || 0} onChange={(e) => updateMarvelCard(index, "order", parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
