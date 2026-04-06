import mongoose from "mongoose"

const PageSettingsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "achievements"],
    },
    // For Achievements page
    statsCards: [
      {
        label: {
          type: String,
          trim: true,
        },
        number: {
          type: Number,
        },
        suffix: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    fieldsOfExcellence: [
      {
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        achievements: [
          {
            type: String,
            trim: true,
          },
        ],
        color: {
          type: String,
          trim: true,
          default: "from-sky-400 to-blue-500",
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    // For Home page
    // Hero Section
    heroSection: {
      title: {
        type: String,
        trim: true,
      },
      subtitle: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      studentsCount: {
        type: String,
        trim: true,
      },
      projectsCount: {
        type: String,
        trim: true,
      },
      awardsCount: {
        type: String,
        trim: true,
      },
    },
    heroImages: [
      {
        url: {
          type: String,
          trim: true,
        },
        publicId: {
          type: String,
          trim: true,
        },
        alt: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    // What Makes Us Unique Cards
    uniqueCards: [
      {
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        iconType: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    // Iconic Civil Engineering Marvels
    marvelCards: [
      {
        name: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        quote: {
          type: String,
          trim: true,
        },
        image: {
          url: {
            type: String,
            trim: true,
          },
          publicId: {
            type: String,
            trim: true,
          },
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.PageSettings || mongoose.model("PageSettings", PageSettingsSchema)
