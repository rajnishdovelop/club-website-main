"use client"

import { useState, useCallback } from "react"

/**
 * Custom hook for managing carousel/slider state
 * @returns {object} - Carousel state and actions
 */
export function useCarousel() {
  const [indices, setIndices] = useState({})

  const goToSlide = useCallback((itemId, index) => {
    setIndices((prev) => ({
      ...prev,
      [itemId]: index,
    }))
  }, [])

  const nextSlide = useCallback(
    (itemId, totalImages) => {
      const currentIndex = indices[itemId] || 0
      goToSlide(itemId, (currentIndex + 1) % totalImages)
    },
    [indices, goToSlide]
  )

  const prevSlide = useCallback(
    (itemId, totalImages) => {
      const currentIndex = indices[itemId] || 0
      goToSlide(itemId, (currentIndex - 1 + totalImages) % totalImages)
    },
    [indices, goToSlide]
  )

  const getCurrentIndex = useCallback(
    (itemId) => {
      return indices[itemId] || 0
    },
    [indices]
  )

  return {
    indices,
    goToSlide,
    nextSlide,
    prevSlide,
    getCurrentIndex,
  }
}

export default useCarousel
