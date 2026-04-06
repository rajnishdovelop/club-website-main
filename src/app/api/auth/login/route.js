import { NextResponse } from "next/server"

// Legacy login route - App uses NextAuth OAuth
// This route is disabled for security

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Password-based login is disabled. Please use Google Sign-In.",
    },
    { status: 400 }
  )
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
