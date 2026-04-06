import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { verifyToken } from "@/lib/authUtils"

/**
 * Verify admin authentication - supports both next-auth sessions and legacy auth-token cookies
 * @param {Request} request - The incoming request
 * @returns {Promise<{user?: User, error?: string, status?: number}>}
 */
export async function verifyAdmin(request) {
  try {
    await dbConnect()

    // First, try next-auth session (for OAuth users)
    const session = await getServerSession(authOptions)
    
    if (session?.user) {
      const user = await User.findOne({ email: session.user.email }).select("-password")
      
      if (!user || !user.isActive) {
        return { error: "User not found or inactive", status: 401 }
      }

      if (user.role !== "admin" && user.role !== "editor") {
        return { error: "Admin access required", status: 403 }
      }

      return { user }
    }

    // Fallback: try legacy auth-token cookie
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return { error: "No authentication token found", status: 401 }
    }

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user || !user.isActive) {
      return { error: "User not found or inactive", status: 401 }
    }

    if (user.role !== "admin" && user.role !== "editor") {
      return { error: "Admin access required", status: 403 }
    }

    return { user }
  } catch (error) {
    console.error("Auth verification error:", error)
    return { error: "Authentication failed", status: 401 }
  }
}
