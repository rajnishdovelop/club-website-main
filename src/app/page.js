import { CivilEngineeringBackground } from "@/components/common"
import { Navbar, Footer, MobileSectionNav } from "@/components/layout"
import { HomePage } from "@/components/home"

export default function Home() {
  return (
    <>
      <CivilEngineeringBackground />
      <Navbar />
      <HomePage />
      <Footer />
      <MobileSectionNav />
    </>
  )
}
