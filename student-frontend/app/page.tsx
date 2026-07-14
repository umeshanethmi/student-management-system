'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, UserCheck, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0e1e] flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30 text-white">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-650/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-purple-650/15 blur-[120px] pointer-events-none animate-pulse delay-500" style={{ animationDuration: '10s' }} />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-5 h-5 animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">AuraEdu</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-350 hover:text-white transition-colors py-2 px-4">
            Sign In
          </Link>
          <Link href="/register" className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl py-2.5 px-5 text-sm font-bold transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl w-full mx-auto text-center py-20 md:py-28 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-550/20 text-indigo-400 text-xs font-semibold mb-8 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Student Management</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          Empowering Education <br />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Through Secure Systems</span>
        </h1>

        <p className="text-slate-400 text-base md:text-xl max-w-2xl leading-relaxed mb-12">
          Manage courses, track enrollment registries, view payments, and run verification tools on a secure JWT-authorized administration portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/login" 
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-900/40 py-4 px-8 rounded-xl font-bold transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-2"
          >
            Sign In to Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-[#121634]/40 hover:bg-[#151b3c]/60 border border-[#212854]/60 py-4 px-8 rounded-xl font-bold transition-all uppercase text-xs tracking-wider flex items-center justify-center"
          >
            Create Student Account
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24 text-left">
          <div className="bg-[#121634]/20 border border-[#212854]/30 p-6 rounded-[2rem] backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-550/20 flex items-center justify-center text-indigo-400 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold mb-2">Academic Catalogs</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Browse, filter, and register for courses using active university registries.</p>
          </div>

          <div className="bg-[#121634]/20 border border-[#212854]/30 p-6 rounded-[2rem] backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-550/20 flex items-center justify-center text-indigo-400 mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold mb-2">Role-Based Access</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Dedicated interfaces and restrictions built for Admins, Faculty, and Students.</p>
          </div>

          <div className="bg-[#121634]/20 border border-[#212854]/30 p-6 rounded-[2rem] backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-550/20 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-md font-bold mb-2">Secure Verification</h3>
            <p className="text-slate-400 text-xs leading-relaxed">All API endpoints are protected using JWT authorization wrappers.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center py-6 border-t border-[#151a3a]/40 text-slate-500 text-xs relative z-10">
        <p>&copy; 2026 AuraEdu. All rights reserved.</p>
      </footer>
    </div>
  );
}