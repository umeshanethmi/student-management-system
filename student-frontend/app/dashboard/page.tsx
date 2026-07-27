'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Bell,
  GraduationCap,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import CourseProgressCard from '@/components/ui/CourseProgressCard';
import ActivityItem from '@/components/ui/ActivityItem';

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
  enrolledCoursesCount: number;
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
        const summaryData = await apiFetch<DashboardSummary>(`/api/students/profile/${storedUsername}/dashboard-summary`);
        setSummary(summaryData);

        try {
          const enrollData = await apiFetch<Enrollment[]>(`/api/enrollments/student/${storedUsername}`);
          setEnrollments(enrollData || []);
        } catch (e) {
          console.warn('Error fetching enrollments:', e);
        }

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
    return <LoadingSpinner message="Loading student workspace..." />;
  }

  if (error || !summary) {
    return (
      <ErrorDisplay
        message="Failed to connect to AuraEdu portal services. Please make sure the Spring Boot backend is running on port 8081."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Welcome Academic Banner */}
      <PageHeader
        icon={<GraduationCap className="text-primary w-8 h-8" />}
        tag={`Academic Term: ${summary.semesterDescription}`}
        title="AuraEdu Hub"
        description="Your personalized academic overview. View your progress, register for classes, and manage your student records."
      >
        <Link
          href="/dashboard/register-course"
          className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center text-sm gap-2 uppercase tracking-wider"
        >
          <span>+ Register Course</span>
        </Link>
      </PageHeader>

      {/* Dynamic Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<BookOpen className="text-blue-500 w-5 h-5" />}
          label="ENROLLED COURSES"
          value={`${summary.enrolledCoursesCount} Active`}
          trend="Current Semester"
          trendUp={true}
          color="blue"
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
      <div className="bg-card/70 backdrop-blur-xl border border-muted-border/50 rounded-[2.5rem] p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Semester Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2.5 text-primary" />
                Current Semester Courses
              </h2>
              <Link
                href="/dashboard/courses"
                className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center transition-colors"
              >
                View All <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <EmptyState message="No enrolled courses found. Click '+ Register Course' to enroll." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((item) => (
                  <CourseProgressCard
                    key={item.id}
                    id={item.courseId}
                    title={item.courseName}
                    code={item.courseCode}
                    progress={item.progress}
                    instructor={item.instructor}
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
            <div className="bg-muted/50 border border-muted-border/50 rounded-[2rem] p-6 shadow-inner">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}