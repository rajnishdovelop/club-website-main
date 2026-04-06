import { CivilEngineeringBackground } from "@/components/common"
import { Navbar, Footer } from "@/components/layout"
import { ContactPage } from "@/components/contact"

export const metadata = {
  title: "Contact Us - Concreate Club",
  description: "Get in touch with the Concreate Club at IIT Indore",
}

export default function MessageUsPage() {
  return (
    <>
      <CivilEngineeringBackground />
      <Navbar />
      <ContactPage />
      <Footer />
    </>
  )
}
