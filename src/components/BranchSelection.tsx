'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft } from 'lucide-react';

interface Branch {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  branchType: string;
}

interface BranchSelectionProps {
  branches: Branch[];
  branchType: string;
  title: string;
  subtitle: string;
  onSelect: (branchId: string) => void;
  onDismiss: () => void;
}

export default function BranchSelection({
  branches,
  branchType,
  title,
  subtitle,
  onSelect,
  onDismiss,
}: BranchSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleSelect = useCallback((branchId: string) => {
    if (confirming) return;
    setSelectedId(branchId);
    setConfirming(true);
  }, [confirming]);

  const handleConfirm = useCallback(() => {
    if (selectedId) {
      onSelect(selectedId);
    }
  }, [selectedId, onSelect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full py-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(145deg, rgba(255,200,0,0.2), rgba(255,200,0,0.05))',
            border: '2px solid rgba(255,200,0,0.3)',
            boxShadow: '0 0 30px rgba(255,200,0,0.15)',
          }}
        >
          <Sparkles className="w-8 h-8" style={{ color: '#ffc800' }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl sm:text-2xl font-extrabold mb-2"
          style={{ color: '#f8f5f0' }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm"
          style={{ color: '#a3c4d0' }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-2">
        <AnimatePresence>
          {branches.map((branch, i) => (
            <motion.button
              key={branch.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
              whileHover={!confirming ? { scale: 1.04, y: -4 } : {}}
              whileTap={!confirming ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(branch.id)}
              disabled={confirming}
              className="relative p-4 rounded-2xl text-center transition-all"
              style={{
                background: selectedId === branch.id
                  ? 'linear-gradient(145deg, rgba(255,200,0,0.15), rgba(255,200,0,0.03))'
                  : 'linear-gradient(145deg, #1a3347, #162d40)',
                border: selectedId === branch.id
                  ? '2px solid rgba(255,200,0,0.4)'
                  : '2px solid rgba(88,196,220,0.1)',
                boxShadow: selectedId === branch.id
                  ? '0 0 20px rgba(255,200,0,0.2), 0 4px 15px rgba(0,0,0,0.3)'
                  : '0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              {/* Icon / Emoji placeholder */}
              <div
                className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 text-2xl"
                style={{
                  background: selectedId === branch.id
                    ? 'rgba(255,200,0,0.15)'
                    : 'rgba(88,196,220,0.1)',
                }}
              >
                {branch.icon || branchType === 'hobby' ? '🎯' : '🔧'}
              </div>
              <h4
                className="text-xs sm:text-sm font-extrabold leading-tight"
                style={{ color: selectedId === branch.id ? '#ffc800' : '#f8f5f0' }}
              >
                {branch.title}
              </h4>
              {branch.description && (
                <p className="text-[10px] mt-1 leading-relaxed line-clamp-2" style={{ color: '#5a7f8f' }}>
                  {branch.description}
                </p>
              )}

              {/* Selected check */}
              {selectedId === branch.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#ffc800' }}
                >
                  <span className="text-[10px] font-bold" style={{ color: '#0f1f2e' }}>✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm button */}
      <AnimatePresence>
        {confirming && selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #ffc800, #cc9f00)',
                color: '#0f1f2e',
                boxShadow: '0 6px 25px rgba(255,200,0,0.35)',
                border: '2px solid rgba(255,224,102,0.3)',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              تأكيد الاختيار
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {!confirming && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onDismiss}
          className="block mx-auto mt-6 text-xs font-medium px-6 py-2 rounded-xl transition-all"
          style={{ color: '#5a7f8f', background: 'rgba(88,196,220,0.05)' }}
        >
          تخطي الآن
        </motion.button>
      )}
    </motion.div>
  );
}
