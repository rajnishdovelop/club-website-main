import { CivilEngineeringBackground } from "@/components/common"
import { Navbar, Footer } from "@/components/layout"
import { ProjectsPage } from "@/components/projects"

export const metadata = {
  title: "Projects - Concreate Club",
  description: "Ongoing and completed projects by the Concreate Club at IIT Indore",
}

export default function Projects() {
  return (
    <>
      <CivilEngineeringBackground />
      <Navbar />
      <ProjectsPage />
      <Footer />
    </>
  )
}
