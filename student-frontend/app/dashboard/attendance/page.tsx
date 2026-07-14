'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-black text-slate-800 flex items-center">
        <CheckCircle className="w-6 h-6 mr-3 text-emerald-500" />
        Attendance Overview
      </h1>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-semibold">Loading attendance logs...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Circular Panel */}
          <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="7" className="text-slate-100" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="7" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * attendanceRate) / 100} 
                  strokeLinecap="round" 
                  className="text-emerald-500 drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)]" 
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black text-slate-850">{attendanceRate}%</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Overall</p>
              </div>
            </div>
            <div className="mt-6 text-center w-full">
              <p className="text-slate-800 font-bold mb-1">
                {attendanceRate >= 80 ? 'Excellent Standing' : 'Needs Attention'}
              </p>
              <p className="text-sm text-slate-500">
                You&apos;ve attended {attendance.filter(a => a.status === 'Present').length} out of {attendance.length} logged sessions.
              </p>
            </div>
          </div>

          {/* Table history */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent History</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 pb-4">Date</th>
                    <th className="py-3 pb-4">Course Name</th>
                    <th className="py-3 pb-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {attendance.map((rec, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-slate-800">{rec.date}</td>
                      <td className="py-4 text-slate-500">{rec.courseName}</td>
                      <td className="py-4 text-right">
                        {rec.status === 'Present' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-500 border border-rose-100">
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
