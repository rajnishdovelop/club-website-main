"use client"

import { cn } from "../utils/cn"
import React, { useEffect, useState } from "react"

export const InfiniteMovingCards = ({ items, direction = "left", speed = "fast", pauseOnHover = true, className }) => {
  const containerRef = React.useRef(null)
  const scrollerRef = React.useRef(null)

  useEffect(() => {
    addAnimation()
  }, [])

  const [start, setStart] = useState(false)

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      // Create enough duplicates for seamless infinite scroll
      const duplicateCount = 3; // Create multiple sets for better seamless effect
      
      for (let i = 0; i < duplicateCount; i++) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true)
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem)
          }
        })
      }

      getDirection()
      getSpeed()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards")
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse")
      }
    }
  }

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s")
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "35s")
      } else {
        containerRef.current.style.setProperty("--animation-duration", "60s")
      }
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "scroller relative z-20 w-full overflow-hidden", 
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      role="region"
      aria-label="Scrolling content carousel"
    >
      <ul 
        ref={scrollerRef} 
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-8 w-max flex-nowrap",
          start && "animate-scroll"
        )}
        style={{
          animationPlayState: pauseOnHover ? 'running' : 'running'
        }}
        onMouseEnter={() => {
          if (pauseOnHover && scrollerRef.current) {
            scrollerRef.current.style.animationPlayState = 'paused';
          }
        }}
        onMouseLeave={() => {
          if (pauseOnHover && scrollerRef.current) {
            scrollerRef.current.style.animationPlayState = 'running';
          }
        }}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] md:w-[500px] max-w-full relative rounded-3xl flex-shrink-0 px-6 md:px-8 py-6 md:py-8 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border border-white/10 hover:border-sky-400/30 transition-all duration-300 group hover:scale-[1.02] shadow-2xl shadow-black/20"
            key={item.name}
          >
            <blockquote>
              <div className="relative z-20 flex flex-col gap-6">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 p-1">
                  <img 
                    className="w-full h-48 md:h-56 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                    src={item.image} 
                    alt={`${item.name}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent rounded-xl"></div>
                  
                  {/* Floating Engineering Badge */}
                  <div className="absolute top-4 right-4 bg-sky-500/20 backdrop-blur-md rounded-full px-3 py-1 border border-sky-400/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-sky-200 font-medium">Engineering Marvel</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col space-y-4">
                  {/* Title and Location */}
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-sky-200 to-blue-300 bg-clip-text text-transparent">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-sky-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="relative">
                    <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full"></div>
                    <p className="text-sm md:text-base leading-relaxed text-gray-300 pl-4 font-light">
                      {item.quote}
                    </p>
                  </div>
                  
                  {/* Stats or Additional Info */}
                  <div className="flex justify-center pt-2">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Historical Significance</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Engineering Excellence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  )
}
