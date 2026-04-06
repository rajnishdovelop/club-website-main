import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Project from "@/models/Project"

// GET - Fetch all active projects
export async function GET() {
  try {
    await dbConnect()

    const projects = await Project.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
