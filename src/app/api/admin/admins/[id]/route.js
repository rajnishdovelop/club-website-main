import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

// DELETE - Delete admin by ID (only for super admins)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is super admin
    if (!session.user.super) {
      return NextResponse.json({ success: false, message: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const { id } = await params

    await dbConnect()

    const adminToDelete = await User.findById(id)

    if (!adminToDelete) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 })
    }

    // Prevent deleting yourself
    if (adminToDelete.email === session.user.email) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 })
    }

    // Prevent deleting the last super admin
    if (adminToDelete.super) {
      const superAdminCount = await User.countDocuments({ super: true, isActive: true })
      if (superAdminCount <= 1) {
        return NextResponse.json({ success: false, message: "Cannot delete the last super admin" }, { status: 400 })
      }
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json({ success: false, message: "Failed to delete admin", error: error.message }, { status: 500 })
  }
}

// PUT - Update admin (only for super admins)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is super admin
    if (!session.user.super) {
      return NextResponse.json({ success: false, message: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, role, super: isSuper, isActive } = body

    await dbConnect()

    const admin = await User.findById(id)

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 })
    }

    // Prevent removing super from yourself
    if (admin.email === session.user.email && isSuper === false) {
      return NextResponse.json({ success: false, message: "Cannot remove super admin status from yourself" }, { status: 400 })
    }

    // Prevent removing super from last super admin
    if (admin.super && isSuper === false) {
      const superAdminCount = await User.countDocuments({ super: true, isActive: true })
      if (superAdminCount <= 1) {
        return NextResponse.json({ success: false, message: "Cannot remove super status from the last super admin" }, { status: 400 })
      }
    }

    // Update fields
    if (name !== undefined) admin.name = name
    if (role !== undefined) admin.role = role
    if (isSuper !== undefined) admin.super = isSuper
    if (isActive !== undefined) admin.isActive = isActive

    await admin.save()

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    })
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json({ success: false, message: "Failed to update admin", error: error.message }, { status: 500 })
  }
}
