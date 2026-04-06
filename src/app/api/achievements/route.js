import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Achievement from "@/models/Achievement"

export async function GET() {
  try {
    await dbConnect()

    const achievements = await Achievement.find({ isActive: true }).sort({ year: -1, order: 1 }).lean()

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
