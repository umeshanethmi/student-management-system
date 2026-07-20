# AuraEdu - Student Management System

# Comprehensive Project Report

---

**Generated:** July 16, 2026  
**Project Repository:** [GitHub - umeshanethmi/student-management-system](https://github.com/umeshanethmi/student-management-system)  
**Latest Git Commit:** `c2ab191364c8827f641adc061a5f8c7f44e3e59c`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Complete Folder Structure](#3-complete-folder-structure)
4. [Backend Architecture (Spring Boot)](#4-backend-architecture-spring-boot)
   - 4.1 [Application Entry Point](#41-application-entry-point)
   - 4.2 [Data Initializer](#42-data-initializer)
   - 4.3 [Model Layer (10 Entities)](#43-model-layer-10-entities)
   - 4.4 [Repository Layer (10 Repositories)](#44-repository-layer-10-repositories)
   - 4.5 [Service Layer (3 Services)](#45-service-layer-3-services)
   - 4.6 [Controller Layer (13 Controllers)](#46-controller-layer-13-controllers)
   - 4.7 [DTOs (3 Data Transfer Objects)](#47-dtos-3-data-transfer-objects)
   - 4.8 [Security Layer (5 Classes)](#48-security-layer-5-classes)
   - 4.9 [Database Schema](#49-database-schema)
   - 4.10 [API Endpoint Matrix](#410-api-endpoint-matrix)
5. [Frontend Architecture (Next.js)](#5-frontend-architecture-nextjs)
   - 5.1 [Routing Structure](#51-routing-structure)
   - 5.2 [Page Details](#52-page-details)
   - 5.3 [Utility Layer](#53-utility-layer)
   - 5.4 [Styling Architecture](#54-styling-architecture)
6. [Authentication & Authorization Workflow](#6-authentication--authorization-workflow)
7. [Data Flow & System Workflow](#7-data-flow--system-workflow)
8. [Current Configuration & Environment](#8-current-configuration--environment)
9. [Additional Project Files](#9-additional-project-files)
10. [Summary of Key Observations](#10-summary-of-key-observations)

---

## 1. Project Overview

| Property | Value |
|---|---|
| **Project Name** | AuraEdu (Student Management System / EduAdmin) |
| **Description** | A modern, full-stack web application for managing student records, courses, enrollments, attendance, assignments, exam results, payments, and administrative users |
| **Architecture** | RESTful API + Single Page Application (SPA) |
| **Frontend** | Next.js 16.2.10 (React 19) with Tailwind CSS v4 |
| **Backend** | Spring Boot 4.1.0 (Java 17) |
| **Database** | Supabase PostgreSQL (via Hibernate/JPA) |
| **Authentication** | JWT (JSON Web Tokens) with Spring Security + BCrypt |
| **UI Style** | Premium glassmorphic dark-themed dashboard with custom animations |

---

## 2. Technology Stack

### Backend (student-backend)

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Runtime |
| Spring Boot | 4.1.0 | Application framework |
| Spring Web MVC | - | REST API endpoints |
| Spring Data JPA | - | ORM / Database access |
| Spring Security | - | Authentication & Authorization |
| JJWT (io.jsonwebtoken) | 0.11.5 | JWT token generation & validation |
| PostgreSQL | - | Relational database (via Supabase) |
| Lombok | - | Boilerplate reduction |
| Maven | Wrapper included | Build & dependency management |

### Frontend (student-frontend)

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.10 | React framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Lucide React | 1.24.0 | SVG icon library |
| Supabase JS | 2.110.1 | Supabase client SDK |
| ESLint | 9.x | Linting |

---

## 3. Complete Folder Structure

```
d:\Project\Gamage\Student Project\
├── README.md                                  # Main project documentation
├── auraedu_postman_collection.json            # Postman API test collection
├── donkey-page.html                           # Standalone HTML page (unrelated)
│
├── student-backend/                           # Spring Boot Backend
│   ├── .gitattributes
│   ├── .gitignore
│   ├── mvnw                                   # Maven wrapper (Linux/Mac)
│   ├── mvnw.cmd                               # Maven wrapper (Windows)
│   ├── pom.xml                                # Maven build configuration
│   ├── schema.sql                             # Database SQL schema reference
│   └── src/
│       ├── main/
│       │   ├── java/com/student/student_backend/
│       │   │   ├── StudentBackendApplication.java    # Main entry point
│       │   │   ├── DataInitializer.java              # Seed data on startup
│       │   │   ├── controller/                       # 13 REST controllers
│       │   │   │   ├── AdminUserController.java
│       │   │   │   ├── AnnouncementController.java
│       │   │   │   ├── AssignmentController.java
│       │   │   │   ├── AttendanceController.java
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── CourseController.java
│       │   │   │   ├── EnrollmentController.java
│       │   │   │   ├── ExamResultController.java
│       │   │   │   ├── PaymentController.java
│       │   │   │   ├── ProfileController.java
│       │   │   │   ├── RegistrationController.java
│       │   │   │   ├── StudentController.java
│       │   │   │   └── SubmissionController.java
│       │   │   ├── dto/                              # 3 Data Transfer Objects
│       │   │   │   ├── ApiResponse.java
│       │   │   │   ├── LoginResponseData.java
│       │   │   │   └── UserResponseDTO.java
│       │   │   ├── model/                            # 10 JPA Entities
│       │   │   │   ├── Announcement.java
│       │   │   │   ├── Assignment.java
│       │   │   │   ├── Attendance.java
│       │   │   │   ├── Course.java
│       │   │   │   ├── Enrollment.java
│       │   │   │   ├── ExamResult.java
│       │   │   │   ├── Payment.java
│       │   │   │   ├── Student.java
│       │   │   │   ├── Submission.java
│       │   │   │   └── User.java
│       │   │   ├── repository/                       # 10 JPA Repositories
│       │   │   │   ├── AnnouncementRepository.java
│       │   │   │   ├── AssignmentRepository.java
│       │   │   │   ├── AttendanceRepository.java
│       │   │   │   ├── CourseRepository.java
│       │   │   │   ├── EnrollmentRepository.java
│       │   │   │   ├── ExamResultRepository.java
│       │   │   │   ├── PaymentRepository.java
│       │   │   │   ├── StudentRepository.java
│       │   │   │   ├── SubmissionRepository.java
│       │   │   │   └── UserRepository.java
│       │   │   ├── security/                         # 5 Security classes
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   └── UserPrincipal.java
│       │   │   └── service/                          # 3 Service classes
│       │   │       ├── CourseService.java
│       │   │       ├── StudentService.java
│       │   │       └── UserService.java
│       │   └── resources/
│       │       ├── application.properties            # App configuration
│       │       ├── static/                           # Static resources (empty)
│       │       └── templates/                        # Templates (empty)
│       └── test/java/com/                            # Test sources
│
└── student-frontend/                          # Next.js Frontend
    ├── .gitignore
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tsconfig.json
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx                                 # Landing page (/)
    │   ├── admin/
    │   │   └── dashboard/                           # Admin dashboard
    │   ├── dashboard/                               # Student dashboard
    │   │   ├── layout.tsx                           # Shared dashboard layout
    │   │   ├── page.tsx                             # Dashboard home
    │   │   ├── assignments/                         # Assignments page
    │   │   ├── attendance/                          # Attendance page
    │   │   ├── courses/                             # Courses page
    │   │   ├── exams/                               # Exam results page
    │   │   ├── notifications/                       # Notifications page
    │   │   ├── payments/                            # Payments page
    │   │   ├── profile/                             # Profile page
    │   │   ├── register-course/                     # Course registration
    │   │   ├── registration/                        # Course registration form
    │   │   ├── settings/                            # Settings page
    │   │   ├── students/                            # Students list (admin)
    │   │   └── teacher/                             # Teacher dashboard
    │   ├── login/
    │   │   └── page.tsx                             # Login page
    │   ├── register/
    │   │   └── page.tsx                             # Registration page
    │   └── utils/
    │       ├── api.ts                               # API client with JWT auth
    │       └── supabase.ts                          # Supabase client
    └── public/
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        └── window.svg
```

---

## 4. Backend Architecture (Spring Boot)

### 4.1 Application Entry Point

**File:** `student-backend/src/main/java/com/student/student_backend/StudentBackendApplication.java`

- Standard `@SpringBootApplication` annotated class
- Scans the `com.student.student_backend` package
- Starts on **port 8081** (configured in `application.properties`)

### 4.2 Data Initializer

**File:** `DataInitializer.java` - Implements `CommandLineRunner`

On each application startup, this class:

1. Cleans up duplicate user records from the database
2. Seeds default users if they don't exist:
   - `admin` / `admin1234` (Role: ADMIN)
   - `AURA26L01` / `123456` (Role: TEACHER)
   - `nethmi` / `pass1234` (Role: STUDENT)
3. Resets and seeds 4 catalog courses with IDs 1-4:
   - **Java Programming** (SE-2020) - Dr. Rajesh Kumar - 4 Credits - LKR 45,000
   - **Database Systems** (CS-3010) - Dr. Sarah Jenkins - 3 Credits - LKR 55,000
   - **Web Development** (CS-4020) - Prof. Alan Turing - 3 Credits - LKR 40,000
   - **Cloud Computing** (SE-4050) - Dr. Ramanujan - 4 Credits - LKR 65,000

### 4.3 Model Layer (10 Entities)

| # | Entity | Table Name | Key Fields | Description |
|---|---|---|---|---|
| 1 | **User** | `users` | id, username, email, password, role | Authentication entity; roles: STUDENT, TEACHER, ADMIN |
| 2 | **Student** | student | id, name, email, age, username, phone, address | Student profile/record |
| 3 | **Course** | `courses` | id, courseName, courseCode, instructor, credits, fee | Catalog course |
| 4 | **Enrollment** | `enrollments` | id, username, courseId, courseCode, courseName, instructor, progress | Student-course enrollment with progress tracking |
| 5 | **Announcement** | `announcements` | id, title, description, senderRole, timestamp | System announcements |
| 6 | **Assignment** | `assignments` | id, courseName, title, deadline, maxMarks | Course assignments |
| 7 | **Attendance** | `attendance` | id, username, courseName, date, status | Student attendance records (PRESENT/ABSENT) |
| 8 | **ExamResult** | `exam_results` | id, username, courseCode, courseName, grade, credits, points | Student exam grades |
| 9 | **Payment** | `payments` | id, username, receiptNo, date, amount, method, status, description, slipImage | Tuition/registration payments with bank slip support |
| 10 | **Submission** | `submissions` | id, assignmentId, studentName, studentUsername, fileUrl, marks, feedback, submittedAt | Assignment submissions with grading |

### 4.4 Repository Layer (10 Repositories)

All extend `JpaRepository<Entity, Long>`:

| Repository | Custom Query Methods |
|---|---|
| UserRepository | `findByUsername()`, `findByRole()`, `deleteDuplicateUsers()` |
| StudentRepository | `findByUsername()` |
| CourseRepository | *(standard CRUD only)* |
| EnrollmentRepository | `findByUsername()`, `findByUsernameAndCourseId()`, `findByCourseId()` |
| AttendanceRepository | `findByUsername()` |
| AssignmentRepository | *(standard CRUD only)* |
| SubmissionRepository | `findByStudentUsername()` |
| AnnouncementRepository | *(standard CRUD only)* |
| ExamResultRepository | `findByUsername()` |
| PaymentRepository | `findByUsername()` |

### 4.5 Service Layer (3 Services)

| Service | Key Responsibilities |
|---|---|
| **UserService** | User registration with BCrypt password hashing, login authentication, role-based user retrieval, user deletion |
| **StudentService** | CRUD operations for student profiles, profile retrieval by username, profile update with partial field merging |
| **CourseService** | CRUD operations for catalog courses |

### 4.6 Controller Layer (13 Controllers)

| # | Controller | Base URL | Key Endpoints | Primary Roles |
|---|---|---|---|---|
| 1 | **AuthController** | `/api/auth` | POST /register, POST /login, GET /debug | Public |
| 2 | **AdminUserController** | `/api/admin` | POST /users, GET /users/role/{role}, DELETE /users/{id} | ADMIN |
| 3 | **StudentController** | `/api/students` | POST /, GET /, DELETE /{id}, GET /profile/{username}, GET /profile/{username}/dashboard-summary, GET /profile/{username}/updates, PUT /{id} | ADMIN, TEACHER, STUDENT |
| 4 | **CourseController** | `/api/courses` | GET /, POST /, GET /{id}, DELETE /{id} | All authenticated |
| 5 | **EnrollmentController** | `/api/enrollments` | GET /, GET /student/{username}, POST /, GET /course/{courseId} | STUDENT, TEACHER, ADMIN |
| 6 | **AttendanceController** | `/api/attendance` | GET /student/{username}, POST / | TEACHER, ADMIN |
| 7 | **AssignmentController** | `/api/assignments` | GET /, POST /, GET /{id}, DELETE /{id} | All authenticated |
| 8 | **SubmissionController** | `/api/submissions` | GET /, POST /, GET /student/{username}, PUT /{id}/grade | TEACHER, STUDENT |
| 9 | **AnnouncementController** | `/api/announcements` | GET /, POST / | All authenticated |
| 10 | **ExamResultController** | `/api/exams` | GET /student/{username}, POST / | TEACHER, STUDENT |
| 11 | **PaymentController** | `/api/payments` | GET /student/{username}, POST /, POST /submit-slip, GET /, PUT /{id}/status | STUDENT, ADMIN |
| 12 | **ProfileController** | `/api/profile` | PUT /update | All authenticated |
| 13 | **RegistrationController** | `/api/registration` | POST /submit (multipart) | STUDENT |

### 4.7 DTOs (3 Data Transfer Objects)

| DTO | Purpose | Fields |
|---|---|---|
| **ApiResponse\<T\>** | Generic API response wrapper | success (boolean), message (String), data (T) |
| **LoginResponseData** | Login response payload | email, role, token, username |
| **UserResponseDTO** | User creation response | username, email, role |

### 4.8 Security Layer (5 Classes)

| Class | Role |
|---|---|
| **SecurityConfig** | Configures Spring Security: disables CSRF, sets stateless session policy, defines role-based URL access rules, enables CORS for `localhost:3000`, provides `BCryptPasswordEncoder` bean |
| **JwtTokenProvider** | Generates JWT tokens (HS512, 24-hour expiry), extracts username from token, validates tokens |
| **JwtAuthenticationFilter** | `OncePerRequestFilter` that intercepts every request, extracts Bearer token, validates it, and sets Spring Security context |
| **CustomUserDetailsService** | Loads user by username from database for Spring Security authentication |
| **UserPrincipal** | Implements `UserDetails`; wraps the User entity, converts role to `ROLE_` prefixed authority (handles LECTURER→TEACHER mapping) |

**Role-Based Access Rules Summary:**

| URL Pattern | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| `/api/auth/**` | All | All | - | - |
| `/api/admin/**` | ADMIN | ADMIN | - | ADMIN |
| `/api/students/**` | ADMIN, TEACHER | ADMIN | ADMIN | ADMIN |
| `/api/students/profile/**` | STUDENT, TEACHER, ADMIN | - | - | - |
| `/api/courses/**` | All authenticated | ADMIN | ADMIN | ADMIN |
| `/api/attendance/student/**` | STUDENT, TEACHER, ADMIN | - | - | - |
| `/api/attendance/**` | - | TEACHER, ADMIN | - | - |
| `/api/assignments/**` | All authenticated | TEACHER, ADMIN | - | TEACHER, ADMIN |
| `/api/submissions` | TEACHER, ADMIN | STUDENT | - | - |
| `/api/submissions/student/**` | All authenticated | - | - | - |
| `/api/submissions/*/grade` | - | - | TEACHER | - |
| `/api/exams/student/**` | All authenticated | - | - | - |
| `/api/exams/**` | - | TEACHER | - | - |
| `/api/enrollments` | TEACHER, ADMIN | STUDENT | - | - |
| `/api/enrollments/student/**` | All authenticated | - | - | - |
| `/api/enrollments/course/**` | TEACHER, ADMIN | - | - | - |

### 4.9 Database Schema

The project uses Hibernate's `ddl-auto=update` so tables are auto-created from JPA entities. The `schema.sql` file serves as a reference document with the following tables:

1. **users** - Authentication and role management
2. **courses** - Course catalog with teacher reference
3. **registrations** - Course registration with payment status (PENDING/APPROVED/REJECTED)
4. **attendance** - Daily student attendance tracking
5. **assignments** - Course assignments with deadlines
6. **submissions** - Student assignment submissions with grading

> **Note:** The schema.sql references slightly different table structures than the JPA entities, suggesting some tables (like `registrations`) are handled through the `payments` and `enrollments` entities at the application level.

### 4.10 API Endpoint Matrix (Complete)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new student user |
| POST | `/api/auth/login` | No | Login, receive JWT token |
| GET | `/api/auth/debug` | No | Debug current auth context |
| POST | `/api/admin/users` | ADMIN | Create user (STUDENT/TEACHER) |
| GET | `/api/admin/users/role/{role}` | ADMIN | List users by role |
| DELETE | `/api/admin/users/{id}` | ADMIN | Delete a user |
| GET | `/api/students` | ADMIN, TEACHER | List all students |
| POST | `/api/students` | ADMIN | Create student profile |
| DELETE | `/api/students/{id}` | ADMIN | Delete student profile |
| PUT | `/api/students/{id}` | ADMIN | Update student profile |
| GET | `/api/students/profile/{username}` | All auth | Get student profile by username |
| GET | `/api/students/profile/{username}/dashboard-summary` | All auth | Get dashboard stats |
| GET | `/api/students/profile/{username}/updates` | All auth | Get notifications feed |
| GET | `/api/courses` | All auth | List all courses |
| POST | `/api/courses` | ADMIN | Create course |
| GET | `/api/courses/{id}` | All auth | Get course by ID |
| DELETE | `/api/courses/{id}` | ADMIN | Delete course |
| GET | `/api/enrollments` | ADMIN, TEACHER | List all enrollments |
| GET | `/api/enrollments/student/{username}` | All auth | Get student's enrollments |
| POST | `/api/enrollments` | STUDENT | Enroll in a course |
| GET | `/api/enrollments/course/{courseId}` | TEACHER, ADMIN | Get course enrollments |
| GET | `/api/attendance/student/{username}` | All auth | Get student attendance |
| POST | `/api/attendance` | TEACHER, ADMIN | Save attendance records |
| GET | `/api/assignments` | All auth | List all assignments |
| POST | `/api/assignments` | TEACHER, ADMIN | Create assignment |
| GET | `/api/assignments/{id}` | All auth | Get assignment by ID |
| DELETE | `/api/assignments/{id}` | TEACHER, ADMIN | Delete assignment |
| GET | `/api/submissions` | TEACHER, ADMIN | List all submissions |
| POST | `/api/submissions` | STUDENT | Submit assignment |
| GET | `/api/submissions/student/{username}` | All auth | Get student's submissions |
| GET | `/api/submissions/{id}` | All auth | Get submission by ID |
| PUT | `/api/submissions/{id}/grade` | TEACHER | Grade a submission |
| GET | `/api/exams/student/{username}` | All auth | Get student exam results |
| POST | `/api/exams` | TEACHER | Create exam result |
| GET | `/api/announcements` | All auth | List announcements |
| POST | `/api/announcements` | TEACHER, ADMIN | Create announcement |
| GET | `/api/payments/student/{username}` | All auth | Get student payments |
| POST | `/api/payments` | TEACHER, ADMIN | Add payment record |
| POST | `/api/payments/submit-slip` | STUDENT | Submit bank deposit slip |
| GET | `/api/payments` | ADMIN | List all payments |
| PUT | `/api/payments/{id}/status` | ADMIN | Update payment status |
| PUT | `/api/profile/update` | All auth | Update student profile |
| POST | `/api/registration/submit` | STUDENT | Submit registration with slip upload |

---

## 5. Frontend Architecture (Next.js)

### 5.1 Routing Structure

The frontend uses **Next.js App Router** with file-based routing:

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Landing page with sign-in/create-account CTAs |
| `/login` | `app/login/page.tsx` | Login form with JWT auth |
| `/register` | `app/register/page.tsx` | Student registration form |
| `/dashboard` | `app/dashboard/page.tsx` | Student dashboard home |
| `/dashboard/courses` | `app/dashboard/courses/` | Course management |
| `/dashboard/assignments` | `app/dashboard/assignments/` | Assignment view |
| `/dashboard/attendance` | `app/dashboard/attendance/` | Attendance records |
| `/dashboard/exams` | `app/dashboard/exams/` | Exam results |
| `/dashboard/notifications` | `app/dashboard/notifications/` | Notifications |
| `/dashboard/payments` | `app/dashboard/payments/` | Payment history |
| `/dashboard/profile` | `app/dashboard/profile/` | Student profile |
| `/dashboard/register-course` | `app/dashboard/register-course/` | Course registration |
| `/dashboard/registration` | `app/dashboard/registration/` | Registration form |
| `/dashboard/settings` | `app/dashboard/settings/` | Settings |
| `/dashboard/students` | `app/dashboard/students/` | Student list (admin) |
| `/dashboard/teacher` | `app/dashboard/teacher/` | Teacher dashboard |
| `/admin/dashboard` | `app/admin/dashboard/` | Admin dashboard |

### 5.2 Page Details

**Landing Page (`/`):**
- Branded as "AuraEdu Portal"
- Features a premium dark navy gradient heading
- Two CTA buttons: "Sign In" (primary) and "Create Account" (secondary glassmorphic)
- Animated SVG shield+book icon in background
- Fade-in-up animation on load

**Login Page (`/login`):**
- Username/password form
- Direct fetch to `http://localhost:8081/api/auth/login`
- Stores JWT token, username, role in localStorage
- Role-based redirect: STUDENT→`/dashboard`, TEACHER→`/dashboard/teacher`, ADMIN→`/admin/dashboard`
- Glassmorphic card design on slate background

**Registration Page (`/register`):**
- Username/email/password form
- Client-side validation (email format, minimum 4-char password)
- Posts to `http://localhost:8081/api/auth/register`
- Auto-redirects to login after 2 seconds on success

**Dashboard Layout (`/dashboard/layout.tsx`):**
- Shared layout with dark emerald sidebar
- Top header with search, notifications, messages, profile capsule
- Dynamic menu items based on user role (STUDENT, TEACHER, ADMIN)
- Token verification on mount; redirects to `/login` if missing
- Logout clears localStorage and redirects to landing page

**Student Dashboard (`/dashboard/page.tsx`):**
- Fetches enrollment data, dashboard summary, and notifications
- Displays enrolled courses with progress bars
- Attendance rate, pending assignments, next class cards
- Recent updates feed with categorized icons

### 5.3 Utility Layer

**`app/utils/api.ts`:**
- Custom `apiFetch<T>()` wrapper around native `fetch()`
- Auto-attaches JWT Bearer token from localStorage
- Base URL defaults to `http://localhost:8081` (configurable via `NEXT_PUBLIC_API_URL`)
- Handles JSON serialization, error parsing, and 204 No Content responses

**`app/utils/supabase.ts`:**
- Creates a Supabase client using environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Currently used for potential direct Supabase access (though most data flows through Spring Boot REST API)

### 5.4 Styling Architecture

- **Tailwind CSS v4** with custom theme extensions
- Custom animations: `fade-in-up`, `pulse-slow`, `float`
- Glassmorphic design language: `backdrop-blur`, translucent borders
- Premium utility classes: `.bg-grid-pattern`, `.bg-radial-gradient-glow`
- Custom scrollbar styles: `.custom-scrollbar` (light), `.dark-scrollbar` (dark)
- Animation delay utilities: `.animation-delay-100` through `.animation-delay-500`

---

## 6. Authentication & Authorization Workflow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐     ┌───────────────┐
│   Frontend   │     │  AuthController │     │  UserService  │     │  UserRepo/DB  │
│  (Next.js)   │     │  (Spring Boot)  │     │  (Spring)     │     │  (PostgreSQL) │
└──────┬───────┘     └───────┬─────────┘     └──────┬───────┘     └──────┬────────┘
       │                     │                      │                    │
       │  POST /api/auth/    │                      │                    │
       │  register           │                      │                    │
       │────────────────────>│                      │                    │
       │                     │  registerUser(user)  │                    │
       │                     │─────────────────────>│                    │
       │                     │                      │  BCrypt.encode()   │
       │                     │                      │  save(user) ──────>│
       │                     │                      │<──── User ─────────│
       │                     │<─── UserResponseDTO ──│                    │
       │<── ApiResponse ─────│                      │                    │
       │                     │                      │                    │
       │  POST /api/auth/    │                      │                    │
       │  login              │                      │                    │
       │────────────────────>│                      │                    │
       │                     │  loginUser(u, p)     │                    │
       │                     │─────────────────────>│                    │
       │                     │                      │  findByUsername()  │
       │                     │                      │───────────────────>│
       │                     │                      │<──── User ─────────│
       │                     │                      │  BCrypt.matches()  │
       │                     │<─── Optional<User> ───│                    │
       │                     │  generateToken()     │                    │
       │<── JWT Token ───────│                      │                    │
       │                     │                      │                    │
       │  Store in           │                      │                    │
       │  localStorage:      │                      │                    │
       │  token, username,   │                      │                    │
       │  role               │                      │                    │
       │                     │                      │                    │
       │  GET /api/**        │                      │                    │
       │  (with Bearer JWT)  │                      │                    │
       │────────────────────>│                      │                    │
       │                     │  JwtAuthFilter       │                    │
       │                     │  extracts & validates│                    │
       │                     │  JWT from header     │                    │
       │                     │  sets SecurityContext│                    │
       │<── Protected Data ──│                      │                    │
```

**Key Points:**
1. Passwords are BCrypt-encoded before storage
2. JWT tokens use HS512 algorithm with a hardcoded secret key
3. Tokens expire after 24 hours
4. The `JwtAuthenticationFilter` runs on every request, extracting the Bearer token, validating it, and setting the Spring Security context
5. Role-based access is enforced both at the URL pattern level (`SecurityConfig`) and method level (`@PreAuthorize`)
6. The frontend stores credentials in localStorage and auto-redirects unauthenticated users to `/login`

---

## 7. Data Flow & System Workflow

### 7.1 Role-Based Access Flows

```
                    ┌──────────────────────────────────┐
                    │         AuraEdu Portal            │
                    │         (Landing Page)            │
                    └──────────┬───────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐     ┌──────────┐
        │  Student  │    │  Teacher │     │  Admin   │
        │   Login   │    │   Login  │     │  Login   │
        └─────┬─────┘    └─────┬────┘     └────┬─────┘
              │                │               │
              ▼                ▼               ▼
    ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │ Student Dashboard│ │Teacher Portal│ │  Admin Dashboard │
    │                  │ │              │ │                  │
    │ • View courses   │ │ • Attendance │ │ • Manage Users   │
    │ • Register       │ │ • Grading    │ │ • Manage Courses │
    │ • Enrollments    │ │ • Assignments│ │ • Manage Students│
    │ • Assignments    │ │ • Students   │ │ • Payments       │
    │ • Attendance     │ │ • Settings   │ │ • Settings       │
    │ • Exam Results   │ │              │ │                  │
    │ • Payments       │ │              │ │                  │
    │ • Profile        │ │              │ │                  │
    │ • Notifications  │ │              │ │                  │
    └─────────────────┘ └──────────────┘ └──────────────────┘
```

### 7.2 Course Enrollment Flow

```
Student Portal                    Backend API                      Database
──────────────                    ───────────                      ────────
     │                                │                               │
     │  View Course Catalog           │                               │
     │ ──────────────────────────────> GET /api/courses              │
     │ <────── Returns courses ───────│                               │
     │                                │                               │
     │  Enroll in Course              │                               │
     │ ──────────────────────────────> POST /api/enrollments         │
     │   {courseId, username}         │  ──> Save enrollment ───────>│
     │ <────── Enrollment saved ──────│                               │
     │                                │                               │
     │  Submit Bank Slip              │                               │
     │ ──────────────────────────────> POST /api/registration/submit │
     │   (multipart: slip image)      │  ──> Save payment ──────────>│
     │ <────── Payment recorded ──────│                               │
     │                                │                               │
     │  (Admin approves payment)      │                               │
     │                                │  PUT /api/payments/{id}/status│
     │                                │  ──> Auto-create enrollment ─>│
```

### 7.3 Auto-Seeding Behavior

Multiple controllers implement an **auto-seed pattern**: if a student has no existing records, the system automatically creates default placeholder data to ensure the UI always shows content. This applies to:

- **Enrollments** (EnrollmentController): Auto-enrolls in first 3 courses with varying progress (75%, 40%, 90%)
- **Attendance** (AttendanceController): Creates 5 default attendance records
- **Exam Results** (ExamResultController): Creates 4 default exam results with grades (A, A-, B+, A)
- **Payments** (PaymentController): Creates 3 default payment records
- **Assignments** (AssignmentController): Creates 2 default assignments
- **Submissions** (SubmissionController): Creates 3 default submissions with grades
- **Dashboard Updates** (StudentController): Returns 4 hardcoded notification items
- **Student Profiles** (StudentController): Auto-creates a draft profile if none exists

---

## 8. Current Configuration & Environment

### Backend (`application.properties`)

```properties
spring.application.name=student-backend
spring.config.import=optional:file:.env[.properties]

# Database connection via environment variables from .env file
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.properties.hibernate.dialect=org.postgresql.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8081
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

**Required Environment Variables:**
- `DB_URL` - Supabase PostgreSQL connection URL
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### Frontend (`package.json`)

```json
{
  "name": "student-frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

**Required Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to `http://localhost:8081`)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### How to Run

```bash
# Backend
cd student-backend
mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run      # Mac/Linux
# Runs on http://localhost:8081

# Frontend
cd student-frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 9. Additional Project Files

### `auraedu_postman_collection.json`
A comprehensive 1224-line Postman collection containing pre-configured API testing requests for all backend endpoints, organized by module (Auth, Courses, Students, etc.).

### `donkey-page.html`
A standalone HTML page titled "Nethu Baba Borikari Products" — appears to be a personal side project/playful page unrelated to the core student management system.

---

## 10. Summary of Key Observations

### Strengths

1. **Well-organized full-stack architecture** with clear separation between backend (Spring Boot MVC) and frontend (Next.js App Router)
2. **Comprehensive domain model** covering users, students, courses, enrollments, attendance, assignments, submissions, exams, payments, and announcements
3. **Complete JWT-based authentication** with role-based access control (ADMIN, TEACHER, STUDENT)
4. **Rich dashboard UI** with glassmorphic design, custom animations, and dark mode aesthetic
5. **Auto-seed pattern** ensures the application is always demo-ready with placeholder data
6. **Multipart file upload support** for bank deposit slips in course registration flow
7. **Postman collection** provided for API testing and documentation

### Areas for Improvement

1. **Hardcoded JWT Secret Key** in `JwtTokenProvider.java` — should be externalized to environment variables or application properties
2. **CORS configured only for localhost:3000** — needs updating for production deployment
3. **Auto-seed behavior** may cause unexpected data mutations in production; should be controlled via a feature flag or profile
4. **Direct fetch calls** in some pages (login/register) bypass the `api.ts` utility — inconsistent API client usage
5. **Frontend landing page** metadata still shows "Create Next App" defaults (not updated to AuraEdu)
6. **DataInitializer** resets courses on every startup which could cause issues in multi-environment setups
7. **No dedicated error handling middleware** — errors are caught inline in controllers
8. **Password minimum length is only 4 characters** on frontend — should be strengthened
9. **`donkey-page.html`** appears to be an unrelated file in the project root
10. **Schema.sql** table definitions don't fully match JPA entity definitions, suggesting evolution divergence

### Project Health

| Metric | Status |
|---|---|
| Backend Build | Spring Boot 4.1.0 with Maven |
| Frontend Build | Next.js 16.2.10 with TypeScript |
| Database | PostgreSQL via Supabase (JPA auto-DDL) |
| Authentication | JWT (HS512, 24h expiry) |
| File Upload Support | Yes (multipart, base64 storage) |
| API Documentation | Postman collection available |
| Testing | Test directory exists but appears minimal |
| Production Readiness | Development/Educational stage |

---

**End of Report**