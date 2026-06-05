'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Target,
  FolderKanban,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'OKRs', href: '/okrs', icon: Target },
  { name: 'Projetos', href: '/projetos', icon: FolderKanban },
  { name: 'Rotina', href: '/rotina', icon: CalendarCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-indigo-700 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-semibold text-white">
                Performance
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-indigo-700 p-4">
          {sidebarOpen ? (
            <p className="text-xs text-indigo-300">
              Gestão de Performance Pedagógica
            </p>
          ) : (
            <div className="flex justify-center">
              <GraduationCap className="h-5 w-5 text-indigo-300" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}