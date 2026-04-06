import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import EventRegistration from "@/models/EventRegistration"
import Event from "@/models/Event"
import { verifyAdmin } from "@/lib/adminAuth"

// GET all registrations for an event
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params

    // Fetch the event
    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    // Fetch registrations
    const registrations = await EventRegistration.find({ eventId: id }).sort({ createdAt: -1 })

    // Convert Map to Object for JSON serialization
    const formattedRegistrations = registrations.map((reg) => ({
      _id: reg._id,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle,
      userEmail: reg.userEmail,
      formData: Object.fromEntries(reg.formData),
      registeredAt: reg.submittedAt || reg.createdAt,
      status: reg.status,
      createdAt: reg.createdAt,
      updatedAt: reg.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        description: event.description,
        registrationForm: event.registrationForm,
      },
      registrations: formattedRegistrations,
    })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
