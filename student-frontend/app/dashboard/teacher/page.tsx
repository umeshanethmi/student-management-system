'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Award,
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  ClipboardList
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

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

  // Attendance marking states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Read the teacher's name from localStorage
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('username');
      if (name) {
        setTeacherName(name);
      }
    }
    
    // Set default date to today in YYYY-MM-DD format
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
        apiFetch<Student[]>('/api/students')
      ]);
      
      setCourses(coursesData || []);
      setStudents(studentsData || []);

      if (coursesData && coursesData.length > 0) {
        setSelectedCourse(coursesData[0].courseName);
      }
    } catch (err: any) {
      console.error('Error fetching teacher dashboard data:', err);
      setError(err.message || 'Failed to retrieve academic registry logs.');
    } finally {
      setLoading(false);
    }
  };

  // Filter out Administrators and Teachers from the student list
  const filteredStudents = students.filter((student) => {
    const username = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();

    const isAdmin = username.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');

    return !isAdmin && !isTeacher;
  });

  // Toggle student status in dictionary state
  const handleStatusChange = (username: string, status: 'Present' | 'Absent') => {
    setAttendanceState(prev => ({
      ...prev,
      [username]: status
    }));
  };

  // Format date to "MMM dd, yyyy" structure to align with backend schema (e.g. Oct 12, 2026)
  const formatBackendDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Handle submitting marked attendance array to backend POST `/api/attendance`
  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      setSubmitError('Please select a course to record attendance.');
      return;
    }
    if (!selectedDate) {
      setSubmitError('Please select a valid date.');
      return;
    }

    setSubmitLoading(true);
    setSubmitSuccess('');
    setSubmitError('');

    try {
      // Build attendance records list
      const attendanceRecords = filteredStudents.map(student => ({
        username: student.username,
        courseName: selectedCourse,
        date: formatBackendDate(selectedDate),
        status: attendanceState[student.username] || 'Present' // Default to Present
      }));

      await apiFetch('/api/attendance', {
        method: 'POST',
        body: attendanceRecords
      });

      setSubmitSuccess('Attendance records submitted successfully! 🎉');
      setTimeout(() => setSubmitSuccess(''), 4500);
    } catch (err: any) {
      console.error('Error submitting attendance:', err);
      setSubmitError(err.message || 'Failed to save attendance registry logs.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-650 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Loading teacher workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-[2rem] text-center max-w-2xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-black text-rose-800">Connection Error</h3>
        <p className="text-rose-700 text-sm">{error}</p>
        <button 
          onClick={fetchData} 
          className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-md shadow-rose-100"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Welcome Back Header */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-505/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
            <BookOpen className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
              Instructor Hub
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Welcome back, {teacherName}!
            </h1>
            <p className="text-slate-450 text-sm mt-1 max-w-2xl">
              Track course catalogs, details, manage student attendance registries, and audit records.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-650 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block">My Courses</span>
            <span className="text-2xl font-black text-slate-800">{courses.length} Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-emerald-200 transition-all duration-300">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block">Total Students</span>
            <span className="text-2xl font-black text-slate-800">{filteredStudents.length} Enrolled</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-violet-200 transition-all duration-300">
          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block">Teaching Hours</span>
            <span className="text-2xl font-black text-slate-800">36 Hrs / Wk</span>
          </div>
        </div>
      </div>

      {/* Attendance Marking Section (Full width) */}
      <div id="attendance-registry" className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <ClipboardList className="w-5 h-5 text-indigo-650" />
          <h2 className="text-xl font-bold text-slate-800">Mark Attendance</h2>
        </div>

        <form onSubmit={handleSubmitAttendance} className="space-y-6">
          
          {/* Select course & select date inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Course</label>
              <select 
                value={selectedCourse} 
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                required
              >
                {courses.map(course => (
                  <option key={course.id} value={course.courseName}>{course.courseName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                />
                <Calendar className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Status Submit Alert Banner */}
          {submitSuccess && (
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
              {submitSuccess}
            </div>
          )}

          {submitError && (
            <div className="bg-rose-50 text-rose-500 border border-rose-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider">
              {submitError}
            </div>
          )}

          {/* Student toggle marking items */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Student Statuses</label>
            
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-wider">
                No active student accounts registered yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner max-h-96 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {filteredStudents.map(student => {
                  const currentStatus = attendanceState[student.username] || 'Present';
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 transition-colors">
                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-slate-800 text-sm truncate">{student.name}</p>
                        <p className="text-xs text-slate-400 font-medium truncate">{student.email}</p>
                      </div>
                      
                      {/* Present / Absent Segmented Toggle Controls */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.username, 'Present')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'Present' 
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'text-slate-450 hover:bg-slate-200/50'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.username, 'Absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'Absent' 
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'text-slate-455 hover:bg-slate-200/50'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit attendance registry list */}
          <button 
            type="submit" 
            disabled={submitLoading || filteredStudents.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 uppercase text-xs tracking-wider flex items-center justify-center gap-2"
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
