import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { isAdminFromRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

  const allowedTypes = ['application/pdf']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads', 'fees')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const fileName = `${courseId}-${Date.now()}-${file.name}`
  const filePath = join(uploadDir, fileName)
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  const course = await Course.findByIdAndUpdate(
    courseId,
    {
      feeDocument: {
        fileName: file.name,
        filePath: `/uploads/fees/${fileName}`,
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

  await Course.findByIdAndUpdate(courseId, { $unset: { feeDocument: 1 } })
  return NextResponse.json({ success: true })
}
