import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roadmapId } = await params;
    const body = await request.json();
    const { title, description, sortOrder, icon } = body;

    if (!title) {
      return NextResponse.json({ error: 'عنوان الأسبوع مطلوب' }, { status: 400 });
    }

    // Verify roadmap exists
    const roadmap = await db.roadmap.findUnique({ where: { id: roadmapId } });
    if (!roadmap) {
      return NextResponse.json({ error: 'المسار غير موجود' }, { status: 404 });
    }

    const week = await db.roadmapWeek.create({
      data: {
        roadmapId,
        title,
        description: description || null,
        sortOrder: sortOrder != null ? parseInt(sortOrder) : 0,
        icon: icon || null,
      },
    });

    return NextResponse.json({ week }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في إنشاء الأسبوع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
