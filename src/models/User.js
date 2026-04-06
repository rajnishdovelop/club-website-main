import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
      required: true,
    },
    super: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        return ret
      },
    },
  }
)

// Static method to find user by email
UserSchema.statics.findByEmail = async function (email) {
  const user = await this.findOne({
    email: email.toLowerCase(),
    isActive: true,
  })
  return user
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
