'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award,
  AlertCircle,
  Loader2,
  Users,
  BookOpen,
  X,
  Plus,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import Button from '@/components/ui/Button';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
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

  // ── Modal state ───────────────────────────────────────────────
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

  const [gradeStudent, setGradeStudent] = useState('');
  const [gradeCourse, setGradeCourse] = useState<Course | null>(null);
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [gradePoints, setGradePoints] = useState(4.0);
  const [gradeSubmitLoading, setGradeSubmitLoading] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState('');
  const [gradeError, setGradeError] = useState('');

  const [studentGrades, setStudentGrades] = useState<ExamResult[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // ── Strict client-side pagination for grade records ───────────
  const [gradeCurrentPage, setGradeCurrentPage] = useState(1);
  const gradeRowsPerPage = 5;
  const gradeIndexOfLastRow = gradeCurrentPage * gradeRowsPerPage;
  const gradeIndexOfFirstRow = gradeIndexOfLastRow - gradeRowsPerPage;
  const paginatedGrades = studentGrades.slice(gradeIndexOfFirstRow, gradeIndexOfLastRow);
  const gradeTotalPages = Math.ceil(studentGrades.length / gradeRowsPerPage);

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

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (gradeStudent) { fetchStudentGrades(gradeStudent); }
  }, [gradeStudent]);

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const [coursesData, studentsData] = await Promise.all([
        apiFetch<Course[]>('/api/courses'),
        apiFetch<Student[]>('/api/students')
      ]);
      setCourses(coursesData || []);
      setStudents(studentsData || []);
      if (coursesData && coursesData.length > 0) setGradeCourse(coursesData[0]);
      if (studentsData && studentsData.length > 0) {
        const filtered = (studentsData || []).filter((student) => {
          const uname = (student.username || '').toLowerCase();
          const email = (student.email || '').toLowerCase();
          const name = (student.name || '').toLowerCase();
          const isAdmin = uname.includes('admin') || email.includes('admin') || name.includes('admin');
          const isTeacher = uname.includes('teacher') || email.includes('teacher') || name.includes('teacher') || uname.startsWith('aura26l');
          return !isAdmin && !isTeacher;
        });
        if (filtered.length > 0) setGradeStudent(filtered[0].username);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve academic registry records.');
    } finally { setLoading(false); }
  };

  const filteredStudents = students.filter((student) => {
    const uname = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();
    const isAdmin = uname.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = uname.includes('teacher') || email.includes('teacher') || name.includes('teacher') || uname.startsWith('aura26l');
    return !isAdmin && !isTeacher;
  });

  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    const map: Record<string, number> = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
    setGradePoints(map[newGrade] || 0.0);
  };

  const handleGradeCourseChange = (courseName: string) => {
    const obj = courses.find(c => c.courseName === courseName);
    if (obj) setGradeCourse(obj);
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeStudent) { setGradeError('Please select a student.'); return; }
    if (!gradeCourse) { setGradeError('Please select a course.'); return; }
    setGradeSubmitLoading(true); setGradeSuccess(''); setGradeError('');
    try {
      await apiFetch('/api/exams', { method: 'POST', body: { username: gradeStudent, courseCode: gradeCourse.courseCode, courseName: gradeCourse.courseName, grade: selectedGrade, credits: gradeCourse.credits, points: gradePoints } });
      setGradeSuccess('Grade successfully submitted for student! 🎓');
      fetchStudentGrades(gradeStudent);
      setTimeout(() => setGradeSuccess(''), 4500);
    } catch (err: any) {
      setGradeError(err.message || 'Failed to submit student grade.');
    } finally { setGradeSubmitLoading(false); }
  };

  if (loading) return <LoadingSpinner message="Loading grading records..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} retryLabel="Retry Load" />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        icon={<Award className="text-primary w-8 h-8" />}
        tag="Instructor Hub"
        title="Grading Portal"
        description="Audit course results, calculate student GPAs, and submit final grade cards to student registries."
      />

      {/* Grade Records Section — primary focus */}
      <div className="bg-card border border-muted-border/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-muted-border pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-text-primary">Grade Records{gradeStudent ? ` for ${gradeStudent}` : ''}</h2>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setGradeSuccess('');
              setGradeError('');
              setIsGradingModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Submit Grade
          </Button>
        </div>

        {gradeSuccess && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
            {gradeSuccess}
          </div>
        )}

        {loadingGrades ? (
          <div className="flex items-center justify-center py-12 space-y-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider ml-2">Retrieving records...</p>
          </div>
        ) : studentGrades.length === 0 ? (
          <div className="py-12 text-center text-text-muted font-semibold text-sm">
            No exam results recorded yet. Select a student above or click "Submit Grade" to add one.
          </div>
        ) : (
          <>
            <div className="border border-muted-border rounded-2xl overflow-hidden shadow-inner max-h-96 overflow-y-auto divide-y divide-muted-border custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted text-xs font-bold text-text-muted uppercase tracking-wider border-b border-muted-border">
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Credits</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                    <th className="px-6 py-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-border">
                  {paginatedGrades.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-text-primary text-sm">{record.courseName}</td>
                      <td className="px-6 py-4 text-text-muted font-bold text-xs uppercase">{record.courseCode}</td>
                      <td className="px-6 py-4 text-text-muted text-sm font-semibold">{record.credits} Credits</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded bg-accent-light border border-accent/20 text-xs font-bold text-accent tracking-wider">{record.grade}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-text-primary font-bold text-sm">{record.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
              <div>Page {gradeCurrentPage} of {gradeTotalPages}</div>
              <div className="flex gap-2">
                <button onClick={() => setGradeCurrentPage(prev => Math.max(prev - 1, 1))} disabled={gradeCurrentPage === 1} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">Previous</button>
                <button onClick={() => setGradeCurrentPage(prev => Math.min(prev + 1, gradeTotalPages))} disabled={gradeCurrentPage === gradeTotalPages} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Grading Modal */}
      {isGradingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-[#5c4fe5]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Submit Grade Card</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Create a new grade record for a student</p>
                </div>
              </div>
              <button onClick={() => setIsGradingModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(gradeSuccess || gradeError) && (
              <div className={`mx-6 mt-5 text-xs font-bold uppercase tracking-wider p-3 rounded-xl border animate-in fade-in ${gradeSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                {gradeSuccess || gradeError}
              </div>
            )}

            <form onSubmit={handleSubmitGrade} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Student</label>
                  <select value={gradeStudent} onChange={e => setGradeStudent(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold" required>
                    {filteredStudents.map(s => (<option key={s.id} value={s.username}>{s.name} ({s.username})</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Course</label>
                  <select value={gradeCourse?.courseName || ''} onChange={e => handleGradeCourseChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold" required>
                    {courses.map(c => (<option key={c.id} value={c.courseName}>{c.courseCode} - {c.courseName}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Grade</label>
                  <select value={selectedGrade} onChange={e => handleGradeChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold" required>
                    {['A','A-','B+','B','B-','C+','C','C-','D','F'].map(g => (<option key={g} value={g}>{g}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">GPA Points</label>
                  <input type="number" step="0.1" min="0" max="4" value={gradePoints} onChange={e => setGradePoints(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course Credits</label>
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-sm font-semibold shadow-inner">{gradeCourse?.credits || 3} Credits</div>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setIsGradingModalOpen(false)} className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Cancel</button>
                <Button type="submit" variant="primary" size="lg" className="flex-1" loading={gradeSubmitLoading}>{gradeSubmitLoading ? 'Submitting...' : 'Submit Student Grade'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}