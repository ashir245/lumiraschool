'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, BookOpen } from 'lucide-react'

interface Course {
  _id: string
  title: string
  description: string
  duration: string
  requirements: string
  level: string
}

const LEVELS = ['beginner', 'intermediate', 'advanced']

const emptyForm = { title: '', description: '', duration: '', requirements: '', level: 'beginner' }

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchCourses() }, [])

  async function fetchCourses() {
    const res = await fetch('/api/courses')
    setCourses(await res.json())
  }

  function startEdit(c: Course) {
    setEditing(c._id)
    setForm({ title: c.title, description: c.description, duration: c.duration, requirements: c.requirements, level: c.level })
    setShowForm(true)
    setMsg('')
  }

  function cancelForm() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(false)
    setMsg('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    const res = await fetch('/api/courses', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { ...form, _id: editing } : form),
    })

    if (res.ok) {
      setMsg(editing ? '✅ Course updated' : '✅ Course created')
      cancelForm()
      fetchCourses()
    } else {
      const d = await res.json()
      setMsg('❌ ' + d.error)
    }
    setSaving(false)
  }

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course? This cannot be undone.')) return
    await fetch(`/api/courses?id=${id}`, { method: 'DELETE' })
    fetchCourses()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">{courses.length} course(s)</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {msg && <div className="mb-4 text-sm text-center font-medium">{msg}</div>}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">{editing ? 'Edit Course' : 'New Course'}</h2>
            <button onClick={cancelForm} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Python for Data Science"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                placeholder="Describe the course content, objectives and outcomes…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                <input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 8 weeks"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Requirements</label>
                <input
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  placeholder="e.g. Basic math, laptop"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={cancelForm} className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-lg"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : editing ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses list */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No courses yet. Create your first course!</p>
          </div>
        ) : (
          courses.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">{c.level}</span>
                  {c.duration && <span className="text-xs text-gray-400">{c.duration}</span>}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(c)}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCourse(c._id)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
