import { CivilEngineeringBackground } from "@/components/common"
import { Navbar, Footer } from "@/components/layout"
import { AchievementsPage } from "@/components/achievements"

export const metadata = {
  title: "Achievements - Concreate Club",
  description: "Achievements and accomplishments by the Concreate Club at IIT Indore",
}

export default function Achievements() {
  return (
    <>
      <CivilEngineeringBackground />
      <Navbar />
      <AchievementsPage />
      <Footer />
    </>
  )
}
