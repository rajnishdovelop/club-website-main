import mongoose from "mongoose"

const TeamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [100, "Position cannot exceed 100 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
    },
    skills: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Skill cannot exceed 50 characters"],
      },
    ],
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
      default: null,
    },
    social: {
      insta: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/(www\.)?instagram\.com\//.test(v)
          },
          message: "Please enter a valid Instagram URL",
        },
      },
      linkedin: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/(www\.)?linkedin\.com\//.test(v)
          },
          message: "Please enter a valid LinkedIn URL",
        },
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return !v || /^\S+@\S+\.\S+$/.test(v)
          },
          message: "Please enter a valid email address",
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better performance
TeamMemberSchema.index({ isActive: 1, order: 1 })
TeamMemberSchema.index({ department: 1 })
TeamMemberSchema.index({ createdBy: 1 })

// Static method to get active team members
TeamMemberSchema.statics.getActiveMembers = function () {
  return this.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
}

// Static method to get members by department
TeamMemberSchema.statics.getByDepartment = function (department) {
  return this.find({
    department: new RegExp(department, "i"),
    isActive: true,
  }).sort({ order: 1, createdAt: -1 })
}

// Method to get public profile (without sensitive data)
TeamMemberSchema.methods.getPublicProfile = function () {
  const profile = this.toObject()
  delete profile.createdBy
  delete profile.__v
  return profile
}

export default mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema)
