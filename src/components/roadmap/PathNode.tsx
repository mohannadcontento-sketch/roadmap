'use client';

import { motion, useInView } from 'framer-motion';
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const isDone = node.status === 'done';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';
  const isMilestone = node.status === 'milestone';

  const sizeClass = isMilestone ? 'w-[112px] h-[112px] sm:w-[136px] sm:h-[136px]' : 'w-[92px] h-[92px] sm:w-[108px] sm:h-[108px]';
  const iconSize = isMilestone ? 60 : 46;

  const getOffsetClass = () => {
    if (position === -1) return 'mr-auto ml-0 sm:ml-0';
    if (position === 1) return 'ml-auto mr-0 sm:mr-0';
    return 'mx-auto';
  };

  const accentColor = isDone ? COLORS.success : isActive ? COLORS.gold : isMilestone ? COLORS.gold : COLORS.mid;

  const getNodeBg = () => {
    if (isDone) return `linear-gradient(145deg, ${COLORS.successDark}cc, ${COLORS.bgCard})`;
    if (isActive) return `linear-gradient(145deg, ${COLORS.goldDark}cc, ${COLORS.bgCard})`;
    if (isMilestone) return `linear-gradient(145deg, ${COLORS.gold}99, ${COLORS.bgCard})`;
    return `linear-gradient(145deg, ${COLORS.bgCardHover}, ${COLORS.lockedBg})`;
  };

  const getNodeBorder = () => {
    if (isDone) return COLORS.success;
    if (isActive) return COLORS.gold;
    if (isMilestone) return COLORS.goldLight;
    return COLORS.lockedBorder;
  };

  const getGlow = () => {
    if (isDone) return `0 0 30px ${COLORS.success}40, 0 0 60px ${COLORS.success}15, 0 8px 25px ${COLORS.nodeShadow}`;
    if (isActive) return `0 0 35px ${COLORS.gold}50, 0 0 70px ${COLORS.gold}20, 0 8px 25px ${COLORS.nodeShadow}`;
    if (isMilestone) return `0 0 30px ${COLORS.gold}35, 0 0 60px ${COLORS.gold}10, 0 8px 25px ${COLORS.nodeShadow}`;
    return `0 4px 15px ${COLORS.nodeShadow}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.6 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center gap-2 sm:gap-3 ${getOffsetClass()} relative z-10 w-full max-w-[360px] sm:max-w-[420px]`}
      onClick={() => onSelect?.(node)}
    >
      {/* Week badge */}
      {node.week && !isLocked && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-[10px] sm:text-[11px] font-mono tracking-widest font-semibold mb-0.5 px-3 py-0.5 rounded-full"
          style={{
            color: accentColor,
            background: `${accentColor}12`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          {node.week}
        </motion.span>
      )}

      {/* Main circle with outer ring */}
      <div className="relative">
        {/* Outer decorative ring for active/milestone */}
        {(isActive || isMilestone) && (
          <motion.div
            animate={isActive
              ? { scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }
              : { rotate: 360 }
            }
            transition={isActive
              ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 25, repeat: Infinity, ease: 'linear' }
            }
            className={`absolute rounded-full ${isMilestone ? 'border-dashed' : ''}`}
            style={{
              inset: isMilestone ? -8 : -6,
              border: `2px solid ${accentColor}30`,
            }}
          />
        )}

        {/* Main node circle */}
        <motion.div
          whileHover={{ scale: isLocked ? 1 : 1.06, y: isLocked ? 0 : -4 }}
          whileTap={{ scale: isLocked ? 1 : 0.95 }}
          className={`
            ${sizeClass} rounded-full flex items-center justify-center
            border-[3.5px] sm:border-4 relative cursor-pointer
            transition-all duration-300
            ${isLocked ? 'opacity-40 grayscale-[0.5]' : ''}
          `}
          style={{
            borderColor: isSelected ? accentColor : getNodeBorder(),
            background: getNodeBg(),
            boxShadow: isSelected
              ? `0 0 0 3px ${COLORS.bg}, 0 0 0 5px ${accentColor}, 0 0 30px ${accentColor}40`
              : getGlow(),
          }}
        >
          {/* Inner gradient overlay */}
          <div
            className="absolute inset-[2px] rounded-full"
            style={{
              background: isLocked
                ? `linear-gradient(145deg, ${COLORS.lockedBg}, ${COLORS.bg})`
                : `linear-gradient(145deg, transparent 40%, rgba(0,0,0,0.15))`,
            }}
          />

          {/* Done checkmark badge */}
          {isDone && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.7 }}
              className="absolute -top-1.5 -right-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full 
                         flex items-center justify-center text-white z-20"
              style={{
                background: `linear-gradient(135deg, ${COLORS.success}, ${COLORS.successDark})`,
                border: `3px solid ${COLORS.bg}`,
                boxShadow: `0 3px 12px ${COLORS.success}60`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}

          {/* Active pulse rings */}
          {isActive && (
            <>
              <motion.div
                animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full"
                style={{ border: `2.5px solid ${COLORS.gold}40` }}
              />
              <motion.div
                animate={{ scale: [1, 1.25], opacity: [0.3, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
                className="absolute inset-0 rounded-full"
                style={{ border: `1.5px solid ${COLORS.gold}25` }}
              />
            </>
          )}

          {/* Lock icon overlay */}
          {isLocked && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center z-10"
              style={{ background: 'rgba(15, 31, 46, 0.5)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke={COLORS.textMuted} strokeWidth="2"/>
                <path d="M8 11V7a4 4 0 018 0v4" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}

          {/* 3D Icon */}
          <div className="relative z-[2] flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
            <Image
              src={node.icon}
              alt={node.label}
              width={iconSize}
              height={iconSize}
              className={`object-contain ${isLocked ? 'opacity-50 grayscale-[0.3]' : 'drop-shadow-lg'}`}
              priority={index < 3}
            />
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span
          className="text-[14px] sm:text-[16px] font-extrabold leading-tight tracking-tight"
          style={{ color: isLocked ? COLORS.textMuted : COLORS.cream }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-1.5 mt-1"
        >
          {node.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="text-[9px] sm:text-[10px] px-2.5 py-[3px] rounded-full font-semibold"
              style={{
                background: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}25`,
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 my-8 sm:my-12 w-full"
    >
      <div className="relative mx-auto max-w-[660px] sm:max-w-[760px]">
        {/* Outer glow border */}
        <div
          className="absolute -inset-[2px] rounded-[28px]"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}30, ${COLORS.gold}15, ${COLORS.mid}10, transparent)` }}
        />

        <div
          className="relative backdrop-blur-2xl rounded-3xl p-5 sm:p-8 overflow-hidden"
          style={{
            backgroundColor: `${COLORS.bg}f5`,
            border: `1px solid ${COLORS.primary}18`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 ${COLORS.primary}08`,
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: `${COLORS.primary}06` }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-2xl" style={{ background: `${COLORS.gold}04` }} />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="text-center mb-6 sm:mb-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
              style={{ background: `${COLORS.gold}10`, border: `1px solid ${COLORS.gold}20` }}>
              <span className="text-[11px]">🌟</span>
              <span className="text-[11px] sm:text-xs font-bold" style={{ color: COLORS.gold }}>اختار هويتك الجديدة</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: COLORS.cream }}>
              اختار مسارك
            </h3>
            <p className="text-[11px] sm:text-xs mt-1.5 font-medium" style={{ color: COLORS.textMuted }}>
              واحد من الخمسة مسارات — هويتك الجديدة تبدأ هنا
            </p>
          </motion.div>

          {/* Path cards - scrollable on mobile */}
          <div className="flex sm:grid sm:grid-cols-5 gap-2.5 sm:gap-4 relative z-10 overflow-x-auto pb-2 sm:pb-0 snap-x snap-mandatory
                        px-1 sm:px-0 -mx-1 sm:mx-0 scrollbar-hide justify-start sm:justify-center">
            {paths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 35, scale: 0.4 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.35 + i * 0.08, type: 'spring', stiffness: 180, damping: 16 }}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onSelectPath?.(path)}
                className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group snap-center min-w-[100px] sm:min-w-0 flex-shrink-0"
              >
                <div
                  className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-[18px] sm:rounded-2xl flex items-center justify-center
                             border-[2.5px] transition-all duration-300 relative overflow-hidden"
                  style={{
                    borderColor: `${path.color}50`,
                    background: `linear-gradient(145deg, ${path.color}18, ${path.color}08)`,
                    boxShadow: `0 4px 15px ${path.color}10`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[18px] sm:rounded-2xl"
                    style={{
                      background: `linear-gradient(145deg, ${path.color}25, ${path.color}10)`,
                      boxShadow: `0 0 30px ${path.color}20, inset 0 0 20px ${path.color}08`,
                    }}
                  />
                  <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12">
                    <Image
                      src={path.icon}
                      alt={path.label}
                      width={48}
                      height={48}
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="text-[11px] sm:text-[13px] font-bold group-hover:text-white transition-colors"
                    style={{ color: `${path.color}dd` }}
                  >
                    {path.label}
                  </span>
                  <span
                    className="text-[8px] sm:text-[9px] text-center leading-tight max-w-[85px] sm:max-w-[80px] hidden sm:block"
                    style={{ color: COLORS.textMuted }}
                  >
                    {path.description}
                  </span>
                </div>
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15px' });

  const lineColor = status === 'done'
    ? COLORS.success
    : status === 'active'
    ? COLORS.gold
    : COLORS.border;

  return (
    <div className="relative w-full flex justify-center" ref={ref}>
      {/* Background track */}
      <div className="absolute w-[2px] top-0 bottom-0" style={{ background: `${lineColor}10` }} />
      {/* Animated line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`w-[3.5px] sm:w-[4px] ${height} rounded-full origin-top relative z-10`}
        style={{
          background: `linear-gradient(to bottom, ${lineColor}70, ${lineColor}20, ${lineColor}08)`,
        }}
      />
      {/* Glow dot at midpoint */}
      {!status.includes('locked') && isInView && (
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-20"
          style={{
            background: lineColor,
            boxShadow: `0 0 8px ${lineColor}60`,
          }}
        />
      )}
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

  const accentColor = isDone ? COLORS.success : isActive ? COLORS.gold : isMilestone ? COLORS.gold : COLORS.mid;

  return (
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md mx-0 sm:mx-4 mb-0 sm:mb-0 rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{
            backgroundColor: COLORS.bgLight,
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 -8px 40px rgba(0,0,0,0.4)`,
            maxHeight: '85vh',
          }}
        >
          {/* Accent top bar */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(to left, ${accentColor}, ${accentColor}40, transparent)` }} />

          {/* Handle for mobile */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: `${COLORS.textMuted}40` }} />
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 pb-8 pt-2 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 40px)' }}>
            <div className="flex items-start gap-4 mb-5">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${accentColor}20, ${accentColor}08)`,
                  border: `2px solid ${accentColor}35`,
                  boxShadow: `0 4px 15px ${accentColor}15`,
                }}
              >
                <Image src={node.icon} alt={node.label} width={48} height={48} className="object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-extrabold leading-tight" style={{ color: COLORS.cream }}>{node.label}</h3>
                {node.subtitle && (
                  <p className="text-sm mt-1 font-medium" style={{ color: COLORS.textSecondary }}>{node.subtitle}</p>
                )}
                {node.week && (
                  <span
                    className="inline-block mt-2 text-[10px] font-mono px-3 py-1 rounded-full font-bold"
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
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 mt-1 hover:bg-white/5"
                style={{ color: COLORS.textMuted }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Character preview */}
            {node.character && node.status !== 'locked' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3 mb-5 p-3.5 rounded-2xl"
                style={{ background: `${COLORS.bg}cc`, border: `1px solid ${COLORS.border}` }}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={node.character} alt="character" width={48} height={48} className="object-contain" />
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: COLORS.textSecondary }}>
                  {isDone ? 'وصال بتشجعك — كمل كده!' : isActive ? 'وصال مستنية تبدأ — اضغط ابدأ الآن!' : 'وصال معاك طول الرحلة!'}
                </p>
              </motion.div>
            )}

            {node.description && (
              <p className="text-sm leading-relaxed mb-5 font-medium" style={{ color: COLORS.textSecondary }}>
                {node.description}
              </p>
            )}

            {node.tags && node.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
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
                className="w-full mt-4 py-4 rounded-2xl font-extrabold text-sm transition-all"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                  color: COLORS.bg,
                  boxShadow: `0 6px 25px ${COLORS.gold}35`,
                  border: `2px solid ${COLORS.goldLight}30`,
                }}
              >
                ابدأ الآن
              </motion.button>
            )}

            {isDone && (
              <div className="flex items-center justify-center gap-2 mt-4 py-3 rounded-2xl"
                style={{ background: `${COLORS.success}10`, border: `1px solid ${COLORS.success}20` }}>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke={COLORS.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-bold" style={{ color: COLORS.success }}>تم الإكمال</span>
              </div>
            )}
          </div>
        </motion.div>
    </motion.div>
  );
}
