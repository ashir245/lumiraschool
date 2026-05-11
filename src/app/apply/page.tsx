import { Suspense } from 'react'
import ApplyForm from './ApplyForm'

export default function ApplyPage() {
  return (
    <Suspense fallback={<div>Loading application form...</div>}>
      <ApplyForm />
    </Suspense>
  )
}
