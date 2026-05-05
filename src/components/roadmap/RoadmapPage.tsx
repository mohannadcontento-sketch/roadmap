'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { PathNode, BranchSection, Connector, NodeDetail } from './PathNode';
import { ROADMAP_DATA, BRANCH_PATHS, NODE_POSITIONS } from './types';
import type { RoadmapNode, BranchPath } from './types';
import { useState, useRef, useCallback, useMemo } from 'react';

/* ── Confetti particle ── */
function ConfettiPiece({ delay, color, left }: { delay: number; color: string; left: number }) {
  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 30, 60, 100],
        x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
        opacity: [1, 1, 0.6, 0],
        rotate: [0, 180, 360, 540],
      }}
      transition={{ duration: 2.5, delay, ease: 'easeOut' }}
      className="absolute w-2 h-2 rounded-sm top-0"
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

  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0.8, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['22%', '100%']);

  // Stable star positions (computed once)
  const stars = useMemo(() =>
    Array.from({ length: 50 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      baseOpacity: Math.random() * 0.3 + 0.08,
    })),
  []);

  const confettiColors = ['#34d399', '#38bdf8', '#fbbf24', '#a78bfa', '#fb923c', '#f87171'];

  const handlePathSelect = useCallback((path: BranchPath) => {
    setSelectedPath(path);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
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
    <div className="relative min-h-screen bg-[#0B1120] overflow-hidden" dir="rtl">
      {/* ═══════ Background ═══════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 right-[10%] w-[500px] h-[500px] rounded-full bg-sky-500/[0.05] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 15, -25, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[30%] left-[5%] w-[450px] h-[450px] rounded-full bg-violet-500/[0.04] blur-[90px]"
        />
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, 10, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[60%] right-[20%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.04] blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -15, 20, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 left-[30%] w-[500px] h-[300px] rounded-full bg-amber-500/[0.03] blur-[100px]"
        />

        {/* Stars */}
        {stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [star.baseOpacity, star.baseOpacity + 0.2, star.baseOpacity],
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

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ═══════ Content ═══════ */}
      <div className="relative z-10" ref={mainRef}>
        {/* ── Sticky Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0B1120]/75 border-b border-white/[0.05]"
          style={{ opacity: headerOpacity }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl 
                           bg-gradient-to-br from-emerald-400 to-teal-500 
                           flex items-center justify-center text-lg sm:text-xl 
                           shadow-lg shadow-emerald-500/25 flex-shrink-0"
              >
                🦉
              </motion.div>
              <div className="leading-tight">
                <h1 className="text-[14px] sm:text-[16px] font-bold text-white">وصال</h1>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">رود ماب التعافي</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Streak */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-l from-orange-500/10 to-red-500/10 
                           border border-orange-500/15 rounded-full pl-2.5 pr-2 sm:pl-3 sm:pr-2.5 py-1 sm:py-1.5"
              >
                <span className="text-[11px] sm:text-xs">🔥</span>
                <span className="text-[11px] sm:text-[13px] font-bold text-orange-300 tabular-nums">7</span>
              </motion.div>

              {/* Gems */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 sm:gap-1.5 bg-sky-500/10 border border-sky-500/15 
                           rounded-full pl-2.5 pr-2 sm:pl-3 sm:pr-2.5 py-1 sm:py-1.5"
              >
                <span className="text-[11px] sm:text-xs">💎</span>
                <span className="text-[11px] sm:text-[13px] font-bold text-sky-300 tabular-nums">350</span>
              </motion.div>

              {/* Level */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/15 
                           rounded-full pl-3 pr-2.5 py-1.5"
              >
                <span className="text-xs">⚡</span>
                <span className="text-[13px] font-bold text-amber-300">Lv.3</span>
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
            <span className="text-[10px] sm:text-[11px] text-gray-600 font-medium whitespace-nowrap">التقدم</span>
            <div className="flex-1 h-[6px] sm:h-[7px] rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '22%' }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                className="h-full rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-emerald-400 via-teal-400 to-sky-400" />
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-600 font-medium tabular-nums">٢/١٠</span>
          </motion.div>
        </div>

        {/* ── Welcome message ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-2 text-center"
        >
          <p className="text-[12px] sm:text-sm text-gray-500 leading-relaxed">
            مرحبًا! رحلتك بدأت — كمّل الخطوات واحدة واحدة ووصل لنهاية الرحلة 🌱
          </p>
        </motion.div>

        {/* ═══ Roadmap Path ═══ */}
        <main className="max-w-2xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6 pb-40">
          <div className="flex flex-col items-center">
            {renderNodes()}
          </div>

          {/* End of path */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3 mt-10"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-[3px] h-12 bg-gradient-to-b from-white/[0.08] to-transparent"
            />
            <motion.p
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="text-[11px] text-gray-600 font-medium"
            >
              🔮 نهاية الرحلة
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
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            onClick={() => setSelectedPath(null)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
          >
            {/* Confetti burst */}
            {showConfetti && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ConfettiPiece
                    key={i}
                    delay={i * 0.05}
                    color={confettiColors[i % confettiColors.length]}
                    left={30 + Math.random() * 40}
                  />
                ))}
              </div>
            )}

            <div
              className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl 
                         border shadow-2xl backdrop-blur-2xl max-w-[90vw]"
              style={{
                background: `linear-gradient(135deg, ${selectedPath.color}18, ${selectedPath.color}08)`,
                borderColor: `${selectedPath.color}35`,
                boxShadow: `0 8px 40px ${selectedPath.color}15, 0 0 0 1px ${selectedPath.color}10`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: `${selectedPath.color}15`,
                  border: `1.5px solid ${selectedPath.color}30`,
                }}
              >
                {selectedPath.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-[15px] font-bold text-white">مسار {selectedPath.label}</p>
                <p className="text-[11px] sm:text-xs text-gray-400">{selectedPath.description}</p>
              </div>
              <span className="text-[9px] sm:text-[10px] text-gray-600 mr-1 sm:mr-2 whitespace-nowrap hidden sm:block">
                اضغط للإغلاق
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
