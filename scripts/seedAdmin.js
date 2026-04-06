import { config } from "dotenv"
import dbConnect from "../src/lib/dbConnect.js"
import User from "../src/models/User.js"

// Load environment variables
config({ path: ".env.local" })

const seedAdmin = async () => {
  try {
    // Connect to database
    await dbConnect()

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL || "admin@conreate.com",
    })

    if (existingAdmin) {
      console.log("✅ Admin user already exists")
      console.log(`Email: ${existingAdmin.email}`)
      console.log(`Username: ${existingAdmin.username}`)
      return
    }

    // Create default admin user
    const adminData = {
      username: "admin",
      email: process.env.ADMIN_EMAIL || "admin@conreate.comDevelopment team. ",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      isActive: true,
    }

    const admin = new User(adminData)
    await admin.save()

    console.log("✅ Default admin user created successfully!")
    console.log(`Email: ${admin.email}`)
    console.log(`Username: ${admin.username}`)
    console.log(`Password: ${process.env.ADMIN_PASSWORD || "admin123"}`)
    console.log("⚠️  Please change the default password after first login!")
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message)
    if (error.code === 11000) {
      console.error("Admin user with this email or username already exists")
    }
  } finally {
    process.exit(0)
  }
}

// Run the seeder
seedAdmin()
