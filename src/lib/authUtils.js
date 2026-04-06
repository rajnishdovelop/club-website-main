import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable inside .env.local")
}

// Generate JWT token
export const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "conreate-app",
      audience: "conreate-users",
    }
  )
}

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "conreate-app",
      audience: "conreate-users",
    })
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired")
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token")
    } else {
      throw new Error("Token verification failed")
    }
  }
}

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}

// Compare password
export const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword)
}

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

// Validate password strength
export const validatePassword = (password) => {
  const errors = []

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Generate random password
export const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Check if user has required role
export const hasRequiredRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    admin: 2,
    editor: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}
