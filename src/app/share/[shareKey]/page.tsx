'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame, Gem, Trophy, Zap, Star, Target,
  Calendar, Eye, Sparkles, Rocket,
} from 'lucide-react';

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
interface ShareUser {
  id: string;
  name: string;
  avatar?: string | null;
  xp: number;
  streak: number;
  gems: number;
  level: number;
}

interface ShareStats {
  completedDays: number;
  totalEnrollments: number;
}

/* ═══════════════════════════════════════
   Share Page
   ═══════════════════════════════════════ */
export default function SharePage({ params }: { params: Promise<{ shareKey: string }> }) {
  const [shareKey, setShareKey] = useState<string>('');
  const [shareData, setShareData] = useState<{
    title: string | null;
    message: string | null;
    imageUrl: string | null;
    views: number;
    createdAt: string;
  } | null>(null);
  const [userData, setUserData] = useState<ShareUser | null>(null);
  const [stats, setStats] = useState<ShareStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then((p) => setShareKey(p.shareKey));
  }, [params]);

  useEffect(() => {
    if (!shareKey) return;

    async function fetchShare() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/shares/${shareKey}`);
        if (res.ok) {
          const data = await res.json();
          setShareData(data.share);
          setUserData(data.user);
          setStats(data.stats);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShare();
  }, [shareKey]);

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#0f1f2e' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full mb-4"
          style={{ border: '3px solid rgba(88,196,220,0.2)', borderTopColor: '#58c4dc' }}
        />
        <p className="text-xs" style={{ color: '#5a7f8f' }}>جارٍ التحميل...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: '#0f1f2e' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: '#1a3347', border: '2px solid rgba(88,196,220,0.1)' }}
          >
            <Star className="w-8 h-8" style={{ color: '#5a7f8f' }} />
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: '#f8f5f0' }}>الرابط مش موجود</h2>
          <p className="text-sm text-center" style={{ color: '#a3c4d0' }}>
            الصفحة دي مش موجودة أو اتحذفت
          </p>
          <Link
            href="/"
            className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
            style={{
              background: 'rgba(88,196,220,0.1)',
              color: '#58c4dc',
              border: '1px solid rgba(88,196,220,0.15)',
            }}
          >
            <Rocket className="w-4 h-4" />
            ابدأ رحلتك
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen relative flex flex-col"
      style={{ background: '#0f1f2e' }}
    >
      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.06)' }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 -left-24 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(255,200,0,0.04)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div
            className="rounded-3xl p-6 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a3347, #162d40)',
              border: '1px solid rgba(88,196,220,0.15)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* App branding */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <h2 className="text-lg font-extrabold" style={{ color: '#58c4dc' }}>وصال</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(88,196,220,0.1)', color: '#58c4dc', border: '1px solid rgba(88,196,220,0.15)' }}>
                تقدم مشترك
              </span>
            </div>

            {/* User info */}
            {userData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-5"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(88,196,220,0.15), rgba(88,196,220,0.05))',
                    border: '2px solid rgba(88,196,220,0.2)',
                  }}
                >
                  {userData.avatar ? (
                    <Image src={userData.avatar} alt={userData.name} width={52} height={52} className="object-cover" />
                  ) : (
                    <Image src="/roadmap/characters/mascot.png" alt={userData.name} width={52} height={52} className="object-contain" />
                  )}
                </div>
                <h3 className="text-xl font-extrabold" style={{ color: '#f8f5f0' }}>
                  {userData.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: '#a3c4d0' }}>
                  المستوى {userData.level}
                </p>
              </motion.div>
            )}

            {/* Custom message */}
            {shareData?.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-5 p-4 rounded-2xl text-center"
                style={{
                  background: 'rgba(88,196,220,0.04)',
                  border: '1px solid rgba(88,196,220,0.08)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: '#a3c4d0' }}>
                  {shareData.message}
                </p>
              </motion.div>
            )}

            {/* Stats grid */}
            {userData && stats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-3 mb-5"
              >
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,200,0,0.06)', border: '1px solid rgba(255,200,0,0.1)' }}
                >
                  <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: '#ffc800' }} />
                  <p className="text-lg font-extrabold" style={{ color: '#ffc800' }}>{userData.xp}</p>
                  <p className="text-[10px]" style={{ color: '#5a7f8f' }}>XP</p>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,75,75,0.06)', border: '1px solid rgba(255,75,75,0.1)' }}
                >
                  <Flame className="w-5 h-5 mx-auto mb-1" style={{ color: '#ff4b4b' }} />
                  <p className="text-lg font-extrabold" style={{ color: '#ff4b4b' }}>{userData.streak}</p>
                  <p className="text-[10px]" style={{ color: '#5a7f8f' }}>سلسلة</p>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(88,196,220,0.06)', border: '1px solid rgba(88,196,220,0.1)' }}
                >
                  <Gem className="w-5 h-5 mx-auto mb-1" style={{ color: '#58c4dc' }} />
                  <p className="text-lg font-extrabold" style={{ color: '#58c4dc' }}>{userData.gems}</p>
                  <p className="text-[10px]" style={{ color: '#5a7f8f' }}>جواهر</p>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(88,204,2,0.06)', border: '1px solid rgba(88,204,2,0.1)' }}
                >
                  <Calendar className="w-5 h-5 mx-auto mb-1" style={{ color: '#58cc02' }} />
                  <p className="text-lg font-extrabold" style={{ color: '#58cc02' }}>{stats.completedDays}</p>
                  <p className="text-[10px]" style={{ color: '#5a7f8f' }}>أيام مكتملة</p>
                </div>
              </motion.div>
            )}

            {/* Views */}
            {shareData && (
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <Eye className="w-3.5 h-3.5" style={{ color: '#5a7f8f' }} />
                <span className="text-[10px]" style={{ color: '#5a7f8f' }}>
                  {shareData.views} مشاهدة
                </span>
              </div>
            )}
          </div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5"
          >
            <Link href="/" className="block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #ffc800, #cc9f00)',
                  color: '#0f1f2e',
                  boxShadow: '0 6px 25px rgba(255,200,0,0.35)',
                  border: '2px solid rgba(255,224,102,0.3)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                ابدأ رحلتك
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-[10px]" style={{ color: '#5a7f8f' }}>
          وصال — رحلة التعافي من التعفن الدماغي
        </p>
      </div>
    </div>
  );
}
