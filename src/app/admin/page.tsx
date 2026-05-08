'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Map,
  Users,
  CheckCircle2,
  MessageSquareHeart,
  ArrowLeft,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalRoadmaps: number;
  activeRoadmaps: number;
  draftRoadmaps: number;
  closedRoadmaps: number;
  totalUsers: number;
  totalWeeks: number;
  totalDays: number;
  welcomeMessages: number;
}

interface DashboardCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  href: string;
  description: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [roadmapsRes, welcomeRes] = await Promise.all([
          fetch('/api/admin/roadmaps'),
          fetch('/api/admin/welcome'),
        ]);

        const roadmapsData = await roadmapsRes.json();
        const welcomeData = await welcomeRes.json();

        const roadmaps = roadmapsData.roadmaps || [];
        const totalWeeks = roadmaps.reduce(
          (acc: number, r: { weeks?: unknown[] }) => acc + (r.weeks?.length || 0),
          0
        );
        const totalDays = roadmaps.reduce(
          (acc: number, r: { weeks?: { days?: unknown[] }[] }) =>
            acc +
            (r.weeks?.reduce(
              (a: number, w: { days?: unknown[] }) => a + (w.days?.length || 0),
              0
            ) || 0),
          0
        );

        const activeMessages = (welcomeData.messages || []).filter(
          (m: { isActive: boolean }) => m.isActive === true
        );

        setStats({
          totalRoadmaps: roadmaps.length,
          activeRoadmaps: roadmaps.filter(
            (r: { status: string }) => r.status === 'active'
          ).length,
          draftRoadmaps: roadmaps.filter(
            (r: { status: string }) => r.status === 'draft'
          ).length,
          closedRoadmaps: roadmaps.filter(
            (r: { status: string }) => r.status === 'closed'
          ).length,
          totalUsers: 0,
          totalWeeks,
          totalDays,
          welcomeMessages: activeMessages.length,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards: DashboardCard[] = stats
    ? [
        {
          title: 'إجمالي المسارات',
          value: stats.totalRoadmaps,
          icon: <Map className="w-6 h-6" />,
          color: 'text-[#58c4dc]',
          bgColor: 'bg-[#58c4dc]/10',
          href: '/admin/roadmaps',
          description: `${stats.activeRoadmaps} نشط · ${stats.draftRoadmaps} مسودة`,
        },
        {
          title: 'المستخدمون',
          value: stats.totalUsers,
          icon: <Users className="w-6 h-6" />,
          color: 'text-[#ffc800]',
          bgColor: 'bg-[#ffc800]/10',
          href: '/admin',
          description: 'مستخدم مسجّل',
        },
        {
          title: 'الأسابيع والأيام',
          value: `${stats.totalWeeks} / ${stats.totalDays}`,
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'text-[#58cc02]',
          bgColor: 'bg-[#58cc02]/10',
          href: '/admin/roadmaps',
          description: `${stats.totalWeeks} أسبوع · ${stats.totalDays} يوم`,
        },
        {
          title: 'رسائل الترحيب',
          value: stats.welcomeMessages,
          icon: <MessageSquareHeart className="w-6 h-6" />,
          color: 'text-[#e879a0]',
          bgColor: 'bg-[#e879a0]/10',
          href: '/admin/welcome',
          description: 'رسالة مخصصة',
        },
      ]
    : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold text-[#f8f5f0]"
          >
            لوحة التحكم
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-[#5a7f8f]"
          >
            إدارة وتتبع أداء المنصة
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-sm text-[#5a7f8f]"
        >
          <Sparkles className="w-4 h-4 text-[#ffc800]" />
          <span>إصدار ١.٠</span>
        </motion.div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]"
            >
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4 bg-[#162d40]" />
                <Skeleton className="h-4 w-24 mb-2 bg-[#162d40]" />
                <Skeleton className="h-8 w-16 mb-2 bg-[#162d40]" />
                <Skeleton className="h-3 w-32 bg-[#162d40]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {cards.map((card) => (
            <motion.div key={card.title} variants={item}>
              <Link href={card.href}>
                <Card className="group bg-[#1a3347] border-[rgba(88,196,220,0.1)] hover:border-[#58c4dc]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#58c4dc]/5 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}
                      >
                        {card.icon}
                      </div>
                      <ArrowLeft className="w-4 h-4 text-[#5a7f8f] group-hover:text-[#58c4dc] group-hover:-translate-x-1 transition-all duration-200" />
                    </div>
                    <p className="text-sm text-[#a3c4d0] mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-[#f8f5f0] mb-1">
                      {card.value}
                    </p>
                    <p className="text-xs text-[#5a7f8f]">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-bold text-[#f8f5f0] mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/roadmaps">
            <Card className="group bg-[#1a3347] border-[rgba(88,196,220,0.1)] hover:border-[#58c4dc]/30 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#58c4dc]/10 text-[#58c4dc]">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f8f5f0]">
                    إدارة المسارات
                  </p>
                  <p className="text-xs text-[#5a7f8f]">
                    إنشاء وتعديل مسارات التعلم
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/welcome">
            <Card className="group bg-[#1a3347] border-[rgba(88,196,220,0.1)] hover:border-[#ffc800]/30 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#ffc800]/10 text-[#ffc800]">
                  <MessageSquareHeart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f8f5f0]">
                    رسائل الترحيب
                  </p>
                  <p className="text-xs text-[#5a7f8f]">
                    إدارة رسائل الترحيب والتشجيع
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="group bg-[#1a3347] border-[rgba(88,196,220,0.1)] hover:border-[#58cc02]/30 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#58cc02]/10 text-[#58cc02]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#f8f5f0]">
                  حالة المنصة
                </p>
                <p className="text-xs text-[#5a7f8f]">
                  جميع الأنظمة تعمل بشكل طبيعي
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Platform Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#f8f5f0]">
              معلومات المنصة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#162d40]">
                <p className="text-lg font-bold text-[#58c4dc]">
                  {stats?.activeRoadmaps ?? '—'}
                </p>
                <p className="text-xs text-[#5a7f8f] mt-1">مسار نشط</p>
              </div>
              <div className="p-3 rounded-xl bg-[#162d40]">
                <p className="text-lg font-bold text-[#ffc800]">
                  {stats?.draftRoadmaps ?? '—'}
                </p>
                <p className="text-xs text-[#5a7f8f] mt-1">مسودة</p>
              </div>
              <div className="p-3 rounded-xl bg-[#162d40]">
                <p className="text-lg font-bold text-[#a3c4d0]">
                  {stats?.closedRoadmaps ?? '—'}
                </p>
                <p className="text-xs text-[#5a7f8f] mt-1">مسار مغلق</p>
              </div>
              <div className="p-3 rounded-xl bg-[#162d40]">
                <p className="text-lg font-bold text-[#58cc02]">
                  {stats?.totalDays ?? '—'}
                </p>
                <p className="text-xs text-[#5a7f8f] mt-1">يوم تعليمي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
