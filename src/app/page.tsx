'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Phone, User, Lock, Eye, EyeOff, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/store/auth';
import MainRoadmap from '@/components/MainRoadmap';
import OnboardingFlow from '@/components/OnboardingFlow';

/* ═══════════════════════════════════════
   Login / Register Page
   ═══════════════════════════════════════ */
function AuthPage() {
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('رقم الموبايل مطلوب');
      return;
    }

    if (phone.length < 10) {
      setError('رقم الموبايل مش صحيح');
      return;
    }

    let success: boolean;
    if (isLogin) {
      if (!password) {
        setError('كلمة المرور مطلوبة');
        return;
      }
      success = await login(phone, password);
      if (!success) setError('رقم الموبايل أو كلمة المرور غلط');
    } else {
      if (!name.trim()) {
        setError('الاسم مطلوب');
        return;
      }
      success = await register(name, phone, password || undefined);
      if (!success) setError('حصل خطأ. حاول تاني.');
      else setShowSuccess(true);
    }
  }, [isLogin, name, phone, password, login, register]);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0f1f2e' }}
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.06)' }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 35, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 -left-28 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(255,200,0,0.04)' }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-1/4 w-56 h-56 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.03)' }}
        />
      </div>

      {/* Top section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-6">
        {/* Logo + Mascot */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-8"
        >
          {/* Mascot */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-4"
          >
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #1a3347, #162d40)',
                border: '2px solid rgba(88,196,220,0.2)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 0 50px rgba(88,196,220,0.08)',
              }}
            >
              <Image
                src="/roadmap/characters/mascot.png"
                alt="وصال"
                width={110}
                height={110}
                className="object-contain drop-shadow-lg"
              />
            </div>
            {/* Sparkles */}
            <motion.div
              animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
              className="absolute -top-2 -left-2 text-lg"
              style={{ color: '#ffc800' }}
            >
              ✦
            </motion.div>
            <motion.div
              animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute top-2 -right-3 text-sm"
              style={{ color: '#58c4dc' }}
            >
              ✧
            </motion.div>
          </motion.div>

          {/* App name */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-2"
            style={{ color: '#58c4dc' }}
          >
            وصال
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-center max-w-xs leading-relaxed"
            style={{ color: '#a3c4d0' }}
          >
            رحلة ٣ أشهر للتخلص من التعفن الدماغي
          </motion.p>
        </motion.div>

        {/* Auth Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 30 : -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (register only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative">
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.1)' }}
                    >
                      <User className="w-4 h-4" style={{ color: '#58c4dc' }} />
                    </div>
                    <input
                      type="text"
                      placeholder="اسمك"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pr-14 pl-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
                      style={{
                        background: '#1a3347',
                        border: '1.5px solid rgba(88,196,220,0.12)',
                        color: '#f8f5f0',
                        caretColor: '#58c4dc',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        ['--tw-ring-color' as string]: 'rgba(88,196,220,0.3)',
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Phone field */}
              <div className="relative">
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.1)' }}
                >
                  <Phone className="w-4 h-4" style={{ color: '#58c4dc' }} />
                </div>
                <input
                  type="tel"
                  placeholder="رقم الموبايل"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full pr-14 pl-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 text-right"
                  style={{
                    background: '#1a3347',
                    border: '1.5px solid rgba(88,196,220,0.12)',
                    color: '#f8f5f0',
                    caretColor: '#58c4dc',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    ['--tw-ring-color' as string]: 'rgba(88,196,220,0.3)',
                  }}
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.1)' }}
                >
                  <Lock className="w-4 h-4" style={{ color: '#58c4dc' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'كلمة المرور' : 'كلمة المرور (اختياري)'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full pr-14 pl-12 py-3.5 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 text-right"
                  style={{
                    background: '#1a3347',
                    border: '1.5px solid rgba(88,196,220,0.12)',
                    color: '#f8f5f0',
                    caretColor: '#58c4dc',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    ['--tw-ring-color' as string]: 'rgba(88,196,220,0.3)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: '#5a7f8f' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                      style={{
                        background: 'rgba(255,75,75,0.08)',
                        color: '#ff4b4b',
                        border: '1px solid rgba(255,75,75,0.15)',
                      }}
                    >
                      <span>⚠️</span>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: isLoading
                    ? 'linear-gradient(135deg, #508992, #3a6b75)'
                    : 'linear-gradient(135deg, #ffc800, #cc9f00)',
                  color: '#0f1f2e',
                  boxShadow: isLoading ? 'none' : '0 6px 25px rgba(255,200,0,0.35)',
                  border: '2px solid rgba(255,224,102,0.3)',
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{isLogin ? 'دخول' : 'حساب جديد'}</span>
                )}
              </motion.button>
            </form>

            {/* Toggle login/register */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="text-xs" style={{ color: '#5a7f8f' }}>
                {isLogin ? 'معندكش حساب؟' : 'عندك حساب؟'}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setShowSuccess(false);
                }}
                className="text-xs font-bold transition-colors"
                style={{ color: '#58c4dc' }}
              >
                {isLogin ? 'سجل دلوقتي' : 'ادخل'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Success message for registration */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6 w-full max-w-sm"
            >
              <div
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{
                  background: 'rgba(88,204,2,0.08)',
                  border: '1px solid rgba(88,204,2,0.2)',
                }}
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: '#58cc02' }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#58cc02' }}>تم إنشاء حسابك بنجاح! 🎉</p>
                  <p className="text-xs mt-0.5" style={{ color: '#a3c4d0' }}>هيتم توجيهك للتقديم...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-[10px]" style={{ color: '#5a7f8f' }}>
          صُنع بـ ❤️ لعلاج التعفن الدماغي
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Home Page - Router
   ═══════════════════════════════════════ */
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Home() {
  const { user, refreshUser } = useAuth();
  const mounted = useHydrated();

  // Refresh user data on mount (subscription pattern)
  useEffect(() => {
    if (!mounted || !user) return;
    refreshUser();
  }, [mounted, user?.id, refreshUser]);

  // Derive view from user state
  const view = !mounted ? 'auth' as const
    : !user ? 'auth' as const
    : !user.onboarded ? 'onboarding' as const
    : 'roadmap' as const;

  // Show nothing during SSR hydration
  if (!mounted) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f1f2e' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full"
          style={{ border: '3px solid rgba(88,196,220,0.2)', borderTopColor: '#58c4dc' }}
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'auth' && (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthPage />
        </motion.div>
      )}

      {view === 'onboarding' && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingFlow
            onComplete={async () => {
              // Mark user as onboarded locally + via API
              if (user) {
                try {
                  await fetch(`/api/auth/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ onboarded: true }) });
                } catch { /* silent */ }
                useAuth.setState({ user: { ...user, onboarded: true } });
                if (typeof window !== 'undefined') {
                  localStorage.setItem('wasal_user', JSON.stringify({ ...user, onboarded: true }));
                }
              }
            }}
          />
        </motion.div>
      )}

      {view === 'roadmap' && (
        <motion.div
          key="roadmap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MainRoadmap />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
