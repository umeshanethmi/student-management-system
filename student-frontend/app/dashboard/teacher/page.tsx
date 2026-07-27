'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Award,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import PageHeader from '@/components/ui/PageHeader';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  fee?: number | string;
  instructor?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  username: string;
}

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('Teacher');
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('username');
      if (name) setTeacherName(name);
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [coursesData, studentsData] = await Promise.all([
        apiFetch<Course[]>('/api/courses'),
        apiFetch<Student[]>('/api/students'),
      ]);

      setCourses(coursesData || []);
      setStudents(studentsData || []);
    } catch (err: unknown) {
      console.error('Error fetching teacher dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to retrieve academic registry logs.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const username = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();
    const isAdmin = username.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');
    return !isAdmin && !isTeacher;
  });

  if (loading) {
    return <LoadingSpinner message="Loading teacher workspace..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchData} retryLabel="Retry Load" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        icon={<BookOpen className="text-primary w-8 h-8" />}
        tag="Instructor Hub"
        title={`Welcome back, ${teacherName}!`}
        description="Track course catalogs, manage student records, and review academic progress."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-muted-border/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-primary/20 transition-all duration-300">
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">My Courses</span>
            <span className="text-2xl font-bold text-slate-800">{courses.length} Active</span>
          </div>
        </div>

        <div className="bg-card border border-muted-border/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-primary/20 transition-all duration-300">
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Students</span>
            <span className="text-2xl font-bold text-slate-800">{filteredStudents.length} Enrolled</span>
          </div>
        </div>

        <div className="bg-card border border-muted-border/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-primary/20 transition-all duration-300">
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Teaching Hours</span>
            <span className="text-2xl font-bold text-slate-800">36 Hrs / Wk</span>
          </div>
        </div>
      </div>
    </div>
  );
}