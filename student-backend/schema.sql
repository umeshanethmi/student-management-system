-- Database Schema Additions for AuraEdu (Supabase/PostgreSQL)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN'))
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    teacher_id BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2),
    deposit_date DATE DEFAULT CURRENT_DATE,
    slip_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- 4. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    UNIQUE(student_id, course_id, date)
);

-- 5. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    deadline DATE NOT NULL,
    max_marks INTEGER DEFAULT 100
);

-- 6. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    file_url VARCHAR(255),
    marks INTEGER,
    feedback TEXT,
    graded_at TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- Indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_registrations_student_course ON registrations(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_course_date ON attendance(student_id, course_id, date);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_student ON submissions(assignment_id, student_id);
