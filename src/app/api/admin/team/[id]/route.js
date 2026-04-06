import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import TeamMember from "@/models/TeamMember"
import { verifyAdmin } from "@/lib/adminAuth"
import { sanitizeInput } from "@/lib/authUtils"
import { z } from "zod"

// Validation schema for team member update
const updateTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  position: z.string().min(1, "Position is required").max(100, "Position too long").optional(),
  department: z.string().min(1, "Department is required").max(100, "Department too long").optional(),
  skills: z.array(z.string().max(50, "Skill name too long")).optional(),
  image: z.string().min(1, "Image is required").optional(),
  imagePublicId: z.string().optional().nullable(),
  social: z
    .object({
      insta: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
      linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
      email: z.string().email("Invalid email").optional().or(z.literal("")),
    })
    .optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
})

// GET - Get specific team member
export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    const { id } = await params

    const teamMember = await TeamMember.findById(id).populate("createdBy", "name email")

    if (!teamMember) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        data: teamMember,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get team member error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch team member" }, { status: 500 })
  }
}

// PUT - Update team member
export async function PUT(request, { params }) {
  try {
    await dbConnect()
    
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const validationResult = updateTeamMemberSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const updateData = validationResult.data

    // Sanitize string inputs
    if (updateData.name) updateData.name = sanitizeInput(updateData.name)
    if (updateData.position) updateData.position = sanitizeInput(updateData.position)
    if (updateData.department) updateData.department = sanitizeInput(updateData.department)
    if (updateData.skills) updateData.skills = updateData.skills.map((skill) => sanitizeInput(skill))

    // Find and update team member
    const teamMember = await TeamMember.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).populate("createdBy", "name email")

    if (!teamMember) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Team member updated successfully",
        data: teamMember,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update team member error:", error)

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 }
      )
    }

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid team member ID" }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Failed to update team member" }, { status: 500 })
  }
}

// DELETE - Delete team member
export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    const { id } = await params

    const teamMember = await TeamMember.findByIdAndDelete(id)

    if (!teamMember) {
      return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Team member deleted successfully",
        data: { id: teamMember._id, name: teamMember.name },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete team member error:", error)

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid team member ID" }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Failed to delete team member" }, { status: 500 })
  }
}
