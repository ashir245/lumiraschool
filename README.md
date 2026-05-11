# LumiraSchool – Next.js + MongoDB

A complete conversion of the PHP/MySQL Data Science Hub into a modern Next.js 14 app with MongoDB, email notifications, and a polished admin panel.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: MongoDB + Mongoose
- **Email**: Nodemailer (Gmail SMTP)
- **Auth**: Cookie-based admin session

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── courses/page.tsx          # Courses listing
│   ├── fees/page.tsx             # Fee structures with PDF download
│   ├── apply/page.tsx            # Application form
│   ├── status/page.tsx           # Check application status by email
│   ├── contact/page.tsx          # Contact page
│   ├── admin/
│   │   ├── login/page.tsx        # Admin login
│   │   ├── layout.tsx            # Admin sidebar layout (auth guard)
│   │   ├── applicants/page.tsx   # Manage applicants + status updates
│   │   ├── courses/page.tsx      # Add/edit/delete courses
│   │   └── fees/page.tsx         # Upload PDF fee documents
│   └── api/
│       ├── courses/              # GET, POST, PUT, DELETE
│       ├── applications/         # GET (admin), POST (public)
│       ├── applications/[id]/    # PATCH (status update), DELETE
│       ├── status/               # GET by email (public)
│       ├── fees/                 # POST (upload PDF), DELETE
│       └── admin-auth/           # POST (login), DELETE (logout)
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── mongodb.ts                # DB connection
│   ├── email.ts                  # Nodemailer email helpers
│   └── auth.ts                   # Admin session utilities
└── models/
    ├── Course.ts                  # Course schema
    └── Application.ts            # Application schema
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

**Required variables:**

```env
# MongoDB (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/lumira-school

# Admin login password
ADMIN_PASSWORD=your-secure-password

# Gmail SMTP for email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password   # Use App Password, not regular password
FROM_EMAIL=your-gmail@gmail.com
```

### 3. Gmail App Password setup

1. Go to Google Account → Security → 2-Step Verification (enable it)
2. Then go to Security → App passwords
3. Generate a password for "Mail" → use it as `SMTP_PASS`

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Admin Panel

Visit `/admin/login` and use your `ADMIN_PASSWORD`.

### Admin features:
- **Applicants** – view all applications, filter by status, update status, send email/WhatsApp notifications
- **Courses** – create, edit, delete courses
- **Fee Documents** – upload PDF fee structures per course

---

## Key Features

### Public Pages
| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, features, how it works |
| Courses | `/courses` | Course cards with apply buttons |
| Fees | `/fees` | PDF download per course |
| Apply | `/apply` | Application form |
| Status | `/status` | Check status by email |
| Contact | `/contact` | Contact info + FAQ |

### Email Notifications
- **On application submit** – confirmation email sent to applicant
- **On status update** – admin can check "Send email" to notify the applicant with their new status and any notes

### Status Flow
```
pending → under_review → accepted / rejected / waitlisted
```

### Classes delivery
- Sessions taught live via Zoom or Google Meet
- Schedule sent to accepted applicants via email
- WhatsApp link available in admin for quick contact

---

## MongoDB Collections

### `courses`
```js
{
  title, description, duration, requirements, level,
  feeDocument: { fileName, filePath, uploadedAt }
}
```

### `applications`
```js
{
  fullName, email, phone, courseId (ref), education, experience,
  status, notes, statusUpdatedAt
}
```

---

## Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### MongoDB Atlas (free tier)
1. Create account at mongodb.com/atlas
2. Create cluster → get connection string
3. Set as `MONGODB_URI` in Vercel env vars

---

## Building for production

```bash
npm run build
npm start
```
