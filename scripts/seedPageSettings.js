const mongoose = require("mongoose")
require("dotenv").config({ path: ".env.local" })

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
    heroImages: [
      {
        url: { type: String, trim: true },
        publicId: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],
    homeStats: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
        description: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],
    aboutSection: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      image: {
        url: { type: String, trim: true },
        publicId: { type: String, trim: true },
      },
    },
  },
  { timestamps: true }
)

const PageSettings = mongoose.models.PageSettings || mongoose.model("PageSettings", pageSettingsSchema)

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

// Home Page Data (placeholder - you can customize this)
const homePageData = {
  page: "home",
  heroImages: [
    // Add your hero images here after uploading to Cloudinary
    // Example:
    // {
    //   url: "https://res.cloudinary.com/...",
    //   publicId: "hero_image_1",
    //   order: 0,
    // },
  ],
  homeStats: [
    {
      label: "Years of Excellence",
      value: "10+",
      description: "Decades of civil engineering innovation",
      order: 0,
    },
    {
      label: "Active Members",
      value: "200+",
      description: "Passionate civil engineering students",
      order: 1,
    },
    {
      label: "Industry Partners",
      value: "30+",
      description: "Leading construction companies",
      order: 2,
    },
    {
      label: "Success Rate",
      value: "95%",
      description: "Project completion rate",
      order: 3,
    },
  ],
  aboutSection: {
    title: "About Concreate - IIT Indore",
    description:
      "Concreate is the premier civil engineering club at IIT Indore, dedicated to fostering innovation, research, and practical learning in the field of civil engineering. We organize technical workshops, competitions, and research initiatives that bridge the gap between academic knowledge and industry requirements. Our mission is to develop skilled civil engineers who can contribute to sustainable infrastructure development and smart city solutions.",
    image: {
      url: "", // Add your about section image URL here
      publicId: "",
    },
  },
}

async function seedPageSettings() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")

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
      console.log(`     ${card.description}`)
    })

    console.log("\n🏆 Fields of Excellence Added:")
    achievementsPageData.fieldsOfExcellence.forEach((field, index) => {
      console.log(`  ${index + 1}. ${field.title}`)
      console.log(`     ${field.description}`)
      console.log(`     Achievements: ${field.achievements.length}`)
    })

    // Seed Home Page Settings
    console.log("\n🏠 Seeding Home Page Settings...")
    const existingHome = await PageSettings.findOne({ page: "home" })

    if (existingHome) {
      console.log("⚠️  Home page settings already exist. Updating...")
      await PageSettings.findOneAndUpdate({ page: "home" }, homePageData, { new: true, runValidators: true })
      console.log("✅ Home page settings updated successfully")
    } else {
      const homeSettings = new PageSettings(homePageData)
      await homeSettings.save()
      console.log("✅ Home page settings created successfully")
    }

    console.log("\n📊 Home Stats Added:")
    homePageData.homeStats.forEach((stat, index) => {
      console.log(`  ${index + 1}. ${stat.label}: ${stat.value}`)
      console.log(`     ${stat.description}`)
    })

    console.log("\n✅ All page settings seeded successfully!")
    console.log("\n📝 Next Steps:")
    console.log("  1. Upload hero images for the home page via admin panel")
    console.log("  2. Update home page about section image via admin panel")
    console.log("  3. Customize stats and fields via /admin/page-settings")
    console.log("  4. Update frontend components to fetch from page settings API")
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
