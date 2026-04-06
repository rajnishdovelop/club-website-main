import { CivilEngineeringBackground } from "@/components/common"
import { Navbar, Footer } from "@/components/layout"
import { EventsPage } from "@/components/events"

export const metadata = {
  title: "Events & Activities - Concreate Club",
  description: "Upcoming, ongoing, and past events by the Concreate Club at IIT Indore",
}

export default function Events() {
  return (
    <>
      <CivilEngineeringBackground />
      <Navbar />
      <EventsPage />
      <Footer />
    </>
  )
}
