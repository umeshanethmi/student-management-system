'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // සයිට් එකට ආපු ගමන් කෙළින්ම ලොගින් පේජ් එකට යවනවා
    redirect('/login');
  }, []);

  return null;
}