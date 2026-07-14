'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  AlertCircle, 
  Loader2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  username: string;
}

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  instructor?: string;
  fee?: string | number;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch students and courses from the backend APIs
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentsData, coursesData] = await Promise.all([
        apiFetch<Student[]>('/api/students'),
        apiFetch<Course[]>('/api/courses')
      ]);
      setStudents(studentsData || []);
      setCourses(coursesData || []);
    } catch (err: any) {
      console.error('Error fetching dashboard datasets:', err);
      setError(err.message || 'Failed to fetch student or course records. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role') || 'STUDENT';
    if (role.toUpperCase() === 'STUDENT') {
      router.push('/dashboard');
    } else {
      fetchData();
    }
  }, [router]);

  // Filter the Student List so it ONLY shows users with the 'STUDENT' role.
  // We exclude users with admin/teacher indicators in their username, email, or name.
  const filteredStudents = students.filter((student) => {
    const username = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();

    const isAdmin = username.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');

    return !isAdmin && !isTeacher;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-650 animate-spin" />
        <p className="text-slate-450 text-sm font-semibold uppercase tracking-wider">Loading registry workspace...</p>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* Welcome / Header */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
            <GraduationCap className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
              Instructor Workspace
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Students &amp; Courses Registry
            </h1>
            <p className="text-slate-450 text-sm mt-1 max-w-2xl">
              Monitor active classroom students, browse structural course lists, and audit enrolled registrations.
            </p>
          </div>
        </div>
      </div>

      {/* Top Section: Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-650 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Total Students</span>
            <span className="text-2xl font-black text-slate-800">{filteredStudents.length} Enrolled</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:border-emerald-200 transition-all duration-300">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">My Courses</span>
            <span className="text-2xl font-black text-slate-800">{courses.length} Active</span>
          </div>
        </div>
      </div>

      {/* Middle Section: My Courses */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <BookOpen className="w-5 h-5 text-indigo-650" />
          <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
        </div>

        {courses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-sm">
            No courses cataloged in the system registry database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="group bg-slate-50 border border-slate-150 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-lg hover:border-indigo-150 hover:bg-white transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 tracking-wider">
                      {course.courseCode}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base group-hover:text-indigo-650 transition-colors">
                    {course.courseName}
                  </h3>
                </div>

                <div className="pt-4 border-t border-slate-200/60 mt-6 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="font-medium">Fee: {course.fee || 'LKR 45,000'}</span>
                  <span className="text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full">
                    {course.instructor || 'Staff'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: Student List Table (Read-Only) */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-650" />
            <h2 className="text-xl font-bold text-slate-800">Student Directory</h2>
          </div>
          <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-200 uppercase tracking-wider">
            {filteredStudents.length} Active Students
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-sm">
            No registered student records found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6 text-center">Age</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-slate-700">
                {filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="border-b border-slate-100 last:border-none hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="py-3.5 px-6 text-slate-400 font-mono text-xs">#{student.id}</td>
                    <td className="py-3.5 px-6 text-slate-850 font-bold">{student.name}</td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">{student.email}</td>
                    <td className="py-3.5 px-6 text-center text-slate-500">
                      {student.age > 0 ? `${student.age} y/o` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}