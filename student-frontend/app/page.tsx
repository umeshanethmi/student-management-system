'use client';

import Link from 'next/link';
import { Sparkles, GraduationCap, BookOpen, Users, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-muted flex flex-col items-center justify-center p-6 text-center text-slate-800 relative overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-10">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wider uppercase mb-8 backdrop-blur-md shadow-sm select-none">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AuraEdu Portal</span>
        </div>

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            AuraEdu
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            Transform your academic journey with intelligent course management, real-time progress tracking, and seamless collaboration.
          </p>
        </div>

        {/* Feature Mini Icons */}
        <div className="flex justify-center gap-6 text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Learn</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Study</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Collaborate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Secure</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="w-full sm:w-auto relative flex items-center justify-center gap-2 px-9 py-4 bg-primary text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-97 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.25)] hover:bg-primary-hover hover:shadow-[0_15px_30px_rgba(16,185,129,0.35)] group text-sm tracking-wide"
          >
            Sign In to Dashboard
            <Sparkles className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-hover font-semibold hover:underline transition-colors">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}