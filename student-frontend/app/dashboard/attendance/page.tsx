'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable, { Column } from '@/components/ui/DataTable';

interface Attendance {
  id: number;
  courseName: string;
  date: string;
  status: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');

  // ── Strict client-side pagination ─────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    apiFetch<Attendance[]>(`/api/attendance/student/${user}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setAttendance(data);
        }
      })
      .catch((err) => console.error('Error fetching attendance:', err))
      .finally(() => setLoading(false));
  }, []);

  const calculateAttendanceRate = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const attendanceRate = calculateAttendanceRate();

  // ── Slicing logic ──────────────────────────────────────────────
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = attendance.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(attendance.length / rowsPerPage);

  const columns: Column<Attendance>[] = [
    { key: 'date', label: 'Date', render: (val) => <span className="text-slate-800">{String(val)}</span> },
    { key: 'courseName', label: 'Course Name', render: (val) => <span className="text-slate-500">{String(val)}</span> },
    { key: 'status', label: 'Status', align: 'right', render: (val) => <StatusBadge status={String(val) as 'Present' | 'Absent'} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-black text-slate-800 flex items-center">
        <CheckCircle className="w-6 h-6 mr-3 text-emerald-500" />
        Attendance Overview
      </h1>

      {loading ? (
        <LoadingSpinner message="Loading attendance logs..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Circular Panel */}
          <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="7" className="text-slate-100" />
                <circle
                  cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="7" strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * attendanceRate) / 100} strokeLinecap="round"
                  className="text-emerald-500 drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)]"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black text-slate-850">{attendanceRate}%</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Overall</p>
              </div>
            </div>
            <div className="mt-6 text-center w-full">
              <p className="text-slate-800 font-bold mb-1">{attendanceRate >= 80 ? 'Excellent Standing' : 'Needs Attention'}</p>
              <p className="text-sm text-slate-500">You've attended {attendance.filter(a => a.status === 'Present').length} out of {attendance.length} logged sessions.</p>
            </div>
          </div>

          {/* Table history */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent History</h3>
            <DataTable columns={columns} rows={currentRows} emptyMessage="No attendance records found." />

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