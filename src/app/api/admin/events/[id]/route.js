import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Event from "@/models/Event"
import { verifyAdmin } from "@/lib/adminAuth"
import { deleteFromCloudinary } from "@/lib/cloudinary"

// GET single event
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params
    const event = await Event.findById(id)

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid event ID format" }, { status: 400 })
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch event",
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// PUT update event
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params
    const body = await request.json()

    const event = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    })
  } catch (error) {
    console.error("Error updating event:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid event ID format" }, { status: 400 })
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event",
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE event
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params
    const event = await Event.findById(id)

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    // Delete associated Cloudinary images
    if (event.images && event.images.length > 0) {
      const deletePromises = event.images
        .filter((img) => img.publicId)
        .map((img) => deleteFromCloudinary(img.publicId).catch((err) => console.error(`Failed to delete image ${img.publicId}:`, err)))
      await Promise.all(deletePromises)
    }

    await Event.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid event ID format" }, { status: 400 })
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete event",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
