import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const roadmaps = await db.roadmap.findMany({
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
