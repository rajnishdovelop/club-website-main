import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Event from "@/models/Event"
import { verifyAdmin } from "@/lib/adminAuth"
import { eventSchema, validateBody } from "@/lib/validations"

// GET all events (admin - includes inactive)
export async function GET(request) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const includeInactive = searchParams.get("includeInactive") !== "false"

    const query = includeInactive ? {} : { isActive: true }

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

// POST create new event
export async function POST(request) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const body = await request.json()

    // Validate request body
    const validation = validateBody(eventSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      )
    }

    const event = await Event.create(validation.data)

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        data: event,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
