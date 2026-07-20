'use client';

import Link from 'next/link';
import { ChevronRight, User } from 'lucide-react';
import { getCourseStyle } from '@/components/shared/CourseStyleHelper';

interface CourseProgressCardProps {
  id: number;
  title: string;
  code: string;
  progress: number;
  instructor: string;
}

export default function CourseProgressCard({ id, title, code, progress, instructor }: CourseProgressCardProps) {
  const style = getCourseStyle(code, title);

  return (
    <Link
      href={`/dashboard/courses/${id}`}
      className={`group bg-card/70 backdrop-blur-xl border border-muted-border/55 rounded-[2rem] p-6 shadow-lg ${style.shadow} hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${style.bg} mb-3.5 inline-block uppercase tracking-wider`}>
            {code}
          </span>
          <h4 className={`text-lg font-bold text-slate-800 ${style.hoverText} transition-colors leading-snug`}>{title}</h4>
          <p className="text-sm text-slate-500 mt-1 flex items-center font-medium">
            <User className="w-4 h-4 mr-1.5 opacity-60 text-slate-400" />
            {instructor}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-muted border border-muted-border flex items-center justify-center group-hover:bg-primary-light transition-colors shrink-0">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-muted-border">
        <div className="flex justify-between text-sm font-semibold mb-1.5">
          <span className="text-slate-400">COURSE PROGRESS</span>
          <span className="text-slate-800">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-muted-border/60">
          <div
            className={`h-2 rounded-full ${style.progressColor} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}