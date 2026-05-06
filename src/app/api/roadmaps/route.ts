import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const roadmaps = await db.roadmap.findMany({
      where: { status: 'active' },
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
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ roadmaps });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب المسارات';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, coverImage, type, price, status, sortOrder, targetAudience, icon } = body;

    if (!title) {
      return NextResponse.json({ error: 'عنوان المسار مطلوب' }, { status: 400 });
    }

    const roadmap = await db.roadmap.create({
      data: {
        title,
        description: description || null,
        coverImage: coverImage || null,
        type: type || 'free',
        price: price != null ? parseFloat(price) : null,
        status: status || 'active',
        sortOrder: sortOrder != null ? parseInt(sortOrder) : 0,
        targetAudience: targetAudience || null,
        icon: icon || null,
      },
    });

    return NextResponse.json({ roadmap }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في إنشاء المسار';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
