const mongoose = require("mongoose")
const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Define PageSettings Schema
const pageSettingsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      enum: ["home", "achievements"],
      unique: true,
    },
    statsCards: [
      {
        label: { type: String, trim: true },
        number: { type: Number, default: 0 },
        suffix: { type: String, trim: true },
        description: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],
    fieldsOfExcellence: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        achievements: [{ type: String, trim: true }],
        color: { type: String, default: "from-sky-400 to-blue-500" },
        order: { type: Number, default: 0 },
      },
    ],
    // Home Page Hero Section
    heroSection: {
      title: { type: String, trim: true },
      subtitle: { type: String, trim: true },
      description: { type: String, trim: true },
      studentsCount: { type: String, trim: true },
      projectsCount: { type: String, trim: true },
      awardsCount: { type: String, trim: true },
    },
    heroImages: [
      {
        url: { type: String, trim: true },
        publicId: { type: String, trim: true },
        alt: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],
    // What Makes Us Unique Cards
    uniqueCards: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        iconType: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],
    // Iconic Civil Engineering Marvels
    marvelCards: [
      {
        name: { type: String, trim: true },
        title: { type: String, trim: true },
        quote: { type: String, trim: true },
        image: {
          url: { type: String, trim: true },
          publicId: { type: String, trim: true },
        },
        order: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
)

const PageSettings = mongoose.models.PageSettings || mongoose.model("PageSettings", pageSettingsSchema)

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(imagePath, folderName) {
  try {
    const absolutePath = path.join(__dirname, "..", "public", imagePath)
    console.log(`   Uploading: ${imagePath}...`)

    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: `concreate/${folderName}`,
      transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
    })

    console.log(`   ✅ Uploaded: ${result.secure_url}`)
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error(`   ❌ Error uploading ${imagePath}:`, error.message)
    // Return local path as fallback
    return {
      url: imagePath,
      publicId: "",
    }
  }
}

// Achievements Page Data
const achievementsPageData = {
  page: "achievements",
  statsCards: [
    {
      label: "Events Organized",
      number: 75,
      suffix: "+",
      description: "Technical workshops, competitions, and seminars",
      order: 0,
    },
    {
      label: "National/International Wins",
      number: 25,
      suffix: "+",
      description: "Awards and recognitions at prestigious competitions",
      order: 1,
    },
    {
      label: "Research Projects",
      number: 150,
      suffix: "+",
      description: "Student-led and faculty-mentored research initiatives",
      order: 2,
    },
    {
      label: "Students Impacted",
      number: 2000,
      suffix: "+",
      description: "Lives touched through our programs and initiatives",
      order: 3,
    },
  ],
  fieldsOfExcellence: [
    {
      title: "Inter-IIT Civil Conclave",
      description: "Leading national-level competition showcasing civil engineering excellence",
      achievements: ["Overall Champions 2023", "Best Innovation Award 2024", "3 consecutive finals"],
      color: "from-amber-400 to-orange-500",
      order: 0,
    },
    {
      title: "Sustainability",
      description: "Pioneering eco-friendly solutions and sustainable construction practices",
      achievements: ["Green Building Certification", "40% Waste Reduction", "Solar Energy Integration"],
      color: "from-green-400 to-emerald-500",
      order: 1,
    },
    {
      title: "Smart Solutions",
      description: "Innovative engineering solutions using cutting-edge technology",
      achievements: ["IoT Sensor Networks", "AI-Powered Analysis", "Automated Monitoring Systems"],
      color: "from-blue-400 to-indigo-500",
      order: 2,
    },
    {
      title: "Smart City Planning",
      description: "Urban development solutions for modern metropolitan challenges",
      achievements: ["Traffic Optimization", "Urban Heat Island Mitigation", "Smart Infrastructure Design"],
      color: "from-purple-400 to-pink-500",
      order: 3,
    },
    {
      title: "Machine Learning in Civil Engineering",
      description: "Applying AI and ML to solve complex civil engineering problems",
      achievements: ["Predictive Maintenance Models", "Structural Health Monitoring", "Construction Quality Control"],
      color: "from-cyan-400 to-teal-500",
      order: 4,
    },
    {
      title: "Research & Innovation",
      description: "Cutting-edge research contributing to the advancement of civil engineering",
      achievements: ["25+ Research Papers", "5 Patents Filed", "International Collaborations"],
      color: "from-red-400 to-rose-500",
      order: 5,
    },
  ],
}

// Home Page Data Structure
const getHomePageData = async () => {
  console.log("\n📸 Uploading Home Page Images to Cloudinary...")

  // Upload hero images
  console.log("\n🖼️  Uploading Hero Images...")
  const heroImagePaths = ["/Home/new/p1.jpg", "/Home/new/p2.jpg", "/Home/new/p3.jpg", "/Home/new/p4.jpg", "/Home/new/p5.jpg", "/Home/new/p6.jpg"]

  const heroImages = []
  for (let i = 0; i < heroImagePaths.length; i++) {
    const uploaded = await uploadToCloudinary(heroImagePaths[i], "home-hero")
    heroImages.push({
      url: uploaded.url,
      publicId: uploaded.publicId,
      alt: `Civil Engineering Project ${i + 1}`,
      order: i,
    })
  }

  // Upload marvel card images
  console.log("\n🏛️  Uploading Marvel Card Images...")
  const marvelImages = [
    { path: "/Home/eiffeltower.png", name: "Eiffel Tower" },
    { path: "/Home/GoldenGateBridge.png", name: "Golden Gate Bridge" },
    { path: "/Home/burjkhalifa.png", name: "Burj Khalifa" },
    { path: "/Home/greatwall.png", name: "Great Wall of China" },
    { path: "/Home/tajmahal.png", name: "Taj Mahal" },
  ]

  const marvelCards = []
  for (let i = 0; i < marvelImages.length; i++) {
    const uploaded = await uploadToCloudinary(marvelImages[i].path, "home-marvels")
    marvelCards.push({
      name: marvelImages[i].name,
      title: i === 0 ? "Paris, France" : i === 1 ? "San Francisco, USA" : i === 2 ? "Dubai, UAE" : i === 3 ? "Beijing, China" : "Agra, India",
      quote:
        i === 0
          ? "The Eiffel Tower, completed in 1889, stands at approximately 330 meters tall and was constructed using 18,038 wrought iron parts held together by 2.5 million rivets."
          : i === 1
          ? "The Golden Gate Bridge, completed in 1937, features a main span of 1,280 meters and stands 227 meters tall, making it one of the longest suspension bridges globally."
          : i === 2
          ? "Standing at 828 meters, this skyscraper is the tallest building in the world. Its unique design and advanced engineering techniques showcase the possibilities of modern construction."
          : i === 3
          ? "A collection of fortification walls, the Great Wall of China spans about 21,196 km (13,170 mi) and it has stood for over 2,000 years."
          : "Completed in 1653, the Taj Mahal features a massive marble dome and deep foundations to stabilize it near the Yamuna River. The minarets are tilted outward to safeguard the structure from earthquakes.",
      image: {
        url: uploaded.url,
        publicId: uploaded.publicId,
      },
      order: i,
    })
  }

  return {
    page: "home",
    heroSection: {
      title: "Concreate Club",
      subtitle: "Civil Engineering Student Club - IIT Indore",
      description: "Driving hands-on learning, innovation, and collaboration. Through workshops, student-led projects, competitions, and the flagship CivilX Series, we bridge classroom knowledge with real-world engineering challenges.",
      studentsCount: "500+",
      projectsCount: "50+",
      awardsCount: "25+",
    },
    heroImages: heroImages,
    uniqueCards: [
      {
        title: "Hands-On Learning",
        description: "Practical workshops and lab sessions that bring theoretical concepts to life through real engineering applications.",
        iconType: "beaker",
        order: 0,
      },
      {
        title: "Innovation Hub",
        description: "Student-led projects pushing the boundaries of civil engineering with cutting-edge technologies and sustainable solutions.",
        iconType: "lightning",
        order: 1,
      },
      {
        title: "CivilX Series",
        description: "Our flagship competition series connecting students with industry challenges and fostering competitive excellence.",
        iconType: "trophy",
        order: 2,
      },
      {
        title: "Industry Connect",
        description: "Strong partnerships with leading construction companies and engineering firms for internships and career opportunities.",
        iconType: "users",
        order: 3,
      },
      {
        title: "Sustainable Focus",
        description: "Emphasis on green building technologies, sustainable infrastructure, and environmentally conscious engineering practices.",
        iconType: "heart",
        order: 4,
      },
      {
        title: "Knowledge Sharing",
        description: "Regular seminars, technical talks, and peer-to-peer learning sessions with experts from academia and industry.",
        iconType: "book",
        order: 5,
      },
    ],
    marvelCards: marvelCards,
  }
}

async function seedPageSettings() {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Check Cloudinary configuration
    const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET

    if (!cloudinaryConfigured) {
      console.log("\n⚠️  WARNING: Cloudinary not configured!")
      console.log("   Images will use local paths instead.")
      console.log("   To enable Cloudinary upload, set these environment variables:")
      console.log("   - CLOUDINARY_CLOUD_NAME")
      console.log("   - CLOUDINARY_API_KEY")
      console.log("   - CLOUDINARY_API_SECRET")
    }

    // Seed Achievements Page Settings
    console.log("\n📊 Seeding Achievements Page Settings...")
    const existingAchievements = await PageSettings.findOne({ page: "achievements" })

    if (existingAchievements) {
      console.log("⚠️  Achievements page settings already exist. Updating...")
      await PageSettings.findOneAndUpdate({ page: "achievements" }, achievementsPageData, { new: true, runValidators: true })
      console.log("✅ Achievements page settings updated successfully")
    } else {
      const achievementsSettings = new PageSettings(achievementsPageData)
      await achievementsSettings.save()
      console.log("✅ Achievements page settings created successfully")
    }

    console.log("\n📈 Stats Cards Added:")
    achievementsPageData.statsCards.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.label}: ${card.number}${card.suffix}`)
    })

    console.log("\n🏆 Fields of Excellence Added:")
    achievementsPageData.fieldsOfExcellence.forEach((field, index) => {
      console.log(`  ${index + 1}. ${field.title} (${field.achievements.length} achievements)`)
    })

    // Seed Home Page Settings
    console.log("\n🏠 Seeding Home Page Settings...")
    const homePageData = await getHomePageData()
    const existingHome = await PageSettings.findOne({ page: "home" })

    if (existingHome) {
      console.log("\n⚠️  Home page settings already exist. Updating...")
      await PageSettings.findOneAndUpdate({ page: "home" }, homePageData, { new: true, runValidators: true })
      console.log("✅ Home page settings updated successfully")
    } else {
      const homeSettings = new PageSettings(homePageData)
      await homeSettings.save()
      console.log("\n✅ Home page settings created successfully")
    }

    console.log("\n📊 Home Page Content Summary:")
    console.log(`  Hero Section:`)
    console.log(`    - Title: ${homePageData.heroSection.title}`)
    console.log(`    - Subtitle: ${homePageData.heroSection.subtitle}`)
    console.log(`    - Students: ${homePageData.heroSection.studentsCount}`)
    console.log(`    - Projects: ${homePageData.heroSection.projectsCount}`)
    console.log(`    - Awards: ${homePageData.heroSection.awardsCount}`)
    console.log(`  Hero Images: ${homePageData.heroImages.length}`)
    console.log(`  Unique Cards: ${homePageData.uniqueCards.length}`)
    console.log(`  Marvel Cards: ${homePageData.marvelCards.length}`)

    console.log("\n✅ All page settings seeded successfully!")
    console.log("\n📝 Next Steps:")
    console.log("  1. Update Home.js to fetch from /api/page-settings?page=home")
    console.log("  2. Update InfiniteMovingCardsDemo.js to fetch marvel cards from API")
    console.log("  3. Customize content via /admin/page-settings")
    console.log("  4. All images are now stored in Cloudinary (if configured)")
  } catch (error) {
    console.error("❌ Error seeding page settings:", error)
    throw error
  } finally {
    await mongoose.connection.close()
    console.log("\n🔌 Disconnected from MongoDB")
  }
}

// Run the seed script
seedPageSettings()
  .then(() => {
    console.log("\n🎉 Seed script completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Seed script failed:", error)
    process.exit(1)
  })
