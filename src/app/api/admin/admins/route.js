import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

// GET - List all admins (only for super admins)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is super admin
    if (!session.user.super) {
      return NextResponse.json({ success: false, message: "Forbidden - Super admin access required" }, { status: 403 })
    }

    await dbConnect()

    const admins = await User.find({}).sort({ createdAt: -1 }).select("-__v")

    return NextResponse.json({
      success: true,
      data: admins,
    })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch admins", error: error.message }, { status: 500 })
  }
}

// POST - Create new admin (only for super admins)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is super admin
    if (!session.user.super) {
      return NextResponse.json({ success: false, message: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, role, super: isSuper } = body

    // Validate input
    if (!email || !name) {
      return NextResponse.json({ success: false, message: "Email and name are required" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Admin with this email already exists" }, { status: 400 })
    }

    // Create new admin
    const newAdmin = new User({
      email: email.toLowerCase(),
      name,
      role: role || "admin",
      super: isSuper || false,
      isActive: true,
    })

    await newAdmin.save()

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      data: newAdmin,
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ success: false, message: "Failed to create admin", error: error.message }, { status: 500 })
  }
}
