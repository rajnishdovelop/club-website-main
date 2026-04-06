import { CivilEngineeringBackground } from "@/components/common"
import { Navbar, Footer } from "@/components/layout"
import { TeamMembersPage } from "@/components/team"

export const metadata = {
  title: "Team Members - Concreate Club",
  description: "Meet the team members of the Concreate Club at IIT Indore",
}

export default function TeamPage() {
  return (
    <>
      <CivilEngineeringBackground />
      <Navbar />
      <TeamMembersPage />
      <Footer />
    </>
  )
}
