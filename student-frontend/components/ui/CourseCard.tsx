'use client';

import React from 'react';
import { CheckCircle, Plus, User, Award, DollarSign } from 'lucide-react';
import { getCourseStyle } from '@/components/shared/CourseStyleHelper';

interface CourseData {
  id: number;
  courseName: string;
  courseCode: string;
  instructor?: string;
  credits?: number;
  fee?: string | number;
}

interface CourseCardProps {
  course: CourseData;
  isEnrolled: boolean;
  onEnroll?: (courseId: number, courseCode: string, courseName: string) => void;
  onRegister?: (course: CourseData) => void;
  role?: string;
}

export default function CourseCard({ course, isEnrolled, onEnroll, onRegister, role = 'STUDENT' }: CourseCardProps) {
  const style = getCourseStyle(course.courseCode, course.courseName);

  return (
    <div
      className={`group bg-white/70 backdrop-blur-xl border border-muted-border/60 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between shadow-lg ${style.shadow} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
    >
      <div>
        {/* Header: Course Code and Tag */}
        <div className="flex justify-between items-start mb-5">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.bg} uppercase tracking-wider`}>
            {course.courseCode}
          </span>
          <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
            {style.icon}
          </div>
        </div>

        <div className="flex space-x-1.5 mb-4 opacity-25">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        </div>

        {/* Body: Course Name */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-primary-hover transition-colors">
          {course.courseName}
        </h3>

        {/* Info rows */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100/60">
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <User className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
            <span className="truncate">{course.instructor || 'Dr. Albert Einstein'}</span>
          </div>

          <div className="flex items-center text-sm text-slate-500 font-medium">
            <Award className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
            <span>{course.credits || 3} Credits</span>
          </div>

          <div className="flex items-center text-sm text-slate-800 font-semibold">
            <DollarSign className="w-4 h-4 mr-2 text-primary shrink-0" />
            <span>{course.fee || 'LKR 45,000'}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Active Program
          </span>
          <div>
            {role === 'STUDENT' ? (
              isEnrolled ? (
                <span className="text-sm font-semibold bg-primary-light text-primary-hover px-4 py-1.5 rounded-xl border border-primary/20 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" /> Enrolled
                </span>
              ) : onEnroll ? (
                <button
                  type="button"
                  onClick={() => onEnroll(course.id, course.courseCode, course.courseName)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold uppercase tracking-wider shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer"
                >
                  Enroll
                </button>
              ) : onRegister ? (
                <button
                  type="button"
                  onClick={() => onRegister(course)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 text-white" /> Register Course
                </button>
              ) : null
            ) : (
              <span className="text-sm font-semibold bg-primary-light text-primary-hover px-4 py-1.5 rounded-xl border border-primary/20 uppercase tracking-wider">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Accent bottom stripe */}
      <div className={`h-1.5 absolute bottom-0 left-0 right-0 w-full bg-gradient-to-r ${style.grad} rounded-b-[2rem]`} />
    </div>
  );
}