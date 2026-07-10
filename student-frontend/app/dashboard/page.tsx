'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [studentCount, setStudentCount] = useState<number | string>('...');
  const [courseCount, setCourseCount] = useState<number | string>('...');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User');

    fetch('http://localhost:8080/api/students')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStudentCount(data.length);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
        setStudentCount('Error');
      });

    fetch('http://localhost:8080/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourseCount(data.length);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setCourseCount('Error');
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-indigo-500/20 p-8 rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{username}</span>! 👋
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-lg">
            Here's a quick overview of what's happening in your educational platform today.
          </p>
          
          <div className="mt-6 flex gap-4">
            <Link href="/dashboard/students" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-900/20">
              Manage Students
            </Link>
            <Link href="/dashboard/courses" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl border border-slate-700 transition-all shadow-lg">
              View Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Students Card */}
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden group hover:border-slate-600 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Total Students</p>
              <h3 className="text-4xl font-bold text-white">{studentCount}</h3>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-400 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Active
              </span>
              <span className="text-slate-500 ml-2">Enrolled in platform</span>
            </div>
          </div>
        </div>
        
        {/* Available Courses Card */}
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden group hover:border-slate-600 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Available Courses</p>
              <h3 className="text-4xl font-bold text-white">{courseCount}</h3>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-400 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Updated
              </span>
              <span className="text-slate-500 ml-2">For current semester</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2 bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-center">
          <h3 className="text-slate-200 font-semibold mb-4 text-lg">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/students" className="flex items-center p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700 group">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Add New Student</p>
                <p className="text-xs text-slate-400 mt-0.5">Register a student</p>
              </div>
            </Link>
            
            <Link href="/dashboard/courses" className="flex items-center p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700 group">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Create Course</p>
                <p className="text-xs text-slate-400 mt-0.5">Add to curriculum</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}