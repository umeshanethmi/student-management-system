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

-- Indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_registrations_student_course ON registrations(student_id, course_id);
