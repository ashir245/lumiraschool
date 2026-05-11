import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Application from '@/models/Application'
import Course from '@/models/Course'
import { sendStatusUpdate } from '@/lib/email'
import { isAdminFromRequest } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const { status, notes, sendEmail } = body

  const validStatuses = ['pending', 'under_review', 'accepted', 'rejected', 'waitlisted']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const application = await Application.findByIdAndUpdate(
    params.id,
    { status, notes: notes || '', statusUpdatedAt: new Date() },
    { new: true }
  ).populate('courseId', 'title')

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  // Send email notification if requested
  if (sendEmail) {
    try {
      const courseName = (application.courseId as any)?.title || 'your course'
      await sendStatusUpdate(application.email, application.fullName, courseName, status, notes || '')
    } catch (e) {
      console.error('Email send error:', e)
    }
  }

  return NextResponse.json({ success: true, application })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  await Application.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
