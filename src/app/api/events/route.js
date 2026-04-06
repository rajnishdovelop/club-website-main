import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Event from "@/models/Event"

// GET all events (public)
export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    // Public route - ONLY show active events
    const query = { isActive: true }

    if (type) {
      query.type = type
    }

    const events = await Event.find(query).sort({ order: 1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
