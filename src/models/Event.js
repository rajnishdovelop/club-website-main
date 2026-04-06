import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["upcoming", "ongoing", "past"],
      default: "upcoming",
    },
    category: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    participants: {
      type: String,
      trim: true,
    },
    teams: {
      type: String,
      trim: true,
    },
    registrations: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    outcome: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    impact: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
      },
    ],
    // Registration Configuration
    registrationEnabled: {
      type: Boolean,
      default: false,
    },
    registrationForm: [
      {
        fieldName: {
          type: String,
          required: true,
        },
        fieldLabel: {
          type: String,
          required: true,
        },
        fieldType: {
          type: String,
          required: true,
          enum: ["text", "email", "tel", "number", "textarea", "select", "checkbox", "radio", "date"],
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [String], // For select, radio, checkbox
        placeholder: String,
        order: {
          type: Number,
          default: 0,
        },
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
EventSchema.index({ type: 1, isActive: 1, order: 1 })
EventSchema.index({ createdAt: -1 })

export default mongoose.models.Event || mongoose.model("Event", EventSchema)
