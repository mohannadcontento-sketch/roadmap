import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shareKey: string }> }
) {
  try {
    const { shareKey } = await params;

    const share = await db.share.findUnique({
      where: { shareKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            xp: true,
            streak: true,
            gems: true,
            level: true,
          },
        },
      },
    });

    if (!share) {
      return NextResponse.json({ error: 'المشاركة غير موجودة' }, { status: 404 });
    }

    // Increment views and re-read to get accurate count
    const updatedShare = await db.share.update({
      where: { id: share.id },
      data: { views: { increment: 1 } },
    });

    // Get user's progress data for the shared view
    const enrollments = await db.userEnrollment.findMany({
      where: { userId: share.userId },
      include: {
        roadmap: {
          include: {
            weeks: {
              include: {
                days: true,
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    const dayProgress = await db.dayProgress.findMany({
      where: { userId: share.userId },
    });

    const completedDaysCount = dayProgress.filter((p) => p.status === 'completed').length;

    return NextResponse.json({
      share: {
        id: share.id,
        title: share.title,
        message: share.message,
        imageUrl: share.imageUrl,
        views: updatedShare.views,
        createdAt: share.createdAt,
      },
      user: share.user,
      stats: {
        completedDays: completedDaysCount,
        totalEnrollments: enrollments.length,
      },
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'خطأ في جلب المشاركة';
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
