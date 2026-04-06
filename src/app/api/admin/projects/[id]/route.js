import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Project from "@/models/Project"
import { verifyAdmin } from "@/lib/adminAuth"
import { deleteFromCloudinary } from "@/lib/cloudinary"

// GET - Fetch single project
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params
    const project = await Project.findById(id)

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid project ID format" }, { status: 400 })
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project",
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// PUT - Update project
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params
    const body = await request.json()

    const project = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    })
  } catch (error) {
    console.error("Error updating project:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid project ID format" }, { status: 400 })
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update project",
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete project
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { id } = await params
    const project = await Project.findById(id)

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 })
    }

    // Delete associated Cloudinary images
    if (project.images && project.images.length > 0) {
      const deletePromises = project.images
        .filter((img) => img.publicId)
        .map((img) => deleteFromCloudinary(img.publicId).catch((err) => console.error(`Failed to delete image ${img.publicId}:`, err)))
      await Promise.all(deletePromises)
    }

    await Project.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid project ID format" }, { status: 400 })
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete project",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
