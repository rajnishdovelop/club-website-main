import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { verifyToken } from "@/lib/authUtils"

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect()

    // First, try next-auth session (for OAuth users)
    const session = await getServerSession(authOptions)
    
    if (session?.user) {
      // User is authenticated via next-auth (Google OAuth)
      const user = await User.findOne({ email: session.user.email }).select("-password")
      
      if (!user || !user.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found or inactive",
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            super: user.super,
            isActive: user.isActive,
            createdAt: user.createdAt,
          },
        },
        { status: 200 }
      )
    }

    // Fallback: try legacy auth-token cookie
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No authentication token found",
        },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)

    // Find user
    const user = await User.findById(decoded.userId).select("-password")

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found or inactive",
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          super: user.super,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get user info error:", error)

    if (error.message?.includes("Token") || error.message?.includes("token")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}

