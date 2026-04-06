import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ongoing", "completed"],
      required: true,
    },
    // Ongoing project fields
    expectedOutcomes: {
      type: [String],
      default: [],
    },
    leadMembers: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    timeline: {
      type: String,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
    },
    funding: {
      type: String,
    },
    status: {
      type: String,
    },
    // Completed project fields
    results: {
      type: [String],
      default: [],
    },
    impact: {
      type: String,
    },
    completionDate: {
      type: String,
    },
    teamSize: {
      type: Number,
    },
    publications: {
      type: Number,
    },
    awards: {
      type: [String],
      default: [],
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
    },
    // Common fields
    image: {
      type: String,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
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

// Index for better query performance
ProjectSchema.index({ type: 1, isActive: 1, order: 1 })
ProjectSchema.index({ createdAt: -1 })

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema)
