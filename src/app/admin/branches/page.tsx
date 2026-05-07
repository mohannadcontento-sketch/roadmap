'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Loader2, GitBranch, Search,
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
import { useToast } from '@/hooks/use-toast';

interface Branch {
  id: string;
  roadmapId: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  branchType: string;
  sortOrder: number;
  requiredWeekIndex: number;
  isActive: boolean;
  createdAt: string;
  selections?: { id: string }[];
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    branchType: 'hobby',
    sortOrder: '0',
    requiredWeekIndex: '2',
    roadmapId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data.branches || []);
      }
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تحميل الفروع', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const filteredBranches = branches.filter(
    (b) => b.title.includes(searchQuery) || (b.description && b.description.includes(searchQuery))
  );

  function openCreate() {
    setEditingBranch(null);
    setFormData({
      title: '', description: '', icon: '', branchType: 'hobby',
      sortOrder: String(branches.length), requiredWeekIndex: '2', roadmapId: '',
    });
    setFormOpen(true);
  }

  function openEdit(branch: Branch) {
    setEditingBranch(branch);
    setFormData({
      title: branch.title,
      description: branch.description || '',
      icon: branch.icon || '',
      branchType: branch.branchType,
      sortOrder: String(branch.sortOrder),
      requiredWeekIndex: String(branch.requiredWeekIndex),
      roadmapId: branch.roadmapId,
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!formData.title.trim()) {
      toast({ title: 'خطأ', description: 'العنوان مطلوب', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);

      // Get roadmapId - use the first active roadmap if not specified
      let roadmapId = formData.roadmapId;
      if (!roadmapId) {
        const roadmapRes = await fetch('/api/roadmaps');
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          if (roadmapData.roadmaps?.length > 0) {
            roadmapId = roadmapData.roadmaps[0].id;
          }
        }
      }

      if (!roadmapId) {
        toast({ title: 'خطأ', description: 'لا يوجد مسار نشط', variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      const url = editingBranch ? `/api/branches/${editingBranch.id}` : '/api/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          icon: formData.icon || null,
          branchType: formData.branchType,
          sortOrder: parseInt(formData.sortOrder) || 0,
          requiredWeekIndex: parseInt(formData.requiredWeekIndex) || 0,
          ...(editingBranch ? {} : { roadmapId }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ');
      }

      toast({
        title: editingBranch ? 'تم التحديث' : 'تم الإنشاء',
        description: editingBranch ? 'تم تحديث الفرع بنجاح' : 'تم إنشاء الفرع بنجاح',
      });
      setFormOpen(false);
      fetchBranches();
    } catch (err) {
      toast({
        title: 'خطأ',
        description: err instanceof Error ? err.message : 'حدث خطأ',
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
      const res = await fetch(`/api/branches/${deletingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      toast({ title: 'تم الحذف', description: 'تم حذف الفرع بنجاح' });
      setDeleteOpen(false);
      setDeletingId(null);
      fetchBranches();
    } catch {
      toast({ title: 'خطأ', description: 'فشل في حذف الفرع', variant: 'destructive' });
    }
  }

  const branchTypeLabel = (type: string) => {
    switch (type) {
      case 'hobby': return { label: 'هواية', color: 'bg-[#58cc02]/15 text-[#58cc02]' };
      case 'skill': return { label: 'مهارة', color: 'bg-[#58c4dc]/15 text-[#58c4dc]' };
      case 'career': return { label: 'مسار مهني', color: 'bg-[#ffc800]/15 text-[#ffc800]' };
      default: return { label: type, color: 'bg-[#5a7f8f]/15 text-[#5a7f8f]' };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f8f5f0]">الفروع</h1>
          <p className="mt-1 text-sm text-[#5a7f8f]">إدارة الفروع المتاحة في المسار</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#58c4dc] hover:bg-[#58c4dc]/80 text-[#0f1f2e] font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          فرع جديد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#58c4dc]/10 text-[#58c4dc]"><GitBranch className="w-5 h-5" /></div>
            <div>
              <p className="text-xl font-bold text-[#f8f5f0]">{branches.length}</p>
              <p className="text-xs text-[#5a7f8f]">إجمالي الفروع</p>
            </div>
          </CardContent>
        </Card>
        {(['hobby', 'skill', 'career'] as const).map((type) => {
          const count = branches.filter(b => b.branchType === type).length;
          const bt = branchTypeLabel(type);
          return (
            <Card key={type} className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg text-xl">{type === 'hobby' ? '🎯' : type === 'skill' ? '🔧' : '💼'}</div>
                <div>
                  <p className="text-xl font-bold text-[#f8f5f0]">{count}</p>
                  <p className="text-xs text-[#5a7f8f]">{bt.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a7f8f]" />
        <Input
          placeholder="ابحث في الفروع..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 bg-[#1a3347] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]"
        />
      </div>

      {/* Branches List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
              <CardContent className="p-6"><Skeleton className="h-5 w-40 bg-[#162d40]" /></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="text-center py-16">
          <GitBranch className="w-16 h-16 mx-auto text-[#5a7f8f]/30 mb-4" />
          <p className="text-[#5a7f8f] text-lg">لا توجد فروع</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBranches.map((branch) => {
            const bt = branchTypeLabel(branch.branchType);
            return (
              <Card key={branch.id} className="bg-[#1a3347] border-[rgba(88,196,220,0.1)]">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{ background: 'rgba(88,196,220,0.1)' }}>
                      {branch.icon || '🌿'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold text-[#f8f5f0]">{branch.title}</h3>
                        <Badge variant="secondary" className={`border-0 text-xs ${bt.color}`}>{bt.label}</Badge>
                        {!branch.isActive && <Badge variant="secondary" className="bg-red-400/15 text-red-400 border-0 text-xs">معطّل</Badge>}
                      </div>
                      {branch.description && <p className="text-sm text-[#a3c4d0] line-clamp-2">{branch.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#5a7f8f]">
                        <span>بعد الأسبوع {branch.requiredWeekIndex + 1}</span>
                        <span>•</span>
                        <span>{branch.selections?.length || 0} اختيار</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(branch)} className="text-[#5a7f8f] hover:text-[#ffc800] hover:bg-[#ffc800]/10 h-8 w-8 p-1">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete(branch.id)} className="text-[#5a7f8f] hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-1">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0]">{editingBranch ? 'تعديل الفرع' : 'فرع جديد'}</DialogTitle>
            <DialogDescription className="text-[#5a7f8f]">
              {editingBranch ? 'قم بتعديل بيانات الفرع' : 'أدخل بيانات الفرع الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">العنوان *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الوصف</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3} className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f] resize-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#a3c4d0] text-sm">الأيقونة (إيموجي)</Label>
              <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="مثال: 🎯" className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0] placeholder:text-[#5a7f8f]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#a3c4d0] text-sm">نوع الفرع</Label>
                <Select value={formData.branchType} onValueChange={(v) => setFormData({ ...formData, branchType: v })}>
                  <SelectTrigger className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
                    <SelectItem value="hobby">🎯 هواية</SelectItem>
                    <SelectItem value="skill">🔧 مهارة</SelectItem>
                    <SelectItem value="career">💼 مسار مهني</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#a3c4d0] text-sm">بعد الأسبوع (0-indexed)</Label>
                <Input type="number" value={formData.requiredWeekIndex} onChange={(e) => setFormData({ ...formData, requiredWeekIndex: e.target.value })}
                  className="bg-[#162d40] border-[rgba(88,196,220,0.15)] text-[#f8f5f0]" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setFormOpen(false)} className="text-[#a3c4d0] hover:text-[#f8f5f0]">إلغاء</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-[#58c4dc] hover:bg-[#58c4dc]/80 text-[#0f1f2e] font-bold">
              {submitting && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
              {editingBranch ? 'حفظ' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#1a3347] border-[rgba(88,196,220,0.15)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f8f5f0]">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a3c4d0]">هل أنت متأكد؟ لا يمكن التراجع.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#a3c4d0] hover:text-[#f8f5f0] border-[rgba(88,196,220,0.15)]">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0 font-bold">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
