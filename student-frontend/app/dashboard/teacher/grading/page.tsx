'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award,
  AlertCircle,
  Loader2,
  Users,
  BookOpen
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

interface ExamResult {
  id?: number;
  username: string;
  courseCode: string;
  courseName: string;
  grade: string;
  credits: number;
  points: number;
}

export default function GradingPortalPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Grading states
  const [gradeStudent, setGradeStudent] = useState('');
  const [gradeCourse, setGradeCourse] = useState<Course | null>(null);
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [gradePoints, setGradePoints] = useState(4.0);
  const [gradeSubmitLoading, setGradeSubmitLoading] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState('');
  const [gradeError, setGradeError] = useState('');

  // Graded student records state
  const [studentGrades, setStudentGrades] = useState<ExamResult[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const fetchStudentGrades = async (username: string) => {
    if (!username) return;
    setLoadingGrades(true);
    try {
      const data = await apiFetch<ExamResult[]>(`/api/exams/student/${username}`);
      setStudentGrades(data || []);
    } catch (err) {
      console.error('Error fetching student grades:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (gradeStudent) {
      fetchStudentGrades(gradeStudent);
    }
  }, [gradeStudent]);

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
        setGradeCourse(coursesData[0]);
      }

      // Pre-select first student
      if (studentsData && studentsData.length > 0) {
        const filtered = (studentsData || []).filter((student) => {
          const username = (student.username || '').toLowerCase();
          const email = (student.email || '').toLowerCase();
          const name = (student.name || '').toLowerCase();

          const isAdmin = username.includes('admin') || email.includes('admin') || name.includes('admin');
          const isTeacher = username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');

          return !isAdmin && !isTeacher;
        });

        if (filtered.length > 0) {
          setGradeStudent(filtered[0].username);
        }
      }
    } catch (err: any) {
      console.error('Error fetching grading details:', err);
      setError(err.message || 'Failed to retrieve academic registry records.');
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

  // Handle Grade Selection Change and auto-set points
  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    const gradePointsMap: Record<string, number> = {
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D': 1.0,
      'F': 0.0
    };
    setGradePoints(gradePointsMap[newGrade] || 0.0);
  };

  // Handle selected course change
  const handleGradeCourseChange = (courseName: string) => {
    const courseObj = courses.find(c => c.courseName === courseName);
    if (courseObj) {
      setGradeCourse(courseObj);
    }
  };

  // Submit Grade POST /api/exams
  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeStudent) {
      setGradeError('Please select a student.');
      return;
    }
    if (!gradeCourse) {
      setGradeError('Please select a course.');
      return;
    }

    setGradeSubmitLoading(true);
    setGradeSuccess('');
    setGradeError('');

    try {
      await apiFetch('/api/exams', {
        method: 'POST',
        body: {
          username: gradeStudent,
          courseCode: gradeCourse.courseCode,
          courseName: gradeCourse.courseName,
          grade: selectedGrade,
          credits: gradeCourse.credits,
          points: gradePoints
        }
      });

      setGradeSuccess('Grade successfully submitted for student! 🎓');
      fetchStudentGrades(gradeStudent);
      setTimeout(() => setGradeSuccess(''), 4500);
    } catch (err: any) {
      console.error('Error submitting grade:', err);
      setGradeError(err.message || 'Failed to submit student grade.');
    } finally {
      setGradeSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-650 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Loading grading records...</p>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-505/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
            <Award className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
              Instructor Hub
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Grading Portal
            </h1>
            <p className="text-slate-455 text-sm mt-1 max-w-2xl">
              Audit course results, calculate student GPAs, and submit final grade cards to student registries.
            </p>
          </div>
        </div>
      </div>

      {/* Grading Form Panel */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Award className="w-5 h-5 text-indigo-650" />
          <h2 className="text-xl font-bold text-slate-800">Submit Grade Card</h2>
        </div>

        {filteredStudents.length === 0 || courses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-sm">
            Cannot access grading registry. Please verify courses and students exist in the system database.
          </div>
        ) : (
          <form onSubmit={handleSubmitGrade} className="space-y-6">
            
            {/* Student selection, Course selection, Grade selection row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Student</label>
                <select
                  value={gradeStudent}
                  onChange={e => setGradeStudent(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                >
                  {filteredStudents.map(student => (
                    <option key={student.id} value={student.username}>
                      {student.name} ({student.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Course</label>
                <select
                  value={gradeCourse?.courseName || ''}
                  onChange={e => handleGradeCourseChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.courseName}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Grade</label>
                <select
                  value={selectedGrade}
                  onChange={e => handleGradeChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                >
                  {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* GPA Points & Course Credits read-only details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">GPA Points (Calculated)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={gradePoints}
                  onChange={e => setGradePoints(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course Credits (Read-Only)</label>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-sm font-semibold shadow-inner">
                  {gradeCourse?.credits || 3} Credits
                </div>
              </div>
            </div>

            {/* Submit Success / Error alert banners */}
            {gradeSuccess && (
              <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
                {gradeSuccess}
              </div>
            )}

            {gradeError && (
              <div className="bg-rose-50 text-rose-500 border border-rose-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider">
                {gradeError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={gradeSubmitLoading}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-100 transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-2"
            >
              {gradeSubmitLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Grade...</span>
                </>
              ) : (
                <span>Submit Student Grade</span>
              )}
            </button>

          </form>
        )}
      </div>

      {/* Student Grade History Section */}
      {gradeStudent && (
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Users className="w-5 h-5 text-indigo-650" />
            <h2 className="text-xl font-bold text-slate-800">Grade Records for {gradeStudent}</h2>
          </div>

          {loadingGrades ? (
            <div className="flex items-center justify-center py-12 space-y-2">
              <Loader2 className="w-6 h-6 text-indigo-650 animate-spin" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-2">Retrieving records...</p>
            </div>
          ) : studentGrades.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-semibold text-sm">
              No exam results recorded for this student yet.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner max-h-96 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Credits</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                    <th className="px-6 py-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">{record.courseName}</td>
                      <td className="px-6 py-4 text-slate-500 font-bold text-xs uppercase">{record.courseCode}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-semibold">{record.credits} Credits</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 tracking-wider">
                          {record.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-750 font-bold text-sm">{record.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
