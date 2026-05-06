'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Share2, Copy, CheckCircle2, Plus,
  Eye, Trash2, Gift, Calendar, Zap, Loader2,
  ExternalLink, Flame,
} from 'lucide-react';
import { useAuth } from '@/store/auth';

interface UserShare {
  id: string;
  userId: string;
  title: string | null;
  message: string | null;
  imageUrl: string | null;
  shareKey: string;
  views: number;
  createdAt: string;
}

export default function SharesPage() {
  const { user } = useAuth();
  const [shares, setShares] = useState<UserShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createMessage, setCreateMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchShares() {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/shares/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setShares(data.shares || []);
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }
    fetchShares();
  }, [user]);

  const handleCreate = useCallback(async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: createTitle || `تقدم ${user.name}`,
          message: createMessage || `جمعت ${user.xp} XP وسلسلتي ${user.streak} يوم!`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShares(prev => [data.share, ...prev]);
        setShowCreate(false);
        setCreateTitle('');
        setCreateMessage('');
      }
    } catch {
      // silent
    } finally {
      setIsCreating(false);
    }
  }, [user, createTitle, createMessage]);

  const handleCopyLink = useCallback(async (share: UserShare) => {
    const link = `${window.location.origin}/share/${share.shareKey}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedKey(share.id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  }, []);

  const handleNativeShare = useCallback(async (share: UserShare) => {
    const link = `${window.location.origin}/share/${share.shareKey}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: share.title || 'تقدمي في وصال',
          text: share.message || '',
          url: link,
        });
      } catch {
        // cancelled
      }
    }
  }, []);

  const handleDelete = useCallback(async (shareId: string) => {
    try {
      await fetch(`/api/shares/${shareId}`, { method: 'DELETE' });
      setShares(prev => prev.filter(s => s.id !== shareId));
    } catch {
      // silent
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  if (!user) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#0f1f2e' }}>
        <p className="text-sm mb-4" style={{ color: '#a3c4d0' }}>سجل دخولك الأول</p>
        <Link href="/" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'rgba(88,196,220,0.1)', color: '#58c4dc', border: '1px solid rgba(88,196,220,0.15)' }}>
          <ArrowRight className="w-4 h-4" />
          الصفحة الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen relative" style={{ background: '#0f1f2e' }}>
      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(88,196,220,0.04)' }}
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 -left-20 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'rgba(255,200,0,0.03)' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: 'rgba(88,196,220,0.08)', border: '1px solid rgba(88,196,220,0.12)' }}>
              <ArrowRight className="w-4 h-4" style={{ color: '#58c4dc' }} />
            </div>
          </Link>
          <h1 className="text-lg font-extrabold" style={{ color: '#f8f5f0' }}>المشاركات</h1>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.12)' }}>
            <Share2 className="w-4 h-4" style={{ color: '#ffc800' }} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,200,0,0.06)', border: '1px solid rgba(255,200,0,0.1)' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: '#ffc800' }} />
            <span className="text-xs font-bold" style={{ color: '#ffc800' }}>{user.xp} XP</span>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,75,75,0.06)', border: '1px solid rgba(255,75,75,0.1)' }}>
            <Flame className="w-3.5 h-3.5" style={{ color: '#ff4b4b' }} />
            <span className="text-xs font-bold" style={{ color: '#ff4b4b' }}>{user.streak} يوم</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(88,196,220,0.06)', border: '1px solid rgba(88,196,220,0.1)' }}>
            <Eye className="w-3.5 h-3.5" style={{ color: '#58c4dc' }} />
            <span className="text-xs font-bold" style={{ color: '#58c4dc' }}>
              {shares.reduce((sum, s) => sum + s.views, 0)}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full" style={{ border: '3px solid rgba(88,196,220,0.2)', borderTopColor: '#58c4dc' }} />
        </div>
      ) : (
        <div className="relative z-10 px-4 pb-24">
          {/* Create share button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreate(true)}
            className="w-full py-4 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffc800, #cc9f00)',
              color: '#0f1f2e',
              boxShadow: '0 6px 25px rgba(255,200,0,0.35)',
              border: '2px solid rgba(255,224,102,0.3)',
            }}
          >
            <Plus className="w-4 h-4" />
            مشاركة جديدة
          </motion.button>

          {/* Shares list */}
          {shares.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-16"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: '#1a3347', border: '2px solid rgba(88,196,220,0.1)' }}
              >
                <Gift className="w-8 h-8" style={{ color: '#5a7f8f' }} />
              </motion.div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#f8f5f0' }}>مفيش مشاركات بعد</h3>
              <p className="text-xs text-center leading-relaxed" style={{ color: '#a3c4d0' }}>
                شارك تقدمك مع أصحابك وخلّيهم يشجعوك!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {shares.map((share, i) => (
                <motion.div
                  key={share.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'linear-gradient(145deg, #1a3347, #162d40)',
                    border: '1px solid rgba(88,196,220,0.1)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold" style={{ color: '#f8f5f0' }}>
                        {share.title}
                      </h4>
                      {share.message && (
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#a3c4d0' }}>
                          {share.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" style={{ color: '#5a7f8f' }} />
                        <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>
                          {share.views}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" style={{ color: '#5a7f8f' }} />
                        <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>
                          {formatDate(share.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleNativeShare(share)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(88,196,220,0.08)' }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" style={{ color: '#58c4dc' }} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopyLink(share)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: copiedKey === share.id
                            ? 'rgba(88,204,2,0.15)'
                            : 'rgba(88,196,220,0.08)',
                        }}
                      >
                        {copiedKey === share.id ? (
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#58cc02' }} />
                        ) : (
                          <Copy className="w-3.5 h-3.5" style={{ color: '#58c4dc' }} />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(share.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,75,75,0.06)' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#ff4b4b' }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create share modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowCreate(false)}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-0 sm:mx-4 mb-0 sm:mb-0 rounded-t-3xl sm:rounded-3xl overflow-hidden"
              style={{
                backgroundColor: '#162d40',
                border: '1px solid rgba(88,196,220,0.15)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
              }}
            >
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to left, #ffc800, #ffc80040, transparent)' }} />
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(90,127,143,0.4)' }} />
              </div>

              <div className="px-5 sm:px-6 pb-6 pt-2">
                {/* Mascot */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ background: 'rgba(255,200,0,0.1)', border: '1.5px solid rgba(255,200,0,0.2)' }}>
                    <Image src="/roadmap/characters/mascot.png" alt="وصال" width={36} height={36} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold" style={{ color: '#f8f5f0' }}>شارك تقدمك!</h3>
                    <p className="text-xs" style={{ color: '#a3c4d0' }}>خلّي أصحابك يشجعوك في رحلتك</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: '#a3c4d0' }}>عنوان المشاركة</label>
                    <input
                      type="text"
                      value={createTitle}
                      onChange={(e) => setCreateTitle(e.target.value)}
                      placeholder="مثال: أنا في رحلة التعافي!"
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2"
                      style={{
                        background: '#0f1f2e',
                        border: '1.5px solid rgba(88,196,220,0.12)',
                        color: '#f8f5f0',
                        caretColor: '#58c4dc',
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: '#a3c4d0' }}>رسالة (اختياري)</label>
                    <textarea
                      value={createMessage}
                      onChange={(e) => setCreateMessage(e.target.value)}
                      placeholder="اكتب رسالة تشجيعية أو حديث عن تقدمك..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 resize-none"
                      style={{
                        background: '#0f1f2e',
                        border: '1.5px solid rgba(88,196,220,0.12)',
                        color: '#f8f5f0',
                        caretColor: '#58c4dc',
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm"
                    style={{ background: '#152535', color: '#a3c4d0', border: '1px solid rgba(88,196,220,0.08)' }}
                  >
                    إلغاء
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2"
                    style={{
                      background: isCreating
                        ? 'linear-gradient(135deg, #508992, #3a6b75)'
                        : 'linear-gradient(135deg, #ffc800, #cc9f00)',
                      color: '#0f1f2e',
                    }}
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                    مشارك
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{ background: 'linear-gradient(to top, #0f1f2e 70%, transparent)', paddingTop: '24px' }}
      >
        <div className="px-4 pb-6 flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.04)', border: '1px solid rgba(88,196,220,0.08)' }}>
              <Gift className="w-5 h-5" style={{ color: '#5a7f8f' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>الرود ماب</span>
          </Link>

          <Link href="/progress" className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(88,196,220,0.04)', border: '1px solid rgba(88,196,220,0.08)' }}>
              <Zap className="w-5 h-5" style={{ color: '#5a7f8f' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#5a7f8f' }}>التقدم</span>
          </Link>

          <Link href="/shares" className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,200,0,0.12)', border: '1px solid rgba(255,200,0,0.2)' }}>
              <Share2 className="w-5 h-5" style={{ color: '#ffc800' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#ffc800' }}>المشاركات</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
