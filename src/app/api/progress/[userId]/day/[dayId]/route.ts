import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string; dayId: string }> }
) {
  try {
    const { userId, dayId } = await params;

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'مستخدم غير موجود' }, { status: 404 });
    }

    // Verify day exists
    const day = await db.roadmapDay.findUnique({
      where: { id: dayId },
      include: {
        week: {
          include: {
            days: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
    if (!day) {
      return NextResponse.json({ error: 'اليوم غير موجود' }, { status: 404 });
    }

    // Check if already completed - idempotency guard
    const existingProgress = await db.dayProgress.findUnique({
      where: { userId_dayId: { userId, dayId } },
    });

    if (existingProgress && existingProgress.status === 'completed') {
      return NextResponse.json({
        message: 'اليوم مكتمل بالفعل ✓',
        progress: existingProgress,
        xpAwarded: 0,
      });
    }

    // Create or update progress
    const progress = await db.dayProgress.upsert({
      where: {
        userId_dayId: { userId, dayId },
      },
      create: {
        userId,
        dayId,
        status: 'completed',
        xpEarned: day.xpReward,
        completedAt: new Date(),
      },
      update: {
        status: 'completed',
        xpEarned: day.xpReward,
        completedAt: new Date(),
      },
    });

    // Award XP to user
    await db.user.update({
      where: { id: userId },
      data: {
        xp: { increment: day.xpReward },
        lastActiveAt: new Date(),
      },
    });

    // Unlock the next day
    const daysInWeek = day.week.days;
    const currentDayIndex = daysInWeek.findIndex((d) => d.id === dayId);

    if (currentDayIndex < daysInWeek.length - 1) {
      // Unlock next day in same week
      const nextDay = daysInWeek[currentDayIndex + 1];
      await db.dayProgress.upsert({
        where: {
          userId_dayId: { userId, dayId: nextDay.id },
        },
        create: {
          userId,
          dayId: nextDay.id,
          status: 'active',
        },
        update: {
          status: 'active',
        },
      });
    } else {
      // Current day is the last in the week - unlock first day of next week
      const nextWeek = await db.roadmapWeek.findFirst({
        where: {
          roadmapId: day.week.roadmapId,
          sortOrder: { gt: day.week.sortOrder },
        },
        orderBy: { sortOrder: 'asc' },
        include: {
          days: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (nextWeek && nextWeek.days.length > 0) {
        const firstDayOfNextWeek = nextWeek.days[0];
        await db.dayProgress.upsert({
          where: {
            userId_dayId: { userId, dayId: firstDayOfNextWeek.id },
          },
          create: {
            userId,
            dayId: firstDayOfNextWeek.id,
            status: 'active',
          },
          update: {
            status: 'active',
          },
        });
      }
    }

    return NextResponse.json({
      message: 'تم إكمال اليوم بنجاح! 🎉',
      progress,
      xpAwarded: day.xpReward,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تسجيل التقدم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; dayId: string }> }
) {
  try {
    const { userId, dayId } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['locked', 'active', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صالحة. الحالات المسموحة: locked, active, completed' },
        { status: 400 }
      );
    }

    const progress = await db.dayProgress.upsert({
      where: {
        userId_dayId: { userId, dayId },
      },
      create: {
        userId,
        dayId,
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
      update: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث التقدم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
