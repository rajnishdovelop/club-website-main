"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

/**
 * Session Provider wrapper for NextAuth
 * Provides authentication context to the app
 */
export function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
