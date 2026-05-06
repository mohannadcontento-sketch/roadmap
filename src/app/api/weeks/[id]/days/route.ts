import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weekId } = await params;
    const body = await request.json();
    const { title, description, sortOrder, icon, xpReward } = body;

    if (!title) {
      return NextResponse.json({ error: 'عنوان اليوم مطلوب' }, { status: 400 });
    }

    // Verify week exists
    const week = await db.roadmapWeek.findUnique({ where: { id: weekId } });
    if (!week) {
      return NextResponse.json({ error: 'الأسبوع غير موجود' }, { status: 404 });
    }

    const day = await db.roadmapDay.create({
      data: {
        weekId,
        title,
        description: description || null,
        sortOrder: sortOrder != null ? parseInt(sortOrder) : 0,
        icon: icon || null,
        xpReward: xpReward != null ? parseInt(xpReward) : 10,
      },
    });

    return NextResponse.json({ day }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في إنشاء اليوم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
