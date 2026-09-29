# Job Application Portal - Frontend Client

A modern, responsive, and intuitive web client for the Job Application Portal, built with **React.js 18**, **Vite**, and **Bootstrap 5**. Designed with an executive design system, strict candidate authentication, automated profile resume attachment, interactive recruitment pipeline visualization, real-time application status management, and mobile responsiveness.

---

## Table of Contents

- [Tech Stack & Libraries](#tech-stack--libraries)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Environment Configuration (.env)](#environment-configuration-env)
- [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [Application Routes & Pages](#application-routes--pages)
- [Key Features & User Flows](#key-features--user-flows)
  - [1. Authentication & Session Management](#1-authentication--session-management)
  - [2. Strict Password Validation & Visibility Toggle](#2-strict-password-validation--visibility-toggle)
  - [3. Job Discovery & Filtering](#3-job-discovery--filtering)
  - [4. Seamless 1-Click Application Flow](#4-seamless-1-click-application-flow)
  - [5. Hiring Pipeline Progress Stepper & Status Changer](#5-hiring-pipeline-progress-stepper--status-changer)
  - [6. Job Status Handling (Open vs Closed)](#6-job-status-handling-open-vs-closed)
  - [7. Profile & Resume Management](#7-profile--resume-management)
- [Design System & Styling](#design-system--styling)
- [Connecting with the Backend API](#connecting-with-the-backend-api)

---

## Tech Stack & Libraries

- **Core Library**: [React.js 18](https://react.dev/) (Functional components, hooks, Context API)
- **Build Tool & Bundler**: [Vite](https://vitejs.dev/) (Lightning-fast HMR and optimized production bundling)
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (Client-side routing with protected route guards)
- **UI Framework**: [Bootstrap 5](https://getbootstrap.com/) (Responsive grid, modern form controls, utility classes)
- **Icons**: [Font Awesome 6](https://fontawesome.com/) (Visual cues and status icons)
- **HTTP Client**: [Axios](https://axios-http.com/) (Pre-configured instance with Bearer JWT interceptors and auto-logout on 401)
- **Feedback & Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/) (User feedback banners and alerts)

---

## Project Architecture

```
frontend/
├── public/                     # Static web assets
├── src/
│   ├── api/
│   │   └── axios.js            # Axios client with request & 401 response interceptors
│   ├── components/
│   │   ├── ApplicationForm.jsx # Job application form with resume check & confirmation modal
│   │   ├── ErrorMessage.jsx    # User-friendly error alert with retry button
│   │   ├── Footer.jsx          # Professional multi-column footer
│   │   ├── JobCard.jsx         # Card component for job listings with status pills & applied indicator
│   │   ├── LoadingSpinner.jsx  # Centered loading spinner with custom message
│   │   ├── Navbar.jsx          # Top navigation bar with active links & user profile dropdown
│   │   ├── ProtectedRoute.jsx  # Route guard redirecting unauthenticated users to /login
│   │   └── ResumeUpload.jsx    # Drag-and-drop / file selector resume upload box
│   ├── context/
│   │   └── AuthContext.jsx     # Global authentication provider (user, token, login, logout, refresh)
│   ├── pages/
│   │   ├── JobDetails.jsx      # Comprehensive job view, position summary, and apply card
│   │   ├── Jobs.jsx            # Job discovery catalog with search bar and filter tags
│   │   ├── Login.jsx           # Sign-in form with password visibility toggle
│   │   ├── MyApplications.jsx  # Candidate application tracker with hiring stepper & status selector
│   │   ├── Profile.jsx         # Candidate profile management and resume upload/preview
│   │   └── Register.jsx        # Candidate sign-up with real-time password criteria checklist
│   ├── App.jsx                 # Route definitions and layout wrapper
│   ├── index.css               # Global stylesheet, custom theme variables, and pipeline stepper CSS
│   └── main.jsx                # React root initialization
├── .env                        # Local frontend environment variables
├── .env.example                # Sample environment template
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and Vite build scripts
└── vite.config.js              # Vite configuration
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Backend API Server**: The backend Express service should be running (default: `http://localhost:5000`)

---

## Environment Configuration (.env)

Create a `.env` file in the root of `frontend/`:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api

# Backend Server Root URL (used for viewing static uploaded resume files)
VITE_SERVER_URL=http://localhost:5000
```

A companion `.env.example` file is provided for reference.

---

## Installation & Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

The application will be available at: **`http://localhost:5173`**

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Vite dev server with Hot Module Replacement (HMR). |
| **Production Build** | `npm run build` | Compiles optimized production bundle in `dist/`. |
| **Preview Build** | `npm run preview` | Locally serves the production build from `dist/` to verify performance. |

---

## Application Routes & Pages

| Route | Access | Component | Purpose |
| :--- | :--- | :--- | :--- |
| **`/`** | Public | `<Navigate to="/jobs" />` | Automatically redirects landing visitors to the job catalog. |
| **`/jobs`** | Public | `Jobs.jsx` | Search and explore all verified engineering opportunities. |
| **`/jobs/:id`** | Public | `JobDetails.jsx` | Full role description, requirements, position status, and quick application. |
| **`/login`** | Public (Guest) | `Login.jsx` | Candidate sign-in with password eye toggle. |
| **`/register`** | Public (Guest) | `Register.jsx` | Candidate account creation with live password strength checklist. |
| **`/profile`** | **Protected** | `Profile.jsx` | View candidate details, upload/update resume document, and inspect preview. |
| **`/applications`** | **Protected** | `MyApplications.jsx` | Application tracker with pipeline stage progress stepper and status changer. |

---

## Key Features & User Flows

### 1. Authentication & Session Management
- Managed via `AuthContext.jsx` and backed by `localStorage`.
- Signed JWT token and user metadata are stored upon successful login/registration.
- The Axios instance (`src/api/axios.js`) automatically attaches `Authorization: Bearer <token>` to all outgoing requests.
- If a request returns `401 Unauthorized`, the interceptor clears local storage and automatically redirects the user to `/login`.

### 2. Strict Password Validation & Visibility Toggle
- **Interactive Checklist**: On the `Register` page, a real-time checklist monitors the password as the candidate types:
  - Minimum 8 characters
  - At least one uppercase letter (`A-Z`)
  - At least one lowercase letter (`a-z`)
  - At least one numeric digit (`0-9`)
  - At least one special symbol (`!@#$%^&*...`)
- **Show / Hide Password**: An eye icon toggle button allows users to inspect or hide their entered password securely on both Login and Register pages.

### 3. Job Discovery & Filtering
- Search across job title, required skills, company name, or office location.
- One-click pill filters for popular categories: **All Jobs**, **Remote**, **Hybrid**, **React.js**, **Node.js**.
- If a logged-in candidate has already applied for a job, the listing displays an **"Applied"** badge instead of "Apply Now".

### 4. Seamless 1-Click Application Flow
- Candidates do not need to re-upload their resume for every job.
- When clicking **"Submit Application"**, the modal confirms that the candidate's active profile resume will be submitted.
- Submissions include an optional cover note.
- Duplicate applications are blocked with an informative message.

### 5. Hiring Pipeline Progress Stepper & Status Changer
- On the **Application Tracker** (`/applications`), every application features an interactive visual stage stepper:
  1. `Applied`
  2. `Under Review`
  3. `Shortlisted`
  4. `Selected` / `Rejected`
- Steps dynamically fill with checkmarks and highlight the active stage. If rejected, the milestone turns red.
- **Change Status Selector**: An inline dropdown on each card lets users simulate or transition stages (`Applied`, `Under Review`, `Shortlisted`, `Selected`, `Rejected`) in real time, triggering instant state updates, toast alerts, and metric counter recalculations.

### 6. Job Status Handling (Open vs Closed)
- **Open Jobs**: Display an `Actively Hiring` indicator and allow application submissions.
- **Closed Jobs**: 
  - Displays a `Closed` badge in the job catalog.
  - Replaces the "Apply Now" button with a `Closed` badge.
  - On the Job Details page, the application form is replaced with a **"Position Closed"** notification, preventing new submissions.

### 7. Profile & Resume Management
- Upload PDF, DOC, or DOCX documents up to 5 MB via a dedicated drag-and-drop / file selector box.
- Live file validation checks file size and type before sending to the backend.
- Displays uploaded resume filename, size, and provides a direct link to open the uploaded file in a new browser tab.

---

## Design System & Styling

The frontend incorporates custom styling layered on top of Bootstrap 5:

- **Executive Palette**: Deep Slate (`#0f172a`), Primary Blue (`#2563eb`), Clean Whites, and Subtle Accents.
- **Custom CSS (`src/index.css`)**:
  - `.hero-pill-badge`: Gradient badge with animated glowing pulse dot.
  - `.job-card`: Hover lift effect (`translateY(-4px)`), smooth transition, and modern subtle borders.
  - `.company-avatar-box`: Rounded initial logo placeholder with soft gradient.
  - `.badge-applied`: Success pill indicating existing applications.
  - `.status-stepper`: Horizontal hiring pipeline with circular stage icons, connecting progress bars, active glow, and rejection state styling.
- **Mobile Responsive**: Flexbox layouts, wrapping headers, responsive tables, and off-canvas navigation collapses smoothly for smartphones and tablets.

---

## Connecting with the Backend API

1. Ensure the backend server is running on port 5000:
   ```bash
   cd ../backend
   npm run dev
   ```
2. Verify that `frontend/.env` points to:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SERVER_URL=http://localhost:5000
   ```
3. Run the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.
