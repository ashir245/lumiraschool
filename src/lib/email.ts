import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  under_review: 'Under Review',
  accepted: 'Accepted ✅',
  rejected: 'Not Successful',
  waitlisted: 'Waitlisted',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  under_review: '#3b82f6',
  accepted: '#10b981',
  rejected: '#ef4444',
  waitlisted: '#8b5cf6',
}

export async function sendApplicationConfirmation(
  email: string,
  name: string,
  courseName: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', sans-serif; background: #f3f4f6; margin:0; padding:0;">
      <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2563eb,#1e40af); padding:40px; text-align:center;">
          <h1 style="color:#fff; margin:0; font-size:28px; font-weight:700;">LumiraSchool</h1>
          <p style="color:#bfdbfe; margin:8px 0 0;">Data Science Programs</p>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#1e3a8a; margin-top:0;">Application Received! 🎉</h2>
          <p style="color:#374151; line-height:1.7;">Hi <strong>${name}</strong>,</p>
          <p style="color:#374151; line-height:1.7;">
            Thank you for applying to <strong>${courseName}</strong> at LumiraSchool. 
            We have received your application and will review it shortly.
          </p>
          <div style="background:#eff6ff; border-left:4px solid #2563eb; padding:16px 20px; border-radius:0 8px 8px 0; margin:24px 0;">
            <p style="margin:0; color:#1e40af; font-weight:600;">What happens next?</p>
            <ul style="color:#374151; margin:8px 0 0; padding-left:20px; line-height:2;">
              <li>Our team will review your application</li>
              <li>You'll receive a status update via this email</li>
              <li>You can also check your status at any time on our website</li>
            </ul>
          </div>
          <p style="color:#374151; line-height:1.7;">
            To check your application status, visit our website and go to <strong>Check Status</strong>.
          </p>
          <p style="color:#6b7280; font-size:14px; margin-top:32px; border-top:1px solid #e5e7eb; padding-top:20px;">
            Questions? Reach us at <a href="mailto:lumiraschool@gmail.com" style="color:#2563eb;">lumiraschool@gmail.com</a> or WhatsApp: 0759083260
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"LumiraSchool" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Application Received – ${courseName}`,
    html,
  })
}

export async function sendStatusUpdate(
  email: string,
  name: string,
  courseName: string,
  status: string,
  notes: string
) {
  const statusLabel = STATUS_LABELS[status] || status
  const statusColor = STATUS_COLORS[status] || '#6b7280'

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', sans-serif; background: #f3f4f6; margin:0; padding:0;">
      <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2563eb,#1e40af); padding:40px; text-align:center;">
          <h1 style="color:#fff; margin:0; font-size:28px; font-weight:700;">LumiraSchool</h1>
          <p style="color:#bfdbfe; margin:8px 0 0;">Application Status Update</p>
        </div>
        <div style="padding:40px;">
          <p style="color:#374151; line-height:1.7;">Hi <strong>${name}</strong>,</p>
          <p style="color:#374151; line-height:1.7;">
            There's an update on your application for <strong>${courseName}</strong>.
          </p>
          <div style="text-align:center; margin:32px 0;">
            <span style="display:inline-block; background:${statusColor}20; color:${statusColor}; border:2px solid ${statusColor}; padding:12px 32px; border-radius:50px; font-size:20px; font-weight:700;">
              ${statusLabel}
            </span>
          </div>
          ${
            notes
              ? `
          <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:16px 20px; border-radius:8px; margin:24px 0;">
            <p style="margin:0 0 8px; color:#374151; font-weight:600;">Message from admissions:</p>
            <p style="margin:0; color:#4b5563; line-height:1.7;">${notes}</p>
          </div>
          `
              : ''
          }
          ${
            status === 'accepted'
              ? `
          <div style="background:#ecfdf5; border-left:4px solid #10b981; padding:16px 20px; border-radius:0 8px 8px 0; margin:24px 0;">
            <p style="margin:0; color:#065f46; font-weight:600;">🎓 Welcome to LumiraSchool!</p>
            <p style="margin:8px 0 0; color:#065f46; line-height:1.7;">Our team will be in touch with onboarding details and your Zoom/Google Meet session schedule.</p>
          </div>
          `
              : ''
          }
          <p style="color:#6b7280; font-size:14px; margin-top:32px; border-top:1px solid #e5e7eb; padding-top:20px;">
            Questions? Reach us at <a href="mailto:lumiraschool@gmail.com" style="color:#2563eb;">lumiraschool@gmail.com</a> or WhatsApp: 0759083260
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"LumiraSchool" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Application Update – ${courseName} (${statusLabel})`,
    html,
  })
}
