"use client"

import React, { useState, useEffect } from "react"
import { InfiniteMovingCards } from "@/ui/infinite-moving-cards"

/**
 * Fallback marvel cards data
 */
const defaultMarvelCards = [
  {
    quote:
      "The Eiffel Tower, completed in 1889, stands at approximately 330 meters tall and was constructed using 18,038 wrought iron parts held together by 2.5 million rivets.",
    name: "Eiffel Tower",
    title: "Paris, France",
    image: "/Home/eiffeltower.png",
  },
  {
    quote:
      "The Golden Gate Bridge, completed in 1937, features a main span of 1,280 meters and stands 227 meters tall, making it one of the longest suspension bridges globally.",
    name: "Golden Gate Bridge",
    title: "San Francisco, USA",
    image: "/Home/GoldenGateBridge.png",
  },
  {
    quote:
      "Standing at 828 meters, this skyscraper is the tallest building in the world. Its unique design and advanced engineering techniques showcase the possibilities of modern construction.",
    name: "Burj Khalifa",
    title: "Dubai, UAE",
    image: "/Home/burjkhalifa.png",
  },
  {
    quote:
      "A collection of fortification walls, the Great Wall of China spans about 21,196 km (13,170 mi) and it has stood for over 2,000 years.",
    name: "Great Wall of China",
    title: "Beijing, China",
    image: "/Home/greatwall.png",
  },
  {
    quote:
      "Completed in 1653, the Taj Mahal features a massive marble dome and deep foundations to stabilize it near the Yamuna River. The minarets are tilted outward to safeguard the structure from earthquakes.",
    name: "Taj Mahal",
    title: "Agra, India",
    image: "/Home/tajmahal.png",
  },
]

export function InfiniteMovingCardsDemo() {
  const [marvelCards, setMarvelCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMarvelCards()
  }, [])

  const fetchMarvelCards = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/page-settings?page=home")
      const data = await response.json()

      if (data.success && data.data.marvelCards) {
        const formattedCards = data.data.marvelCards
          .sort((a, b) => a.order - b.order)
          .map((card) => ({
            quote: card.quote,
            name: card.name,
            title: card.title,
            image: card.image.url,
          }))
        setMarvelCards(formattedCards)
      }
    } catch (error) {
      console.error("Error fetching marvel cards:", error)
      setMarvelCards(defaultMarvelCards)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden py-8">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden py-8">
      <InfiniteMovingCards items={marvelCards} direction="right" speed="slow" />
    </div>
  )
}

export { defaultMarvelCards }
