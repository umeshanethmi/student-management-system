'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle, Download } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DataTable, { Column } from '@/components/ui/DataTable';

interface ExamResult {
  id: number;
  courseCode: string;
  courseName: string;
  grade: string;
  credits: number;
  points: number;
}

export default function ExamResultsPage() {
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');

  // ── Strict client-side pagination ─────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    apiFetch<ExamResult[]>(`/api/exams/student/${user}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setExams(data);
        }
      })
      .catch((err) => console.error('Error fetching exams:', err))
      .finally(() => setLoading(false));
  }, []);

  const calculateGPA = () => {
    if (exams.length === 0) return '0.00';
    let totalPoints = 0;
    let totalCredits = 0;
    exams.forEach((exam) => {
      totalPoints += exam.points * exam.credits;
      totalCredits += exam.credits;
    });
    return (totalPoints / totalCredits).toFixed(2);
  };

  const totalCreditsVal = exams.reduce((acc, exam) => acc + exam.credits, 0);
  const gpa = calculateGPA();

  // ── Slicing logic ──────────────────────────────────────────────
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = exams.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(exams.length / rowsPerPage);

  const columns: Column<ExamResult>[] = [
    { key: 'courseCode', label: 'Course Code', render: (val) => <span className="text-[#5c4fe5] font-black">{String(val)}</span> },
    { key: 'courseName', label: 'Course Title', render: (val) => <span className="text-slate-800">{String(val)}</span> },
    { key: 'credits', label: 'Credits', render: (val) => <span className="text-slate-400">{String(val)}</span> },
    { key: 'grade', label: 'Grade', align: 'center', render: (val) => <span className="font-extrabold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 text-xs shadow-sm">{String(val)}</span> },
    { key: 'points', label: 'Points', align: 'right', render: (val) => <span className="text-slate-700 font-bold">{Number(val).toFixed(1)}</span> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-black text-slate-800 flex items-center">
        <GraduationCap className="w-6 h-6 mr-3 text-[#5c4fe5]" />
        Exam Results & Grades
      </h1>

      {loading ? (
        <LoadingSpinner message="Loading academic transcript..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* GPA Card Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#5c4fe5] via-[#4c3ce0] to-indigo-900 border border-indigo-400/20 rounded-[2rem] p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-indigo-200 font-bold text-[10px] uppercase tracking-widest mb-2">Current CGPA</h3>
              <p className="text-5xl font-black text-white mb-2">{gpa}</p>
              <div className="flex items-center text-xs font-semibold text-indigo-100">
                <CheckCircle className="w-4 h-4 mr-1.5 shrink-0 text-emerald-400" />
                {parseFloat(gpa) >= 3.5 ? 'High Distinction' : 'Satisfactory Standing'}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-slate-800 font-bold text-sm mb-4">Total Credits</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-400 uppercase tracking-wider">Earned</span>
                    <span className="text-slate-800">{totalCreditsVal} Credits</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-[#5c4fe5] h-1.5 rounded-full" style={{ width: `${(totalCreditsVal / 20) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Download Transcript
              </button>
            </div>
          </div>

          {/* Academic Table details */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Academic Transcript (Fall 2026)</h3>
            <DataTable columns={columns} rows={currentRows} emptyMessage="No exam results on record." />

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
      )}
    </div>
  );
}