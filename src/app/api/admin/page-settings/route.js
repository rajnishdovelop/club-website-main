import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import PageSettings from "@/models/PageSettings"
import { verifyAdmin } from "@/lib/adminAuth"

export async function GET(request) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page parameter is required",
        },
        { status: 400 }
      )
    }

    let settings = await PageSettings.findOne({ page }).lean()

    // If settings don't exist, create default
    if (!settings) {
      settings = await PageSettings.create({
        page,
        statsCards: [],
        fieldsOfExcellence: [],
        heroImages: [],
        homeStats: [],
        aboutSection: {},
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Error fetching page settings:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch page settings",
      },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
    }

    await dbConnect()

    const body = await request.json()
    const { page, ...updateData } = body

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page parameter is required",
        },
        { status: 400 }
      )
    }

    // Validation for achievements page
    if (page === "achievements") {
      if (updateData.statsCards && updateData.statsCards.length > 4) {
        return NextResponse.json(
          {
            success: false,
            error: "Maximum 4 stats cards allowed",
          },
          { status: 400 }
        )
      }
      if (updateData.fieldsOfExcellence && updateData.fieldsOfExcellence.length > 6) {
        return NextResponse.json(
          {
            success: false,
            error: "Maximum 6 fields of excellence cards allowed",
          },
          { status: 400 }
        )
      }
    }

    const settings = await PageSettings.findOneAndUpdate({ page }, { page, ...updateData }, { new: true, upsert: true, runValidators: true })

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Error updating page settings:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update page settings",
      },
      { status: 500 }
    )
  }
}
