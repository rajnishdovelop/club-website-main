import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import EventRegistration from "@/models/EventRegistration"
import Event from "@/models/Event"
import { verifyToken } from "@/lib/authUtils"

// POST - Submit event registration
export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { eventId, formData } = body

    if (!eventId || !formData) {
      return NextResponse.json({ success: false, message: "Event ID and form data are required" }, { status: 400 })
    }

    // Verify event exists and registration is enabled
    const event = await Event.findById(eventId)
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    if (!event.registrationEnabled) {
      return NextResponse.json({ success: false, message: "Registration is not enabled for this event" }, { status: 400 })
    }

    // Get email from formData (for duplicate check) or logged in user
    let userEmail = formData.email || formData.Email || null
    
    // Try to get user email if logged in (optional)
    try {
      const token = request.cookies.get("auth-token")?.value
      if (token) {
        const decoded = verifyToken(token)
        if (decoded.email) userEmail = decoded.email
      }
    } catch (error) {
      // User not logged in, that's okay
    }

    // Check for duplicate registration if email is provided
    if (userEmail) {
      const existingRegistration = await EventRegistration.findOne({
        eventId,
        userEmail: userEmail.toLowerCase().trim()
      })
      
      if (existingRegistration) {
        return NextResponse.json({ 
          success: false, 
          message: "You have already registered for this event" 
        }, { status: 409 })
      }
    }

    // Create registration
    const registration = await EventRegistration.create({
      eventId,
      eventTitle: event.title,
      userEmail: userEmail ? userEmail.toLowerCase().trim() : null,
      formData: new Map(Object.entries(formData)),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully",
        data: registration,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting registration:", error)
    
    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "You have already registered for this event"
      }, { status: 409 })
    }
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit registration",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
