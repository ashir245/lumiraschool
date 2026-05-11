import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { isAdminFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const formData = await req.formData()
  const courseId = formData.get('courseId') as string
  const file = formData.get('file') as File

  if (!courseId || !file) {
    return NextResponse.json({ error: 'courseId and file are required' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64}`

  const course = await Course.findOneAndUpdate(
    { _id: courseId },
    {
      feeDocument: {
        fileName: file.name,
        filePath: dataUrl,   // stored as data URL, served directly
        uploadedAt: new Date(),
      },
    },
    { new: true }
  )

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, course })
}

export async function DELETE(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 })
  }

  await Course.findOneAndUpdate({ _id: courseId }, { $unset: { feeDocument: 1 } })
  return NextResponse.json({ success: true })
}