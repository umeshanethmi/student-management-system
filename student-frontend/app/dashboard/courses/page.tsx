'use client';

import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
}

interface Enrollment {
  id: number;
  username: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  instructor: string;
  progress: number;
}

export default function CoursesPage() {
  const [role, setRole] = useState('STUDENT');
  const [username, setUsername] = useState('Student');
  
  // Catalog courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses from the backend catalog
  const fetchCourses = async () => {
    try {
      const data = await apiFetch('/api/courses');
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch student's current enrollments
  const fetchStudentEnrollments = async (user: string) => {
    try {
      const data = await apiFetch(`/api/enrollments/student/${user}`);
      if (Array.isArray(data)) {
        setEnrollments(data);
      }
    } catch (err) {
      console.error('Error fetching student enrollments:', err);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || 'STUDENT';
    const storedUsername = localStorage.getItem('username') || 'Student';
    setRole(storedRole.toUpperCase());
    setUsername(storedUsername);

    const initPage = async () => {
      setLoading(true);
      await fetchCourses();
      if (storedRole.toUpperCase() === 'STUDENT') {
        await fetchStudentEnrollments(storedUsername);
      }
      setLoading(false);
    };

    initPage();
  }, []);

  // Student action: enroll in a course
  const handleEnroll = async (courseId: number, courseCode: string, courseName: string) => {
    try {
      await apiFetch('/api/enrollments', {
        method: 'POST',
        body: { 
          username: username, 
          courseId: courseId
        },
      });

      // Refresh enrollments after registration
      await fetchStudentEnrollments(username);
      alert(`Successfully registered for ${courseName}! 🎓`);
    } catch (err: any) {
      console.error('Enrollment error:', err);
      alert(err.message || 'Failed to complete registration.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 font-bold uppercase text-xs tracking-wider animate-pulse">
        Loading courses directory...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Available Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse curriculum paths and active campus courses
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-200 uppercase tracking-wider shrink-0">
          {courses.length} Courses
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Full-width Available Courses list */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-[#5c4fe5]">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-md font-black text-slate-850">Available Courses</h3>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-slate-550/5 border border-dashed border-slate-200 rounded-2xl text-slate-450 font-bold text-xs uppercase tracking-wider">
              No courses cataloged yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
              {courses.map((course) => {
                const isEnrolled = enrollments.some(e => e.courseId === course.id || e.courseCode === course.courseCode);
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 last:border-none text-slate-700 hover:bg-slate-50/40 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-850 text-sm">{course.courseName}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Code: {course.courseCode}</span>
                    </div>
                    <div>
                      {role === 'STUDENT' ? (
                        isEnrolled ? (
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3.5 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Enrolled
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course.id, course.courseCode, course.courseName)}
                            className="px-4 py-2 bg-[#5c4fe5] hover:bg-[#4c3ce0] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-100 transition-all duration-200"
                          >
                            Enroll
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-650 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}