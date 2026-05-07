'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame, Gem, Trophy, Lock, CheckCircle2, ChevronLeft,
  Star, Zap, ArrowDown, Loader2, BookOpen, Target, Calendar,
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import DayDetailSheet, { type DayData } from './DayDetailSheet';
import BranchSelection from './BranchSelection';

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
interface ContentItem {
  id: string;
  type: 'youtube_reel' | 'game_challenge' | 'article' | 'task';
  title: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  xpReward: number;
  sortOrder: number;
  settings?: string | null;
}

interface RoadmapDay {
  id: string;
  weekId: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  icon?: string | null;
  xpReward: number;
  content: ContentItem[];
}

interface RoadmapWeek {
  id: string;
  roadmapId: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  icon?: string | null;
  days: RoadmapDay[];
}

interface Roadmap {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  icon?: string | null;
  weeks: RoadmapWeek[];
}

type DayStatus = 'locked' | 'active' | 'completed';

/* ═══════════════════════════════════════
   Zigzag position helper
   ═══════════════════════════════════════ */
function getZigzagPosition(index: number): 'center' | 'right' | 'left' {
  const pos = index % 5;
  if (pos === 0) return 'center';
  if (pos === 1 || pos === 2) return 'right';
  return 'left';
}

/* ═══════════════════════════════════════
   Week Icons Map
   ═══════════════════════════════════════ */
const WEEK_ICONS: Record<string, string> = {
  'الوعي': '/roadmap/icons/awareness.png',
  'التسجيل': '/roadmap/icons/registration.png',
  'التحدي': '/roadmap/icons/challenge.png',
  'الاستمرار': '/roadmap/icons/streak.png',
  'المنتصف': '/roadmap/icons/milestone.png',
  'العادة': '/roadmap/icons/identity.png',
  'المرونة': '/roadmap/icons/resilience.png',
  'الإتمام': '/roadmap/icons/completion.png',
};

function getWeekIcon(weekTitle: string): string {
  for (const [key, icon] of Object.entries(WEEK_ICONS)) {
    if (weekTitle.includes(key)) return icon;
  }
  return '/roadmap/icons/milestone.png';
}

/* ═══════════════════════════════════════
   Sticky Header
   ═══════════════════════════════════════ */
function StickyHeader({ user }: { user: { xp: number; streak: number; gems: number; level: number; name: string } }) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="sticky top-0 z-40"
      style={{
        background: 'linear-gradient(to bottom, #0f1f2e 60%, rgba(15,31,46,0.95) 80%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          {/* App name */}
          <div className="flex items-center gap-2">
            <Image src="/roadmap/characters/mascot.png" alt="وصال" width={36} height={36} className="object-contain" />
            <h1 className="text-lg font-extrabold" style={{ color: '#58c4dc' }}>وصال</h1>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {/* Level */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}>
              <Trophy className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
              <span className="text-xs font-bold" style={{ color: '#ffc800' }}>{user.level}</span>
            </div>
            {/* Gems */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}>
              <Gem className="w-3.5 h-3.5" style={{ color: '#58c4dc' }} />
              <span className="text-xs font-bold" style={{ color: '#58c4dc' }}>{user.gems}</span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(255,75,75,0.08)', border: '1px solid rgba(255,75,75,0.12)' }}>
              <Flame className="w-3.5 h-3.5" style={{ color: '#ff4b4b' }} />
              <span className="text-xs font-bold" style={{ color: '#ff4b4b' }}>{user.streak}</span>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-3">
          <p className="text-sm" style={{ color: '#a3c4d0' }}>
            أهلاً، <span className="font-bold" style={{ color: '#f8f5f0' }}>{user.name}</span> 👋
          </p>
        </div>

        {/* XP bar */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: '#ffc800' }} />
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(88,196,220,0.1)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((user.xp % 100) / 100 * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(to left, #ffc800, #cc9f00)',
                boxShadow: '0 0 10px rgba(255,200,0,0.3)',
              }}
            />
          </div>
          <span className="text-xs font-bold min-w-[52px] text-left" style={{ color: '#ffc800' }}>
            {user.xp} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Day Node
   ═══════════════════════════════════════ */
function DayNode({
  day,
  status,
  position,
  index,
  totalInWeek,
  onClick,
}: {
  day: RoadmapDay;
  status: DayStatus;
  position: 'center' | 'right' | 'left';
  index: number;
  totalInWeek: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const isDone = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  const nodeColor = isDone ? '#58cc02' : isActive ? '#ffc800' : '#5a7f8f';
  const bgColor = isDone
    ? 'linear-gradient(145deg, rgba(88,204,2,0.15), #1a3347)'
    : isActive
    ? 'linear-gradient(145deg, rgba(255,200,0,0.15), #1a3347)'
    : 'linear-gradient(145deg, #1a3347, #152535)';

  const borderColor = isDone ? '#58cc02' : isActive ? '#ffc800' : 'rgba(88,196,220,0.06)';
  const glow = isDone
    ? '0 0 20px rgba(88,204,2,0.25), 0 4px 15px rgba(0,0,0,0.3)'
    : isActive
    ? '0 0 25px rgba(255,200,0,0.35), 0 4px 15px rgba(0,0,0,0.3)'
    : '0 4px 15px rgba(0,0,0,0.2)';

  const positionClass = position === 'center' ? 'mx-auto' : position === 'right' ? 'mr-auto ml-4 sm:ml-8' : 'ml-auto mr-4 sm:mr-8';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.7 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 w-full max-w-[85%] sm:max-w-[320px] ${positionClass}`}
      onClick={onClick}
    >
      {/* Connector line from previous node */}
      {index > 0 && (
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-[28px] sm:-translate-y-[36px] w-[3px] h-[28px] sm:h-[36px]">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: isDone
                ? 'linear-gradient(to bottom, rgba(88,204,2,0.4), rgba(88,204,2,0.1))'
                : isActive
                ? 'linear-gradient(to bottom, rgba(255,200,0,0.4), rgba(255,200,0,0.1))'
                : 'linear-gradient(to bottom, rgba(88,196,220,0.08), rgba(88,196,220,0.03))',
            }}
          />
        </div>
      )}

      <motion.div
        whileHover={!isLocked ? { scale: 1.04, y: -3 } : {}}
        whileTap={!isLocked ? { scale: 0.97 } : {}}
        className={`
          rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all
          ${isLocked ? 'opacity-45' : ''}
        `}
        style={{
          background: bgColor,
          border: `2px solid ${borderColor}`,
          boxShadow: glow,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Day number circle */}
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: isLocked
                ? 'rgba(90,127,143,0.1)'
                : `${nodeColor}18`,
              border: `2px solid ${isLocked ? 'rgba(90,127,143,0.15)' : `${nodeColor}40`}`,
            }}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#58cc02' }} />
            ) : isLocked ? (
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#5a7f8f' }} />
            ) : (
              <Star className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#ffc800' }} fill="#ffc800" />
            )}

            {/* Active pulse */}
            {isActive && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid rgba(255,200,0,0.3)` }}
                />
                <motion.div
                  animate={{ scale: [1, 1.3], opacity: [0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `1.5px solid rgba(255,200,0,0.2)` }}
                />
              </>
            )}
          </div>

          {/* Day info */}
          <div className="flex-1 min-w-0">
            <h4
              className="text-sm sm:text-base font-extrabold leading-tight truncate"
              style={{ color: isLocked ? '#5a7f8f' : '#f8f5f0' }}
            >
              {day.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] sm:text-xs font-bold" style={{ color: nodeColor }}>
                {isDone ? 'تم ✓' : isActive ? 'ابدأ الآن' : `+${day.xpReward} XP`}
              </span>
              <span className="text-[10px]" style={{ color: '#5a7f8f' }}>
                {day.content.length} محتوى
              </span>
            </div>
          </div>

          {/* Arrow */}
          {!isLocked && (
            <ChevronLeft className="w-4 h-4 flex-shrink-0" style={{ color: '#5a7f8f' }} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Week Section
   ═══════════════════════════════════════ */
function WeekSection({
  week,
  weekIndex,
  dayProgressMap,
  onDayClick,
}: {
  week: RoadmapWeek;
  weekIndex: number;
  dayProgressMap: Map<string, DayStatus>;
  onDayClick: (day: RoadmapDay, status: DayStatus) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const weekIcon = week.icon || getWeekIcon(week.title);

  // Calculate week progress
  const completedCount = week.days.filter(d => dayProgressMap.get(d.id) === 'completed').length;
  const totalDays = week.days.length;
  const weekProgress = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
  const isWeekComplete = weekProgress === 100;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative mb-6"
    >
      {/* Week header */}
      <div className="flex items-center gap-3 mb-5 px-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{
            background: isWeekComplete
              ? 'linear-gradient(145deg, rgba(88,204,2,0.2), rgba(88,204,2,0.05))'
              : 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
            border: `1.5px solid ${isWeekComplete ? 'rgba(88,204,2,0.25)' : 'rgba(88,196,220,0.15)'}`,
          }}
        >
          <Image src={weekIcon} alt={week.title} width={28} height={28} className="object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold" style={{ color: '#f8f5f0' }}>
              {week.title}
            </h3>
            {isWeekComplete && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-sm"
              >
                ✅
              </motion.span>
            )}
          </div>
          {week.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#a3c4d0' }}>
              {week.description}
            </p>
          )}
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
          style={{
            background: isWeekComplete ? 'rgba(88,204,2,0.1)' : 'rgba(88,196,220,0.08)',
            color: isWeekComplete ? '#58cc02' : '#58c4dc',
          }}
        >
          {completedCount}/{totalDays}
        </span>
      </div>

      {/* Week progress bar */}
      <div className="px-2 mb-5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(88,196,220,0.08)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${weekProgress}%` } : { width: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: isWeekComplete
                ? 'linear-gradient(to left, #58cc02, #46a302)'
                : 'linear-gradient(to left, #58c4dc, #3a9bb5)',
            }}
          />
        </div>
      </div>

      {/* Days zigzag layout */}
      <div className="relative flex flex-col gap-6 sm:gap-8 pb-4">
        {week.days.map((day, dayIndex) => (
          <DayNode
            key={day.id}
            day={day}
            status={dayProgressMap.get(day.id) || 'locked'}
            position={getZigzagPosition(dayIndex)}
            index={dayIndex}
            totalInWeek={week.days.length}
            onClick={() => onDayClick(day, dayProgressMap.get(day.id) || 'locked')}
          />
        ))}
      </div>

      {/* Week separator */}
      <div className="flex items-center justify-center mt-6 mb-2">
        <div className="flex-1 h-px" style={{ background: 'rgba(88,196,220,0.06)' }} />
        <motion.div
          animate={{ rotate: 180, scale: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-3"
          style={{ color: '#5a7f8f' }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
        <div className="flex-1 h-px" style={{ background: 'rgba(88,196,220,0.06)' }} />
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════
   Loading Skeleton
   ═══════════════════════════════════════ */
function LoadingSkeleton() {
  return (
    <div dir="rtl" className="min-h-screen" style={{ background: '#0f1f2e' }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl" style={{ background: '#1a3347' }} />
            <div className="w-16 h-5 rounded-lg" style={{ background: '#1a3347' }} />
          </div>
          <div className="flex gap-2">
            <div className="w-14 h-7 rounded-lg" style={{ background: '#1a3347' }} />
            <div className="w-14 h-7 rounded-lg" style={{ background: '#1a3347' }} />
            <div className="w-14 h-7 rounded-lg" style={{ background: '#1a3347' }} />
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl" style={{ background: '#1a3347' }} />
              <div className="flex-1">
                <div className="w-32 h-4 rounded-lg mb-2" style={{ background: '#1a3347' }} />
                <div className="w-20 h-3 rounded-lg" style={{ background: '#152535' }} />
              </div>
            </div>
            {[1, 2, 3].map((j) => (
              <motion.div
                key={j}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                className="h-16 rounded-2xl"
                style={{
                  background: '#1a3347',
                  marginLeft: j % 2 === 0 ? 'auto' : '0',
                  marginRight: j % 2 === 0 ? '0' : 'auto',
                  width: j % 2 === 0 ? '85%' : '85%',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MainRoadmap Component
   ═══════════════════════════════════════ */
export default function MainRoadmap() {
  const { user, refreshUser } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [dayProgressMap, setDayProgressMap] = useState<Map<string, DayStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Branch state
  const [availableBranches, setAvailableBranches] = useState<Array<{
    id: string; title: string; description?: string | null; icon?: string | null;
    branchType: string; requiredWeekIndex: number;
  }>>([]);
  const [showBranchSelection, setShowBranchSelection] = useState(false);
  const [branchSelectionType, setBranchSelectionType] = useState('hobby');
  const [userSelectedBranches, setUserSelectedBranches] = useState<string[]>([]);
  const [lastCompletedWeekIndex, setLastCompletedWeekIndex] = useState(-1);

  // Fetch roadmaps, user progress, and branches in a single effect
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setIsLoading(true);
      try {
        const [roadmapsRes, progressRes, branchesRes, selectionsRes] = await Promise.all([
          fetch('/api/roadmaps'),
          fetch(`/api/progress/${user.id}`),
          fetch('/api/branches'),
          fetch(`/api/branches/user/${user.id}`),
        ]);

        let roadmapData: Roadmap[] = [];
        if (roadmapsRes.ok) {
          const data = await roadmapsRes.json();
          roadmapData = data.roadmaps || [];
          setRoadmaps(roadmapData);
        }

        const map = new Map<string, DayStatus>();

        // Initialize all days as locked
        for (const roadmap of roadmapData) {
          for (const week of roadmap.weeks) {
            for (const day of week.days) {
              map.set(day.id, 'locked');
            }
          }
        }

        if (progressRes.ok) {
          const data = await progressRes.json();

          if (data.enrollments && data.enrollments.length > 0) {
            let allDays: Array<{ id: string }> = [];

            for (const enrollment of data.enrollments) {
              const r = roadmapData.find(rm => rm.id === enrollment.roadmapId);
              if (r) {
                for (const week of r.weeks) {
                  for (const day of week.days) {
                    allDays.push({ id: day.id });
                  }
                }
              }
            }

            // Mark first N days as completed based on server stats, next as active
            const completedCount = data.stats.completedDays;
            for (let i = 0; i < allDays.length; i++) {
              if (i < completedCount) {
                map.set(allDays[i].id, 'completed');
              } else if (i === completedCount) {
                map.set(allDays[i].id, 'active');
              }
            }
          } else {
            // Not enrolled - activate first day of first roadmap
            if (roadmapData.length > 0 && roadmapData[0].weeks.length > 0 && roadmapData[0].weeks[0].days.length > 0) {
              map.set(roadmapData[0].weeks[0].days[0].id, 'active');
            }
          }
        } else {
          // Progress fetch failed - still activate first day
          if (roadmapData.length > 0 && roadmapData[0].weeks.length > 0 && roadmapData[0].weeks[0].days.length > 0) {
            map.set(roadmapData[0].weeks[0].days[0].id, 'active');
          }
        }

        setDayProgressMap(map);

        // Fetch branches and user selections
        if (branchesRes.ok) {
          const bData = await branchesRes.json();
          setAvailableBranches(bData.branches || []);
        }

        if (selectionsRes.ok) {
          const sData = await selectionsRes.json();
          const selectedIds = (sData.selections || []).map((s: { branchId: string }) => s.branchId);
          setUserSelectedBranches(selectedIds);
        }

        // Calculate the last fully completed week index to determine branch triggers
        let maxCompletedWeek = -1;
        for (const roadmap of roadmapData) {
          for (let wIdx = 0; wIdx < roadmap.weeks.length; wIdx++) {
            const week = roadmap.weeks[wIdx];
            const allCompleted = week.days.every(d => map.get(d.id) === 'completed');
            if (allCompleted && wIdx > maxCompletedWeek) maxCompletedWeek = wIdx;
          }
        }
        setLastCompletedWeekIndex(maxCompletedWeek);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Branch selection handler
  const handleBranchSelect = useCallback(async (branchId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/branches/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, branchId }),
      });
      if (res.ok) {
        setUserSelectedBranches(prev => [...prev, branchId]);
        setShowBranchSelection(false);
      }
    } catch { /* silent */ }
  }, [user]);

  // Check if branch selection should be shown
  const shouldShowHobbyBranch = useMemo(() => {
    if (lastCompletedWeekIndex < 2) return false;
    const hobbyBranch = availableBranches.find(b => b.branchType === 'hobby' && b.requiredWeekIndex === 2);
    if (!hobbyBranch) return false;
    return !userSelectedBranches.includes(hobbyBranch.id);
  }, [lastCompletedWeekIndex, availableBranches, userSelectedBranches]);

  const shouldShowSkillBranch = useMemo(() => {
    if (lastCompletedWeekIndex < 7) return false;
    const skillBranch = availableBranches.find(b => b.branchType === 'skill' && b.requiredWeekIndex === 7);
    if (!skillBranch) return false;
    return !userSelectedBranches.includes(skillBranch.id);
  }, [lastCompletedWeekIndex, availableBranches, userSelectedBranches]);

  // Determine which branch to show
  const activeBranchType = shouldShowHobbyBranch ? 'hobby' : shouldShowSkillBranch ? 'skill' : null;
  const branchesToShow = activeBranchType
    ? availableBranches.filter(b => b.branchType === activeBranchType)
    : [];

  useEffect(() => {
    if (branchesToShow.length > 0 && activeBranchType && !showBranchSelection) {
      setBranchSelectionType(activeBranchType);
      setShowBranchSelection(true);
    }
  }, [branchesToShow, activeBranchType, showBranchSelection]);

  const handleDayClick = useCallback((day: RoadmapDay, _status: DayStatus) => {
    if (_status === 'locked') return;
    setSelectedDay({
      id: day.id,
      title: day.title,
      description: day.description,
      xpReward: day.xpReward,
      icon: day.icon,
      content: day.content,
      status: _status,
    });
    setSheetOpen(true);
  }, []);

  const handleDayComplete = useCallback(async (dayId: string, xp: number) => {
    // Update local state immediately
    setDayProgressMap(prev => {
      const next = new Map(prev);
      next.set(dayId, 'completed');

      // Find and activate the next day
      for (const roadmap of roadmaps) {
        for (const week of roadmap.weeks) {
          for (let i = 0; i < week.days.length; i++) {
            if (week.days[i].id === dayId) {
              // Try next day in week
              if (i + 1 < week.days.length) {
                next.set(week.days[i + 1].id, 'active');
              } else {
                // Try first day of next week
                const weekIdx = roadmap.weeks.findIndex(w => w.id === week.id);
                if (weekIdx + 1 < roadmap.weeks.length) {
                  const nextWeek = roadmap.weeks[weekIdx + 1];
                  if (nextWeek.days.length > 0) {
                    next.set(nextWeek.days[0].id, 'active');
                  }
                }
              }
              break;
            }
          }
        }
      }

      return next;
    });

    // Refresh user data
    refreshUser();
  }, [roadmaps, refreshUser]);

  // Calculate overall progress
  const overallStats = useMemo(() => {
    let totalDays = 0;
    let completedDays = 0;
    for (const roadmap of roadmaps) {
      for (const week of roadmap.weeks) {
        for (const day of week.days) {
          totalDays++;
          if (dayProgressMap.get(day.id) === 'completed') completedDays++;
        }
      }
    }
    return { totalDays, completedDays, percent: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0 };
  }, [roadmaps, dayProgressMap]);

  if (!user) return null;
  if (isLoading) return <LoadingSkeleton />;

  return (
    <div dir="rtl" className="min-h-screen relative" style={{ background: '#0f1f2e' }}>
      {/* Gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.04)' }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -left-32 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(255,200,0,0.03)' }}
        />
        <motion.div
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 right-1/3 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.03)' }}
        />
      </div>

      {/* Sticky header */}
      <StickyHeader user={user} />

      {/* Overall progress banner */}
      {roadmaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mb-4"
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: 'linear-gradient(145deg, rgba(88,196,220,0.06), rgba(88,196,220,0.02))',
              border: '1px solid rgba(88,196,220,0.1)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
                border: '1.5px solid rgba(88,196,220,0.2)',
              }}
            >
              <Target className="w-6 h-6" style={{ color: '#58c4dc' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold mb-1" style={{ color: '#a3c4d0' }}>
                تقدمك الكلي
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(88,196,220,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallStats.percent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(to left, #58c4dc, #3a9bb5)',
                    }}
                  />
                </div>
                <span className="text-xs font-bold min-w-[40px] text-left" style={{ color: '#58c4dc' }}>
                  {overallStats.percent}%
                </span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#5a7f8f' }}>
                {overallStats.completedDays} من {overallStats.totalDays} يوم
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Roadmap title */}
      {roadmaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4" style={{ color: '#58c4dc' }} />
            <h2 className="text-sm font-bold" style={{ color: '#58c4dc' }}>
              {roadmaps[0].title}
            </h2>
          </div>
          {roadmaps[0].description && (
            <p className="text-xs leading-relaxed" style={{ color: '#a3c4d0' }}>
              {roadmaps[0].description}
            </p>
          )}
        </motion.div>
      )}

      {/* Empty state */}
      {roadmaps.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: '#1a3347', border: '2px solid rgba(88,196,220,0.15)' }}
          >
            <Calendar className="w-10 h-10" style={{ color: '#5a7f8f' }} />
          </motion.div>
          <h3 className="text-lg font-extrabold mb-2" style={{ color: '#f8f5f0' }}>
            لا توجد مسارات حالياً
          </h3>
          <p className="text-sm text-center" style={{ color: '#a3c4d0' }}>
            المسارات هتتوفر قريب. استنى التحديث الجاي!
          </p>
        </div>
      )}

      {/* Week sections */}
      <div className="px-4 pb-8">
        {roadmaps.map((roadmap) => (
          roadmap.weeks.map((week, weekIndex) => (
            <WeekSection
              key={week.id}
              week={week}
              weekIndex={weekIndex}
              dayProgressMap={dayProgressMap}
              onDayClick={handleDayClick}
            />
          ))
        ))}

        {/* Branch Selection */}
        <AnimatePresence>
          {showBranchSelection && branchesToShow.length > 0 && (
            <motion.div
              key={branchSelectionType}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 mb-8"
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(145deg, #1a3347, #162d40)',
                  border: '1px solid rgba(88,196,220,0.15)',
                  boxShadow: '0 0 40px rgba(88,196,220,0.05)',
                }}
              >
                <BranchSelection
                  branches={branchesToShow}
                  branchType={branchSelectionType}
                  title={branchSelectionType === 'hobby' ? 'اختر هوايتك! 🎯' : 'اختر مهارتك! 🔧'}
                  subtitle={
                    branchSelectionType === 'hobby'
                      ? 'اختر هواية واحدة لممارسةها أثناء الأسبوع'
                      : 'اختر مهارة جديدة لتطويرها'
                  }
                  onSelect={handleBranchSelect}
                  onDismiss={() => setShowBranchSelection(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
          {/* Roadmap tab */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-4 py-2"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.12)', border: '1px solid rgba(88,196,220,0.2)' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: '#58c4dc' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#58c4dc' }}>الرود ماب</span>
          </Link>

          {/* Progress tab */}
          <Link
            href="/progress"
            className="flex flex-col items-center gap-1 px-4 py-2"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.04)', border: '1px solid rgba(88,196,220,0.08)' }}
            >
              <Trophy className="w-5 h-5" style={{ color: '#5a7f8f' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>التقدم</span>
          </Link>

          {/* Shares tab */}
          <Link
            href="/shares"
            className="flex flex-col items-center gap-1 px-4 py-2"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.12)' }}
            >
              <Star className="w-5 h-5" style={{ color: '#ffc800' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>المشاركات</span>
          </Link>
        </div>
      </motion.div>

      {/* Day Detail Sheet */}
      <DayDetailSheet
        day={selectedDay}
        userId={user.id}
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setTimeout(() => setSelectedDay(null), 300);
        }}
        onComplete={handleDayComplete}
      />
    </div>
  );
}
