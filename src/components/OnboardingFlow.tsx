'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  sortOrder: number;
}

/* ═══════════════════════════════════════
   Default fallback messages
   ═══════════════════════════════════════ */
const DEFAULT_MESSAGES: WelcomeMessage[] = [
  {
    id: '1',
    title: 'أهلاً بيك! 🎉',
    message: 'أنا وصال! مبسوط جداً إنك بدأت رحلة التعافي معانا. خلينا نتعرف على بعض.',
    sortOrder: 0,
  },
  {
    id: '2',
    title: 'إيه هو التعفن الدماغي؟ 🧠',
    message: 'التعفن الدماغي بيحصل لما بنقضي وقت كتير على المحتوى الرقمي السريع — فيديوهات قصيرة، سكرول بلا هدف، وأشياء بتمتص طاقتنا من غير ما ناخد بالنا.',
    sortOrder: 1,
  },
  {
    id: '3',
    title: 'ليه أنت هنا؟ 💪',
    message: 'أنت لسه مش بتاخد بالك — بس الحقيقة إنك واخد خطوة مهمة جداً. أول خطوة في التغيير هي الوعي، وأنت وصلت ليها!',
    sortOrder: 2,
  },
  {
    id: '4',
    title: 'الرحلة إزاي؟ 🗺️',
    message: 'رحلتك هتكون ٣ أشهر. كل يوم هتلاقي محتوى صغير — فيديو، تحدي، أو مهمة. كل يوم بيكسبك XP وهتلاقي نفسك بتتغير!',
    sortOrder: 3,
  },
  {
    id: '5',
    title: 'يلا نبدأ! 🚀',
    message: 'مستنية تيك تيك تيك... أكدت على "يلا" عشان نبدأ رحلتك الحقيقية!',
    sortOrder: 4,
  },
];

/* ═══════════════════════════════════════
   Typing Animation Hook
   ═══════════════════════════════════════ */
function useTypingEffect(text: string, speed: number = 20) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, isDone };
}

/* ═══════════════════════════════════════
   Speech Bubble Component
   ═══════════════════════════════════════ */
function SpeechBubble({ message, isTyping }: { message: string; isTyping: boolean }) {
  return (
    <div className="relative">
      {/* Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative px-5 py-4 rounded-2xl rounded-br-md"
        style={{
          background: 'linear-gradient(145deg, #1a3347, #162d40)',
          border: '1px solid rgba(88,196,220,0.2)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        }}
      >
        <p className="text-sm sm:text-base leading-relaxed font-medium" style={{ color: '#f8f5f0' }}>
          {message}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-5 mr-1 rounded-sm align-middle"
              style={{ background: '#58c4dc' }}
            />
          )}
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Progress Dots
   ═══════════════════════════════════════ */
function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : i < current ? 8 : 6,
            opacity: i <= current ? 1 : 0.3,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="h-[6px] rounded-full"
          style={{
            background: i <= current ? '#58c4dc' : '#5a7f8f',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   OnboardingFlow Component
   ═══════════════════════════════════════ */
export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [messages, setMessages] = useState<WelcomeMessage[]>(DEFAULT_MESSAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch welcome messages from API
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/welcome');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch {
        // Use default messages
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, []);

  const currentMsg = messages[currentIndex];
  const { displayed, isDone } = useTypingEffect(currentMsg?.message || '', 25);
  const isLast = currentIndex === messages.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLast, onComplete]);

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f1f2e' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-5xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0f1f2e' }}
    >
      {/* Gradient orbs background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.06)' }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -left-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(255,200,0,0.04)' }}
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-1/4 w-60 h-60 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.04)' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-5 pt-6 pb-2">
        <motion.h2
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-extrabold"
          style={{ color: '#58c4dc' }}
        >
          وصال
        </motion.h2>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{
            background: 'rgba(88,196,220,0.1)',
            color: '#58c4dc',
            border: '1px solid rgba(88,196,220,0.15)',
          }}
        >
          {currentIndex + 1} / {messages.length}
        </motion.span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 w-full max-w-md"
          >
            {/* Mascot */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a3347, #162d40)',
                  border: '2px solid rgba(88,196,220,0.2)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 0 40px rgba(88,196,220,0.08)',
                }}
              >
                <Image
                  src="/roadmap/characters/mascot.png"
                  alt="وصال"
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-lg"
                />
              </div>
              {/* Sparkle effects */}
              <motion.div
                animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 -left-2 w-5 h-5 text-lg"
              >
                ✦
              </motion.div>
              <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                className="absolute -top-1 -right-3 w-4 h-4 text-sm"
                style={{ color: '#ffc800' }}
              >
                ✧
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl sm:text-2xl font-extrabold text-center"
              style={{ color: '#f8f5f0' }}
            >
              {currentMsg?.title}
            </motion.h2>

            {/* Speech bubble */}
            <div className="w-full">
              <SpeechBubble message={displayed} isTyping={!isDone} />
            </div>

            {/* Progress dots */}
            <ProgressDots total={messages.length} current={currentIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="relative z-10 px-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.button
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isDone ? 1 : 0.4, y: 0 }}
            whileHover={isDone ? { scale: 1.03 } : {}}
            whileTap={isDone ? { scale: 0.97 } : {}}
            onClick={isDone ? handleNext : undefined}
            disabled={!isDone}
            className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all"
            style={{
              background: isDone
                ? 'linear-gradient(135deg, #ffc800, #cc9f00)'
                : 'linear-gradient(135deg, #508992, #3a6b75)',
              color: '#0f1f2e',
              boxShadow: isDone ? '0 6px 25px rgba(255,200,0,0.35)' : 'none',
              border: '2px solid rgba(255,224,102,0.3)',
            }}
          >
            {isLast ? 'يلا نبدأ! 🚀' : 'التالي'}
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
}
