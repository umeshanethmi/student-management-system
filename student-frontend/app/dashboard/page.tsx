'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  CheckCircle, 
  GraduationCap, 
  Clock, 
  Calendar,
  ChevronRight,
  User,
  Bell,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Enrollment {
  id: number;
  username: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  instructor: string;
  progress: number;
}

interface DashboardSummary {
  attendanceRate: string;
  enrolledCoursesCount: number;
  pendingAssignmentsCount: number;
  nextClassTime: string;
  nextClassName: string;
  semesterDescription: string;
}

interface UpdateNotification {
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

export default function StudentDashboardHome() {
  const router = useRouter();
  const [username, setUsername] = useState('Student');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [updates, setUpdates] = useState<UpdateNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Student';
    setUsername(storedUsername);

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Fetch Summary
        const summaryData = await apiFetch<DashboardSummary>(`/api/students/profile/${storedUsername}/dashboard-summary`);
        setSummary(summaryData);

        // 2. Fetch Enrollments
        try {
          const enrollData = await apiFetch<Enrollment[]>(`/api/enrollments/student/${storedUsername}`);
          setEnrollments(enrollData || []);
        } catch (e) {
          console.warn('Error fetching enrollments:', e);
        }

        // 3. Fetch Updates/Notifications
        try {
          const updatesData = await apiFetch<UpdateNotification[]>(`/api/students/profile/${storedUsername}/updates`);
          setUpdates(updatesData || []);
        } catch (e) {
          console.warn('Error fetching updates:', e);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary datasets:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold mt-4">Loading student workspace...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="text-center py-24 space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-805 text-slate-800">Connection Error</h3>
        <p className="text-slate-400 text-sm">Failed to connect to AuraEdu portal services. Please make sure the Spring Boot backend is running on port 8081.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* Welcome Academic Banner */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo-505/10 to-transparent pointer-events-none" />
        
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15 animate-pulse">
            <GraduationCap className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
              Academic Term: {summary.semesterDescription}
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              AuraEdu Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Your personalized academic overview. View your progress, register for classes, and manage your student records.
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <Link 
            href="/dashboard/register-course"
            className="bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center text-xs gap-2 uppercase tracking-wider"
          >
            <span>+ REGISTER COURSE</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<BookOpen className="text-blue-500 w-5 h-5" />} 
          label="ENROLLED COURSES" 
          value={`${summary.enrolledCoursesCount} Active`} 
          trend="Current Semester" 
          trendUp={true} 
          color="blue" 
        />
        <StatCard 
          icon={<Clock className="text-rose-500 w-5 h-5" />} 
          label="PENDING ASSIGNMENTS" 
          value={`${summary.pendingAssignmentsCount} Due`} 
          trend="Needs attention" 
          trendUp={false} 
          color="rose" 
        />
        <StatCard 
          icon={<Calendar className="text-amber-500 w-5 h-5" />} 
          label="NEXT CLASS" 
          value={summary.nextClassTime} 
          trend={summary.nextClassName} 
          trendUp={true} 
          color="amber" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Current Semester Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2.5 text-[#5c4fe5]" />
                Current Semester Courses
              </h2>
              <Link 
                href="/dashboard/courses" 
                className="text-sm font-semibold text-[#5c4fe5] hover:text-indigo-700 flex items-center transition-colors"
              >
                View All <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-450 font-bold text-xs uppercase tracking-wider">
                No enrolled courses found. Click &apos;+ Register Course&apos; to enroll.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.map((item) => (
                  <CourseProgressCard 
                    key={item.id} 
                    id={item.courseId} 
                    title={item.courseName} 
                    code={item.courseCode} 
                    progress={item.progress} 
                    instructor={item.instructor} 
                    color="indigo" 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Live Updates */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center pb-2">
              <Bell className="w-5 h-5 mr-2.5 text-blue-500" />
              Recent Updates
            </h2>
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              {updates.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-semibold text-xs uppercase tracking-wider">No notifications.</div>
              ) : (
                <div className="space-y-6">
                  {updates.map((update, idx) => (
                    <ActivityItem 
                      key={idx} 
                      title={update.title} 
                      desc={update.desc} 
                      time={update.time} 
                      type={update.type} 
                    />
                  ))}
                </div>
              )}
              <button className="w-full mt-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CARD COMPONENTS
// ==========================================

function StatCard({ icon, label, value, trend, trendUp, color }: { icon: React.ReactNode, label: string, value: string, trend: string, trendUp: boolean, color: string }) {
  const stripeColors: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
  };
  
  const iconBgs: Record<string, string> = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    rose: 'bg-rose-50',
    amber: 'bg-amber-50',
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer pb-8">
      <div className="flex justify-between items-center mb-5">
        <div className={`w-10 h-10 rounded-xl ${iconBgs[color] || 'bg-slate-50'} flex items-center justify-center shadow-inner`}>
          {icon}
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
          trendUp 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : color === 'rose' 
              ? 'bg-rose-50 text-rose-500 border border-rose-100' 
              : 'bg-slate-50 text-slate-555 border border-slate-100'
        }`}>
          {trend}
        </div>
      </div>

      <div className="flex space-x-1.5 mb-4 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
      </div>

      <div className="mt-auto">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>

      <div className={`h-1.5 absolute bottom-0 left-0 right-0 w-full ${stripeColors[color] || 'bg-slate-200'} rounded-b-3xl`} />
    </div>
  );
}

function CourseProgressCard({ id, title, code, progress, instructor, color }: { id: number, title: string, code: string, progress: number, instructor: string, color: string }) {
  const progressColors: Record<string, string> = {
    blue: 'bg-blue-500',
    indigo: 'bg-[#5c4fe5]',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
  };

  const progressBgs: Record<string, string> = {
    blue: 'bg-blue-50',
    indigo: 'bg-indigo-50',
    purple: 'bg-purple-50',
    emerald: 'bg-emerald-50',
  };

  const progressText: Record<string, string> = {
    blue: 'text-blue-600 border-blue-100',
    indigo: 'text-[#5c4fe5] border-indigo-100',
    purple: 'text-purple-600 border-purple-100',
    emerald: 'text-emerald-600 border-emerald-100',
  };

  return (
    <Link 
      href={`/dashboard/courses/${id}`}
      className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-md hover:border-slate-350 transition-all duration-300 flex flex-col group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${progressBgs[color]} ${progressText[color]} mb-3 inline-block uppercase tracking-wider`}>
            {code}
          </span>
          <h4 className="text-base font-extrabold text-slate-800 group-hover:text-[#5c4fe5] transition-colors leading-snug">{title}</h4>
          <p className="text-xs text-slate-450 mt-1 flex items-center font-medium">
             <User className="w-3.5 h-3.5 mr-1.5 opacity-60 text-slate-400" />
             {instructor}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
          <ChevronRight className="w-4 h-4 text-slate-450 group-hover:text-[#5c4fe5] transition-colors" />
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex justify-between text-xs font-bold mb-1.5">
          <span className="text-slate-400">COURSE PROGRESS</span>
          <span className="text-slate-800">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-100">
          <div 
            className={`h-2 rounded-full ${progressColors[color] || progressColors.indigo} relative`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ title, desc, time, type }: { title: string, desc: string, time: string, type: 'success' | 'warning' | 'danger' | 'info' }) {
  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    danger: <Clock className="w-4 h-4 text-rose-500" />,
    info: <BookOpen className="w-4 h-4 text-blue-500" />
  };
  
  const bgMap = {
    success: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-amber-50 border-amber-100',
    danger: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100'
  };

  return (
    <div className="flex gap-4 group">
      <div className={`mt-0.5 w-9 h-9 shrink-0 rounded-full flex items-center justify-center border ${bgMap[type]} shadow-sm`}>
        {iconMap[type]}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#5c4fe5] transition-colors truncate leading-tight">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>
        <span className="text-[10px] text-slate-400 mt-2 block font-extrabold uppercase tracking-wider">{time}</span>
      </div>
    </div>
  );
}