"use client"

import React, { useState, useEffect } from "react"
import HeroSection from "./HeroSection"
import FeaturesSection from "./FeaturesSection"
import HomeCTASection from "./HomeCTASection"
import MarvelsSection from "./MarvelsSection"
import CivitasBanner from "./CivitasBanner"
import { usePageSettings } from "@/hooks"

/**
 * Home page component
 */
const Home = () => {
  const { settings, isLoading, fetchSettings } = usePageSettings("home")

  useEffect(() => {
    fetchSettings()
  }, [])

  // Process hero images from settings
  const heroImages = settings?.heroImages?.sort((a, b) => a.order - b.order).map((img) => img.url) || []
  
  // Process unique cards from settings
  const uniqueCards = settings?.uniqueCards?.sort((a, b) => a.order - b.order) || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <CivitasBanner />
      {/* Hero Section */}
      <HeroSection settings={settings} heroImages={heroImages} />

      {/* Features Section */}
      <FeaturesSection features={uniqueCards} />

      {/* Call to Action Section */}
      <HomeCTASection />

      {/* Iconic Civil Engineering Marvels Section */}
      <MarvelsSection />
    </div>
  )
}

export default Home
