import mongoose, { Schema, Document } from 'mongoose'

export interface ICourse extends Document {
  title: string
  description: string
  duration: string
  requirements: string
  level: 'beginner' | 'intermediate' | 'advanced'
  feeDocument?: {
    fileName: string
    filePath: string
    uploadedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: String, default: '' },
    requirements: { type: String, default: '' },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    feeDocument: {
      fileName: String,
      filePath: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
)

const Course =
  (mongoose.models.Course as mongoose.Model<ICourse>) ||
  mongoose.model<ICourse>('Course', CourseSchema)

export default Course
