'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Play, BookOpen, Gamepad2, CheckCircle2, Star, Loader2, Volume2 } from 'lucide-react';

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
export interface ContentItem {
  id: string;
  type: 'youtube_reel' | 'game_challenge' | 'article' | 'task';
  title: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  xpReward: number;
  sortOrder: number;
  settings?: string | null;
}

export interface DayData {
  id: string;
  title: string;
  description?: string | null;
  xpReward: number;
  icon?: string | null;
  content: ContentItem[];
  status?: 'locked' | 'active' | 'completed';
}

interface DayDetailSheetProps {
  day: DayData | null;
  userId: string;
  open: boolean;
  onClose: () => void;
  onComplete?: (dayId: string, xp: number) => void;
}

/* ═══════════════════════════════════════
   Content Item Renderers
   ═══════════════════════════════════════ */
function YoutubeReelItem({ item }: { item: ContentItem }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = item.url
    ? item.url.replace('watch?v=', 'embed/').replace('/shorts/', '/embed/')
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1a3347, #162d40)',
        border: '1px solid rgba(88,196,220,0.12)',
      }}
    >
      {/* Thumbnail / Player */}
      <div className="relative aspect-video w-full rounded-t-2xl overflow-hidden bg-[#0f1f2e]">
        {embedUrl && playing ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => embedUrl && setPlaying(true)}
            className="w-full h-full flex items-center justify-center gap-3 group"
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #ff4b4b, #cc3333)',
                  boxShadow: '0 4px 20px rgba(255,75,75,0.4)',
                }}
              >
                <Play className="w-6 h-6 text-white mr-[-2px]" fill="white" />
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-bold" style={{ color: '#f8f5f0' }}>{item.title}</h4>
        {item.description && (
          <p className="text-xs mt-1 leading-relaxed" style={{ color: '#a3c4d0' }}>
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <Star className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
          <span className="text-xs font-bold" style={{ color: '#ffc800' }}>+{item.xpReward} XP</span>
        </div>
      </div>
    </motion.div>
  );
}

function GameChallengeItem({ item }: { item: ContentItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(145deg, #1a3347, #162d40)',
        border: '1px solid rgba(255,200,0,0.15)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,200,0,0.2), rgba(255,200,0,0.05))',
            border: '1px solid rgba(255,200,0,0.2)',
          }}
        >
          <Gamepad2 className="w-5 h-5" style={{ color: '#ffc800' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold" style={{ color: '#f8f5f0' }}>{item.title}</h4>
          {item.description && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#a3c4d0' }}>
              {item.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
          <span className="text-xs font-bold" style={{ color: '#ffc800' }}>+{item.xpReward} XP</span>
        </div>
        <span
          className="text-[10px] px-2.5 py-1 rounded-full font-bold"
          style={{
            background: 'rgba(255,200,0,0.1)',
            color: '#ffc800',
            border: '1px solid rgba(255,200,0,0.2)',
          }}
        >
          تحدي
        </span>
      </div>
    </motion.div>
  );
}

function ArticleItem({ item }: { item: ContentItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1a3347, #162d40)',
        border: '1px solid rgba(88,196,220,0.12)',
      }}
    >
      {item.imageUrl && (
        <div className="relative aspect-[2/1] w-full">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: 'linear-gradient(135deg, rgba(88,196,220,0.2), rgba(88,196,220,0.05))',
              border: '1px solid rgba(88,196,220,0.2)',
            }}
          >
            <BookOpen className="w-4.5 h-4.5" style={{ color: '#58c4dc' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold" style={{ color: '#f8f5f0' }}>{item.title}</h4>
            {item.description && (
              <>
                <p
                  className="text-xs mt-1.5 leading-relaxed"
                  style={{ color: '#a3c4d0' }}
                >
                  {expanded || item.description.length <= 120
                    ? item.description
                    : item.description.slice(0, 120) + '...'}
                </p>
                {item.description.length > 120 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs font-bold mt-1"
                    style={{ color: '#58c4dc' }}
                  >
                    {expanded ? 'عرض أقل' : 'اقرأ المزيد'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <Star className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
          <span className="text-xs font-bold" style={{ color: '#ffc800' }}>+{item.xpReward} XP</span>
        </div>
      </div>
    </motion.div>
  );
}

function TaskItem({ item }: { item: ContentItem }) {
  const [done, setDone] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: done
          ? 'linear-gradient(145deg, rgba(88,204,2,0.1), rgba(88,204,2,0.03))'
          : 'linear-gradient(145deg, #1a3347, #162d40)',
        border: done
          ? '1px solid rgba(88,204,2,0.25)'
          : '1px solid rgba(88,196,220,0.12)',
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => setDone(!done)}
          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: done ? '#58cc02' : 'rgba(88,196,220,0.3)',
            background: done ? '#58cc02' : 'transparent',
          }}
        >
          {done && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-bold"
            style={{ color: done ? '#58cc02' : '#f8f5f0', textDecoration: done ? 'line-through' : 'none' }}
          >
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: done ? '#5a7f8f' : '#a3c4d0' }}>
              {item.description}
            </p>
          )}
        </div>
      </div>
      {!done && (
        <div className="flex items-center gap-1.5 mt-3 mr-9">
          <Star className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
          <span className="text-xs font-bold" style={{ color: '#ffc800' }}>+{item.xpReward} XP</span>
        </div>
      )}
      {done && (
        <div className="flex items-center gap-1.5 mt-2 mr-9">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#58cc02' }} />
          <span className="text-xs font-bold" style={{ color: '#58cc02' }}>تم!</span>
        </div>
      )}
    </motion.div>
  );
}

function ContentItemRenderer({ item, index }: { item: ContentItem; index: number }) {
  return (
    <div>
      {item.audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-3"
        >
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: 'linear-gradient(145deg, rgba(88,196,220,0.08), rgba(88,196,220,0.02))',
              border: '1px solid rgba(88,196,220,0.12)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(88,196,220,0.15)' }}
            >
              <Volume2 className="w-4 h-4" style={{ color: '#58c4dc' }} />
            </div>
            <audio controls src={item.audioUrl} className="flex-1 h-8" preload="none" />
          </div>
        </motion.div>
      )}
      {(() => {
        switch (item.type) {
          case 'youtube_reel':
            return <YoutubeReelItem key={item.id} item={item} />;
          case 'game_challenge':
            return <GameChallengeItem key={item.id} item={item} />;
          case 'article':
            return <ArticleItem key={item.id} item={item} />;
          case 'task':
            return <TaskItem key={item.id} item={item} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

/* ═══════════════════════════════════════
   XP Earned Animation
   ═══════════════════════════════════════ */
function XpAnimation({ xp, show }: { xp: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl sm:text-7xl"
            >
              ⭐
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-8 py-4 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,200,0,0.2), rgba(255,200,0,0.05))',
                border: '2px solid rgba(255,200,0,0.3)',
                boxShadow: '0 8px 40px rgba(255,200,0,0.3)',
              }}
            >
              <p className="text-3xl font-extrabold" style={{ color: '#ffc800' }}>+{xp}</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: '#ffc800' }}>XP مكتسب! 🎉</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════
   DayDetailSheet Component
   ═══════════════════════════════════════ */
export default function DayDetailSheet({ day, userId, open, onClose, onComplete }: DayDetailSheetProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showXpAnim, setShowXpAnim] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = useCallback(async () => {
    if (!day || isCompleting || completed) return;
    setIsCompleting(true);

    try {
      const res = await fetch(`/api/progress/${userId}/day/${day.id}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCompleted(true);
        setShowXpAnim(true);
        onComplete?.(day.id, data.xpAwarded || day.xpReward);

        setTimeout(() => {
          setShowXpAnim(false);
          setTimeout(() => {
            onClose();
            setCompleted(false);
          }, 300);
        }, 2500);
      }
    } catch {
      // silent fail
    } finally {
      setIsCompleting(false);
    }
  }, [day, userId, isCompleting, completed, onComplete, onClose]);

  if (!day) return null;

  const isCompleted = day.status === 'completed' || completed;

  return (
    <>
      <XpAnimation xp={day.xpReward} show={showXpAnim} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={onClose}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg mx-0 sm:mx-4 mb-0 sm:mb-0 rounded-t-3xl sm:rounded-3xl overflow-hidden"
              style={{
                backgroundColor: '#162d40',
                border: '1px solid rgba(88,196,220,0.15)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
                maxHeight: '90vh',
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: 'linear-gradient(to left, #ffc800, #ffc80040, transparent)',
                }}
              />

              {/* Mobile handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(90,127,143,0.4)' }} />
              </div>

              {/* Content */}
              <div className="px-5 sm:px-6 pb-6 pt-2 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Day icon */}
                    {day.icon ? (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          background: 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
                          border: '1.5px solid rgba(88,196,220,0.2)',
                        }}
                      >
                        <Image src={day.icon} alt={day.title} width={40} height={40} className="object-contain" />
                      </div>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
                          border: '1.5px solid rgba(88,196,220,0.2)',
                        }}
                      >
                        <span className="text-lg">📅</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg font-extrabold leading-tight" style={{ color: '#f8f5f0' }}>
                        {day.title}
                      </h3>
                      {day.description && (
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#a3c4d0' }}>
                          {day.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 hover:bg-white/5 transition-all"
                    style={{ color: '#5a7f8f' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* XP Badge */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl mb-5"
                  style={{
                    background: 'rgba(255,200,0,0.08)',
                    border: '1px solid rgba(255,200,0,0.15)',
                  }}
                >
                  <Star className="w-4 h-4" style={{ color: '#ffc800' }} />
                  <span className="text-xs font-bold" style={{ color: '#ffc800' }}>
                    مكافأة: +{day.xpReward} XP
                  </span>
                </div>

                {/* Content items */}
                <div className="space-y-3 mb-6">
                  {day.content && day.content.length > 0 ? (
                    day.content
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((item, index) => (
                        <ContentItemRenderer key={item.id} item={item} index={index} />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: '#5a7f8f' }}>
                        لا يوجد محتوى لهذا اليوم بعد
                      </p>
                    </div>
                  )}
                </div>

                {/* Complete button */}
                {!isCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2"
                    style={{
                      background: isCompleting
                        ? 'linear-gradient(135deg, #508992, #3a6b75)'
                        : 'linear-gradient(135deg, #ffc800, #cc9f00)',
                      color: '#0f1f2e',
                      boxShadow: isCompleting ? 'none' : '0 6px 25px rgba(255,200,0,0.35)',
                      border: '2px solid rgba(255,224,102,0.3)',
                    }}
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جارٍ الإكمال...</span>
                      </>
                    ) : (
                      <span>أكمل اليوم ✨</span>
                    )}
                  </motion.button>
                )}

                {isCompleted && (
                  <div
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl"
                    style={{
                      background: 'rgba(88,204,2,0.08)',
                      border: '1px solid rgba(88,204,2,0.2)',
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#58cc02' }} />
                    <span className="text-sm font-bold" style={{ color: '#58cc02' }}>تم إكمال هذا اليوم! 🎉</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
