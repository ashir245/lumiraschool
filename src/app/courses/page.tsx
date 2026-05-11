import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { Clock, BarChart, BookOpen, ArrowRight } from 'lucide-react'

export const revalidate = 0  // ← always fetch fresh, never cache

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

async function getCourses() {
  await connectDB()
  return Course.find().sort({ createdAt: -1 }).lean()
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl mb-4">Our Data Science Programs</h1>
            <p className="text-blue-100 text-xl">Comprehensive courses designed to launch your career in data science</p>
          </div>
        </section>

        {/* Courses grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            {courses.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No courses available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course: any, i: number) => (
                  <div
                    key={course._id.toString()}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col animate-fade-up"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${LEVEL_COLORS[course.level] || 'bg-gray-100 text-gray-600'}`}>
                          {course.level}
                        </span>
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="font-heading text-xl text-gray-900 mb-3">{course.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{course.description}</p>

                      {course.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {course.duration}
                        </div>
                      )}

                      {course.requirements && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 leading-relaxed">
                          <span className="font-medium text-gray-700">Requirements: </span>
                          {course.requirements}
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        href={`/apply?course=${course._id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                      >
                        Apply for this Course <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
