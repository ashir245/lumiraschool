'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, Trash2, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface Course {
  _id: string
  title: string
  level: string
  feeDocument?: {
    fileName: string
    filePath: string
    uploadedAt: string
  }
}

export default function AdminFeesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => { fetchCourses() }, [])

  async function fetchCourses() {
    const res = await fetch('/api/courses')
    setCourses(await res.json())
  }

  async function handleUpload(courseId: string, file: File) {
    if (!file || file.type !== 'application/pdf') {
      setMsg({ id: courseId, type: 'error', text: 'Only PDF files are allowed' })
      return
    }

    setUploading(courseId)
    setMsg(null)

    const fd = new FormData()
    fd.append('courseId', courseId)
    fd.append('file', file)

    const res = await fetch('/api/fees', { method: 'POST', body: fd })
    const data = await res.json()

    if (res.ok) {
      setMsg({ id: courseId, type: 'success', text: 'Fee document uploaded!' })
      fetchCourses()
    } else {
      setMsg({ id: courseId, type: 'error', text: data.error })
    }
    setUploading(null)
  }

  async function handleDelete(courseId: string) {
    if (!confirm('Remove fee document for this course?')) return
    await fetch(`/api/fees?courseId=${courseId}`, { method: 'DELETE' })
    fetchCourses()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fee Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Upload PDF fee structures for each course</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">{course.level}</span>
            </div>

            <div className="p-5">
              {course.feeDocument ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{course.feeDocument.fileName}</span>
                    </div>
                    <a
                      href={course.feeDocument.filePath}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400">
                    Uploaded: {new Date(course.feeDocument.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No fee document uploaded yet
                </div>
              )}

              {msg?.id === course._id && (
                <div className={`mb-3 p-2 rounded-lg text-xs flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {msg.type === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {msg.text}
                </div>
              )}

              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    ref={(el) => {
                      if (el) fileRefs.current[course._id] = el
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(course._id, file)
                    }}
                  />
                  <span
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      uploading === course._id
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {uploading === course._id ? 'Uploading…' : course.feeDocument ? 'Replace PDF' : 'Upload PDF'}
                  </span>
                </label>

                {course.feeDocument && (
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No courses yet. Create courses first before uploading fee documents.</p>
        </div>
      )}
    </div>
  )
}
