# DataPollex Academy — Frontend (Next.js 16 + Tailwind CSS)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-sky?style=for-the-badge&logo=vercel)](https://datapollex-lms-seven.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/Frontend-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/moziful/DataPollex-LMS)
[![Backend Repo](https://img.shields.io/badge/Backend-GitHub-green?style=for-the-badge&logo=node.js)](https://github.com/moziful/DataPollex-LMS-Backend)

> **Recruitment Process Task**: DataPollex Ltd. — Industrial Training Recruitment Process  
> **Duration**: 2 Days (48 Hours)  
> **Project Type**: Full-Stack Learning Management System (LMS)  
> **Tech Stack**: Next.js 16.4 (App Router), React 19, Tailwind CSS v4, Framer Motion, React Icons

---

## 🔗 Quick Project Links

- 🌐 **Live Deployed Application**: [https://datapollex-lms-seven.vercel.app/](https://datapollex-lms-seven.vercel.app/)
- 💻 **Frontend Source Code**: [https://github.com/moziful/DataPollex-LMS](https://github.com/moziful/DataPollex-LMS)
- ⚙️ **Backend Source Code**: [https://github.com/moziful/DataPollex-LMS-Backend](https://github.com/moziful/DataPollex-LMS-Backend)

---

## ✨ Features & User Experience

### 1. Student Panel & Course Catalog
- **Course Discovery (`/courses` & `/`)**: Dynamic catalog retrieved from the backend API, complete with live search, pricing filters (All / Free / Paid), and pagination.
- **Sequential Video Classroom (`/courses/[id]`)**:
  - 16:9 embedded player supporting YouTube watch URLs, playlists, shorts, and direct embeds.
  - Sticky syllabus playlist with **"Now Playing"** badges and natural sequential ordering (`01`, `02`, ... `18`).
  - **Previous / Next Lesson** controls.
  - 1-click shareable link copy.

### 2. Student Dashboard (`/dashboard`)
- **Exact Lecture Continuation**: *"Continue Where You Left Off"* hero card automatically remembers the exact course and lecture index the student was watching.
- **1-Click Resume**: Clicking *"Resume Lecture"* opens `/courses/[id]?lectureId=...` with the exact video pre-selected.
- **Available Curriculums**: Quick catalog preview with direct links to other courses.

### 3. Self Profile Management (`/profile`)
- **Name Editing**: Live editing and persistence of full name.
- **Avatar Switcher**: Preset portrait avatar selector and custom image URL support with real-time preview.
- **Locked Password Update**: Password fields disabled with a `🔒 Locked • Will add later` badge per evaluation scope.

### 4. Admin Dashboard (`/admin`)
- **Access Guard**: Protected route restricted strictly to admins.
- **Course CRUD**:
  - Modal with **real-time thumbnail image preview**, title, description, and price.
  - Management table with live search and dynamic lecture counts.
  - Edit modal pre-populating existing data.
  - Delete modal with explicit warning for **cascading lecture deletion**.
- **Lecture CRUD**:
  - In-place lecture manager listing all lectures sequentially.
  - Add lecture form (title, description, embedded video URL).
  - Edit lecture form.
  - **Customized confirmation modal** (`z-60`, high-contrast dialog, replacing native browser `confirm()`).

### 5. Navigation & Theme
- **Role-Based Navigation**:
  - Student: `Home | Dashboard | Courses | About`
  - Admin: `Home | Admin Panel | Courses | About`
  - Guest: `Home | Courses | About`
- **User Avatar & Hover Pop-up**:
  - Displays avatar and truncated user name.
  - Hovering reveals dropdown card with user details, role badge (`🛡️ ADMIN` or `🎓 STUDENT`), and full-width red Sign Out button.
  - Clicking on the user info area navigates to `/profile`.
  - **"Explore"** button is automatically hidden when logged in.
- **Theme Toggle**: High-contrast Dark and Light modes matching the modern Aurora design standard.

---

## 🛠️ Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/moziful/DataPollex-LMS.git
cd DataPollex-LMS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file (or use `.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```
*(Verified: 0 errors across all 11 routes during build)*

---

## 📂 Project Routing Structure

```
app/
├── layout.js                 # Global Root Layout (ThemeProvider + Navbar + Suspense)
├── page.js                   # Hero Carousel, Featured Courses, Specialized Tracks
├── about/page.js             # Official Company Info & Technical Pillars
├── courses/
│   ├── page.js               # Filterable & Searchable Course Catalog
│   └── [id]/page.js          # Course Details & Sequential Video Classroom
├── dashboard/page.js         # Student Portal (Exact Lesson Continuation)
├── profile/page.js           # Self Profile Management (Name, Avatar, Password)
├── admin/page.js             # Protected Admin Dashboard (Course & Lecture CRUD)
└── login/page.js             # Split-Screen Sign-In & Student Sign-Up
```

---

## 🚀 Upcoming Features & Product Roadmap

The following planned enhancements are scheduled for subsequent iterations:

| Feature | Scope / Description | Architecture / Requirement |
|---|---|---|
| 🔐 **Self-Service Password Rotation** | Enable users to change their password securely with old password validation (currently marked as `Locked • Will add later` on the `/profile` page). | **Requires Backend** (`PUT /api/auth/update-password`, bcrypt hash verification) |
| 💳 **Course Enrollment & Payment Gateway** | Automated checkout (Stripe / SSLCommerz / bKash), student enrollment records, and access restriction for premium course lectures. | **Requires Backend** (`Enrollment` schema, payment webhooks, access guard) |
| 🎓 **Quizzes & Verifiable Certificates** | Modular quizzes after lectures and automated PDF certificate generation upon 100% syllabus completion. | **Requires Backend** (`Quiz` model, grading engine, PDF generation) |
| 💬 **Classroom Discussions & Reviews** | Interactive Q&A discussion board beneath each video with timestamped questions, replies, and course ratings. | **Requires Backend** (`Comment` / `Review` endpoints & MongoDB models) |
| ☁️ **Direct Cloud Video Uploads** | Cloud asset storage (AWS S3 / Cloudinary / Uploadthing) for direct video and thumbnail uploads instead of external URLs. | **Requires Backend** (Multipart upload pipeline, presigned URLs) |
| 📊 **Admin Analytics & Revenue Metrics** | Interactive charts tracking student engagement, daily watch time, completion rates, and enrollment revenue. | **Requires Backend** (MongoDB aggregation pipeline) |
| 📧 **Password Reset & Notifications** | "Forgot Password" email reset flow and automated notifications for new lectures or announcements. | **Requires Backend** (Nodemailer / Resend SMTP integration) |
| ⚡ **Classroom Keyboard Shortcuts** | Hotkeys in classroom player (`Space` to play/pause, `←`/`→` for 5s seek, `F` for fullscreen, `M` to mute). | **Frontend Only** (DOM keydown listeners) |
| 📑 **In-Class Timestamped Notes** | Personal markdown notepad synced with current video timestamps. | **Frontend + Backend Sync** |

---

## 🏢 Organization Details

**DataPollex Ltd.**  
House 6, Block A, Main Road, Mirpur 10, Mirpur, Dhaka, Bangladesh  
Phone: `01963-431045` | Email: `contact@datapollex.com`
