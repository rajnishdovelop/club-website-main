import mongoose from "mongoose"

const EventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: false,
    },
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

// Index for better query performance
EventRegistrationSchema.index({ eventId: 1, createdAt: -1 })
EventRegistrationSchema.index({ status: 1 })
// Compound index to prevent duplicate registrations (same email for same event)
EventRegistrationSchema.index({ eventId: 1, userEmail: 1 }, { unique: true, sparse: true })

export default mongoose.models.EventRegistration || mongoose.model("EventRegistration", EventRegistrationSchema)
