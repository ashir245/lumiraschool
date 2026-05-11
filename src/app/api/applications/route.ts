import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Application from '@/models/Application'
import Course from '@/models/Course'
import { sendApplicationConfirmation } from '@/lib/email'
import { isAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const applications = await Application.find()
    .populate('courseId', 'title')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(applications)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const { fullName, email, phone, courseId, education, experience } = body

  if (!fullName || !email || !phone || !courseId || !education) {
    return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Verify course exists
  const course = await Course.findById(courseId)
  if (!course) {
    return NextResponse.json({ error: 'Selected course does not exist' }, { status: 400 })
  }

  // Check duplicate
  const existing = await Application.findOne({ email: email.toLowerCase(), courseId })
  if (existing) {
    return NextResponse.json(
      { error: 'You have already applied for this course with this email' },
      { status: 409 }
    )
  }

  const application = await Application.create({
    fullName,
    email: email.toLowerCase(),
    phone,
    courseId,
    education,
    experience: experience || '',
  })

  // Send confirmation email (don't fail the request if email fails)
  try {
    await sendApplicationConfirmation(email, fullName, course.title)
  } catch (e) {
    console.error('Email error:', e)
  }

  return NextResponse.json(
    { success: true, message: `Application for ${course.title} submitted successfully!`, name: fullName },
    { status: 201 }
  )
}
