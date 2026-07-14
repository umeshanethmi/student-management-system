'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  User, 
  FileText, 
  CheckCircle,
  Video,
  Download,
  Calendar,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState(75); // Fallback progress
  const [instructor, setInstructor] = useState('Dr. Sarah Jenkins');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch course details
    apiFetch<Course>(`/api/courses/${id}`)
      .then((data) => {
        setCourse(data);
        
        // Dynamic details based on ID for student visualization
        if (data.courseCode === 'CS204') {
          setProgress(40);
          setInstructor('Prof. Alan Turing');
        } else if (data.courseCode === 'MTH201') {
          setProgress(90);
          setInstructor('Dr. Ramanujan');
        } else if (data.courseCode === 'ENG105') {
          setProgress(15);
          setInstructor('Ms. Jane Austen');
        } else {
          // Dynamic seed
          setProgress(Math.floor(Math.random() * 80) + 15);
          setInstructor('Dr. Albert Einstein');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold mt-4">Loading class records...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-24 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-800">Course Not Found</h3>
        <p className="text-slate-400 text-sm">The course catalog could not resolve this path.</p>
        <Link href="/dashboard/courses" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#5c4fe5] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to courses
        </Link>
      </div>
    );
  }

  const syllabusItems = [
    { title: "Introduction & Foundations", duration: "Week 1 - 2", status: "Completed" },
    { title: "Core Architecture & Design Patterns", duration: "Week 3 - 5", status: "Completed" },
    { title: "Advanced Implementations & Databases", duration: "Week 6 - 8", status: "In Progress" },
    { title: "Optimization & Final Projects", duration: "Week 9 - 12", status: "Pending" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4">
      {/* Back button */}
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-[-100px] top-[-50px] w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shrink-0 shadow-sm">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 tracking-wider mb-2.5 uppercase">
              {course.courseCode}
            </span>
            <h1 className="text-2xl font-black text-slate-800 leading-tight">
              {course.courseName}
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center font-medium">
              <User className="w-4 h-4 mr-1.5 opacity-70 text-slate-400" />
              Instructor: {instructor}
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Syllabus Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Syllabus Tracker */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <FileText className="w-5 h-5 mr-2.5 text-[#5c4fe5]" /> Course Syllabus & Chapters
          </h3>
          
          <div className="space-y-4">
            {syllabusItems.map((item, idx) => (
              <div 
                key={idx} 
                className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    item.status === 'Completed' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : item.status === 'In Progress' 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 animate-pulse' 
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{item.duration}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                  item.status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : item.status === 'In Progress' 
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Progress Panel & Video Resources */}
        <div className="space-y-6">
          
          {/* Progress Card */}
          <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Course Progress</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black text-slate-800">{progress}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Completion</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-100">
                <div className="bg-[#5c4fe5] h-2 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium pt-2 border-t border-slate-100">
                You have completed 3 of the 4 core learning modules in this curriculum. Keep going!
              </p>
            </div>
          </div>

          {/* Quick Actions / Materials */}
          <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Class Materials</h4>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#5c4fe5]" /> Watch Lecture Stream
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors">
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-500" /> Download Lecture Notes
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" /> Join Q&A Office Hours
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
