'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, Lock, Trophy, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (p) => pathname === p;

  return (
    <div className="bottom-nav">
      <Link href="/today" className={`nav-btn ${isActive('/today') ? 'active' : ''}`}>
        <Check size={18} /> Today
      </Link>
      <Link href="/progress" className={`nav-btn ${isActive('/progress') ? 'active' : ''}`}>
        <Lock size={18} /> Progress
      </Link>
      <Link href="/leaderboard" className={`nav-btn ${isActive('/leaderboard') ? 'active' : ''}`}>
        <Trophy size={18} /> Leaderboard
      </Link>
      <Link href="/dashboard" className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}>
        <User size={18} /> Dashboard
      </Link>
    </div>
  );
}
