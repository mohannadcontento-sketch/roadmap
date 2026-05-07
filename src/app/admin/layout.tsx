'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  MessageSquareHeart,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/admin',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/roadmaps',
    label: 'المسارات',
    icon: Map,
  },
  {
    href: '/admin/welcome',
    label: 'رسائل الترحيب',
    icon: MessageSquareHeart,
  },
  {
    href: '/admin/branches',
    label: 'الفروع',
    icon: GitBranch,
  },
];

function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-[rgba(88,196,220,0.1)]">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 rounded-xl bg-[#58c4dc]/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#58c4dc]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#f8f5f0]">وصال</h1>
            <p className="text-xs text-[#5a7f8f]">لوحة الإدارة</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#58c4dc]/15 text-[#58c4dc] shadow-lg shadow-[#58c4dc]/5'
                  : 'text-[#a3c4d0] hover:bg-[#162d40] hover:text-[#f8f5f0]'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-[#58c4dc]' : 'text-[#5a7f8f]'
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to App */}
      <div className="p-4 border-t border-[rgba(88,196,220,0.1)]">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#a3c4d0] hover:bg-[#162d40] hover:text-[#f8f5f0] transition-all duration-200"
        >
          <ArrowRight className="w-5 h-5 text-[#5a7f8f]" />
          العودة للتطبيق
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1f2e]" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 xl:w-72">
        <div className="w-full h-full bg-[#0a1622] border-l border-[rgba(88,196,220,0.1)]">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-72 bg-[#0a1622] border-l border-[rgba(88,196,220,0.1)] lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-[#0a1622]/90 backdrop-blur-md border-b border-[rgba(88,196,220,0.1)] lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-[#a3c4d0] hover:bg-[#162d40] transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#58c4dc]" />
          <span className="text-sm font-bold text-[#f8f5f0]">لوحة إدارة وصال</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pr-64 xl:pr-72">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-4 sm:p-6 lg:p-8 min-h-screen"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
