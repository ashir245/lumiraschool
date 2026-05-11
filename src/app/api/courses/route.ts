import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { isAdminFromRequest } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const courses = await Course.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const { title, description, duration, requirements, level } = body

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
  }

  const course = await Course.create({ title, description, duration, requirements, level })
  return NextResponse.json(course, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const { _id, title, description, duration, requirements, level } = body

  const course = await Course.findByIdAndUpdate(
    _id,
    { title, description, duration, requirements, level },
    { new: true }
  )

  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(course)
}

export async function DELETE(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await Course.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
