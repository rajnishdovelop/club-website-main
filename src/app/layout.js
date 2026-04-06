import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: {
    default: "Concreate Club | IIT Indore",
    template: "%s | Concreate Club",
  },
  description: "Official Civil Engineering student club of IIT Indore. Bridging classroom theory with real-world engineering through innovation, hands-on projects, and sustainable infrastructure development.",
  keywords: [
    "Concreate Club",
    "IIT Indore",
    "Civil Engineering",
    "Student Club",
    "CivilX Series",
    "Technical Workshops",
    "Sustainable Infrastructure",
    "IIT Indore Civil Engineering",
    "Engineering Student Organization",
  ],
  authors: [{ name: "Concreate Club", url: "https://concreate.iiti.ac.in" }],
  creator: "Concreate Club",
  publisher: "IIT Indore",
  metadataBase: new URL("https://concreate.iiti.ac.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Concreate Club | Civil Engineering, IIT Indore",
    description: "Empowering civil engineering students at IIT Indore with hands-on learning and innovative projects.",
    url: "https://concreate.iiti.ac.in",
    siteName: "Concreate Club",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Concreate Club Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concreate Club | IIT Indore",
    description: "Official Civil Engineering student club of IIT Indore. Fostering innovation in Civil Engineering.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "qKQFEBKqw5TQrYa32mhAN3oe8q-0kT5OMC0zR0eAKg8",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative`}>
        <SessionProvider>
          <div className="relative z-10">{children}</div>
        </SessionProvider>
      </body>
    </html>
  )
}
