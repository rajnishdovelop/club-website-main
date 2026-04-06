import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import TeamMember from "@/models/TeamMember"

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")

    let teamMembers

    if (department) {
      // Get team members by department
      teamMembers = await TeamMember.getByDepartment(department)
    } else {
      // Get all active team members
      teamMembers = await TeamMember.getActiveMembers()
    }

    // Convert to public profiles (remove sensitive data)
    const publicProfiles = teamMembers.map((member) => member.getPublicProfile())

    return NextResponse.json(
      {
        success: true,
        data: publicProfiles,
        total: publicProfiles.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get team members error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team members",
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
