import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmapId');

    const where = roadmapId ? { roadmapId, isActive: true } : { isActive: true };

    const branches = await db.branch.findMany({
      where,
      include: {
        weeks: {
          include: {
            days: {
              include: {
                content: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ branches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب الفروع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roadmapId, title, description, icon, imageUrl, branchType, sortOrder, requiredWeekIndex } = body;

    if (!roadmapId || !title) {
      return NextResponse.json({ error: 'معرف المسار والعنوان مطلوبان' }, { status: 400 });
    }

    const branch = await db.branch.create({
      data: {
        roadmapId,
        title,
        description: description || null,
        icon: icon || null,
        imageUrl: imageUrl || null,
        branchType: branchType || 'hobby',
        sortOrder: sortOrder != null ? parseInt(sortOrder) : 0,
        requiredWeekIndex: requiredWeekIndex != null ? parseInt(requiredWeekIndex) : 0,
      },
    });

    return NextResponse.json({ branch }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في إنشاء الفرع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
