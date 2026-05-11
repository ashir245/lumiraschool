import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LumiraSchool – Data Science Programs',
  description: 'Comprehensive data science programs taught live via Zoom & Google Meet. Apply today.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
