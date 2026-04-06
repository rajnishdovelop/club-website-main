"use client"

import React, { useState, useEffect } from "react"
import { Modal, PageHero, CTASection, TabNavigation } from "@/components/common"
import { RegistrationModal } from "@/components/forms"
import { EventCard, PastEventCard, EventGrid, EventList, EventModalContent } from "@/components/events"
import { useEvents, useCarousel } from "@/hooks"

/**
 * Events page component - displays all club events
 */
const Events = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [registrationEvent, setRegistrationEvent] = useState(null)

  // Use custom hooks
  const { allEvents, upcomingEvents, ongoingEvents, pastEvents, isLoading, fetchEvents } = useEvents()
  const { carouselIndices, goToSlide, nextSlide, prevSlide } = useCarousel()

  useEffect(() => {
    fetchEvents()
  }, [])

  // Event handlers
  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleRegisterClick = (event) => {
    if (event.registrationEnabled && event.registrationForm?.length > 0) {
      setIsModalOpen(false)
      setRegistrationEvent(event)
      setIsRegistrationModalOpen(true)
    }
  }

  const handleJoinClick = (event) => {
    if (event.registrationEnabled && event.registrationForm?.length > 0) {
      setIsModalOpen(false)
      setRegistrationEvent(event)
      setIsRegistrationModalOpen(true)
    }
  }

  // Tab configuration
  const tabs = [
    { id: "all", label: "All Events", count: allEvents.length },
    { id: "upcoming", label: "Upcoming Events", count: upcomingEvents.length },
    { id: "ongoing", label: "Ongoing Events", count: ongoingEvents.length },
    { id: "past", label: "Past Events", count: pastEvents.length },
  ]

  // CTA section configuration
  const ctaButtons = [
    { label: "Contact Us", href: "/message-us", variant: "primary" },
    { label: "Meet the Team", href: "/team", variant: "outline" },
  ]

  // Get current events based on active tab
  const getCurrentEvents = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingEvents
      case "ongoing":
        return ongoingEvents
      case "past":
        return pastEvents
      default:
        return allEvents
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <PageHero title="Events & Activities" />

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Event categories"
        className="mb-12"
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-400" />
        </div>
      ) : (
        /* Content Sections */
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          {/* Grid view for all, upcoming, ongoing */}
          {activeTab !== "past" && (
            <EventGrid
              events={getCurrentEvents()}
              CardComponent={EventCard}
              onViewDetails={handleViewDetails}
              cardProps={{ showTypeBadge: activeTab === "all" }}
            />
          )}

          {/* List view for past events */}
          {activeTab === "past" && (
            <EventList
              events={pastEvents}
              CardComponent={PastEventCard}
              carouselIndices={carouselIndices}
              onNextImage={nextSlide}
              onPrevImage={prevSlide}
              onGoToImage={goToSlide}
            />
          )}
        </div>
      )}

      {/* Bottom CTA Section */}
      <CTASection
        title="Ready to Join Our Community?"
        description="Be part of exciting events, competitions, and workshops. Connect with fellow civil engineers and industry experts."
        buttons={ctaButtons}
      />

      {/* Event Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent?.title}
      >
        <EventModalContent
          event={selectedEvent}
          onRegister={() => handleRegisterClick(selectedEvent)}
          onJoin={() => handleJoinClick(selectedEvent)}
        />
      </Modal>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        event={registrationEvent}
      />
    </div>
  )
}

export default Events
