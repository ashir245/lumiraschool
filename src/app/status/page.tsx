'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Mail, Clock, CheckCircle, XCircle, AlertCircle, Hourglass, BookOpen } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; text: string; border: string }> = {
  pending: {
    label: 'Pending Review',
    icon: Hourglass,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  under_review: {
    label: 'Under Review',
    icon: Search,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  accepted: {
    label: 'Accepted! 🎉',
    icon: CheckCircle,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  rejected: {
    label: 'Not Successful',
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  waitlisted: {
    label: 'Waitlisted',
    icon: AlertCircle,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
}

interface Application {
  _id: string
  status: string
  notes: string
  courseId: { title: string; level: string; duration: string }
  createdAt: string
  statusUpdatedAt?: string
}

export default function StatusPage() {
  const [email, setEmail] = useState('')
  const [applications, setApplications] = useState<Application[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setApplications(null)

    try {
      const res = await fetch(`/api/status?email=${encodeURIComponent(email.trim())}`)
      const data = await res.json()
      setApplications(data)
    } catch {
      setError('Unable to fetch status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-indigo-700 to-blue-700 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center text-white">
            <h1 className="font-heading text-4xl mb-3">Check Application Status</h1>
            <p className="text-blue-100">Enter the email you used to apply, and we'll show your application status.</p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-14">
          {/* Search */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Mail className="w-4 h-4 inline mr-1" />Your Email Address
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? '' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Results */}
          {applications !== null && (
            <>
              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium text-gray-700">No applications found</p>
                  <p className="text-sm mt-1">No applications found for this email. Double-check the address or <a href="/apply" className="text-blue-500 hover:underline">apply now</a>.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">{applications.length} application(s) found</p>
                  {applications.map((app) => {
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
                    const Icon = cfg.icon
                    return (
                      <div key={app._id} className={`bg-white rounded-2xl border p-6 shadow-sm ${cfg.border}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {app.courseId?.title || 'Unknown Course'}
                            </h3>
                            {app.courseId?.duration && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {app.courseId.duration}
                              </p>
                            )}
                          </div>
                          <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.text}`}>
                            <Icon className="w-4 h-4" />
                            {cfg.label}
                          </span>
                        </div>

                        {app.notes && (
                          <div className={`p-3 rounded-lg text-sm ${cfg.bg} ${cfg.text} mb-3`}>
                            <span className="font-medium">Message from admissions: </span>
                            {app.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                          {app.statusUpdatedAt && (
                            <span>Updated: {new Date(app.statusUpdatedAt).toLocaleDateString()}</span>
                          )}
                        </div>

                        {app.status === 'accepted' && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                            🎓 Congratulations! Our team will contact you with Zoom/Google Meet session details.
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
