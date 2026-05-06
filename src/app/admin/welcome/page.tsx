'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquareHeart,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function WelcomeMessagesPage() {
  const [messages, setMessages] = useState<WelcomeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create/Edit dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<WelcomeMessage | null>(null);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<WelcomeMessage | null>(null);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/welcome');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل رسائل الترحيب',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = messages.filter(
    (m) =>
      m.title.includes(searchQuery) || m.message.includes(searchQuery)
  );

  function openCreate() {
    setEditingMessage(null);
    setFormData({ title: '', message: '' });
    setFormOpen(true);
  }

  function openEdit(msg: WelcomeMessage) {
    setEditingMessage(msg);
    setFormData({ title: msg.title, message: msg.message });
    setFormOpen(true);
  }

  function openPreview(msg: WelcomeMessage) {
    setPreviewMessage(msg);
    setPreviewOpen(true);
  }

  async function handleSubmit() {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: 'خطأ',
        description: 'العنوان والرسالة مطلوبان',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const url = editingMessage
        ? `/api/welcome/${editingMessage.id}`
        : '/api/welcome';
      const method = editingMessage ? 'PUT' : 'POST';

      const body: Record<string, unknown> = {
        title: formData.title,
        message: formData.message,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ');
      }

      toast({
        title: editingMessage ? 'تم التحديث' : 'تم الإنشاء',
        description: editingMessage
          ? 'تم تحديث رسالة الترحيب بنجاح'
          : 'تم إنشاء رسالة الترحيب بنجاح',
      });

      setFormOpen(false);
      fetchMessages();
    } catch (err) {
      toast({
        title: 'خطأ',
        description: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(msg: WelcomeMessage) {
    try {
      const res = await fetch(`/api/welcome/${msg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !msg.isActive }),
      });

      if (!res.ok) throw new Error('فشل تحديث الحالة');

      toast({
        title: 'تم التحديث',
        description: msg.isActive
          ? 'تم إلغاء تفعيل الرسالة'
          : 'تم تفعيل الرسالة',
      });
      fetchMessages();
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الحالة',
        variant: 'destructive',
      });
    }
  }

  function confirmDelete(id: string) {
    setDeletingId(id);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/welcome/${deletingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('فشل الحذف');

      toast({ title: 'تم الحذف', description: 'تم حذف الرسالة بنجاح' });
      setDeleteOpen(false);
      setDeletingId(null);
      fetchMessages();
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الرسالة',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f8f5f0]">
            رسائل الترحيب
          </h1>
          <p className="mt-1 text-sm text-[#5a7f8f]">
            إدارة رسائل الترحيب والتشجيع للمستخدمين الجدد
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#ffc800] hover:bg-[#ffc800]/80 text-[#0f1f2e] font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          رسالة جديدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ffc800]/10 text-[#ffc800]">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#f8f5f0]">{messages.length}</p>
              <p className="text-xs text-[#5a7f8f]">إجمالي الرسائل</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#58cc02]/10 text-[#58cc02]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#f8f5f0]">
                {messages.filter((m) => m.isActive).length}
              </p>
              <p className="text-xs text-[#5a7f8f]">رسائل مفعّلة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)] hidden sm:block">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#a3c4d0]/10 text-[#a3c4d0]">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#f8f5f0]">
                {messages.filter((m) => !m.isActive).length}
              </p>
              <p className="text-xs text-[#5a7f8f]">رسائل معطّلة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a7f8f]" />
        <Input
          placeholder="ابحث في الرسائل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 bg-[#1a3347] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
        />
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]"
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40 bg-[#162d40]" />
                  <Skeleton className="h-4 w-full bg-[#162d40]" />
                  <Skeleton className="h-4 w-3/4 bg-[#162d40]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <MessageSquareHeart className="w-16 h-16 mx-auto text-[#5a7f8f]/30 mb-4" />
          <p className="text-[#5a7f8f] text-lg">لا توجد رسائل ترحيب</p>
          <p className="text-[#5a7f8f]/60 text-sm mt-1">
            اضغط &quot;رسالة جديدة&quot; لإنشاء أول رسالة
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {filteredMessages.map((msg) => (
              <motion.div key={msg.id} variants={item} layout>
                <Card
                  className={`bg-[#1a3347] border transition-all duration-200 ${
                    msg.isActive
                      ? 'border-[rgba(88,196,220,0.15)] hover:border-[#58c4dc]/30'
                      : 'border-[rgba(88,196,220,0.05)] hover:border-[rgba(88,196,220,0.1)] opacity-70'
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-xl flex-shrink-0 ${
                          msg.isActive
                            ? 'bg-[#ffc800]/10 text-[#ffc800]'
                            : 'bg-[#5a7f8f]/10 text-[#5a7f8f]'
                        }`}
                      >
                        {msg.isActive ? (
                          <Sparkles className="w-5 h-5" />
                        ) : (
                          <MessageSquareHeart className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-[#f8f5f0]">
                            {msg.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`border-0 text-xs ${
                              msg.isActive
                                ? 'bg-[#58cc02]/15 text-[#58cc02]'
                                : 'bg-[#5a7f8f]/15 text-[#5a7f8f]'
                            }`}
                          >
                            {msg.isActive ? 'مفعّلة' : 'معطّلة'}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#a3c4d0] line-clamp-2">
                          {msg.message}
                        </p>
                        <p className="text-xs text-[#5a7f8f] mt-2">
                          {new Date(msg.createdAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <Switch
                          checked={msg.isActive}
                          onCheckedChange={() => toggleActive(msg)}
                          className="data-[state=checked]:bg-[#58cc02]"
                        />
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPreview(msg)}
                            className="text-[#58c4dc] hover:text-[#58c4dc] hover:bg-[#58c4dc]/10 h-8 w-8 p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(msg)}
                            className="text-[#5a7f8f] hover:text-[#ffc800] hover:bg-[#ffc800]/10 h-8 w-8 p-1"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(msg.id)}
                            className="text-[#5a7f8f] hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-lg sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0] text-lg">
              {editingMessage ? 'تعديل رسالة الترحيب' : 'رسالة ترحيب جديدة'}
            </DialogTitle>
            <DialogDescription className="text-[#5a7f8f]">
              {editingMessage
                ? 'قم بتعديل محتوى الرسالة'
                : 'أدخل محتوى رسالة الترحيب الجديدة'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">العنوان *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="مثال: مرحباً بك في وصال!"
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">نص الرسالة *</Label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="اكتب رسالة ترحيب مشجعة للمستخدم الجديد..."
                rows={5}
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] resize-none"
              />
              <p className="text-xs text-[#5a7f8f]">
                {formData.message.length} حرف
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setFormOpen(false)}
              className="text-[#a3c4d0] hover:text-[#f8f5f0]"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#ffc800] hover:bg-[#ffc800]/80 text-[#0f1f2e] font-bold min-w-[100px]"
            >
              {submitting && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
              {editingMessage ? 'حفظ التعديلات' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0] text-lg">
              معاينة الرسالة
            </DialogTitle>
          </DialogHeader>
          {previewMessage && (
            <div className="space-y-4">
              {/* Simulated Phone Preview */}
              <div className="mx-auto w-full max-w-[280px] bg-[#0f1f2e] rounded-2xl p-5 border border-[rgba(88,196,220,0.15)] shadow-xl">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#58c4dc]/20 flex items-center justify-center mb-2">
                    <MessageSquareHeart className="w-6 h-6 text-[#58c4dc]" />
                  </div>
                </div>
                <div className="bg-[#1a3347] rounded-xl p-4">
                  <h4 className="text-sm font-bold text-[#ffc800] mb-2 text-center">
                    {previewMessage.title}
                  </h4>
                  <p className="text-xs text-[#a3c4d0] leading-relaxed whitespace-pre-wrap text-center">
                    {previewMessage.message}
                  </p>
                </div>
                <div className="mt-3 flex justify-center">
                  <div className="px-4 py-1.5 rounded-full bg-[#58c4dc]/10 text-[#58c4dc] text-xs">
                    ✨ وصال
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5a7f8f]">
                <Badge
                  variant="secondary"
                  className={`border-0 text-xs ${
                    previewMessage.isActive
                      ? 'bg-[#58cc02]/15 text-[#58cc02]'
                      : 'bg-[#5a7f8f]/15 text-[#5a7f8f]'
                  }`}
                >
                  {previewMessage.isActive ? 'مفعّلة' : 'معطّلة'}
                </Badge>
                <span>
                  تاريخ الإنشاء:{' '}
                  {new Date(previewMessage.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f8f5f0]">
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#a3c4d0]">
              هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#a3c4d0] hover:text-[#f8f5f0] border-[rgba(88,196,220,0.15)]">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0 font-bold"
            >
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
