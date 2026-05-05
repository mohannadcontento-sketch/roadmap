'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useMemo } from 'react';
import type { RoadmapNode, BranchPath, NodeStatus } from './types';

/* ────────────────────────────────────────
   PathNode - Individual circular node
   ──────────────────────────────────────── */
interface PathNodeProps {
  node: RoadmapNode;
  position: number;
  index: number;
  onSelect?: (node: RoadmapNode) => void;
  isSelected?: boolean;
}

export function PathNode({ node, position, index, onSelect, isSelected }: PathNodeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const isDone = node.status === 'done';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';
  const isMilestone = node.status === 'milestone';

  const sizeClass = isMilestone ? 'w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]' : 'w-[80px] h-[80px] sm:w-[96px] sm:h-[96px]';
  const emojiSize = isMilestone ? 'text-[40px] sm:text-[48px]' : 'text-[32px] sm:text-[40px]';

  const getOffsetClass = () => {
    if (position === -1) return 'mr-auto ml-0 sm:ml-0';
    if (position === 1) return 'ml-auto mr-0 sm:mr-0';
    return 'mx-auto';
  };

  const borderColor = isDone ? 'border-emerald-400/80' : isActive ? 'border-sky-400/80' : isMilestone ? 'border-amber-400/80' : 'border-white/[0.08]';
  const bgGradient = isDone
    ? 'bg-gradient-to-br from-emerald-400/25 via-emerald-500/10 to-transparent'
    : isActive
    ? 'bg-gradient-to-br from-sky-400/25 via-sky-500/10 to-transparent'
    : isMilestone
    ? 'bg-gradient-to-br from-amber-400/20 via-amber-500/8 to-transparent'
    : 'bg-gradient-to-br from-white/[0.04] to-white/[0.01]';

  const glowShadow = isDone
    ? 'shadow-[0_0_40px_rgba(52,211,153,0.35),0_0_80px_rgba(52,211,153,0.1)]'
    : isActive
    ? 'shadow-[0_0_50px_rgba(56,189,248,0.4),0_0_100px_rgba(56,189,248,0.15)]'
    : isMilestone
    ? 'shadow-[0_0_40px_rgba(251,191,36,0.3),0_0_80px_rgba(251,191,36,0.08)]'
    : '';

  const labelColor = isDone ? 'text-emerald-300' : isActive ? 'text-sky-300' : isMilestone ? 'text-amber-300' : 'text-gray-600';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.7 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center gap-2.5 sm:gap-3 ${getOffsetClass()} relative z-10 w-full max-w-[320px] sm:max-w-[380px]`}
      onClick={() => onSelect?.(node)}
    >
      {/* Week badge */}
      {node.week && !isLocked && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-[10px] sm:text-[11px] font-mono tracking-widest text-gray-500/70 mb-0.5"
        >
          {node.week}
        </motion.span>
      )}

      {/* Main circle */}
      <motion.div
        whileHover={{ scale: isLocked ? 1 : 1.1 }}
        whileTap={{ scale: isLocked ? 1 : 0.93 }}
        className={`
          ${sizeClass} ${emojiSize} ${bgGradient} ${borderColor} ${glowShadow}
          rounded-full flex items-center justify-center
          border-[3px] sm:border-4 relative cursor-pointer
          transition-colors duration-300
          ${isLocked ? 'opacity-40 grayscale-[0.5]' : ''}
          ${isActive ? 'animate-activeGlow' : ''}
          ${isSelected ? 'ring-[3px] ring-white/15' : ''}
        `}
      >
        {/* Done checkmark */}
        {isDone && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.6 }}
            className="absolute -top-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full 
                       bg-emerald-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold
                       border-[3px] border-[#0B1120] shadow-lg shadow-emerald-500/30"
          >
            ✓
          </motion.div>
        )}

        {/* Active ripple */}
        {isActive && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-sky-400/40"
            />
            <motion.div
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
              className="absolute inset-0 rounded-full border border-sky-400/25"
            />
          </>
        )}

        {/* Milestone ring */}
        {isMilestone && !isLocked && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-4px] sm:inset-[-5px] rounded-full 
                       border border-dashed border-amber-400/20"
          />
        )}

        <span className="relative z-[1] select-none">{node.emoji}</span>
      </motion.div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className={`text-[13px] sm:text-[15px] font-bold ${labelColor} leading-tight`}>
          {node.label}
        </span>
        {node.subtitle && (
          <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
            {node.subtitle}
          </span>
        )}
      </div>

      {/* Tags */}
      {node.tags && node.tags.length > 0 && !isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap justify-center gap-1.5 mt-1"
        >
          {node.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[9px] sm:text-[10px] px-2 py-[3px] rounded-full font-semibold
                         bg-white/[0.05] text-gray-400/80 border border-white/[0.06]
                         backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────
   BranchSection - Path selection area
   ──────────────────────────────────────── */
interface BranchSectionProps {
  paths: BranchPath[];
  onSelectPath?: (path: BranchPath) => void;
}

export function BranchSection({ paths, onSelectPath }: BranchSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 my-6 sm:my-10 w-full"
    >
      <div className="relative mx-auto max-w-[620px] sm:max-w-[720px]">
        {/* Outer glow */}
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-sm" />

        <div className="relative bg-[#0f1628]/90 backdrop-blur-xl border border-violet-400/[0.15] rounded-3xl p-5 sm:p-8 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-3 right-3 w-16 h-16 rounded-full bg-violet-500/[0.06]" />
          <div className="absolute bottom-3 left-3 w-24 h-24 rounded-full bg-violet-500/[0.04]" />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="text-center mb-5 sm:mb-7 relative z-10"
          >
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-l from-violet-300 to-purple-300 bg-clip-text text-transparent">
              🗺️ اختار مسارك
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">واحد من الخمسة — هويتك الجديدة تبدأ هنا</p>
          </motion.div>

          {/* Path circles */}
          <div className="flex justify-center gap-3 sm:gap-5 relative z-10">
            {paths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 35, scale: 0.5 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.35 + i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
                whileHover={{ scale: 1.12, y: -6 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSelectPath?.(path)}
                className="flex flex-col items-center gap-2 sm:gap-2.5 cursor-pointer group"
              >
                <div
                  className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] rounded-full flex items-center justify-center
                             text-[24px] sm:text-[28px] border-[2.5px] sm:border-3 transition-all duration-300
                             relative overflow-hidden"
                  style={{
                    borderColor: path.color + '60',
                    background: `linear-gradient(135deg, ${path.color}18, ${path.color}06)`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `0 0 30px ${path.color}30, inset 0 0 20px ${path.color}10` }}
                  />
                  <span className="relative z-10 select-none">{path.emoji}</span>
                </div>
                <span className="text-[11px] sm:text-[13px] font-bold text-gray-300 group-hover:text-white transition-colors">
                  {path.label}
                </span>
                <span className="text-[8px] sm:text-[9px] text-gray-600 text-center leading-tight max-w-[70px] sm:max-w-[80px]">
                  {path.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   Connector - Line between nodes
   ──────────────────────────────────────── */
interface ConnectorProps {
  status: 'done' | 'active' | 'locked';
  height?: string;
}

export function Connector({ status, height = 'h-8 sm:h-14' }: ConnectorProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  const gradientClass = status === 'done'
    ? 'bg-gradient-to-b from-emerald-400/50 via-emerald-400/30 to-emerald-400/10'
    : status === 'active'
    ? 'bg-gradient-to-b from-sky-400/40 via-sky-400/20 to-sky-400/8'
    : 'bg-gradient-to-b from-white/[0.05] to-white/[0.02]';

  return (
    <div className="relative w-full flex justify-center" ref={ref}>
      {/* Dotted background line */}
      <div className="absolute w-[2px] top-0 bottom-0 bg-white/[0.03]" />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`w-[3px] sm:w-[4px] ${height} ${gradientClass} rounded-full origin-top relative z-10`}
      />
    </div>
  );
}

/* ────────────────────────────────────────
   NodeDetail - Bottom sheet modal
   ──────────────────────────────────────── */
interface NodeDetailProps {
  node: RoadmapNode;
  onClose: () => void;
}

export function NodeDetail({ node, onClose }: NodeDetailProps) {
  const isDone = node.status === 'done';
  const isActive = node.status === 'active';
  const isMilestone = node.status === 'milestone';

  const accentColor = isDone ? '#34d399' : isActive ? '#38bdf8' : isMilestone ? '#fbbf24' : '#6b7280';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#151d30] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Accent top bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }} />

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
                  border: `2px solid ${accentColor}40`,
                }}
              >
                {node.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white leading-tight">{node.label}</h3>
                {node.subtitle && (
                  <p className="text-sm text-gray-400 mt-0.5">{node.subtitle}</p>
                )}
                {node.week && (
                  <span
                    className="inline-block mt-2 text-[10px] font-mono px-2.5 py-0.5 rounded-full"
                    style={{
                      background: `${accentColor}12`,
                      color: accentColor,
                      border: `1px solid ${accentColor}20`,
                    }}
                  >
                    {node.week}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-gray-500 
                           hover:text-white hover:bg-white/[0.12] transition-all flex-shrink-0 mt-1"
              >
                ✕
              </button>
            </div>

            {node.description && (
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{node.description}</p>
            )}

            {node.tags && node.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {node.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-3 py-1.5 rounded-full font-semibold"
                    style={{
                      background: `${accentColor}10`,
                      color: accentColor,
                      border: `1px solid ${accentColor}20`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action button */}
            {isActive && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-5 py-3 rounded-2xl font-bold text-sm text-white transition-all"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  boxShadow: `0 4px 20px ${accentColor}30`,
                }}
              >
                ابدأ الآن →
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
