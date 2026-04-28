# Quality Assurance Platform

## Project Overview

The **Quality Assurance Platform** is a full-stack web application designed for evaluating and managing quality assurance processes in higher education institutions.

Users answer structured Yes/No evaluation questions organized by quality domains, upload supporting documents as proof, and track the status of their submissions. Administrators and the Rector can review, validate, and provide feedback on submissions. The Rector has read-only access to all admin views without the ability to approve, reject, edit, or delete.

The platform supports multiple institutional roles, secure file uploads, role-based access control, and a comprehensive admin dashboard for monitoring submission statistics.

---

## Key Features

- **Role-Based Access Control**: Nine institutional roles (Admin, Rector, Dean, Head of Department, Vice-Rector for Pedagogy and Development, Vice-Rector for Post-Graduation and Research, Vice-Rector for External Relations, Vice-Rector for Planning, Secretary General), each with tailored access and question assignments
- **Evaluation Interface**: Answer Yes/No questions organized by quality domains and references, with per-role question filtering
- **File Upload**: Attach PDFs or images as supporting proof for each answer
- **Admin Validation**: Review submissions, approve or reject answers with mandatory comments on rejection
- **Rector Read-Only Access**: Rector can view all admin pages (dashboard, validation queue, users, user management) without performing any actions
- **User Management**: Admins can view all users, update roles, and delete users (with cascading removal of answers and validations)
- **Statistics Dashboard**: Live stats including completion rate, pending validations, total answers, and critical alerts (rejections in the last 7 days)
- **Session-Based Authentication**: PHP session management with protected routes on both frontend and backend

---

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | PHP 8.1+, built-in PHP development server |
| Database | PostgreSQL (hosted on Neon) |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner |

---

## Repository Structure

```
Quality-Assurance-Platform/
├── frontend/                  # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── adminDashboard/
│       │   ├── auth/
│       │   ├── feature_evaluation/
│       │   ├── layout/
│       │   └── UserDashboard/
│       ├── hooks/             # Custom React hooks (useRole)
│       ├── pages/             # Route-level page components
│       ├── services/          # Axios API calls (adminService, authService, …)
│       └── utils/             # Validation helpers
├── backend/                   # PHP backend
│   ├── public/
│   │   └── index.php          # Single entry point / router
│   ├── controllers/
│   │   ├── admin/             # Admin endpoints (users, answers, stats, …)
│   │   ├── auth/              # Login, logout, register, me
│   │   ├── evaluation/        # Question fetching and answer submission
│   │   ├── public/            # Unauthenticated endpoints (roles list)
│   │   └── user/              # User dashboard and answers
│   ├── uploads/
│   │   └── proofs/            # Uploaded proof files (PDFs and images)
│   └── db.php                 # PostgreSQL PDO connection
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PHP 8.1+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL 14+ instance)

---

### 1. Clone the Repository

```bash
git clone https://github.com/AdnaneTaleb10/Quality-Assurance-Platform.git
cd Quality-Assurance-Platform
```

---

### 2. Backend Setup

**Configure the database connection**

Open `backend/db.php` and update the Neon connection string:

```php
$dsn = 'pgsql:host=<your-neon-host>;dbname=<your-db>;sslmode=require';
$user = '<your-db-user>';
$password = '<your-db-password>';
```

**Create the database schema**

Run the SQL schema file against your PostgreSQL database:

```bash
psql "<your-neon-connection-string>" -f database/schema.sql
```

**Start the PHP development server**

```bash
cd backend/public
php -S localhost:8000
```

The API will be available at `http://localhost:8000/api`.

**Uploads directory**

Make sure the uploads folder is writable:

```bash
mkdir -p backend/uploads/proofs
chmod 755 backend/uploads/proofs
```

---

### 3. Frontend Setup

**Configure the environment**

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

**Install dependencies and start the dev server**

```bash
cd frontend
npm install
npm run dev
```

The React application will run at `http://localhost:5173`.

---

## User Roles & Access

| Role | Dashboard | Validation | Users | User Management | Evaluation |
|---|---|---|---|---|---|
| Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ |
| Rector | ✅ Read-only | ✅ Read-only | ✅ Read-only | ✅ Read-only | ❌ |
| All others | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login and start session |
| POST | `/auth/logout` | Destroy session |
| GET | `/auth/me` | Get current authenticated user |
| POST | `/auth/register` | Register a new user |
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/answers` | List all answers (filterable by status) |
| POST | `/admin/validate` | Approve or reject an answer |
| GET | `/admin/users` | List all users with submission stats |
| PUT | `/admin/users/:id/role` | Update a user's role |
| DELETE | `/admin/users/:id` | Delete a user (cascades answers + validations) |
| GET | `/admin/roles` | List all roles (authenticated) |
| GET | `/roles` | List all roles (public, used on signup) |
| GET | `/evaluation/next` | Get next unanswered question for current user |
| GET | `/evaluation/:id` | Get a specific question |
| POST | `/evaluation/submit` | Submit an answer with proof files |
| GET | `/dashboard` | User dashboard data and assigned questions |
| GET | `/my-answers` | Current user's submitted answers |
| GET | `/uploads/proofs/:filename` | Serve an uploaded proof file |

---

## Authors

- **TALEB Mohamed Adnane**
- **GUERID Hocine**
