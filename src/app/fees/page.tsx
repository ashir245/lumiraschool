import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import connectDB from '@/lib/mongodb'
import Course from '@/models/Course'
import { Download, FileText, Clock, Info } from 'lucide-react'

async function getCourses() {
  await connectDB()
  return Course.find().sort({ title: 1 }).lean()
}

export default async function FeesPage() {
  const courses = await getCourses()

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl mb-4">Tuition & Fees</h1>
            <p className="text-purple-100 text-xl">Transparent pricing for all our data science programs</p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl text-gray-900 mb-3">Course Fees Structure</h2>
              <p className="text-gray-500">Download the detailed fee breakdown for each program</p>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No courses available yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course: any, i: number) => (
                  <div
                    key={course._id.toString()}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-fade-up"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                      <div className="flex items-start justify-between">
                        <h3 className="font-heading text-xl leading-snug">{course.title}</h3>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                      {course.duration && (
                        <div className="flex items-center gap-2 mt-3 text-blue-100 text-sm">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                        {course.description}
                      </p>

                      {course.feeDocument ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="truncate">{course.feeDocument.fileName}</span>
                          </div>
                          <a
                            href={course.feeDocument.filePath}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Fee Structure
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                          <Info className="w-4 h-4 flex-shrink-0" />
                          Fee document coming soon. Contact us for details.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact notice */}
            <div className="mt-16 text-center p-8 bg-blue-50 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">Need more information?</h3>
              <p className="text-gray-500 mb-4">
                Reach out to us via WhatsApp or email for payment plans and scholarship inquiries.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/254759083260"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium text-sm transition-colors"
                >
                  WhatsApp Us
                </a>
                <a
                  href="mailto:lumiraschool@gmail.com"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
