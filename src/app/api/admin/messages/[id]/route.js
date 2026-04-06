import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Message from '@/models/Message'
import { verifyAdmin } from '@/lib/adminAuth'
import { sanitizeInput } from '@/lib/authUtils'
import { z } from 'zod'

// Validation schema for message updates
const updateMessageSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
  isStarred: z.boolean().optional(),
  adminNotes: z.string().max(1000, 'Admin notes too long').optional().or(z.literal('')),
})

// GET - Get specific message
export async function GET(request, { params }) {
  try {
    await dbConnect()

    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      )
    }

    const { id } = await params

    const message = await Message.findById(id)

    if (!message) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 })
    }

    // Mark as read if it's new
    await message.markAsRead()

    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Get message error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch message' },
      { status: 500 },
    )
  }
}

// PUT - Update message
export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const validationResult = updateMessageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input data',
          errors: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const updateData = validationResult.data

    // Sanitize admin notes if provided
    if (updateData.adminNotes) {
      updateData.adminNotes = sanitizeInput(updateData.adminNotes)
    }

    // Find and update message
    const message = await Message.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!message) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message updated successfully',
        data: message,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Update message error:', error)

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 },
      )
    }

    if (error.name === 'CastError') {
      return NextResponse.json({ success: false, message: 'Invalid message ID' }, { status: 400 })
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update message' },
      { status: 500 },
    )
  }
}

// DELETE - Delete message
export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      )
    }

    const { id } = await params

    const message = await Message.findByIdAndDelete(id)

    if (!message) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message deleted successfully',
        data: { id: message._id, subject: message.subject },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Delete message error:', error)

    if (error.name === 'CastError') {
      return NextResponse.json({ success: false, message: 'Invalid message ID' }, { status: 400 })
    }

    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 },
    )
  }
}

// PATCH - Also handle PATCH for update (frontend uses PATCH)
export { PUT as PATCH }
