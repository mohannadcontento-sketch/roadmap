'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileEdit,
  Play,
  BookOpen,
  Gamepad2,
  ListChecks,
  Star,
  GripVertical,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

/* ── Types ── */
interface ContentItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  url: string | null;
  xpReward: number;
  sortOrder: number;
}

interface Day {
  id: string;
  title: string;
  description: string | null;
  xpReward: number;
  sortOrder: number;
  content: ContentItem[];
}

interface Week {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  days: Day[];
}

interface RoadmapData {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  targetAudience: string | null;
  weeks: Week[];
  _count?: { enrollments: number };
}

/* ── Helpers ── */
const contentTypeConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  youtube_reel: {
    label: 'فيديو',
    icon: <Play className="w-4 h-4" />,
    color: 'text-red-400',
    bgColor: 'bg-red-400/15',
  },
  game_challenge: {
    label: 'تحدي',
    icon: <Gamepad2 className="w-4 h-4" />,
    color: 'text-[#58cc02]',
    bgColor: 'bg-[#58cc02]/15',
  },
  article: {
    label: 'مقال',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'text-[#58c4dc]',
    bgColor: 'bg-[#58c4dc]/15',
  },
  task: {
    label: 'مهمة',
    icon: <ListChecks className="w-4 h-4" />,
    color: 'text-[#ffc800]',
    bgColor: 'bg-[#ffc800]/15',
  },
};

/* ── Component ── */
export default function RoadmapEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);

  // Dialog states
  const [weekDialogOpen, setWeekDialogOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState<Week | null>(null);
  const [weekForm, setWeekForm] = useState({ title: '', description: '' });

  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<Day | null>(null);
  const [dayForm, setDayForm] = useState({
    title: '',
    description: '',
    xpReward: '10',
    targetWeekId: '',
  });

  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [contentForm, setContentForm] = useState({
    type: 'article',
    title: '',
    description: '',
    url: '',
    xpReward: '5',
    targetDayId: '',
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'week' | 'day' | 'content';
    id: string;
    label: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/roadmaps/${id}`);
      if (!res.ok) throw new Error('المسار غير موجود');
      const data = await res.json();
      setRoadmap(data.roadmap);
      // Expand first week by default
      if (data.roadmap.weeks?.length > 0) {
        setExpandedWeeks([data.roadmap.weeks[0].id]);
        if (data.roadmap.weeks[0].days?.length > 0) {
          setExpandedDays([data.roadmap.weeks[0].days[0].id]);
        }
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المسار',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  /* ── Week CRUD ── */
  function openCreateWeek() {
    setEditingWeek(null);
    setWeekForm({ title: '', description: '' });
    setWeekDialogOpen(true);
  }

  function openEditWeek(week: Week) {
    setEditingWeek(week);
    setWeekForm({ title: week.title, description: week.description || '' });
    setWeekDialogOpen(true);
  }

  async function handleWeekSubmit() {
    if (!weekForm.title.trim()) return;
    try {
      setSubmitting(true);
      const nextOrder = roadmap
        ? (roadmap.weeks?.length || 0)
        : 0;

      const res = await fetch(`/api/roadmaps/${id}/weeks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...weekForm,
          sortOrder: editingWeek ? editingWeek.sortOrder : nextOrder,
        }),
      });
      if (!res.ok) throw new Error('فشل في حفظ الأسبوع');

      if (editingWeek) {
        await fetch(`/api/weeks/${editingWeek.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: weekForm.title,
            description: weekForm.description || null,
          }),
        });
      }

      toast({
        title: 'تم الحفظ',
        description: editingWeek
          ? 'تم تحديث الأسبوع بنجاح'
          : 'تم إنشاء الأسبوع بنجاح',
      });
      setWeekDialogOpen(false);
      fetchRoadmap();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في حفظ الأسبوع', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  async function moveWeek(week: Week, direction: 'up' | 'down') {
    if (!roadmap?.weeks) return;
    const idx = roadmap.weeks.findIndex((w) => w.id === week.id);
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= roadmap.weeks.length) return;

    const otherWeek = roadmap.weeks[newIdx];
    try {
      await Promise.all([
        fetch(`/api/weeks/${week.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: otherWeek.sortOrder }),
        }),
        fetch(`/api/weeks/${otherWeek.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: week.sortOrder }),
        }),
      ]);
      fetchRoadmap();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في إعادة الترتيب', variant: 'destructive' });
    }
  }

  /* ── Day CRUD ── */
  function openCreateDay(weekId: string) {
    setEditingDay(null);
    setDayForm({ title: '', description: '', xpReward: '10', targetWeekId: weekId });
    setDayDialogOpen(true);
  }

  function openEditDay(day: Day, weekId: string) {
    setEditingDay(day);
    setDayForm({
      title: day.title,
      description: day.description || '',
      xpReward: String(day.xpReward),
      targetWeekId: weekId,
    });
    setDayDialogOpen(true);
  }

  async function handleDaySubmit() {
    if (!dayForm.title.trim() || !dayForm.targetWeekId) return;
    try {
      setSubmitting(true);

      if (editingDay) {
        const res = await fetch(`/api/days/${editingDay.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: dayForm.title,
            description: dayForm.description || null,
            xpReward: parseInt(dayForm.xpReward) || 10,
          }),
        });
        if (!res.ok) throw new Error('فشل في تحديث اليوم');
      } else {
        const week = roadmap?.weeks?.find((w) => w.id === dayForm.targetWeekId);
        const nextOrder = week ? (week.days?.length || 0) : 0;
        const res = await fetch(`/api/weeks/${dayForm.targetWeekId}/days`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: dayForm.title,
            description: dayForm.description || null,
            xpReward: parseInt(dayForm.xpReward) || 10,
            sortOrder: nextOrder,
          }),
        });
        if (!res.ok) throw new Error('فشل في إنشاء اليوم');
      }

      toast({
        title: 'تم الحفظ',
        description: editingDay ? 'تم تحديث اليوم بنجاح' : 'تم إنشاء اليوم بنجاح',
      });
      setDayDialogOpen(false);
      fetchRoadmap();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في الحفظ', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Content CRUD ── */
  function openCreateContent(dayId: string) {
    setEditingContent(null);
    setContentForm({
      type: 'article',
      title: '',
      description: '',
      url: '',
      xpReward: '5',
      targetDayId: dayId,
    });
    setContentDialogOpen(true);
  }

  function openEditContent(content: ContentItem, dayId: string) {
    setEditingContent(content);
    setContentForm({
      type: content.type,
      title: content.title,
      description: content.description || '',
      url: content.url || '',
      xpReward: String(content.xpReward),
      targetDayId: dayId,
    });
    setContentDialogOpen(true);
  }

  async function handleContentSubmit() {
    if (!contentForm.title.trim() || !contentForm.targetDayId) return;
    try {
      setSubmitting(true);

      if (editingContent) {
        const res = await fetch(`/api/content/${editingContent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: contentForm.type,
            title: contentForm.title,
            description: contentForm.description || null,
            url: contentForm.url || null,
            xpReward: parseInt(contentForm.xpReward) || 5,
          }),
        });
        if (!res.ok) throw new Error('فشل في تحديث المحتوى');
      } else {
        const res = await fetch(`/api/days/${contentForm.targetDayId}/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: contentForm.type,
            title: contentForm.title,
            description: contentForm.description || null,
            url: contentForm.url || null,
            xpReward: parseInt(contentForm.xpReward) || 5,
          }),
        });
        if (!res.ok) throw new Error('فشل في إنشاء المحتوى');
      }

      toast({
        title: 'تم الحفظ',
        description: editingContent ? 'تم تحديث المحتوى' : 'تم إنشاء المحتوى',
      });
      setContentDialogOpen(false);
      fetchRoadmap();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في الحفظ', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Delete ── */
  function confirmDelete(
    type: 'week' | 'day' | 'content',
    deleteId: string,
    label: string
  ) {
    setDeleteTarget({ type, id: deleteId, label });
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      let endpoint = '';
      if (deleteTarget.type === 'week') endpoint = `/api/weeks/${deleteTarget.id}`;
      else if (deleteTarget.type === 'day') endpoint = `/api/days/${deleteTarget.id}`;
      else endpoint = `/api/content/${deleteTarget.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');

      toast({ title: 'تم الحذف', description: `تم حذف ${deleteTarget.label} بنجاح` });
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchRoadmap();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في الحذف', variant: 'destructive' });
    }
  }

  function toggleWeek(id: string) {
    setExpandedWeeks((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }

  function toggleDay(id: string) {
    setExpandedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  /* ── Render ── */
  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-40 bg-[#162d40]" />
        <Skeleton className="h-20 w-full bg-[#1a3347] rounded-xl" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full bg-[#1a3347] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-16">
        <p className="text-[#5a7f8f]">المسار غير موجود</p>
      </div>
    );
  }

  const totalDays = roadmap.weeks?.reduce(
    (acc, w) => acc + (w.days?.length || 0),
    0
  ) || 0;
  const totalContent = roadmap.weeks?.reduce(
    (acc, w) =>
      acc +
      (w.days?.reduce((a, d) => a + (d.content?.length || 0), 0) || 0),
    0
  ) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/roadmaps')}
          className="text-[#a3c4d0] hover:text-[#f8f5f0] hover:bg-[#162d40] p-2"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#f8f5f0]">
            {roadmap.title}
          </h1>
          {roadmap.description && (
            <p className="text-sm text-[#5a7f8f] mt-0.5 line-clamp-1">
              {roadmap.description}
            </p>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-[#162d40] text-center">
              <Calendar className="w-5 h-5 mx-auto text-[#58c4dc] mb-1" />
              <p className="text-lg font-bold text-[#f8f5f0]">
                {roadmap.weeks?.length || 0}
              </p>
              <p className="text-xs text-[#5a7f8f]">أسبوع</p>
            </div>
            <div className="p-3 rounded-xl bg-[#162d40] text-center">
              <FileEdit className="w-5 h-5 mx-auto text-[#ffc800] mb-1" />
              <p className="text-lg font-bold text-[#f8f5f0]">{totalDays}</p>
              <p className="text-xs text-[#5a7f8f]">يوم</p>
            </div>
            <div className="p-3 rounded-xl bg-[#162d40] text-center">
              <Star className="w-5 h-5 mx-auto text-[#58cc02] mb-1" />
              <p className="text-lg font-bold text-[#f8f5f0]">{totalContent}</p>
              <p className="text-xs text-[#5a7f8f]">محتوى</p>
            </div>
            <div className="p-3 rounded-xl bg-[#162d40] text-center">
              <GripVertical className="w-5 h-5 mx-auto text-[#e879a0] mb-1" />
              <p className="text-lg font-bold text-[#f8f5f0]">
                {roadmap._count?.enrollments || 0}
              </p>
              <p className="text-xs text-[#5a7f8f]">مسجّل</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weeks Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#f8f5f0]">الأسابيع</h2>
        <Button
          onClick={openCreateWeek}
          size="sm"
          className="bg-[#58c4dc] hover:bg-[#58c4dc]/80 text-[#0f1f2e] font-bold gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          أسبوع جديد
        </Button>
      </div>

      {(!roadmap.weeks || roadmap.weeks.length === 0) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-[#1a3347] rounded-xl border border-[rgba(88,196,220,0.1)]"
        >
          <Calendar className="w-12 h-12 mx-auto text-[#5a7f8f]/30 mb-3" />
          <p className="text-[#5a7f8f]">لا توجد أسابيع بعد</p>
          <p className="text-[#5a7f8f]/60 text-sm mt-1">
            اضغط &quot;أسبوع جديد&quot; للبدء
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {roadmap.weeks.map((week, weekIdx) => {
              const isWeekOpen = expandedWeeks.includes(week.id);
              return (
                <motion.div
                  key={week.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: weekIdx * 0.04 }}
                >
                  <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)] overflow-hidden">
                    {/* Week Header */}
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#162d40]/50 transition-colors"
                      onClick={() => toggleWeek(week.id)}
                    >
                      <div className="p-2 rounded-lg bg-[#58c4dc]/10 text-[#58c4dc] flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#f8f5f0]">
                            {week.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-[#162d40] text-[#5a7f8f] border-0 text-xs"
                          >
                            {week.days?.length || 0} يوم
                          </Badge>
                        </div>
                        {week.description && (
                          <p className="text-xs text-[#5a7f8f] mt-0.5 truncate">
                            {week.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Reorder buttons */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-[#5a7f8f] hover:text-[#f8f5f0] hover:bg-[#162d40] h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWeek(week, 'up');
                          }}
                          disabled={weekIdx === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-[#5a7f8f] hover:text-[#f8f5f0] hover:bg-[#162d40] h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWeek(week, 'down');
                          }}
                          disabled={weekIdx === (roadmap.weeks?.length || 0) - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-[#5a7f8f] hover:text-[#58c4dc] hover:bg-[#58c4dc]/10 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditWeek(week);
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-[#5a7f8f] hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete('week', week.id, week.title);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <motion.div
                          animate={{ rotate: isWeekOpen ? 180 : 0 }}
                          className="text-[#5a7f8f]"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Days (collapsible) */}
                    <AnimatePresence>
                      {isWeekOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[rgba(88,196,220,0.08)] bg-[#0f1f2e]/30">
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#5a7f8f] font-medium">
                                  الأيام
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCreateDay(week.id)}
                                  className="text-[#58c4dc] hover:text-[#58c4dc] hover:bg-[#58c4dc]/10 text-xs gap-1 h-7 px-2"
                                >
                                  <Plus className="w-3 h-3" />
                                  يوم جديد
                                </Button>
                              </div>

                              {(!week.days || week.days.length === 0) ? (
                                <p className="text-xs text-[#5a7f8f]/60 text-center py-4">
                                  لا توجد أيام في هذا الأسبوع
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {week.days.map((day) => {
                                    const isDayOpen = expandedDays.includes(day.id);
                                    return (
                                      <div
                                        key={day.id}
                                        className="rounded-lg bg-[#1a3347]/80 border border-[rgba(88,196,220,0.08)] overflow-hidden"
                                      >
                                        {/* Day Header */}
                                        <div
                                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#162d40]/40 transition-colors"
                                          onClick={() => toggleDay(day.id)}
                                        >
                                          <div className="p-1.5 rounded-md bg-[#ffc800]/10 text-[#ffc800] flex-shrink-0">
                                            <FileEdit className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-sm text-[#f8f5f0]">
                                              {day.title}
                                            </span>
                                          </div>
                                          <Badge
                                            variant="secondary"
                                            className="bg-[#ffc800]/10 text-[#ffc800] border-0 text-xs flex-shrink-0"
                                          >
                                            <Star className="w-3 h-3 ml-0.5" />
                                            {day.xpReward} XP
                                          </Badge>
                                          <div className="flex items-center gap-0.5 flex-shrink-0">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="p-1 text-[#5a7f8f] hover:text-[#58c4dc] hover:bg-[#58c4dc]/10 h-7 w-7"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openEditDay(day, week.id);
                                              }}
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="p-1 text-[#5a7f8f] hover:text-red-400 hover:bg-red-400/10 h-7 w-7"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDelete('day', day.id, day.title);
                                              }}
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <motion.div
                                              animate={{
                                                rotate: isDayOpen ? 180 : 0,
                                              }}
                                              className="text-[#5a7f8f]"
                                            >
                                              <ChevronDown className="w-3.5 h-3.5" />
                                            </motion.div>
                                          </div>
                                        </div>

                                        {/* Content Items (collapsible) */}
                                        <AnimatePresence>
                                          {isDayOpen && (
                                            <motion.div
                                              initial={{
                                                height: 0,
                                                opacity: 0,
                                              }}
                                              animate={{
                                                height: 'auto',
                                                opacity: 1,
                                              }}
                                              exit={{
                                                height: 0,
                                                opacity: 0,
                                              }}
                                              transition={{ duration: 0.2 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="border-t border-[rgba(88,196,220,0.06)] bg-[#0f1f2e]/20 p-2">
                                                <div className="flex items-center justify-between mb-2 px-1">
                                                  <span className="text-xs text-[#5a7f8f]">
                                                    المحتوى
                                                  </span>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      openCreateContent(day.id)
                                                    }
                                                    className="text-[#58cc02] hover:text-[#58cc02] hover:bg-[#58cc02]/10 text-xs gap-1 h-6 px-2"
                                                  >
                                                    <Plus className="w-3 h-3" />
                                                    إضافة
                                                  </Button>
                                                </div>

                                                {(!day.content ||
                                                  day.content.length === 0) ? (
                                                  <p className="text-xs text-[#5a7f8f]/60 text-center py-3">
                                                    لا يوجد محتوى
                                                  </p>
                                                ) : (
                                                  <div className="space-y-1">
                                                    {day.content.map(
                                                      (content) => {
                                                        const ctConfig =
                                                          contentTypeConfig[
                                                            content.type
                                                          ] ||
                                                          contentTypeConfig
                                                            .article;
                                                        return (
                                                          <div
                                                            key={content.id}
                                                            className="flex items-center gap-2 p-2 rounded-md bg-[#1a3347]/60 hover:bg-[#1a3347] transition-colors group"
                                                          >
                                                            <div
                                                              className={`p-1.5 rounded-md ${ctConfig.bgColor} ${ctConfig.color} flex-shrink-0`}
                                                            >
                                                              {ctConfig.icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                              <p className="text-xs font-medium text-[#f8f5f0] truncate">
                                                                {content.title}
                                                              </p>
                                                              {content.url && (
                                                                <a
                                                                  href={
                                                                    content.url
                                                                  }
                                                                  target="_blank"
                                                                  rel="noopener noreferrer"
                                                                  className="text-xs text-[#58c4dc] hover:underline truncate block"
                                                                  onClick={(e) =>
                                                                    e.stopPropagation()
                                                                  }
                                                                >
                                                                  <ExternalLink className="w-3 h-3 inline ml-0.5" />
                                                                  رابط
                                                                </a>
                                                              )}
                                                            </div>
                                                            <Badge
                                                              variant="secondary"
                                                              className="bg-[#58cc02]/10 text-[#58cc02] border-0 text-[10px] flex-shrink-0"
                                                            >
                                                              {content.xpReward} XP
                                                            </Badge>
                                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                              <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="p-1 text-[#5a7f8f] hover:text-[#58c4dc] hover:bg-[#58c4dc]/10 h-6 w-6"
                                                                onClick={() =>
                                                                  openEditContent(
                                                                    content,
                                                                    day.id
                                                                  )
                                                                }
                                                              >
                                                                <Edit3 className="w-3 h-3" />
                                                              </Button>
                                                              <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="p-1 text-[#5a7f8f] hover:text-red-400 hover:bg-red-400/10 h-6 w-6"
                                                                onClick={() =>
                                                                  confirmDelete(
                                                                    'content',
                                                                    content.id,
                                                                    content.title
                                                                  )
                                                                }
                                                              >
                                                                <Trash2 className="w-3 h-3" />
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Week Dialog ── */}
      <Dialog open={weekDialogOpen} onOpenChange={setWeekDialogOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0]">
              {editingWeek ? 'تعديل الأسبوع' : 'أسبوع جديد'}
            </DialogTitle>
            <DialogDescription className="text-[#5a7f8f]">
              {editingWeek
                ? 'قم بتعديل بيانات الأسبوع'
                : 'أدخل بيانات الأسبوع الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">عنوان الأسبوع *</Label>
              <Input
                value={weekForm.title}
                onChange={(e) =>
                  setWeekForm({ ...weekForm, title: e.target.value })
                }
                placeholder="مثال: الأسبوع الأول - التعرف على المشكلة"
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الوصف</Label>
              <Textarea
                value={weekForm.description}
                onChange={(e) =>
                  setWeekForm({
                    ...weekForm,
                    description: e.target.value,
                  })
                }
                placeholder="وصف مختصر..."
                rows={3}
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setWeekDialogOpen(false)}
              className="text-[#a3c4d0] hover:text-[#f8f5f0]"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleWeekSubmit}
              disabled={submitting}
              className="bg-[#58c4dc] hover:bg-[#58c4dc]/80 text-[#0f1f2e] font-bold"
            >
              {submitting && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
              {editingWeek ? 'حفظ' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Day Dialog ── */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0]">
              {editingDay ? 'تعديل اليوم' : 'يوم جديد'}
            </DialogTitle>
            <DialogDescription className="text-[#5a7f8f]">
              {editingDay ? 'قم بتعديل بيانات اليوم' : 'أدخل بيانات اليوم الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">عنوان اليوم *</Label>
              <Input
                value={dayForm.title}
                onChange={(e) =>
                  setDayForm({ ...dayForm, title: e.target.value })
                }
                placeholder="مثال: اليوم الأول - ما هو التعفن الدماغي؟"
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الوصف</Label>
              <Textarea
                value={dayForm.description}
                onChange={(e) =>
                  setDayForm({ ...dayForm, description: e.target.value })
                }
                placeholder="وصف مختصر..."
                rows={2}
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">مكافأة XP</Label>
              <Input
                type="number"
                value={dayForm.xpReward}
                onChange={(e) =>
                  setDayForm({ ...dayForm, xpReward: e.target.value })
                }
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDayDialogOpen(false)}
              className="text-[#a3c4d0] hover:text-[#f8f5f0]"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleDaySubmit}
              disabled={submitting}
              className="bg-[#ffc800] hover:bg-[#ffc800]/80 text-[#0f1f2e] font-bold"
            >
              {submitting && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
              {editingDay ? 'حفظ' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Content Dialog ── */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0]">
              {editingContent ? 'تعديل المحتوى' : 'محتوى جديد'}
            </DialogTitle>
            <DialogDescription className="text-[#5a7f8f]">
              {editingContent
                ? 'قم بتعديل بيانات المحتوى'
                : 'أدخل بيانات المحتوى الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">نوع المحتوى *</Label>
              <Select
                value={contentForm.type}
                onValueChange={(v) =>
                  setContentForm({ ...contentForm, type: v })
                }
              >
                <SelectTrigger className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
                  <SelectItem value="youtube_reel">🎬 فيديو يوتيوب</SelectItem>
                  <SelectItem value="game_challenge">🎮 تحدي</SelectItem>
                  <SelectItem value="article">📖 مقال</SelectItem>
                  <SelectItem value="task">✅ مهمة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">عنوان المحتوى *</Label>
              <Input
                value={contentForm.title}
                onChange={(e) =>
                  setContentForm({ ...contentForm, title: e.target.value })
                }
                placeholder="عنوان المحتوى"
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الوصف</Label>
              <Textarea
                value={contentForm.description}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    description: e.target.value,
                  })
                }
                placeholder="وصف مختصر..."
                rows={2}
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] resize-none"
              />
            </div>
            {(contentForm.type === 'youtube_reel' ||
              contentForm.type === 'article') && (
              <div className="space-y-2">
                <Label className="text-[#a3c4d0] text-sm">الرابط</Label>
                <Input
                  value={contentForm.url}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, url: e.target.value })
                  }
                  placeholder="https://..."
                  dir="ltr"
                  className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] text-left"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">مكافأة XP</Label>
              <Input
                type="number"
                value={contentForm.xpReward}
                onChange={(e) =>
                  setContentForm({ ...contentForm, xpReward: e.target.value })
                }
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setContentDialogOpen(false)}
              className="text-[#a3c4d0] hover:text-[#f8f5f0]"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleContentSubmit}
              disabled={submitting}
              className="bg-[#58cc02] hover:bg-[#58cc02]/80 text-[#0f1f2e] font-bold"
            >
              {submitting && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
              {editingContent ? 'حفظ' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f8f5f0]">
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#a3c4d0]">
              هل أنت متأكد من حذف &quot;{deleteTarget?.label}&quot;؟ سيتم حذف جميع المحتويات المرتبطة
              به. لا يمكن التراجع عن هذا الإجراء.
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
