'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Users, BarChart3, CheckSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

// Mock unread messages - in a real app, this would come from state/context
const unreadMessages = {
  student: 2,
  teacher: 3,
  admin: 0,
};

export function Sidebar({ open, onToggle }: SidebarProps) {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and listen for changes
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      { label: 'Dashboard', href: `/${role}`, icon: LayoutDashboard },
    ];

    if (role === 'student') {
      return [
        ...baseItems,
        { label: 'My Assignments', href: '/student/assignments', icon: FileText },
        { label: 'Submit Assignment', href: '/student/submit', icon: CheckSquare },
        { label: 'AI Feedback', href: '/student/feedback', icon: Zap },
        { label: 'Grades', href: '/student/grades', icon: BarChart3 },
        { label: 'Messages', href: '/student/messages', icon: MessageSquare, badge: unreadMessages.student },
      ];
    } else if (role === 'teacher') {
      return [
        ...baseItems,
        { label: 'My Assignments', href: '/teacher/assignments', icon: FileText },
        { label: 'Create Assignment', href: '/teacher/assignments/create', icon: CheckSquare },
        { label: 'My Students', href: '/teacher/students', icon: Users },
        { label: 'Grades', href: '/teacher/grades', icon: BarChart3 },
        { label: 'Messages', href: '/teacher/messages', icon: MessageSquare, badge: unreadMessages.teacher },
      ];
    } else if (role === 'admin') {
      return [
        ...baseItems,
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Assignments', href: '/admin/assignments', icon: FileText },
        { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <Link href={`/${role}`} className="flex items-center gap-2 hover:opacity-80 transition">
          <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
          {(open || isMobile) && <span className="font-bold text-foreground text-lg whitespace-nowrap">Gradely</span>}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const badge = (item as any).badge;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
              title={!open && !isMobile ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {(open || isMobile) && <span className="truncate">{item.label}</span>}
              {badge && badge > 0 && (
                <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings and Logout */}
      <div className="space-y-1 border-t border-sidebar-border p-2">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/settings'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          )}
          title={!open && !isMobile ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {(open || isMobile) && <span className="truncate">Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          title={!open && !isMobile ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(open || isMobile) && <span className="truncate">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300',
        !open && !isMobile ? '-translate-x-full' : '',
        isMobile ? 'w-screen max-w-xs' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <SidebarContent />
      </div>
    </aside>
  );
}
