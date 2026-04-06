import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
      validate: {
        validator: function (v) {
          // Allow empty/no phone, or any reasonable phone format
          if (!v || v.trim() === '') return true
          // Allow digits, spaces, dashes, parentheses, and plus sign
          return /^[\+\d\s\-\(\)]{6,20}$/.test(v)
        },
        message: 'Please enter a valid phone number',
      },
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
MessageSchema.index({ status: 1, createdAt: -1 })
MessageSchema.index({ email: 1 })
MessageSchema.index({ createdAt: -1 })
MessageSchema.index({ isStarred: 1 })

// Static method to get messages with filters
MessageSchema.statics.getFilteredMessages = function (filters = {}) {
  const query = {}

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.isStarred !== undefined) {
    query.isStarred = filters.isStarred
  }

  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { email: new RegExp(filters.search, 'i') },
      { subject: new RegExp(filters.search, 'i') },
      { message: new RegExp(filters.search, 'i') },
    ]
  }

  return this.find(query).sort({ createdAt: -1 })
}

// Static method to get message statistics
MessageSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  const totalMessages = await this.countDocuments()
  const starredMessages = await this.countDocuments({ isStarred: true })

  const statusCounts = stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count
    return acc
  }, {})

  return {
    total: totalMessages,
    starred: starredMessages,
    new: statusCounts.new || 0,
    read: statusCounts.read || 0,
    replied: statusCounts.replied || 0,
    archived: statusCounts.archived || 0,
  }
}

// Method to mark as read
MessageSchema.methods.markAsRead = function () {
  if (this.status === 'new') {
    this.status = 'read'
    return this.save()
  }
  return Promise.resolve(this)
}

// Method to toggle star
MessageSchema.methods.toggleStar = function () {
  this.isStarred = !this.isStarred
  return this.save()
}

export default mongoose.models.Message || mongoose.model('Message', MessageSchema)
