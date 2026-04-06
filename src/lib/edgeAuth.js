// Edge-safe JWT verification using `jose` (Web Crypto compatible)
import { jwtVerify } from "jose"

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not set")
  }
  return new TextEncoder().encode(secret)
}

export const verifyTokenEdge = async (token) => {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: "conreate-app",
      audience: "conreate-users",
    })
    return payload
  } catch (error) {
    // Normalize errors for middleware
    const msg = error?.message || "Token verification failed"
    throw new Error(msg)
  }
}
