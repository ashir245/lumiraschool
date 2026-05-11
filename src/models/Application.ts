import mongoose, { Schema, Document } from 'mongoose'

export interface IApplication extends Document {
  fullName: string
  email: string
  phone: string
  courseId: mongoose.Types.ObjectId
  education: string
  experience: string
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted'
  notes: string
  statusUpdatedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    education: { type: String, required: true },
    experience: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'accepted', 'rejected', 'waitlisted'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
    statusUpdatedAt: { type: Date },
  },
  { timestamps: true }
)

// Unique per email + course
ApplicationSchema.index({ email: 1, courseId: 1 }, { unique: true })

export default mongoose.models.Application ||
  mongoose.model<IApplication>('Application', ApplicationSchema)
