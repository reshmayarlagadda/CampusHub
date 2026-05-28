# 🎓 CampusHub — College Event & Certificate Management System

A full-stack **MERN** application for managing college events, student registrations, attendance, and digital certificates — all in one secure, verified portal.

---

## 🚀 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend    | Node.js, Express.js |
| Database   | MongoDB Atlas + Mongoose |
| Auth       | JWT + bcryptjs |
| Email      | Nodemailer (Gmail) |
| Storage    | Cloudinary (banners, certificates, club images) |
| UI Icons   | React Icons |
| Toasts     | React Hot Toast |

---

## 📁 Project Structure

```
campusconnect/
├── backend/          # Express API server
│   ├── config/       # DB & Cloudinary config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth & role middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── utils/        # Email & JWT helpers
│   └── server.js
│
└── frontend/         # React + Vite app
    └── src/
        ├── components/   # Reusable UI components
        ├── pages/        # All page components
        ├── context/      # Auth context
        └── utils/        # Axios instance
```

---

## ⚙️ Setup Instructions

### 1. Clone the project

```bash
git clone <your-repo-url>
cd campusHub
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required `.env` values:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campusconnect

JWT_SECRET=your_very_strong_secret_key_here
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
ADMIN_SECRET_KEY=your_admin_creation_secret
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one.

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The default API URL is already proxied via Vite config.

Start the frontend:

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### 4. Create Admin Account

Send a POST request to create the first admin:

```http
POST http://localhost:5000/api/admin/create-account
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "admin@college.edu",
  "password": "admin123",
  "secretKey": "your_admin_creation_secret"
}
```

> Use Postman, Insomnia, or `curl` for this one-time setup.

---

## 👥 User Roles

### 🎓 Student
- Register with college RegNo + Email (must exist in DB)
- Verify email via OTP
- Browse, filter, and register for events
- View registered events & attendance status
- Download certificates

### 🗂️ Organizer
- Login with credentials created by Admin
- Create, edit, delete events with banners
- View registered students per event
- Mark attendance
- Upload PDF certificates per student

### 🛡️ Admin
- Upload student database via CSV
- Create/manage organizers
- Create/manage clubs
- Monitor all events
- View platform analytics

---

## 📋 CSV Format for Student Upload

```csv
RegNo,Name,Email,Phone,Branch,Year
21CS001,John Doe,john@college.edu,9876543210,CSE,2
21EC002,Jane Smith,jane@college.edu,9876543211,ECE,3
21ME003,Alex Kumar,alex@college.edu,9876543212,MECH,1
```

> Download the template from the Admin → Students page.

---

## 🌐 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/verify-email` | Public |
| POST | `/api/auth/login/student` | Public |
| POST | `/api/auth/login/organizer` | Public |
| POST | `/api/auth/login/admin` | Public |
| GET | `/api/events` | Public |
| POST | `/api/events/create` | Organizer |
| POST | `/api/students/upload-csv` | Admin |
| GET | `/api/admin/stats` | Admin |
| POST | `/api/certificates/upload` | Organizer |
| GET | `/api/certificates/my-certificates` | Student |

---

## 🎨 UI Theme

- **Background**: Deep Navy (`#040812`)
- **Primary**: Royal Blue (`#2563eb`)
- **Accent**: Cyan (`#22d3ee`) + Purple (`#a78bfa`)
- **Text**: Slate white tones
- **Cards**: Glassmorphism with backdrop blur
- **Font**: Space Grotesk (Display) + DM Sans (Body)

---

## 🔐 Security Features

- JWT-based authentication with role guards
- OTP email verification for students
- bcrypt password hashing (12 rounds)
- CSV validation & duplicate prevention
- Protected routes on both frontend & backend
- Role-based access control (student / organizer / admin)

---

## 📦 Build for Production

### Backend
```bash
cd backend
node server.js
```

### Frontend
```bash
cd frontend
npm run dev
# Output in dist/ folder — deploy to Vercel/Netlify
```

---

## 🧾 License

MIT — Free for academic and portfolio use.

---

Built with ❤️ as a full-stack MERN project.
