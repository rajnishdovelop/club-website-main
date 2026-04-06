"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Event grid component to display event cards in a grid
 * @param {object} props - Component props
 * @param {Array} props.events - Array of events
 * @param {React.ComponentType} props.CardComponent - Card component to render
 * @param {function} props.onViewDetails - View details click handler
 * @param {object} props.cardProps - Additional props to pass to cards
 */
const EventGrid = ({ events, CardComponent, onViewDetails, cardProps = {} }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No events found in this category.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <CardComponent
            key={event._id}
            event={event}
            index={index}
            onViewDetails={onViewDetails}
            {...cardProps}
          />
        ))}
      </div>
    </motion.div>
  )
}

/**
 * Event list component for past events (vertical layout)
 * @param {object} props - Component props
 * @param {Array} props.events - Array of events
 * @param {React.ComponentType} props.CardComponent - Card component to render
 * @param {object} props.carouselIndices - Carousel indices state
 * @param {function} props.onNextImage - Next image handler
 * @param {function} props.onPrevImage - Previous image handler
 * @param {function} props.onGoToImage - Go to specific image handler
 */
const EventList = ({
  events,
  CardComponent,
  carouselIndices = {},
  onNextImage,
  onPrevImage,
  onGoToImage,
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No events found in this category.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-12">
        {events.map((event, index) => (
          <CardComponent
            key={event._id}
            event={event}
            index={index}
            currentImageIndex={carouselIndices[event._id] || 0}
            onNextImage={() => onNextImage(event._id, event.images?.length || 0)}
            onPrevImage={() => onPrevImage(event._id, event.images?.length || 0)}
            onGoToImage={(slideIndex) => onGoToImage(event._id, slideIndex)}
          />
        ))}
      </div>
    </motion.div>
  )
}

export { EventGrid, EventList }
export default EventGrid
