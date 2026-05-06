'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Map,
  Edit3,
  Trash2,
  ArrowLeft,
  Users,
  Calendar,
  Eye,
  MoreVertical,
  Lock,
  FileEdit,
  Search,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Roadmap {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  targetAudience: string | null;
  coverImage: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  weeks?: unknown[];
  _count?: { enrollments: number };
}

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  active: { label: 'نشط', color: 'text-[#58cc02]', bgColor: 'bg-[#58cc02]/15' },
  draft: {
    label: 'مسودة',
    color: 'text-[#ffc800]',
    bgColor: 'bg-[#ffc800]/15',
  },
  closed: {
    label: 'مغلق',
    color: 'text-[#a3c4d0]',
    bgColor: 'bg-[#a3c4d0]/15',
  },
  archived: {
    label: 'مؤرشف',
    color: 'text-[#5a7f8f]',
    bgColor: 'bg-[#5a7f8f]/15',
  },
};

const typeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  free: { label: 'مجاني', color: 'text-[#58cc02]', bgColor: 'bg-[#58cc02]/15' },
  paid: { label: 'مدفوع', color: 'text-[#ffc800]', bgColor: 'bg-[#ffc800]/15' },
};

const emptyForm = {
  title: '',
  description: '',
  type: 'free',
  status: 'draft',
  targetAudience: '',
};

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Create/Edit dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchRoadmaps = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/roadmaps');
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المسارات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesSearch =
      r.title.includes(searchQuery) ||
      (r.description && r.description.includes(searchQuery));
    const matchesStatus =
      statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function openCreate() {
    setEditingRoadmap(null);
    setFormData(emptyForm);
    setFormOpen(true);
  }

  function openEdit(roadmap: Roadmap) {
    setEditingRoadmap(roadmap);
    setFormData({
      title: roadmap.title,
      description: roadmap.description || '',
      type: roadmap.type,
      status: roadmap.status,
      targetAudience: roadmap.targetAudience || '',
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!formData.title.trim()) {
      toast({
        title: 'خطأ',
        description: 'عنوان المسار مطلوب',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const url = editingRoadmap
        ? `/api/roadmaps/${editingRoadmap.id}`
        : '/api/roadmaps';
      const method = editingRoadmap ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ');
      }

      toast({
        title: editingRoadmap ? 'تم التحديث' : 'تم الإنشاء',
        description: editingRoadmap
          ? 'تم تحديث المسار بنجاح'
          : 'تم إنشاء المسار بنجاح',
      });

      setFormOpen(false);
      fetchRoadmaps();
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

  function confirmDelete(id: string) {
    setDeletingId(id);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/roadmaps/${deletingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('فشل الحذف');

      toast({ title: 'تم الحذف', description: 'تم حذف المسار بنجاح' });
      setDeleteOpen(false);
      setDeletingId(null);
      fetchRoadmaps();
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف المسار',
        variant: 'destructive',
      });
    }
  }

  async function toggleStatus(roadmap: Roadmap) {
    const newStatus = roadmap.status === 'active' ? 'closed' : 'active';
    try {
      const res = await fetch(`/api/roadmaps/${roadmap.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('فشل تحديث الحالة');

      toast({
        title: 'تم التحديث',
        description: `تم تغيير حالة المسار إلى ${statusConfig[newStatus]?.label}`,
      });
      fetchRoadmaps();
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الحالة',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f8f5f0]">
            إدارة المسارات
          </h1>
          <p className="mt-1 text-sm text-[#5a7f8f]">
            إنشاء وتعديل مسارات التعلم
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#58c4dc] hover:bg-[#58c4dc]/80 text-[#0f1f2e] font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          مسار جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a7f8f]" />
          <Input
            placeholder="ابحث في المسارات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-[#1a3347] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-40 bg-[#1a3347] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="closed">مغلق</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Roadmaps List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl bg-[#162d40] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48 bg-[#162d40]" />
                    <Skeleton className="h-4 w-72 bg-[#162d40]" />
                    <Skeleton className="h-3 w-24 bg-[#162d40]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRoadmaps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Map className="w-16 h-16 mx-auto text-[#5a7f8f]/30 mb-4" />
          <p className="text-[#5a7f8f] text-lg">لا توجد مسارات</p>
          <p className="text-[#5a7f8f]/60 text-sm mt-1">
            اضغط &quot;مسار جديد&quot; لإنشاء أول مسار
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            className="space-y-3"
          >
            {filteredRoadmaps.map((roadmap) => {
              const status = statusConfig[roadmap.status] || statusConfig.draft;
              const type = typeConfig[roadmap.type] || typeConfig.free;

              return (
                <motion.div
                  key={roadmap.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  layout
                >
                  <Card className="group bg-[#1a3347] border-[rgba(88,196,220,0.1)] hover:border-[#58c4dc]/20 transition-all duration-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="p-3 rounded-xl bg-[#58c4dc]/10 text-[#58c4dc] flex-shrink-0 hidden sm:block">
                          <Map className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Link
                              href={`/admin/roadmaps/${roadmap.id}`}
                              className="text-lg font-bold text-[#f8f5f0] hover:text-[#58c4dc] transition-colors truncate"
                            >
                              {roadmap.title}
                            </Link>
                            <Badge
                              variant="secondary"
                              className={`${status.bgColor} ${status.color} border-0 text-xs`}
                            >
                              {status.label}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`${type.bgColor} ${type.color} border-0 text-xs`}
                            >
                              {type.label}
                            </Badge>
                          </div>
                          {roadmap.description && (
                            <p className="text-sm text-[#a3c4d0] line-clamp-2 mb-2">
                              {roadmap.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-[#5a7f8f]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(roadmap.createdAt).toLocaleDateString(
                                'ar-SA'
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {roadmap._count?.enrollments || 0} مسجّل
                            </span>
                            {roadmap.weeks && (
                              <span className="flex items-center gap-1">
                                <FileEdit className="w-3.5 h-3.5" />
                                {roadmap.weeks.length} أسبوع
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={`/admin/roadmaps/${roadmap.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#58c4dc] hover:text-[#58c4dc] hover:bg-[#58c4dc]/10"
                            >
                              <Eye className="w-4 h-4 sm:ml-1" />
                              <span className="hidden sm:inline">عرض</span>
                            </Button>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#a3c4d0] hover:text-[#f8f5f0] hover:bg-[#162d40]"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]"
                            >
                              <DropdownMenuItem
                                onClick={() => openEdit(roadmap)}
                                className="text-[#f8f5f0] hover:bg-[#162d40] focus:bg-[#162d40] cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4 ml-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleStatus(roadmap)}
                                className="text-[#f8f5f0] hover:bg-[#162d40] focus:bg-[#162d40] cursor-pointer"
                              >
                                {roadmap.status === 'active' ? (
                                  <>
                                    <Lock className="w-4 h-4 ml-2" />
                                    إغلاق
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 ml-2" />
                                    تفعيل
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => confirmDelete(roadmap.id)}
                                className="text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-lg sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0] text-lg">
              {editingRoadmap ? 'تعديل المسار' : 'إنشاء مسار جديد'}
            </DialogTitle>
            <DialogDescription className="text-[#5a7f8f]">
              {editingRoadmap
                ? 'قم بتعديل بيانات المسار'
                : 'أدخل بيانات المسار الجديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">عنوان المسار *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="مثال: رحلة التعافي من التعفن الدماغي"
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="وصف مختصر عن المسار..."
                rows={3}
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[#a3c4d0] text-sm">النوع</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, type: v })
                  }
                >
                  <SelectTrigger className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
                    <SelectItem value="free">مجاني</SelectItem>
                    <SelectItem value="paid">مدفوع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingRoadmap && (
                <div className="space-y-2">
                  <Label className="text-[#a3c4d0] text-sm">الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="closed">مغلق</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الفئة المستهدفة</Label>
              <Input
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAudience: e.target.value,
                  })
                }
                placeholder="مثال: الشباب من ١٨ إلى ٣٠ سنة"
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
              />
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
              className="bg-[#58c4dc] hover:bg-[#58c4dc]/80 text-[#0f1f2e] font-bold min-w-[100px]"
            >
              {submitting ? 'جارٍ الحفظ...' : editingRoadmap ? 'حفظ التعديلات' : 'إنشاء'}
            </Button>
          </DialogFooter>
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
              هل أنت متأكد من حذف هذا المسار؟ سيتم حذف جميع الأسابيع والأيام
              والمحتوى المرتبط به. لا يمكن التراجع عن هذا الإجراء.
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
