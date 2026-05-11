import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Application from '@/models/Application'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.toLowerCase().trim()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const applications = await Application.find({ email })
    .populate('courseId', 'title duration level')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(applications)
}
