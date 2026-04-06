import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import PageSettings from "@/models/PageSettings"

export async function GET(request) {
  try {
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

    // If settings don't exist, return default empty structure
    if (!settings) {
      settings = {
        page,
        statsCards: [],
        fieldsOfExcellence: [],
        heroImages: [],
        homeStats: [],
        aboutSection: {},
      }
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
