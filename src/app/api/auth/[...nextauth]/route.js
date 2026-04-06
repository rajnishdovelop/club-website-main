import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect()

        // Check if user exists in database
        const existingUser = await User.findByEmail(user.email)

        if (!existingUser) {
          // User not found - don't allow sign in
          return false
        }

        // Check if user is active
        if (!existingUser.isActive) {
          return false
        }

        // Update user info from Google if needed
        if (account.provider === "google") {
          existingUser.googleId = profile.sub
          existingUser.name = user.name
          existingUser.image = user.image
          await existingUser.save()
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.super = token.super
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          await dbConnect()
          const dbUser = await User.findByEmail(user.email)
          if (dbUser) {
            token.role = dbUser.role
            token.super = dbUser.super
            token.userId = dbUser._id.toString()
          }
        } catch (error) {
          console.error("Error in JWT callback:", error)
        }
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
