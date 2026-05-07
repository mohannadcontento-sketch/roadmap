'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame, Gem, Trophy, Lock, CheckCircle2, ChevronLeft,
  Star, Zap, ArrowDown, Loader2, BookOpen, Target, Calendar,
  GitBranch, Sparkles,
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
  branchId?: string | null;
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

interface BranchInfo {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  branchType: string;
  requiredWeekIndex: number;
  weeks: RoadmapWeek[];
}

type DayStatus = 'locked' | 'active' | 'completed';

/* Display section types */
type DisplaySection =
  | { type: 'main-week'; week: RoadmapWeek; weekIndex: number }
  | { type: 'branch-week'; week: RoadmapWeek; branch: BranchInfo; weekIndex: number }
  | { type: 'shared-week'; week: RoadmapWeek; weekIndex: number }
  | { type: 'branch-selection'; branchType: 'hobby' | 'skill'; requiredWeekIndex: number };

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
          <div className="flex items-center gap-2">
            <Image src="/roadmap/characters/mascot.png" alt="وصال" width={36} height={36} className="object-contain" />
            <h1 className="text-lg font-extrabold" style={{ color: '#58c4dc' }}>وصال</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}>
              <Trophy className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
              <span className="text-xs font-bold" style={{ color: '#ffc800' }}>{user.level}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}>
              <Gem className="w-3.5 h-3.5" style={{ color: '#58c4dc' }} />
              <span className="text-xs font-bold" style={{ color: '#58c4dc' }}>{user.gems}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
              style={{ background: 'rgba(255,75,75,0.08)', border: '1px solid rgba(255,75,75,0.12)' }}>
              <Flame className="w-3.5 h-3.5" style={{ color: '#ff4b4b' }} />
              <span className="text-xs font-bold" style={{ color: '#ff4b4b' }}>{user.streak}</span>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <p className="text-sm" style={{ color: '#a3c4d0' }}>
            أهلاً، <span className="font-bold" style={{ color: '#f8f5f0' }}>{user.name}</span> 👋
          </p>
        </div>
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
  isBranchDay,
  onClick,
}: {
  day: RoadmapDay;
  status: DayStatus;
  position: 'center' | 'right' | 'left';
  index: number;
  totalInWeek: number;
  isBranchDay?: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const isDone = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  const accentColor = isBranchDay ? '#e879f9' : '#58c4dc';
  const nodeColor = isDone ? '#58cc02' : isActive ? '#ffc800' : '#5a7f8f';
  const bgColor = isDone
    ? 'linear-gradient(145deg, rgba(88,204,2,0.15), #1a3347)'
    : isActive
    ? 'linear-gradient(145deg, rgba(255,200,0,0.15), #1a3347)'
    : 'linear-gradient(145deg, #1a3347, #152535)';

  const borderColor = isDone ? '#58cc02' : isActive ? '#ffc800' : isBranchDay ? 'rgba(232,121,249,0.15)' : 'rgba(88,196,220,0.06)';
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
      {index > 0 && (
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-[28px] sm:-translate-y-[36px] w-[3px] h-[28px] sm:h-[36px]">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: isDone
                ? 'linear-gradient(to bottom, rgba(88,204,2,0.4), rgba(88,204,2,0.1))'
                : isActive
                ? 'linear-gradient(to bottom, rgba(255,200,0,0.4), rgba(255,200,0,0.1))'
                : isBranchDay
                ? 'linear-gradient(to bottom, rgba(232,121,249,0.15), rgba(232,121,249,0.03))'
                : 'linear-gradient(to bottom, rgba(88,196,220,0.08), rgba(88,196,220,0.03))',
            }}
          />
        </div>
      )}
      <motion.div
        whileHover={!isLocked ? { scale: 1.04, y: -3 } : {}}
        whileTap={!isLocked ? { scale: 0.97 } : {}}
        className={`rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all ${isLocked ? 'opacity-45' : ''}`}
        style={{ background: bgColor, border: `2px solid ${borderColor}`, boxShadow: glow }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: isLocked ? 'rgba(90,127,143,0.1)' : `${nodeColor}18`,
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
            {isActive && (
              <>
                <motion.div animate={{ scale: [1, 1.5], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl" style={{ border: '2px solid rgba(255,200,0,0.3)' }} />
                <motion.div animate={{ scale: [1, 1.3], opacity: [0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  className="absolute inset-0 rounded-xl" style={{ border: '1.5px solid rgba(255,200,0,0.2)' }} />
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-extrabold leading-tight truncate" style={{ color: isLocked ? '#5a7f8f' : '#f8f5f0' }}>
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
          {!isLocked && <ChevronLeft className="w-4 h-4 flex-shrink-0" style={{ color: '#5a7f8f' }} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Week Section (Main / Shared)
   ═══════════════════════════════════════ */
function WeekSection({
  week,
  weekIndex,
  dayProgressMap,
  onDayClick,
  isShared,
}: {
  week: RoadmapWeek;
  weekIndex: number;
  dayProgressMap: Map<string, DayStatus>;
  onDayClick: (day: RoadmapDay, status: DayStatus) => void;
  isShared?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const weekIcon = week.icon || getWeekIcon(week.title);
  const completedCount = week.days.filter(d => dayProgressMap.get(d.id) === 'completed').length;
  const totalDays = week.days.length;
  const weekProgress = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
  const isWeekComplete = weekProgress === 100;

  const accentColor = isShared ? '#ffc800' : '#58c4dc';

  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }} className="relative mb-6">
      <div className="flex items-center gap-3 mb-5 px-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{
            background: isWeekComplete
              ? 'linear-gradient(145deg, rgba(88,204,2,0.2), rgba(88,204,2,0.05))'
              : isShared
              ? 'linear-gradient(145deg, rgba(255,200,0,0.2), rgba(255,200,0,0.05))'
              : 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
            border: `1.5px solid ${isWeekComplete ? 'rgba(88,204,2,0.25)' : isShared ? 'rgba(255,200,0,0.25)' : 'rgba(88,196,220,0.15)'}`,
          }}>
          <Image src={weekIcon} alt={week.title} width={28} height={28} className="object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold" style={{ color: '#f8f5f0' }}>
              {week.title}
            </h3>
            {isShared && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,200,0,0.1)', color: '#ffc800', border: '1px solid rgba(255,200,0,0.2)' }}>
                مهمات مجمعة
              </span>
            )}
            {isWeekComplete && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm">✅</motion.span>
            )}
          </div>
          {week.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#a3c4d0' }}>{week.description}</p>
          )}
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
          style={{
            background: isWeekComplete ? 'rgba(88,204,2,0.1)' : isShared ? 'rgba(255,200,0,0.08)' : 'rgba(88,196,220,0.08)',
            color: isWeekComplete ? '#58cc02' : isShared ? '#ffc800' : '#58c4dc',
          }}>
          {completedCount}/{totalDays}
        </span>
      </div>

      <div className="px-2 mb-5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(88,196,220,0.08)' }}>
          <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${weekProgress}%` } : { width: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} className="h-full rounded-full"
            style={{
              background: isWeekComplete ? 'linear-gradient(to left, #58cc02, #46a302)'
                : isShared ? 'linear-gradient(to left, #ffc800, #cc9f00)'
                : 'linear-gradient(to left, #58c4dc, #3a9bb5)',
            }} />
        </div>
      </div>

      <div className="relative flex flex-col gap-6 sm:gap-8 pb-4">
        {week.days.map((day, dayIndex) => (
          <DayNode key={day.id} day={day} status={dayProgressMap.get(day.id) || 'locked'}
            position={getZigzagPosition(dayIndex)} index={dayIndex} totalInWeek={week.days.length}
            onClick={() => onDayClick(day, dayProgressMap.get(day.id) || 'locked')} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-6 mb-2">
        <div className="flex-1 h-px" style={{ background: isShared ? 'rgba(255,200,0,0.08)' : 'rgba(88,196,220,0.06)' }} />
        <motion.div animate={{ rotate: 180, scale: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-3" style={{ color: '#5a7f8f' }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
        <div className="flex-1 h-px" style={{ background: isShared ? 'rgba(255,200,0,0.08)' : 'rgba(88,196,220,0.06)' }} />
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════
   Branch Week Section (special styling)
   ═══════════════════════════════════════ */
function BranchWeekSection({
  week,
  branch,
  weekIndex,
  dayProgressMap,
  onDayClick,
}: {
  week: RoadmapWeek;
  branch: BranchInfo;
  weekIndex: number;
  dayProgressMap: Map<string, DayStatus>;
  onDayClick: (day: RoadmapDay, status: DayStatus) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const completedCount = week.days.filter(d => dayProgressMap.get(d.id) === 'completed').length;
  const totalDays = week.days.length;
  const weekProgress = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
  const isWeekComplete = weekProgress === 100;

  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }} className="relative mb-6">
      {/* Branch label */}
      <div className="px-2 mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5" style={{ color: '#e879f9' }} />
          <span className="text-[10px] font-bold" style={{ color: '#e879f9' }}>
            مسارك: {branch.title}
          </span>
        </div>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(145deg, rgba(232,121,249,0.03), rgba(232,121,249,0.01))',
          border: '1.5px solid rgba(232,121,249,0.12)',
          borderRight: '4px solid rgba(232,121,249,0.4)',
        }}
      >
        {/* Week header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{
              background: 'linear-gradient(145deg, rgba(232,121,249,0.15), rgba(232,121,249,0.05))',
              border: '1.5px solid rgba(232,121,249,0.2)',
            }}
          >
            {branch.icon || '🎯'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold" style={{ color: '#f8f5f0' }}>
                {week.title}
              </h3>
              {isWeekComplete && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm">✅</motion.span>
              )}
            </div>
            {week.description && (
              <p className="text-xs mt-0.5 truncate" style={{ color: '#a3c4d0' }}>{week.description}</p>
            )}
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
            style={{
              background: isWeekComplete ? 'rgba(88,204,2,0.1)' : 'rgba(232,121,249,0.08)',
              color: isWeekComplete ? '#58cc02' : '#e879f9',
            }}>
            {completedCount}/{totalDays}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(232,121,249,0.08)' }}>
            <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${weekProgress}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} className="h-full rounded-full"
              style={{
                background: isWeekComplete
                  ? 'linear-gradient(to left, #58cc02, #46a302)'
                  : 'linear-gradient(to left, #e879f9, #c026d3)',
              }} />
          </div>
        </div>

        {/* Days */}
        <div className="relative flex flex-col gap-5 sm:gap-6 pb-2">
          {week.days.map((day, dayIndex) => (
            <DayNode key={day.id} day={day} status={dayProgressMap.get(day.id) || 'locked'}
              position={getZigzagPosition(dayIndex)} index={dayIndex} totalInWeek={week.days.length}
              isBranchDay onClick={() => onDayClick(day, dayProgressMap.get(day.id) || 'locked')} />
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center justify-center mt-5 mb-2">
        <div className="flex-1 h-px" style={{ background: 'rgba(232,121,249,0.08)' }} />
        <motion.div animate={{ rotate: 180, scale: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-3" style={{ color: '#e879f9' }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
        <div className="flex-1 h-px" style={{ background: 'rgba(232,121,249,0.08)' }} />
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════
   Branch Selection Divider (inline)
   ═══════════════════════════════════════ */
function BranchSelectionDivider({
  branchType,
  branches,
  onSelect,
  alreadySelected,
}: {
  branchType: 'hobby' | 'skill';
  branches: BranchInfo[];
  onSelect: (branchId: string) => void;
  alreadySelected?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (alreadySelected) return null;

  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }} className="relative mb-6 mt-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'linear-gradient(145deg, #1a3347, #162d40)',
          border: '1px solid rgba(88,196,220,0.15)',
          boxShadow: '0 0 40px rgba(88,196,220,0.05)',
        }}
      >
        <BranchSelection
          branches={branches.map(b => ({
            id: b.id,
            title: b.title,
            description: b.description,
            icon: b.icon,
            branchType: b.branchType,
          }))}
          branchType={branchType}
          title={branchType === 'hobby' ? 'اختر هوايتك! 🎯' : 'اختر مهارتك! 🔧'}
          subtitle={
            branchType === 'hobby'
              ? 'اختر هواية واحدة لممارسةها أثناء الأسبوع'
              : 'اختر مهارة جديدة لتطويرها'
          }
          onSelect={onSelect}
          onDismiss={() => {}}
        />
      </div>

      <div className="flex items-center justify-center mt-5 mb-2">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,200,0,0.08)' }} />
        <motion.div animate={{ rotate: 180, scale: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-3">
          <Sparkles className="w-4 h-4" style={{ color: '#ffc800' }} />
        </motion.div>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,200,0,0.08)' }} />
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
              <motion.div key={j} animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 }}
                className="h-16 rounded-2xl"
                style={{ background: '#1a3347', marginLeft: j % 2 === 0 ? 'auto' : '0', marginRight: j % 2 === 0 ? '0' : 'auto', width: '85%' }} />
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
  const [allBranches, setAllBranches] = useState<BranchInfo[]>([]);
  const [dayProgressMap, setDayProgressMap] = useState<Map<string, DayStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [userSelectedBranchIds, setUserSelectedBranchIds] = useState<string[]>([]);
  const [needsRefresh, setNeedsRefresh] = useState(0);

  // Fetch roadmaps, user progress, and branches
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

        // Also init branch days
        if (branchesRes.ok) {
          const bData = await branchesRes.json();
          const branches = (bData.branches || []) as BranchInfo[];
          setAllBranches(branches);
          for (const branch of branches) {
            for (const week of branch.weeks) {
              for (const day of week.days) {
                map.set(day.id, 'locked');
              }
            }
          }
        }

        // Apply progress
        if (progressRes.ok) {
          const data = await progressRes.json();
          if (data.enrollments && data.enrollments.length > 0) {
            let allDays: Array<{ id: string }> = [];

            // Collect main roadmap days
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

            const completedCount = data.stats.completedDays;
            for (let i = 0; i < allDays.length; i++) {
              if (i < completedCount) {
                map.set(allDays[i].id, 'completed');
              } else if (i === completedCount) {
                map.set(allDays[i].id, 'active');
              }
            }
          } else {
            if (roadmapData.length > 0 && roadmapData[0].weeks.length > 0 && roadmapData[0].weeks[0].days.length > 0) {
              map.set(roadmapData[0].weeks[0].days[0].id, 'active');
            }
          }
        } else {
          if (roadmapData.length > 0 && roadmapData[0].weeks.length > 0 && roadmapData[0].weeks[0].days.length > 0) {
            map.set(roadmapData[0].weeks[0].days[0].id, 'active');
          }
        }

        setDayProgressMap(map);

        // User branch selections
        if (selectionsRes.ok) {
          const sData = await selectionsRes.json();
          const selectedIds = (sData.selections || []).map((s: { branchId: string }) => s.branchId);
          setUserSelectedBranchIds(selectedIds);

          // Also unlock branch days if user has selected branches
          const branchSelections = sData.selections || [];
          for (const sel of branchSelections) {
            const branch = allBranches.find(b => b.id === sel.branchId);
            if (branch) {
              for (const week of branch.weeks) {
                for (const day of week.days) {
                  map.set(day.id, 'active');
                }
              }
            }
          }
          setDayProgressMap(map);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user, needsRefresh]);

  // Re-fetch branches with weeks when user selects a branch
  const handleBranchSelect = useCallback(async (branchId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/branches/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, branchId }),
      });
      if (res.ok) {
        setUserSelectedBranchIds(prev => [...prev, branchId]);
        // Re-fetch branches to get weeks for newly selected branch
        const branchesRes = await fetch('/api/branches');
        if (branchesRes.ok) {
          const bData = await branchesRes.json();
          const branches = (bData.branches || []) as BranchInfo[];
          setAllBranches(branches);

          // Unlock the branch days
          setDayProgressMap(prev => {
            const next = new Map(prev);
            const branch = branches.find(b => b.id === branchId);
            if (branch) {
              for (const week of branch.weeks) {
                for (const day of week.days) {
                  next.set(day.id, 'active');
                }
              }
            }
            return next;
          });
        }
        setNeedsRefresh(prev => prev + 1);
      }
    } catch { /* silent */ }
  }, [user]);

  // Build interleaved display sections
  const displaySections = useMemo(() => {
    if (roadmaps.length === 0) return [];

    const roadmap = roadmaps[0];
    // Separate main weeks (no branchId) and shared weeks (sortOrder >= 100)
    const mainWeeks = roadmap.weeks
      .filter(w => !w.branchId && w.sortOrder < 100)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const sharedWeeks = roadmap.weeks
      .filter(w => !w.branchId && w.sortOrder >= 100)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // Find selected hobby and skill branches
    const hobbyBranches = allBranches.filter(b => b.branchType === 'hobby');
    const skillBranches = allBranches.filter(b => b.branchType === 'skill');

    const selectedHobby = hobbyBranches.find(b => userSelectedBranchIds.includes(b.id));
    const selectedSkill = skillBranches.find(b => userSelectedBranchIds.includes(b.id));

    const sections: DisplaySection[] = [];
    let weekIdx = 0;

    // Build a map for shared weeks by sortOrder
    const sharedBySort: Record<number, RoadmapWeek> = {};
    for (const sw of sharedWeeks) {
      sharedBySort[sw.sortOrder] = sw;
    }

    // Insert sections in order:
    // Main weeks 0-1 (weeks 1-2)
    for (let i = 0; i <= 1; i++) {
      if (mainWeeks[i]) {
        sections.push({ type: 'main-week', week: mainWeeks[i], weekIndex: weekIdx++ });
      }
    }

    // Branch selection + hobby branch weeks (after week 2)
    if (selectedHobby) {
      for (const bw of selectedHobby.weeks.sort((a, b) => a.sortOrder - b.sortOrder)) {
        sections.push({ type: 'branch-week', week: bw, branch: selectedHobby, weekIndex: weekIdx++ });
      }
    } else {
      sections.push({ type: 'branch-selection', branchType: 'hobby', requiredWeekIndex: 2 });
    }

    // Main weeks 2-3 (weeks 3-4)
    for (let i = 2; i <= 3; i++) {
      if (mainWeeks[i]) {
        sections.push({ type: 'main-week', week: mainWeeks[i], weekIndex: weekIdx++ });
      }
    }

    // Shared review "مراجعة نصف الطريق" (sortOrder=100, after week 4)
    if (sharedBySort[100]) {
      sections.push({ type: 'shared-week', week: sharedBySort[100], weekIndex: weekIdx++ });
    }

    // Main weeks 4-6 (weeks 5-7)
    for (let i = 4; i <= 6; i++) {
      if (mainWeeks[i]) {
        sections.push({ type: 'main-week', week: mainWeeks[i], weekIndex: weekIdx++ });
      }
    }

    // Branch selection + skill branch weeks (after week 7)
    if (selectedSkill) {
      for (const bw of selectedSkill.weeks.sort((a, b) => a.sortOrder - b.sortOrder)) {
        sections.push({ type: 'branch-week', week: bw, branch: selectedSkill, weekIndex: weekIdx++ });
      }
    } else {
      sections.push({ type: 'branch-selection', branchType: 'skill', requiredWeekIndex: 7 });
    }

    // Main weeks 7-9 (weeks 8-10)
    for (let i = 7; i <= 9; i++) {
      if (mainWeeks[i]) {
        sections.push({ type: 'main-week', week: mainWeeks[i], weekIndex: weekIdx++ });
      }
    }

    // Shared review "مراجعة قبل النهاية" (sortOrder=200, after week 10)
    if (sharedBySort[200]) {
      sections.push({ type: 'shared-week', week: sharedBySort[200], weekIndex: weekIdx++ });
    }

    // Main weeks 10-11 (weeks 11-12)
    for (let i = 10; i <= 11; i++) {
      if (mainWeeks[i]) {
        sections.push({ type: 'main-week', week: mainWeeks[i], weekIndex: weekIdx++ });
      }
    }

    // Shared "الأسبوع الأخير" (sortOrder=300, after week 12)
    if (sharedBySort[300]) {
      sections.push({ type: 'shared-week', week: sharedBySort[300], weekIndex: weekIdx++ });
    }

    return sections;
  }, [roadmaps, allBranches, userSelectedBranchIds]);

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

  const handleDayComplete = useCallback(async (dayId: string, _xp: number) => {
    setDayProgressMap(prev => {
      const next = new Map(prev);
      next.set(dayId, 'completed');

      // Activate next day: find it in displaySections order
      let found = false;
      for (const section of displaySections) {
        const week = section.type === 'branch-week' ? section.week
          : section.type === 'shared-week' ? section.week
          : section.week;

        for (let i = 0; i < week.days.length; i++) {
          if (week.days[i].id === dayId) {
            found = true;
            // Try next day in week
            if (i + 1 < week.days.length) {
              next.set(week.days[i + 1].id, 'active');
            } else {
              // Find next section with days
              // This is handled by the flat loop below
            }
            break;
          }
        }
        if (found) break;
      }

      // If the completed day was the last in its week, activate first day of next section
      if (found) {
        let activateNext = false;
        for (const section of displaySections) {
          if (section.type === 'branch-selection') continue;
          const week = section.type === 'branch-week' ? section.week
            : section.type === 'shared-week' ? section.week
            : section.week;

          for (const day of week.days) {
            if (day.id === dayId) {
              activateNext = true;
              continue;
            }
            if (activateNext && next.get(day.id) !== 'completed') {
              next.set(day.id, 'active');
              activateNext = false;
              break;
            }
          }
          if (!activateNext) break;
        }
      }

      return next;
    });

    refreshUser();
  }, [displaySections, refreshUser]);

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
    // Include branch days
    for (const branch of allBranches) {
      if (userSelectedBranchIds.includes(branch.id)) {
        for (const week of branch.weeks) {
          for (const day of week.days) {
            totalDays++;
            if (dayProgressMap.get(day.id) === 'completed') completedDays++;
          }
        }
      }
    }
    return { totalDays, completedDays, percent: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0 };
  }, [roadmaps, allBranches, userSelectedBranchIds, dayProgressMap]);

  if (!user) return null;
  if (isLoading) return <LoadingSkeleton />;

  return (
    <div dir="rtl" className="min-h-screen relative" style={{ background: '#0f1f2e' }}>
      {/* Gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(88,196,220,0.04)' }} />
        <motion.div animate={{ x: [0, -20, 0], y: [0, 25, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -left-32 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(255,200,0,0.03)' }} />
        <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 right-1/3 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(88,196,220,0.03)' }} />
      </div>

      <StickyHeader user={user} />

      {/* Overall progress banner */}
      {roadmaps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="px-4 mb-4">
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: 'linear-gradient(145deg, rgba(88,196,220,0.06), rgba(88,196,220,0.02))', border: '1px solid rgba(88,196,220,0.1)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))', border: '1.5px solid rgba(88,196,220,0.2)' }}>
              <Target className="w-6 h-6" style={{ color: '#58c4dc' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold mb-1" style={{ color: '#a3c4d0' }}>تقدمك الكلي</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(88,196,220,0.08)' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${overallStats.percent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to left, #58c4dc, #3a9bb5)' }} />
                </div>
                <span className="text-xs font-bold min-w-[40px] text-left" style={{ color: '#58c4dc' }}>{overallStats.percent}%</span>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4" style={{ color: '#58c4dc' }} />
            <h2 className="text-sm font-bold" style={{ color: '#58c4dc' }}>{roadmaps[0].title}</h2>
          </div>
          {roadmaps[0].description && (
            <p className="text-xs leading-relaxed" style={{ color: '#a3c4d0' }}>{roadmaps[0].description}</p>
          )}
        </motion.div>
      )}

      {/* Empty state */}
      {roadmaps.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: '#1a3347', border: '2px solid rgba(88,196,220,0.15)' }}>
            <Calendar className="w-10 h-10" style={{ color: '#5a7f8f' }} />
          </motion.div>
          <h3 className="text-lg font-extrabold mb-2" style={{ color: '#f8f5f0' }}>لا توجد مسارات حالياً</h3>
          <p className="text-sm text-center" style={{ color: '#a3c4d0' }}>المسارات هتتوفر قريب. استنى التحديث الجاي!</p>
        </div>
      )}

      {/* Display Sections (interleaved) */}
      <div className="px-4 pb-8">
        {displaySections.map((section, idx) => {
          if (section.type === 'main-week') {
            return (
              <WeekSection key={`main-${section.week.id}`} week={section.week} weekIndex={section.weekIndex}
                dayProgressMap={dayProgressMap} onDayClick={handleDayClick} />
            );
          }

          if (section.type === 'shared-week') {
            return (
              <WeekSection key={`shared-${section.week.id}`} week={section.week} weekIndex={section.weekIndex}
                dayProgressMap={dayProgressMap} onDayClick={handleDayClick} isShared />
            );
          }

          if (section.type === 'branch-week') {
            return (
              <BranchWeekSection key={`branch-${section.week.id}`} week={section.week} branch={section.branch}
                weekIndex={section.weekIndex} dayProgressMap={dayProgressMap} onDayClick={handleDayClick} />
            );
          }

          if (section.type === 'branch-selection') {
            const branchesForType = allBranches.filter(b => b.branchType === section.branchType);
            return (
              <BranchSelectionDivider key={`select-${section.branchType}`} branchType={section.branchType}
                branches={branchesForType} onSelect={handleBranchSelect}
                alreadySelected={userSelectedBranchIds.some(id =>
                  allBranches.find(b => b.id === id && b.branchType === section.branchType)
                )} />
            );
          }

          return null;
        })}
      </div>

      {/* Bottom navigation */}
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: 'spring', damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{ background: 'linear-gradient(to top, #0f1f2e 70%, transparent)', paddingTop: '24px' }}>
        <div className="px-4 pb-6 flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.12)', border: '1px solid rgba(88,196,220,0.2)' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#58c4dc' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#58c4dc' }}>الرود ماب</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.04)', border: '1px solid rgba(88,196,220,0.08)' }}>
              <Trophy className="w-5 h-5" style={{ color: '#5a7f8f' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>التقدم</span>
          </Link>
          <Link href="/shares" className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.12)' }}>
              <Star className="w-5 h-5" style={{ color: '#ffc800' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>المشاركات</span>
          </Link>
        </div>
      </motion.div>

      {/* Day Detail Sheet */}
      <DayDetailSheet day={selectedDay} userId={user.id} open={sheetOpen}
        onClose={() => { setSheetOpen(false); setTimeout(() => setSelectedDay(null), 300); }}
        onComplete={handleDayComplete} />
    </div>
  );
}
