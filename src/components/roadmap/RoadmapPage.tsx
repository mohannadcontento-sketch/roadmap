'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PathNode, BranchSection, Connector, NodeDetail } from './PathNode';
import { ROADMAP_DATA, BRANCH_PATHS, NODE_POSITIONS, COLORS } from './types';
import type { RoadmapNode, BranchPath } from './types';
import { useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';

/* ── Confetti particle ── */
function ConfettiPiece({ delay, color, left }: { delay: number; color: string; left: number }) {
  const xEnd = (Math.random() - 0.5) * 100;
  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 30, 65, 100],
        x: [0, xEnd * 0.4, xEnd * 0.7, xEnd],
        opacity: [1, 1, 0.4, 0],
        rotate: [0, 200, 400, 600],
      }}
      transition={{ duration: 3, delay, ease: 'easeOut' }}
      className="absolute w-2.5 h-2.5 rounded-sm top-0"
      style={{ backgroundColor: color, left: `${left}%` }}
    />
  );
}

export default function RoadmapPage() {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<BranchPath | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end end'],
  });

  const headerBg = useTransform(scrollYProgress, [0, 0.02], [`${COLORS.bg}00`, `${COLORS.bg}f5`]);

  // Stable star positions
  const stars = useMemo(() =>
    Array.from({ length: 40 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.6,
      duration: Math.random() * 5 + 2,
      delay: Math.random() * 5,
      baseOpacity: Math.random() * 0.2 + 0.03,
    })),
  []);

  const confettiColors = [COLORS.gold, COLORS.success, COLORS.primary, COLORS.goldLight, '#fb923c', '#ff6b6b', COLORS.primaryLight];

  // Stable confetti positions (computed once per burst)
  const confettiPositions = useMemo(() =>
    Array.from({ length: 15 }).map(() => 25 + Math.random() * 50),
  []);

  const handlePathSelect = useCallback((path: BranchPath) => {
    setSelectedPath(path);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  }, []);

  const renderNodes = () => {
    const elements: React.ReactNode[] = [];
    const branchAfter = 2;

    ROADMAP_DATA.forEach((node, i) => {
      if (i > 0) {
        const prevStatus = ROADMAP_DATA[i - 1].status;
        const connectorStatus = prevStatus === 'done' ? 'done' : prevStatus === 'active' ? 'active' : 'locked';
        elements.push(
          <div key={`conn-wrapper-${i}`} className="w-full flex justify-center">
            <Connector key={`conn-${i}`} status={connectorStatus} />
          </div>
        );
      }

      elements.push(
        <PathNode
          key={node.id}
          node={node}
          position={NODE_POSITIONS[i] || 0}
          index={i}
          onSelect={setSelectedNode}
          isSelected={selectedNode?.id === node.id}
        />
      );

      if (i === branchAfter) {
        elements.push(
          <BranchSection
            key="branch"
            paths={BRANCH_PATHS}
            onSelectPath={handlePathSelect}
          />
        );
        elements.push(
          <div key="conn-branch-wrapper" className="w-full flex justify-center">
            <Connector key="conn-branch" status="active" height="h-6 sm:h-10" />
          </div>
        );
      }
    });

    return elements;
  };

  return (
    <div className="relative min-h-screen overflow-hidden" dir="rtl" style={{ backgroundColor: COLORS.bg }}>
      {/* ═══════ Background ═══════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs - more subtle and atmospheric */}
        <motion.div
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 right-[5%] w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: `${COLORS.primary}06` }}
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[35%] left-[0%] w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: `${COLORS.mid}04` }}
        />
        <motion.div
          animate={{ x: [0, 25, -15, 0], y: [0, 15, -20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[65%] right-[15%] w-[450px] h-[450px] rounded-full blur-[90px]"
          style={{ background: `${COLORS.dark}08` }}
        />
        <motion.div
          animate={{ x: [0, -20, 25, 0], y: [0, -15, 25, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] left-[25%] w-[600px] h-[400px] rounded-full blur-[120px]"
          style={{ background: `${COLORS.gold}03` }}
        />

        {/* Stars */}
        {stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              backgroundColor: COLORS.light,
            }}
            animate={{
              opacity: [star.baseOpacity, star.baseOpacity + 0.15, star.baseOpacity],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ═══════ Content ═══════ */}
      <div className="relative z-10" ref={mainRef}>
        {/* ── Sticky Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="sticky top-0 z-40 backdrop-blur-2xl"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
            {/* Logo + Mascot */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <motion.div
                whileHover={{ scale: 1.08, rotate: [-3, 3, 0] }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex-shrink-0 overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${COLORS.primary}25, ${COLORS.dark}30)`,
                  border: `2px solid ${COLORS.primary}30`,
                  boxShadow: `0 4px 15px ${COLORS.primary}15`,
                }}
              >
                <Image src="/roadmap/characters/mascot.png" alt="وصال" width={48} height={48} className="object-contain p-0.5" />
              </motion.div>
              <div className="leading-tight">
                <h1 className="text-[15px] sm:text-[17px] font-extrabold" style={{ color: COLORS.cream }}>وصال</h1>
                <p className="text-[9px] sm:text-[10px] font-semibold" style={{ color: COLORS.textMuted }}>رود ماب التعافي</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Streak */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 sm:gap-1.5 rounded-full pl-2.5 pr-2 sm:pl-3 sm:pr-2.5 py-1 sm:py-1.5"
                style={{ background: `${COLORS.gold}12`, border: `1.5px solid ${COLORS.gold}20` }}
              >
                <span className="text-[12px] sm:text-sm">🔥</span>
                <span className="text-[12px] sm:text-[14px] font-extrabold tabular-nums" style={{ color: COLORS.gold }}>7</span>
              </motion.div>

              {/* Gems */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 sm:gap-1.5 rounded-full pl-2.5 pr-2 sm:pl-3 sm:pr-2.5 py-1 sm:py-1.5"
                style={{ background: `${COLORS.primary}12`, border: `1.5px solid ${COLORS.primary}20` }}
              >
                <span className="text-[12px] sm:text-sm">💎</span>
                <span className="text-[12px] sm:text-[14px] font-extrabold tabular-nums" style={{ color: COLORS.primary }}>350</span>
              </motion.div>

              {/* Level */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-1.5 rounded-full pl-3 pr-2.5 py-1.5"
                style={{ background: `${COLORS.success}12`, border: `1.5px solid ${COLORS.success}20` }}
              >
                <span className="text-sm">⚡</span>
                <span className="text-[14px] font-extrabold" style={{ color: COLORS.success }}>Lv.3</span>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* ── Progress bar ── */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2.5 sm:gap-3"
          >
            <span className="text-[10px] sm:text-[11px] font-bold whitespace-nowrap" style={{ color: COLORS.textMuted }}>التقدم</span>
            <div className="flex-1 h-[8px] sm:h-[9px] rounded-full overflow-hidden" style={{ background: `${COLORS.bgCard}80`, border: `1px solid ${COLORS.border}` }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '22%' }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                className="h-full rounded-full relative overflow-hidden"
              >
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to left, ${COLORS.gold}, ${COLORS.goldDark})` }}
                />
                <motion.div
                  animate={{ x: ['-100%', '250%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to right, transparent, ${COLORS.goldLight}30, transparent)` }}
                />
              </motion.div>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold tabular-nums" style={{ color: COLORS.gold }}>٢/٩</span>
          </motion.div>
        </div>

        {/* ── Welcome + Mascot ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-2"
        >
          <div
            className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl"
            style={{
              background: `linear-gradient(145deg, ${COLORS.bgLight}90, ${COLORS.bgCard}90)`,
              border: `1px solid ${COLORS.border}`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.15)`,
            }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ background: `${COLORS.primary}10`, border: `2px solid ${COLORS.primary}20` }}>
              <Image src="/roadmap/characters/mascot.png" alt="وصال" width={64} height={64} className="object-contain p-1" />
            </div>
            <div>
              <p className="text-[13px] sm:text-sm leading-relaxed font-medium" style={{ color: COLORS.textSecondary }}>
                مرحبًا! أنا <span className="font-extrabold" style={{ color: COLORS.cream }}>وصال</span> — رحلتك بدأت!
              </p>
              <p className="text-[10px] sm:text-[11px] mt-1 font-medium" style={{ color: COLORS.textMuted }}>
                كمّل الخطوات واحدة واحدة ووصل لنهاية الرحلة
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ Roadmap Path ═══ */}
        <main className="max-w-2xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6 pb-44">
          <div className="flex flex-col items-center">
            {renderNodes()}
          </div>

          {/* End of path */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3 mt-12"
          >
            <motion.div
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="w-[3px] h-16"
              style={{ background: `linear-gradient(to bottom, ${COLORS.gold}25, transparent)` }}
            />
            <motion.div
              animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `${COLORS.gold}08`,
                border: `2px solid ${COLORS.gold}20`,
              }}
            >
              <span className="text-sm">🏆</span>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
              className="text-[12px] font-bold"
              style={{ color: COLORS.textMuted }}
            >
              نهاية الرحلة
            </motion.p>
          </motion.div>
        </main>
      </div>

      {/* ═══════ Modals & Overlays ═══════ */}

      {/* Node detail sheet */}
      <AnimatePresence>
        {selectedNode && <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />}
      </AnimatePresence>

      {/* Path selection toast */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 70, scale: 0.85 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            onClick={() => setSelectedPath(null)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
          >
            {/* Confetti burst */}
            {showConfetti && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <ConfettiPiece
                    key={i}
                    delay={i * 0.04}
                    color={confettiColors[i % confettiColors.length]}
                    left={confettiPositions[i]}
                  />
                ))}
              </div>
            )}

            <div
              className="flex items-center gap-3.5 sm:gap-4 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl 
                         border shadow-2xl backdrop-blur-2xl max-w-[92vw]"
              style={{
                background: `linear-gradient(145deg, ${selectedPath.color}18, ${selectedPath.color}08)`,
                borderColor: `${selectedPath.color}35`,
                boxShadow: `0 12px 45px ${selectedPath.color}15, 0 0 0 1px ${selectedPath.color}08, inset 0 1px 0 ${selectedPath.color}10`,
              }}
            >
              <div
                className="w-13 h-13 rounded-2xl overflow-hidden flex-shrink-0"
                style={{
                  background: `${selectedPath.color}12`,
                  border: `2px solid ${selectedPath.color}30`,
                }}
              >
                <Image src={selectedPath.icon} alt={selectedPath.label} width={52} height={52} className="object-contain p-1.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-[15px] font-extrabold" style={{ color: COLORS.cream }}>مسار {selectedPath.label}</p>
                <p className="text-[11px] sm:text-xs font-medium" style={{ color: COLORS.textSecondary }}>{selectedPath.description}</p>
              </div>
              <span className="text-[9px] sm:text-[10px] mr-1 sm:mr-2 whitespace-nowrap hidden sm:block font-medium" style={{ color: COLORS.textMuted }}>
                اضغط للإغلاق
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
