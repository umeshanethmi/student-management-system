'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import PageHeader from '@/components/ui/PageHeader';
import { useTheme } from '@/contexts/ThemeContext';

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

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  const theme = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('username');
      if (name) setTeacherName(name);
    }

    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

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

      if (coursesData && coursesData.length > 0) {
        setSelectedCourse(coursesData[0].courseName);
      }
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

  const handleStatusChange = (username: string, status: 'Present' | 'Absent') => {
    setAttendanceState((prev) => ({ ...prev, [username]: status }));
  };

  const formatBackendDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) { setSubmitError('Please select a course to record attendance.'); return; }
    if (!selectedDate) { setSubmitError('Please select a valid date.'); return; }

    setSubmitLoading(true);
    setSubmitSuccess('');
    setSubmitError('');

    try {
      const attendanceRecords = filteredStudents.map((student) => ({
        username: student.username,
        courseName: selectedCourse,
        date: formatBackendDate(selectedDate),
        status: attendanceState[student.username] || 'Present',
      }));

      await apiFetch('/api/attendance', { method: 'POST', body: attendanceRecords });
      setSubmitSuccess('Attendance records submitted successfully! 🎉');
      setTimeout(() => setSubmitSuccess(''), 4500);
    } catch (err: unknown) {
      console.error('Error submitting attendance:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to save attendance registry logs.');
    } finally {
      setSubmitLoading(false);
    }
  };

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
        description="Track course catalogs, details, manage student attendance registries, and audit records."
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

      <div id="attendance-registry" className="bg-card border border-muted-border/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-muted-border pb-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-slate-800">Mark Attendance</h2>
        </div>

        <form onSubmit={handleSubmitAttendance} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-card border border-muted-border rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.courseName}>{course.courseName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-card border border-muted-border rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {submitSuccess && (
            <div className="bg-primary-light text-primary border border-primary/20 rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wider">
              {submitSuccess}
            </div>
          )}

          {submitError && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wider">
              {submitError}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">Student Statuses</label>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 bg-muted border border-dashed border-muted-border rounded-2xl text-slate-400 text-sm font-semibold uppercase tracking-wider">
                No active student accounts registered yet.
              </div>
            ) : (
              <div className="border border-muted-border rounded-2xl overflow-hidden shadow-inner max-h-96 overflow-y-auto divide-y divide-muted-border custom-scrollbar">
                {filteredStudents.map((student) => {
                  const currentStatus = attendanceState[student.username] || 'Present';
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors">
                      <div className="min-w-0 pr-4">
                        <p className="font-semibold text-slate-800 text-sm truncate">{student.name}</p>
                        <p className="text-xs text-slate-400 font-medium truncate">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-muted p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.username, 'Present')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            currentStatus === 'Present' ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
                          }`}
                          style={currentStatus === 'Present' ? { backgroundColor: theme.primary } : {}}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Present</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.username, 'Absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            currentStatus === 'Absent' ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
                          }`}
                          style={currentStatus === 'Absent' ? { backgroundColor: theme.destructive } : {}}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitLoading || filteredStudents.length === 0}
            className="w-full text-white font-semibold py-3.5 px-6 rounded-lg text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: theme.primary }}
          >
            {submitLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Registry Logs...</span>
              </>
            ) : (
              <span>Submit Attendance Registry</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}