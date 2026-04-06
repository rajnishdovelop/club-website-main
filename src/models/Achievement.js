import mongoose from "mongoose"

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    impact: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
AchievementSchema.index({ year: -1, order: 1 })
AchievementSchema.index({ isActive: 1 })

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema)
