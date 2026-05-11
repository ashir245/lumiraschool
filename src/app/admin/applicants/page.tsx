'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, Send, Trash2, ChevronDown, Mail, Phone, GraduationCap, Briefcase, X } from 'lucide-react'

interface Application {
  _id: string
  fullName: string
  email: string
  phone: string
  courseId: { _id: string; title: string }
  education: string
  experience: string
  status: string
  notes: string
  createdAt: string
  statusUpdatedAt?: string
}

const STATUS_OPTIONS = ['pending', 'under_review', 'accepted', 'rejected', 'waitlisted']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
}
const STATUS_CLASSES: Record<string, string> = {
  pending: 'badge-pending',
  under_review: 'badge-under_review',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
  waitlisted: 'badge-waitlisted',
}

export default function ApplicantsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [filtered, setFiltered] = useState<Application[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Application | null>(null)
  const [updateStatus, setUpdateStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchApps()
  }, [])

  useEffect(() => {
    let result = apps
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.courseId?.title?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }
    setFiltered(result)
  }, [apps, search, statusFilter])

  async function fetchApps() {
    const res = await fetch('/api/applications')
    const data = await res.json()
    setApps(Array.isArray(data) ? data : [])
  }

  function openDetail(app: Application) {
    setSelected(app)
    setUpdateStatus(app.status)
    setNotes(app.notes || '')
    setMsg('')
  }

  async function handleUpdate() {
    if (!selected) return
    setSaving(true)
    const res = await fetch(`/api/applications/${selected._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updateStatus, notes, sendEmail }),
    })
    const data = await res.json()
    if (res.ok) {
      setMsg('✅ Status updated' + (sendEmail ? ' and email sent' : ''))
      fetchApps()
    } else {
      setMsg('❌ ' + data.error)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application?')) return
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    setSelected(null)
    fetchApps()
  }

  const whatsAppLink = (app: Application) => {
    let phone = app.phone.replace(/\D/g, '')
    if (phone.startsWith('0')) phone = '254' + phone.slice(1)
    const msg = encodeURIComponent(
      `Hello ${app.fullName}, regarding your application for ${app.courseId?.title}: Status: ${STATUS_LABELS[app.status]}. ${app.notes ? 'Notes: ' + app.notes : ''}\n\nBest regards,\nLumiraSchool Admissions`
    )
    return `https://wa.me/${phone}?text=${msg}`
  }

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">{apps.length} total applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {STATUS_OPTIONS.map((s) => (
          <div
            key={s}
            onClick={() => setStatusFilter(s === statusFilter ? 'all' : s)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${statusFilter === s ? 'ring-2 ring-blue-500' : ''} ${STATUS_CLASSES[s]} bg-white`}
          >
            <p className="text-2xl font-bold">{counts[s] || 0}</p>
            <p className="text-xs capitalize mt-0.5">{STATUS_LABELS[s]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or course…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No applicants found</td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{app.fullName}</p>
                    <p className="text-xs text-gray-500">{app.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.courseId?.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_CLASSES[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetail(app)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-lg font-medium transition-colors"
                      >
                        Manage
                      </button>
                      <a
                        href={whatsAppLink(app)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded-lg font-medium transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Applicant Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.education}</span>
                </div>
                {selected.experience && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-700">{selected.experience}</span>
                  </div>
                )}
              </div>

              {/* Course */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Course Applied</p>
                <p className="font-medium text-gray-900">{selected.courseId?.title}</p>
              </div>

              {/* Update status */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Update Status</h3>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Notes (shown to applicant)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any message or feedback for the applicant…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Send email notification to applicant</span>
                </label>

                {msg && (
                  <p className="text-sm text-center">{msg}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {saving ? 'Saving…' : 'Save & Notify'}
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
