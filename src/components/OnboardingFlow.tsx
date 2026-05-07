'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  audioUrl?: string | null;
  sortOrder: number;
}

/* ═══════════════════════════════════════
   Default fallback messages
   ═══════════════════════════════════════ */
const DEFAULT_MESSAGES: WelcomeMessage[] = [
  {
    id: '1',
    title: 'مرحباً بيك في وصال! 🌟',
    message: 'أهلاً وسهلاً بيك في رحلتك نحو التحرر من التعفن الدماغي. أنا هنا ندعمك في كل خطوة. هذا البرنامج مصمم خصيصاً لمساعدتك على استعادة تركيزك وإنتاجيتك والسيطرة على وقتك. أنت لحد وحدك في هذه الرحلة!',
    sortOrder: 0,
  },
  {
    id: '2',
    title: 'التعفن الدماغي - ما هو؟ 🧠',
    message: 'التعفن الدماغي هو مصطلح يصف الحالة التي يصبح فيها عقلك مهووساً بالمحتوى الترفيهي السطحي مثل فيديوهات التيك توك والريلز القصيرة والميمز. ينتج عن ذلك ضعف في التركيز، انخفاض في القدرة على التفكير العميق، وقلة الإنتاجية. لكن الحل موجود وبإمكانك التعافي!',
    sortOrder: 1,
  },
  {
    id: '3',
    title: 'كيف سيساعدك هذا البرنامج؟ 💪',
    message: 'خلال ١٢ أسبوعاً، ستمر برحلة منظمة تشمل: الوعي بالمشكلة، التخلص التدريجي من المحتوى السلبي، بناء عادات صحية بديلة، تطوير مهارات التفكير النقدي والقراءة، تعلم الإنتاجية الحقيقية، وتحسين علاقاتك الاجتماعية. كل يوم فيه محتوى تعليمي وتمارين عملية وتحديات ممتعة. جهز نفسك للتغيير!',
    sortOrder: 2,
  },
];

/* ═══════════════════════════════════════
   TTS Hook - Text to Speech with Arabic
   ═══════════════════════════════════════ */
function useTTS() {
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((text: string, audioUrl?: string | null) => {
    if (muted || typeof window === 'undefined') return;

    // Stop any ongoing speech/audio
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    function fallbackTTS() {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) utterance.voice = arabicVoice;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // If audioUrl exists, play it instead of TTS
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else {
        audioRef.current.src = audioUrl;
      }
      audioRef.current.onplay = () => setSpeaking(true);
      audioRef.current.onended = () => setSpeaking(false);
      audioRef.current.onerror = () => setSpeaking(false);
      audioRef.current.play().catch(() => fallbackTTS());
      return;
    }

    fallbackTTS();
  }, [muted]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setSpeaking(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      if (!prev) {
        // Unmuting - stop current speech
        stop();
      }
      return !prev;
    });
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop, muted, speaking, toggleMute };
}

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
function SpeechBubble({ message, isTyping, speaking }: { message: string; isTyping: boolean; speaking: boolean }) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative px-5 py-4 rounded-2xl rounded-br-md"
        style={{
          background: 'linear-gradient(145deg, #1a3347, #162d40)',
          border: `2px solid ${speaking ? 'rgba(255,200,0,0.3)' : 'rgba(88,196,220,0.2)'}`,
          boxShadow: speaking
            ? '0 0 30px rgba(255,200,0,0.15), 0 8px 30px rgba(0,0,0,0.3)'
            : '0 8px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Sound wave indicator when speaking */}
        {speaking && (
          <div className="flex items-center gap-1 mb-2">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                transition={{ duration: 0.4 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                className="w-[3px] rounded-full"
                style={{ background: '#ffc800' }}
              />
            ))}
            <span className="text-[10px] font-bold mr-2" style={{ color: '#ffc800' }}>جاري التحدث...</span>
          </div>
        )}

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
  const { speak, stop, muted, speaking, toggleMute } = useTTS();
  const hasSpokenRef = useRef<string | null>(null);

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

  // Speak the message when typing is done (only once per message)
  useEffect(() => {
    if (isDone && currentMsg && hasSpokenRef.current !== currentMsg.id) {
      hasSpokenRef.current = currentMsg.id;
      // Small delay before speaking so user sees the full text first
      const timer = setTimeout(() => {
        speak(currentMsg.title + '. ' + currentMsg.message, currentMsg.audioUrl);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isDone, currentMsg, speak]);

  const handleNext = useCallback(() => {
    stop(); // Stop any ongoing speech
    hasSpokenRef.current = null; // Reset for next message

    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLast, onComplete, stop]);

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
        <div className="flex items-center gap-3">
          {/* Mute/Unmute button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: muted ? 'rgba(255,75,75,0.1)' : 'rgba(255,200,0,0.1)',
              border: muted ? '1px solid rgba(255,75,75,0.2)' : '1px solid rgba(255,200,0,0.2)',
            }}
          >
            {muted ? (
              <VolumeX className="w-4 h-4" style={{ color: '#ff4b4b' }} />
            ) : (
              <motion.div animate={speaking ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }}>
                <Volume2 className="w-4 h-4" style={{ color: '#ffc800' }} />
              </motion.div>
            )}
          </motion.button>

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
              animate={speaking ? { y: [0, -5, 0], rotate: [-2, 2, -2, 0] } : { y: [0, -8, 0] }}
              transition={{ duration: speaking ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: speaking
                    ? 'linear-gradient(145deg, rgba(255,200,0,0.15), #1a3347)'
                    : 'linear-gradient(145deg, #1a3347, #162d40)',
                  border: `2px solid ${speaking ? 'rgba(255,200,0,0.35)' : 'rgba(88,196,220,0.2)'}`,
                  boxShadow: speaking
                    ? '0 8px 30px rgba(0,0,0,0.3), 0 0 40px rgba(255,200,0,0.15)'
                    : '0 8px 30px rgba(0,0,0,0.3), 0 0 40px rgba(88,196,220,0.08)',
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
              <SpeechBubble message={displayed} isTyping={!isDone} speaking={speaking} />
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
