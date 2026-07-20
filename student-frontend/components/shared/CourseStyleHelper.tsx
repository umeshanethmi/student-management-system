'use client';

import React from 'react';
import { Code, Database, Cpu, Palette } from 'lucide-react';

interface CourseStyle {
  grad: string;
  bg: string;
  shadow: string;
  icon: React.ReactNode;
  progressColor: string;
  hoverText: string;
}

export function getCourseStyle(courseCode: string, courseName: string): CourseStyle {
  const code = (courseCode || '').toUpperCase();
  const name = (courseName || '').toLowerCase();

  if (code.startsWith('CS') || code.startsWith('CSC') || name.includes('computing') || name.includes('programming') || name.includes('software') || name.includes('algorithm')) {
    return {
      grad: 'from-primary to-primary-hover',
      bg: 'bg-primary-light text-primary-hover border-primary/20',
      shadow: 'shadow-primary/5 hover:shadow-primary/15',
      icon: <Code className="w-5 h-5" />,
      progressColor: 'bg-gradient-to-r from-primary to-primary-hover',
      hoverText: 'group-hover:text-primary',
    };
  }

  if (code.startsWith('DB') || code.startsWith('DATA') || name.includes('data') || name.includes('database')) {
    return {
      grad: 'from-primary to-emerald-600',
      bg: 'bg-primary-light text-primary-hover border-primary/20',
      shadow: 'shadow-primary/5 hover:shadow-primary/15',
      icon: <Database className="w-5 h-5" />,
      progressColor: 'bg-gradient-to-r from-primary to-emerald-600',
      hoverText: 'group-hover:text-primary',
    };
  }

  if (code.startsWith('AI') || code.startsWith('ML') || name.includes('intelligence') || name.includes('machine') || name.includes('network')) {
    return {
      grad: 'from-emerald-500 to-teal-600',
      bg: 'bg-primary-light text-primary-hover border-primary/20',
      shadow: 'shadow-primary/5 hover:shadow-primary/15',
      icon: <Cpu className="w-5 h-5" />,
      progressColor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      hoverText: 'group-hover:text-primary',
    };
  }

  return {
    grad: 'from-primary to-emerald-600',
    bg: 'bg-primary-light text-primary-hover border-primary/20',
    shadow: 'shadow-primary/5 hover:shadow-primary/15',
    icon: <Palette className="w-5 h-5" />,
    progressColor: 'bg-gradient-to-r from-primary to-emerald-600',
    hoverText: 'group-hover:text-primary',
  };
}