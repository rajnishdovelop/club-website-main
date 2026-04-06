import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Achievement from "@/models/Achievement"
import { verifyAdmin } from "@/lib/adminAuth"
import { achievementSchema, validateBody } from "@/lib/validations"

export async function GET(request) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const query = includeInactive ? {} : { isActive: true }
    const achievements = await Achievement.find(query).sort({ year: -1, order: 1 }).lean()

    return NextResponse.json({
      success: true,
      data: achievements,
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch achievements",
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const body = await request.json()

    // Validate request body
    const validation = validateBody(achievementSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    const achievement = await Achievement.create(validation.data)

    return NextResponse.json(
      {
        success: true,
        data: achievement,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating achievement:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create achievement",
      },
      { status: 500 }
    )
  }
}
