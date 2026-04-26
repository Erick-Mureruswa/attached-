# Smart Job Board & Applicant Tracker

A full-stack web application built with **Express.js** (Node.js) and **React + Vite**, featuring role-based access for Job Seekers, Employers, and Admins.

---

## Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Backend   | Node.js, Express.js, MySQL2, JWT, Multer |
| Frontend  | React 18, Vite, TailwindCSS, Axios       |
| Database  | MySQL                                    |
| Auth      | JWT (Bearer token)                       |

---

## Project Structure

```
/backend          Express.js API
  /config         DB connection & auto-migration
  /controllers    Route handlers
  /middleware     auth, upload
  /routes         auth, jobs, applications, savedJobs, admin
  /uploads        Uploaded CVs (git-ignored)

/frontend         React + Vite SPA
  /src
    /api          Axios instance with JWT interceptors
    /components   Navbar, JobCard, Spinner, StatusBadge, ProtectedRoute
    /context      AuthContext (login/register/logout)
    /pages        All pages
```

---

## Quick Start

### 1. Create the MySQL database

```sql
CREATE DATABASE job_board;
```

Tables are created **automatically** on first server start (no migrations needed).

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET
npm install
npm run dev        # → http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

Open **http://localhost:5173**

---

## User Roles

| Role        | Capabilities                                                |
|-------------|-------------------------------------------------------------|
| Job Seeker  | Browse/search jobs, apply with CV, save jobs, track status  |
| Employer    | Post/edit/delete jobs, view applicants, update app status   |
| Admin       | View platform stats, manage all users and jobs              |

### Promote a user to Admin

Register normally, then run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## API Reference

### Auth
| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| POST   | /api/auth/register  | Register          |
| POST   | /api/auth/login     | Login             |
| GET    | /api/auth/me        | Get current user  |

### Jobs
| Method | Endpoint        | Auth     | Description        |
|--------|-----------------|----------|--------------------|
| GET    | /api/jobs       | Public   | List + filter      |
| GET    | /api/jobs/:id   | Public   | Single job         |
| GET    | /api/jobs/my    | Employer | My posted jobs     |
| POST   | /api/jobs       | Employer | Create job         |
| PUT    | /api/jobs/:id   | Employer | Update job         |
| DELETE | /api/jobs/:id   | Employer | Delete job         |

### Applications
| Method | Endpoint                     | Auth       | Description           |
|--------|------------------------------|------------|-----------------------|
| POST   | /api/jobs/:id/apply          | Job Seeker | Apply (CV upload)     |
| GET    | /api/applications            | Auth       | My applications       |
| GET    | /api/jobs/:id/applications   | Employer   | Applicants for a job  |
| PUT    | /api/applications/:id/status | Employer   | Update status         |

### Saved Jobs
| Method | Endpoint          | Auth       | Description        |
|--------|-------------------|------------|--------------------|
| POST   | /api/save-job/:id | Job Seeker | Toggle save/unsave |
| GET    | /api/saved-jobs   | Job Seeker | List saved jobs    |

### Admin
| Method | Endpoint              | Auth  | Description    |
|--------|-----------------------|-------|----------------|
| GET    | /api/admin/stats      | Admin | Platform stats |
| GET    | /api/admin/users      | Admin | All users      |
| DELETE | /api/admin/users/:id  | Admin | Delete user    |
| GET    | /api/admin/jobs       | Admin | All jobs       |
| DELETE | /api/admin/jobs/:id   | Admin | Delete job     |
