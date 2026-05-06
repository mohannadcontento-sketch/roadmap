'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Flame, Gem, Trophy, Zap, Star, Target,
  Share2, Copy, CheckCircle2, Calendar, TrendingUp,
  BookOpen, Award, Loader2, Gift,
} from 'lucide-react';
import { useAuth } from '@/store/auth';

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
interface ProgressStats {
  completedDays: number;
  activeDays: number;
  totalXpEarned: number;
  totalEnrollments: number;
}

interface EnrollmentWithProgress {
  id: string;
  roadmapId: string;
  totalDays: number;
  completedDays: number;
  progressPercent: number;
  roadmap: {
    id: string;
    title: string;
    weeks: Array<{
      id: string;
      days: Array<{ id: string }>;
    }>;
  };
}

interface UserData {
  id: string;
  name: string;
  xp: number;
  streak: number;
  gems: number;
  level: number;
  lastActiveAt: string | null;
}

/* ═══════════════════════════════════════
   Stat Card
   ═══════════════════════════════════════ */
function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(145deg, #1a3347, #162d40)',
        border: '1px solid rgba(88,196,220,0.1)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}12`,
            border: `1.5px solid ${color}25`,
          }}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: '#a3c4d0' }}>{label}</p>
          <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Achievement Badge
   ═══════════════════════════════════════ */
function AchievementBadge({
  emoji,
  title,
  description,
  unlocked,
  delay,
}: {
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
      className={`
        flex flex-col items-center gap-2 p-3 rounded-2xl transition-all
        ${unlocked ? '' : 'opacity-35 grayscale-[0.8]'}
      `}
      style={{
        background: unlocked ? 'linear-gradient(145deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))' : '#152535',
        border: unlocked ? '1px solid rgba(255,200,0,0.15)' : '1px solid rgba(88,196,220,0.05)',
      }}
    >
      <div className="text-2xl sm:text-3xl">{emoji}</div>
      <div className="text-center">
        <p className="text-[10px] sm:text-xs font-extrabold" style={{ color: unlocked ? '#ffc800' : '#5a7f8f' }}>
          {title}
        </p>
        <p className="text-[8px] sm:text-[9px] mt-0.5" style={{ color: '#5a7f8f' }}>
          {description}
        </p>
      </div>
      {unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: delay + 0.2 }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#58cc02' }} />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Weekly XP Chart (Simple bar chart)
   ═══════════════════════════════════════ */
function WeeklyXpChart({ enrollments }: { enrollments: EnrollmentWithProgress[] }) {
  // Create mock weekly data based on enrollment progress
  const weekData = useMemo(() => {
    const weeks: Array<{ label: string; xp: number; completed: number }> = [];

    for (const enrollment of enrollments) {
      for (let i = 0; i < enrollment.roadmap.weeks.length; i++) {
        const week = enrollment.roadmap.weeks[i];
        const completedInWeek = week.days.filter(d =>
          enrollment.completedDays > 0
        ).length;

        // Distribute completed days across weeks
        let weekCompleted = 0;
        const avgPerWeek = enrollment.completedDays / enrollment.roadmap.weeks.length;
        if (i < Math.floor(avgPerWeek)) {
          weekCompleted = week.days.length;
        } else if (i === Math.floor(avgPerWeek)) {
          weekCompleted = enrollment.completedDays - Math.floor(avgPerWeek) * enrollment.roadmap.weeks.length;
        }

        weeks.push({
          label: `أ${i + 1}`,
          xp: weekCompleted * 15, // Approximate XP per day
          completed: weekCompleted,
        });
      }
    }

    // Show at most 12 weeks
    return weeks.slice(0, 12);
  }, [enrollments]);

  const maxXp = Math.max(...weekData.map(w => w.xp), 1);

  if (weekData.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xs" style={{ color: '#5a7f8f' }}>لا توجد بيانات بعد</p>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-32 px-1">
      {weekData.map((week, i) => {
        const height = maxXp > 0 ? (week.xp / maxXp) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 4)}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-t-md min-h-[4px]"
              style={{
                background: week.xp > 0
                  ? 'linear-gradient(to top, #58c4dc, #3a9bb5)'
                  : 'rgba(88,196,220,0.08)',
                boxShadow: week.xp > 0 ? '0 0 8px rgba(88,196,220,0.2)' : 'none',
              }}
            />
            <span className="text-[8px] sm:text-[9px] font-bold" style={{ color: '#5a7f8f' }}>
              {week.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   Progress Page
   ═══════════════════════════════════════ */
export default function ProgressPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/progress/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
          setStats(data.stats);
          setEnrollments(data.enrollments || []);
        }
      } catch {
        // silent fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, [user]);

  const handleShare = useCallback(async () => {
    if (!user) return;
    setShareLoading(true);
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: 'تقدمي في وصال',
          message: `كسرت ${stats?.completedDays || 0} يوم وجمعت ${user.xp} XP!`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const link = `${window.location.origin}/share/${data.share.shareKey}`;
        setShareLink(link);

        if (navigator.share) {
          try {
            await navigator.share({ title: 'تقدمي في وصال', url: link });
          } catch {
            // User cancelled share
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      setShareLoading(false);
    }
  }, [user, stats]);

  const handleCopyLink = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [shareLink]);

  // Achievements derived from stats
  const achievements = useMemo(() => {
    const completedDays = stats?.completedDays || 0;
    const totalXp = stats?.totalXpEarned || user?.xp || 0;
    const streak = user?.streak || 0;

    return [
      { emoji: '🌱', title: 'البداية', desc: 'أكمل أول يوم', unlocked: completedDays >= 1 },
      { emoji: '🔥', title: 'حارق', desc: 'سلسلة 3 أيام', unlocked: streak >= 3 },
      { emoji: '💪', title: 'منضبط', desc: 'أسبوع كامل', unlocked: completedDays >= 7 },
      { emoji: '⭐', title: 'نجم', desc: '١٠٠ XP', unlocked: totalXp >= 100 },
      { emoji: '🏆', title: 'بطل', desc: 'أكمل ١٤ يوم', unlocked: completedDays >= 14 },
      { emoji: '💎', title: 'ماسي', desc: '٥٠٠ XP', unlocked: totalXp >= 500 },
      { emoji: '🚀', title: 'صاروخي', desc: 'سلسلة ٧ أيام', unlocked: streak >= 7 },
      { emoji: '👑', title: 'ملك', desc: 'شهر كامل', unlocked: completedDays >= 30 },
    ];
  }, [stats, user]);

  if (!user) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#0f1f2e' }}>
        <p className="text-sm mb-4" style={{ color: '#a3c4d0' }}>سجل دخولك الأول</p>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'rgba(88,196,220,0.1)', color: '#58c4dc', border: '1px solid rgba(88,196,220,0.15)' }}
        >
          <ArrowRight className="w-4 h-4" />
          الصفحة الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen relative" style={{ background: '#0f1f2e' }}>
      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.04)' }}
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 -left-20 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'rgba(255,200,0,0.03)' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}
            >
              <ArrowRight className="w-4 h-4" style={{ color: '#58c4dc' }} />
            </div>
          </Link>
          <h1 className="text-lg font-extrabold" style={{ color: '#f8f5f0' }}>التقدم</h1>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}
          >
            <Trophy className="w-4 h-4" style={{ color: '#ffc800' }} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full"
            style={{ border: '3px solid rgba(88,196,220,0.2)', borderTopColor: '#58c4dc' }}
          />
        </div>
      ) : (
        <div className="relative z-10 px-4 pb-24">
          {/* User greeting */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
                  border: '2px solid rgba(88,196,220,0.2)',
                }}
              >
                <Image src="/roadmap/characters/mascot.png" alt={user.name} width={42} height={42} className="object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: '#f8f5f0' }}>{user.name}</h2>
                <p className="text-xs" style={{ color: '#a3c4d0' }}>المستوى {user.level} • رحلة التعافي</p>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              icon={<Zap className="w-5 h-5" style={{ color: '#ffc800' }} />}
              label="إجمالي XP"
              value={userData?.xp || user.xp}
              color="#ffc800"
              delay={0.05}
            />
            <StatCard
              icon={<Flame className="w-5 h-5" style={{ color: '#ff4b4b' }} />}
              label="السلسلة"
              value={userData?.streak || user.streak}
              color="#ff4b4b"
              delay={0.1}
            />
            <StatCard
              icon={<Gem className="w-5 h-5" style={{ color: '#58c4dc' }} />}
              label="الجواهر"
              value={userData?.gems || user.gems}
              color="#58c4dc"
              delay={0.15}
            />
            <StatCard
              icon={<Calendar className="w-5 h-5" style={{ color: '#58cc02' }} />}
              label="أيام مكتملة"
              value={stats?.completedDays || 0}
              color="#58cc02"
              delay={0.2}
            />
          </div>

          {/* Weekly XP Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-5 mb-6"
            style={{
              background: 'linear-gradient(145deg, #1a3347, #162d40)',
              border: '1px solid rgba(88,196,220,0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: '#58c4dc' }} />
              <h3 className="text-sm font-extrabold" style={{ color: '#f8f5f0' }}>التقدم الأسبوعي</h3>
            </div>
            <WeeklyXpChart enrollments={enrollments} />
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-5 mb-6"
            style={{
              background: 'linear-gradient(145deg, #1a3347, #162d40)',
              border: '1px solid rgba(88,196,220,0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: '#ffc800' }} />
              <h3 className="text-sm font-extrabold" style={{ color: '#f8f5f0' }}>الإنجازات</h3>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold mr-auto"
                style={{
                  background: 'rgba(255,200,0,0.1)',
                  color: '#ffc800',
                  border: '1px solid rgba(255,200,0,0.15)',
                }}
              >
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {achievements.map((badge, i) => (
                <AchievementBadge key={i} {...badge} delay={0.35 + i * 0.05} />
              ))}
            </div>
          </motion.div>

          {/* Roadmap progress */}
          {enrollments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl p-5 mb-6"
              style={{
                background: 'linear-gradient(145deg, #1a3347, #162d40)',
                border: '1px solid rgba(88,196,220,0.1)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4" style={{ color: '#58c4dc' }} />
                <h3 className="text-sm font-extrabold" style={{ color: '#f8f5f0' }}>المسارات</h3>
              </div>
              <div className="space-y-3">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold" style={{ color: '#f8f5f0' }}>
                        {enrollment.roadmap.title}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#58c4dc' }}>
                        {enrollment.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(88,196,220,0.08)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${enrollment.progressPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(to left, #58c4dc, #3a9bb5)',
                        }}
                      />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: '#5a7f8f' }}>
                      {enrollment.completedDays} من {enrollment.totalDays} يوم
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Share link display */}
            <AnimatePresence>
              {shareLink && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div
                    className="rounded-xl p-3 flex items-center gap-2"
                    style={{
                      background: 'rgba(88,204,2,0.08)',
                      border: '1px solid rgba(88,204,2,0.15)',
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#58cc02' }} />
                    <input
                      readOnly
                      value={shareLink}
                      className="flex-1 bg-transparent text-xs outline-none min-w-0"
                      style={{ color: '#58cc02' }}
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all"
                      style={{
                        background: 'rgba(88,204,2,0.15)',
                        color: '#58cc02',
                        border: '1px solid rgba(88,204,2,0.2)',
                      }}
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          تم!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          نسخ
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              disabled={shareLoading}
              className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: shareLoading
                  ? 'linear-gradient(135deg, #508992, #3a6b75)'
                  : 'linear-gradient(135deg, #ffc800, #cc9f00)',
                color: '#0f1f2e',
                boxShadow: shareLoading ? 'none' : '0 6px 25px rgba(255,200,0,0.35)',
                border: '2px solid rgba(255,224,102,0.3)',
              }}
            >
              {shareLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  شارك تقدمك
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Bottom navigation */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: 'linear-gradient(to top, #0f1f2e 70%, transparent)',
          paddingTop: '24px',
        }}
      >
        <div className="px-4 pb-6 flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.04)', border: '1px solid rgba(88,196,220,0.08)' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: '#5a7f8f' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>الرود ماب</span>
          </Link>

          <Link href="/progress" className="flex flex-col items-center gap-1 px-4 py-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.12)', border: '1px solid rgba(88,196,220,0.2)' }}
            >
              <Trophy className="w-5 h-5" style={{ color: '#58c4dc' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#58c4dc' }}>التقدم</span>
          </Link>

          <button className="flex flex-col items-center gap-1 px-4 py-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.04)', border: '1px solid rgba(88,196,220,0.08)' }}
            >
              <Star className="w-5 h-5" style={{ color: '#5a7f8f' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>الملف</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
