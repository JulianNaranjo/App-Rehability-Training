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
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import {
  Home,
  Lightbulb,
  Trophy,
  Settings,
  User,
  Gamepad2,
  LogIn,
  LogOut,
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
      aria-current={isActive ? 'page' : undefined}
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
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

  const isAuthenticated = status === 'authenticated' && user;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { href: '/game/selection', label: 'Jugar', icon: <Gamepad2 className="w-5 h-5" /> },
    { href: '/leaderboard', label: 'Clasificación', icon: <Trophy className="w-5 h-5" /> },
    ...(isAuthenticated
      ? [{ href: '/tips', label: 'Consejos', icon: <Lightbulb className="w-5 h-5" /> }]
      : []),
    { href: '/settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
    { href: '/profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  const onLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

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

          {/* Session */}
          <div className="flex items-center gap-2 pl-2">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-white/90 text-sm font-medium">
                  {user.displayName}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                    'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
