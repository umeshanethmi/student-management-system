'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle, 
  Plus, 
  ArrowLeft, 
  User, 
  Award, 
  DollarSign, 
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  instructor: string;
  credits: number;
  fee: string;
}

interface Enrollment {
  id: number;
  courseId: number;
}

export default function RegisterCoursePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');
  
  // Alert feed states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    const fetchData = async () => {
      try {
        // Fetch all courses
        const coursesList = await apiFetch<Course[]>('/api/courses');
        setCourses(coursesList || []);

        // Fetch student enrollments
        const enrollData = await apiFetch<Enrollment[]>(`/api/enrollments/student/${user}`);
        setEnrollments(enrollData || []);
      } catch (err) {
        console.error('Error loading registration catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 4000);
  };

  const handleEnroll = async (courseId: number, courseName: string) => {
    try {
      await apiFetch('/api/enrollments', {
        method: 'POST',
        body: { 
          username: username, 
          courseId: courseId
        },
      });

      showToast(`Successfully registered for ${courseName}! 🎓`, 'success');
      
      // Add to local enrollments state so button switches dynamically
      setEnrollments([...enrollments, { id: Date.now(), courseId: courseId }]);
    } catch (err: any) {
      showToast(err.message || 'Error connecting to enrollment server.', 'error');
    }
  };

  const isEnrolled = (courseId: number) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto p-4 relative">
      
      {/* Toast popup */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-55 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-rose-50 text-rose-500 border-rose-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-450 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Course Registration</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select and register for catalog courses this semester</p>
          </div>
        </div>
        <div className="text-[10px] font-black bg-[#0b0e1e] text-white px-4.5 py-2 rounded-full border border-slate-950 uppercase tracking-widest shrink-0 shadow-sm">
          {courses.length} Catalog Items
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-semibold">Loading course catalog directory...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-slate-450 font-bold text-xs uppercase tracking-wider">
          No courses currently listed in catalog. Contact registry administration.
        </div>
      ) : (
        /* RESPONSIVE GRID (3 or 4 cards per row) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id);
            return (
              <div 
                key={course.id}
                className="bg-white border border-slate-200/80 rounded-[2.2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-350 transition-all duration-300 relative group"
              >
                <div className="space-y-5">
                  {/* Badge & Code */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black px-3 py-1 bg-indigo-50 text-indigo-650 rounded-full border border-indigo-100">
                      {course.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-md font-black text-slate-800 leading-snug group-hover:text-[#5c4fe5] transition-colors">
                    {course.courseName}
                  </h3>

                  {/* Info rows */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100/60">
                    <div className="flex items-center text-xs text-slate-500 font-semibold">
                      <User className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                      <span className="truncate">{course.instructor || 'Dr. Albert Einstein'}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-slate-500 font-semibold">
                      <Award className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                      <span>{course.credits || 3} Credits</span>
                    </div>

                    <div className="flex items-center text-xs text-slate-805 text-slate-800 font-extrabold">
                      <DollarSign className="w-4 h-4 mr-2 text-slate-450 shrink-0 text-[#5c4fe5]" />
                      <span>{course.fee || 'LKR 45,000'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Submit Action */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  {enrolled ? (
                    <button 
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-650 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> ✓ Enrolled
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(course.id, course.courseName)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#4f46e5] hover:bg-[#5c4fe5] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 text-white" /> Register Course
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
