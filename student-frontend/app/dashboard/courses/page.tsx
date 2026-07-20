'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, BookMarked, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/ui/CourseCard';

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await apiFetch<Course[]>('/api/courses');
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchStudentEnrollments = async (user: string) => {
    try {
      const data = await apiFetch<Enrollment[]>(`/api/enrollments/student/${user}`);
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

  const handleEnroll = async (courseId: number, courseCode: string, courseName: string) => {
    try {
      await apiFetch('/api/enrollments', {
        method: 'POST',
        body: {
          username: username,
          courseId: courseId,
        },
      });

      await fetchStudentEnrollments(username);
      alert(`Successfully registered for ${courseName}! 🎓`);
    } catch (err: unknown) {
      console.error('Enrollment error:', err);
      alert(err instanceof Error ? err.message : 'Failed to complete registration.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading courses directory..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Available Catalog</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Browse curriculum paths and active campus courses
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 uppercase tracking-wider shrink-0 shadow-inner">
          {courses.length} Courses
        </span>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-[#5c4fe5]">
            <BookMarked className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-md font-black text-slate-850">Curriculum Paths</h3>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] text-slate-450 font-bold text-xs uppercase tracking-wider">
            No courses cataloged yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrollments.some(e => e.courseId === course.id || e.courseCode === course.courseCode);

              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled}
                  onEnroll={handleEnroll}
                  role={role}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}