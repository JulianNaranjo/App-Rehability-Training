'use client';

/**
 * Navbar Component
 * 
 * Global navigation bar with links to all main pages.
 * Shows active state for current route.
 * 
 * @module Navbar
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Trophy, 
  Settings, 
  User,
  Gamepad2
} from 'lucide-react';

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function NavLink({ href, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
        'hover:bg-white/10',
        isActive 
          ? 'bg-white/20 text-white font-semibold' 
          : 'text-white/80 hover:text-white'
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { href: '/game/selection', label: 'Jugar', icon: <Gamepad2 className="w-5 h-5" /> },
    { href: '/leaderboard', label: 'Clasificación', icon: <Trophy className="w-5 h-5" /> },
    { href: '/settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
    { href: '/profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-600 dark:bg-primary-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <span className="bg-white text-primary-600 px-2 py-1 rounded-lg text-sm">
              LH
            </span>
            <span className="hidden sm:inline">Letter Hunt</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
