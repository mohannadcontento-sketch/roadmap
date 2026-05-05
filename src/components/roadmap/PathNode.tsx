'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COLORS } from './types';
import type { RoadmapNode, BranchPath } from './types';

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
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const isDone = node.status === 'done';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';
  const isMilestone = node.status === 'milestone';

  const sizeClass = isMilestone ? 'w-[108px] h-[108px] sm:w-[130px] sm:h-[130px]' : 'w-[88px] h-[88px] sm:w-[104px] sm:h-[104px]';
  const iconSize = isMilestone ? 56 : 44;

  const getOffsetClass = () => {
    if (position === -1) return 'mr-auto ml-0 sm:ml-0';
    if (position === 1) return 'ml-auto mr-0 sm:mr-0';
    return 'mx-auto';
  };

  const borderColor = isDone
    ? `border-[${COLORS.success}]`
    : isActive
    ? `border-[${COLORS.primary}]`
    : isMilestone
    ? `border-[${COLORS.gold}]`
    : `border-[${COLORS.border}]`;

  const bgGradient = isDone
    ? `bg-gradient-to-br from-[${COLORS.success}]/30 via-[${COLORS.success}]/10 to-transparent`
    : isActive
    ? `bg-gradient-to-br from-[${COLORS.primary}]/30 via-[${COLORS.primary}]/10 to-transparent`
    : isMilestone
    ? `bg-gradient-to-br from-[${COLORS.gold}]/25 via-[${COLORS.gold}]/8 to-transparent`
    : `bg-[${COLORS.bgCard}]`;

  const glowShadow = isDone
    ? `shadow-[0_0_40px_rgba(78,205,196,0.3),0_0_80px_rgba(78,205,196,0.08)]`
    : isActive
    ? `shadow-[0_0_50px_rgba(115,179,206,0.35),0_0_100px_rgba(115,179,206,0.12)]`
    : isMilestone
    ? `shadow-[0_0_40px_rgba(232,185,49,0.25),0_0_80px_rgba(232,185,49,0.06)]`
    : '';

  const labelColor = isDone
    ? `text-[${COLORS.success}]`
    : isActive
    ? `text-[${COLORS.primary}]`
    : isMilestone
    ? `text-[${COLORS.gold}]`
    : `text-[${COLORS.textMuted}]`;

  const accentColor = isDone ? COLORS.success : isActive ? COLORS.primary : isMilestone ? COLORS.gold : COLORS.mid;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.7 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center gap-2.5 sm:gap-3 ${getOffsetClass()} relative z-10 w-full max-w-[340px] sm:max-w-[400px]`}
      onClick={() => onSelect?.(node)}
    >
      {/* Week badge */}
      {node.week && !isLocked && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-[10px] sm:text-[11px] font-mono tracking-widest font-medium mb-0.5"
          style={{ color: COLORS.textMuted }}
        >
          {node.week}
        </motion.span>
      )}

      {/* Main circle */}
      <motion.div
        whileHover={{ scale: isLocked ? 1 : 1.08 }}
        whileTap={{ scale: isLocked ? 1 : 0.94 }}
        className={`
          ${sizeClass} rounded-full flex items-center justify-center
          border-[3px] sm:border-[3.5px] relative cursor-pointer
          transition-all duration-300 overflow-hidden
          ${isLocked ? 'opacity-35 grayscale-[0.6]' : ''}
          ${isActive ? 'animate-activeGlow' : ''}
          ${isSelected ? 'ring-[3px] ring-white/10' : ''}
        `}
        style={{
          borderColor: isDone ? COLORS.success : isActive ? COLORS.primary : isMilestone ? COLORS.gold : COLORS.border,
          background: isDone
            ? `linear-gradient(135deg, ${COLORS.success}30, ${COLORS.success}08, transparent)`
            : isActive
            ? `linear-gradient(135deg, ${COLORS.primary}30, ${COLORS.primary}08, transparent)`
            : isMilestone
            ? `linear-gradient(135deg, ${COLORS.gold}25, ${COLORS.gold}08, transparent)`
            : COLORS.bgCard,
          boxShadow: isDone
            ? `0 0 40px ${COLORS.success}40, 0 0 80px ${COLORS.success}10`
            : isActive
            ? `0 0 50px ${COLORS.primary}45, 0 0 100px ${COLORS.primary}12`
            : isMilestone
            ? `0 0 40px ${COLORS.gold}35, 0 0 80px ${COLORS.gold}08`
            : 'none',
        }}
      >
        {/* Done checkmark */}
        {isDone && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.6 }}
            className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full 
                       flex items-center justify-center text-white text-xs sm:text-sm font-bold z-20"
            style={{
              backgroundColor: COLORS.success,
              border: `3px solid ${COLORS.bg}`,
              boxShadow: `0 2px 12px ${COLORS.success}50`,
            }}
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
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${COLORS.primary}50` }}
            />
            <motion.div
              animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
              className="absolute inset-0 rounded-full"
              style={{ border: `1px solid ${COLORS.primary}30` }}
            />
          </>
        )}

        {/* Milestone rotating ring */}
        {isMilestone && !isLocked && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full"
            style={{
              inset: -5,
              border: `1.5px dashed ${COLORS.gold}30`,
            }}
          />
        )}

        {/* 3D Icon */}
        <div className="relative z-[1] flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
          <Image
            src={node.icon}
            alt={node.label}
            width={iconSize}
            height={iconSize}
            className="object-contain drop-shadow-lg"
            priority={index < 3}
          />
        </div>
      </motion.div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span
          className="text-[13px] sm:text-[15px] font-bold leading-tight"
          style={{ color: isLocked ? COLORS.textMuted : accentColor }}
        >
          {node.label}
        </span>
        {node.subtitle && (
          <span className="text-[10px] sm:text-[11px] font-medium" style={{ color: COLORS.textMuted }}>
            {node.subtitle}
          </span>
        )}
      </div>

      {/* Tags */}
      {node.tags && node.tags.length > 0 && !isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-1.5 mt-1"
        >
          {node.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[9px] sm:text-[10px] px-2.5 py-[3px] rounded-full font-semibold"
              style={{
                background: `${accentColor}12`,
                color: accentColor,
                border: `1px solid ${accentColor}20`,
              }}
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
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 my-6 sm:my-10 w-full"
    >
      <div className="relative mx-auto max-w-[640px] sm:max-w-[740px]">
        {/* Outer glow */}
        <div
          className="absolute -inset-1 rounded-[28px] blur-sm"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.mid}08, transparent)` }}
        />

        <div
          className="relative backdrop-blur-xl rounded-3xl p-5 sm:p-8 overflow-hidden"
          style={{
            backgroundColor: `${COLORS.bg}ee`,
            border: `1px solid ${COLORS.primary}20`,
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-3 right-3 w-20 h-20 rounded-full" style={{ background: `${COLORS.primary}08` }} />
          <div className="absolute bottom-3 left-3 w-28 h-28 rounded-full" style={{ background: `${COLORS.mid}06` }} />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-center mb-5 sm:mb-7 relative z-10"
          >
            <h3 className="text-lg sm:text-xl font-bold" style={{ color: COLORS.light }}>
              اختار مسارك
            </h3>
            <p className="text-[11px] sm:text-xs mt-1" style={{ color: COLORS.textMuted }}>
              واحد من الخمسة — هويتك الجديدة تبدأ هنا
            </p>
          </motion.div>

          {/* Path cards */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 relative z-10">
            {paths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30, scale: 0.5 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onSelectPath?.(path)}
                className="flex flex-col items-center gap-2 sm:gap-2.5 cursor-pointer group"
              >
                <div
                  className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-2xl sm:rounded-2xl flex items-center justify-center
                             border-[2px] transition-all duration-300 relative overflow-hidden"
                  style={{
                    borderColor: `${path.color}50`,
                    background: `linear-gradient(135deg, ${path.color}15, ${path.color}06)`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ boxShadow: `0 0 25px ${path.color}25, inset 0 0 15px ${path.color}08` }}
                  />
                  <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10">
                    <Image
                      src={path.icon}
                      alt={path.label}
                      width={40}
                      height={40}
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>
                <span
                  className="text-[10px] sm:text-[12px] font-bold group-hover:text-white transition-colors"
                  style={{ color: `${path.color}cc` }}
                >
                  {path.label}
                </span>
                <span
                  className="text-[7px] sm:text-[9px] text-center leading-tight max-w-[60px] sm:max-w-[75px] hidden sm:block"
                  style={{ color: COLORS.textMuted }}
                >
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
  const isInView = useInView(ref, { once: true, margin: '-15px' });

  const lineColor = status === 'done'
    ? COLORS.success
    : status === 'active'
    ? COLORS.primary
    : COLORS.border;

  return (
    <div className="relative w-full flex justify-center" ref={ref}>
      <div className="absolute w-[1.5px] top-0 bottom-0" style={{ background: `${lineColor}15` }} />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`w-[3px] sm:w-[3.5px] ${height} rounded-full origin-top relative z-10`}
        style={{
          background: `linear-gradient(to bottom, ${lineColor}60, ${lineColor}15, ${lineColor}05)`,
        }}
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

  const accentColor = isDone ? COLORS.success : isActive ? COLORS.primary : isMilestone ? COLORS.gold : COLORS.mid;

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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: COLORS.bgLight,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {/* Accent top bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(to left, ${accentColor}, transparent)` }} />

          {/* Handle for mobile */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: `${COLORS.primary}30` }} />
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 pb-6 pt-1">
            <div className="flex items-start gap-4 mb-4">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}06)`,
                  border: `2px solid ${accentColor}30`,
                }}
              >
                <Image src={node.icon} alt={node.label} width={44} height={44} className="object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold leading-tight" style={{ color: COLORS.cream }}>{node.label}</h3>
                {node.subtitle && (
                  <p className="text-sm mt-0.5" style={{ color: COLORS.textSecondary }}>{node.subtitle}</p>
                )}
                {node.week && (
                  <span
                    className="inline-block mt-2 text-[10px] font-mono px-2.5 py-0.5 rounded-full"
                    style={{
                      background: `${accentColor}10`,
                      color: accentColor,
                      border: `1px solid ${accentColor}18`,
                    }}
                  >
                    {node.week}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 mt-1"
                style={{ background: `${COLORS.primary}10`, color: COLORS.textMuted }}
              >
                ✕
              </button>
            </div>

            {/* Character preview */}
            {node.character && !node.status.includes('locked') && (
              <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl" style={{ background: `${COLORS.bg}80` }}>
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={node.character} alt="character" width={40} height={40} className="object-contain" />
                </div>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {isDone ? 'وصال بتشجعك — كمل كده!' : isActive ? 'وصال مستنية تبدأ — اضغط ابدأ الآن!' : 'وصال معاك طول الرحلة!'}
                </p>
              </div>
            )}

            {node.description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.textSecondary }}>
                {node.description}
              </p>
            )}

            {node.tags && node.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {node.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-3 py-1.5 rounded-full font-semibold"
                    style={{
                      background: `${accentColor}10`,
                      color: accentColor,
                      border: `1px solid ${accentColor}18`,
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
                className="w-full mt-3 py-3.5 rounded-2xl font-bold text-sm transition-all"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                  color: COLORS.bg,
                  boxShadow: `0 4px 20px ${accentColor}30`,
                }}
              >
                ابدأ الآن ←
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
