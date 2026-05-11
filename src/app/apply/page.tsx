'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Loader2, Send, User, Mail, Phone, BookOpen, GraduationCap, Briefcase } from 'lucide-react'

interface Course {
  _id: string
  title: string
  level: string
}

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const preselectedCourse = searchParams.get('course')

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string; name?: string } | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseId: preselectedCourse || '',
    education: '',
    experience: '',
  })

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then(setCourses)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setResult({ type: 'success', message: data.message, name: data.name })
        setForm({ fullName: '', email: '', phone: '', courseId: '', education: '', experience: '' })
      } else {
        setResult({ type: 'error', message: data.error })
      }
    } catch {
      setResult({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h1 className="font-heading text-4xl mb-3">Apply to LumiraSchool</h1>
            <p className="text-blue-100">Fill out the form below to apply. We'll review your application and email you the status.</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14">
          {/* Alert */}
          {result && (
            <div className={`mb-8 p-5 rounded-2xl flex items-start gap-4 ${result.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {result.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                {result.type === 'success' && result.name && (
                  <p className="font-semibold text-green-800 mb-1">Thank you, {result.name}!</p>
                )}
                <p className={result.type === 'success' ? 'text-green-700' : 'text-red-700'}>{result.message}</p>
                {result.type === 'success' && (
                  <p className="text-green-600 text-sm mt-2">A confirmation email has been sent to your inbox.</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h2 className="font-heading text-2xl text-gray-900 mb-1">Application Form</h2>
              <p className="text-gray-500 text-sm">All fields marked * are required</p>
            </div>

            <div className="p-8 space-y-6">
              {/* Personal info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />Full Name *
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />Phone Number *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="0712 345 678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />Select Course *
                </label>
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-1" />Highest Education Level *
                </label>
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="">-- Select --</option>
                  <option>High School</option>
                  <option>Certificate</option>
                  <option>Diploma</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>PhD</option>
                  <option>Self-Taught</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Prior Experience <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about any relevant experience — coding, statistics, data analysis, etc."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                After submitting, check your email for a confirmation. You can also track your application status on the <a href="/status" className="text-blue-500 hover:underline">Status page</a>.
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
