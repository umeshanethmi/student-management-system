'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';

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

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentsData, coursesData] = await Promise.all([
        apiFetch<Student[]>('/api/students'),
        apiFetch<Course[]>('/api/courses'),
      ]);
      setStudents(studentsData || []);
      setCourses(coursesData || []);
    } catch (err: unknown) {
      console.error('Error fetching dashboard datasets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch student or course records. Please check the backend connection.');
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

  const filteredStudents = students.filter((student) => {
    const username = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();

    const isAdmin = username.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');

    return !isAdmin && !isTeacher;
  });

  // ── Strict client-side pagination ─────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredStudents.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  if (loading) {
    return <LoadingSpinner message="Loading registry workspace..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchData} retryLabel="Retry Load" />;
  }

  const studentColumns: Column<Student>[] = [
    { key: 'id', label: 'ID', render: (val) => <span className="text-slate-400 font-mono text-xs">#{String(val)}</span> },
    { key: 'name', label: 'Name', render: (val) => <span className="text-slate-850 font-bold">{String(val)}</span> },
    { key: 'email', label: 'Email', render: (val) => <span className="text-slate-500 font-medium">{String(val)}</span> },
    { key: 'age', label: 'Age', align: 'center', render: (val) => Number(val) > 0 ? `${val} y/o` : 'N/A' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <PageHeader
        icon={<GraduationCap className="text-[#10b981] w-8 h-8" />}
        tag="Instructor Workspace"
        title="Students & Courses Registry"
        description="Monitor active classroom students, browse structural course lists, and audit enrolled registrations."
      />

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
                    <span className="text-[11px] font-bold text-slate-400">{course.credits} Credits</span>
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

      {/* Bottom Section: Student List Table */}
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

        {/* Table renders ONLY the sliced currentRows (5 per page) */}
        <DataTable
          columns={studentColumns}
          rows={currentRows}
          emptyMessage="No registered student records found."
        />

        {/* Strict pagination bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
          <div>Page {currentPage} of {totalPages}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}