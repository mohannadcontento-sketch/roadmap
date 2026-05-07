import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'مستخدم غير موجود' }, { status: 404 });
    }

    // Get enrollments with roadmap info (main weeks only)
    const enrollments = await db.userEnrollment.findMany({
      where: { userId },
      include: {
        roadmap: {
          include: {
            weeks: {
              where: { branchId: null },
              include: {
                days: true,
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    // Get all day progress (includes branch days)
    const dayProgress = await db.dayProgress.findMany({
      where: { userId },
    });

    // Get branch selections with progress
    const branchSelections = await db.userBranchSelection.findMany({
      where: { userId },
      include: {
        branch: {
          include: {
            weeks: {
              include: {
                days: {
                  include: {
                    progress: {
                      where: { userId },
                    },
                  },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    // Calculate branch progress
    const branchProgress = branchSelections.map((sel) => {
      const allDays = sel.branch.weeks.flatMap((w) => w.days);
      const completedDays = allDays.filter(
        (d) => d.progress.length > 0 && d.progress[0].status === 'completed'
      ).length;
      return {
        branchId: sel.branch.id,
        branchTitle: sel.branch.title,
        branchType: sel.branch.branchType,
        totalDays: allDays.length,
        completedDays,
        progressPercent: allDays.length > 0 ? Math.round((completedDays / allDays.length) * 100) : 0,
      };
    });

    // Calculate stats
    const completedDays = dayProgress.filter((p) => p.status === 'completed').length;
    const activeDays = dayProgress.filter((p) => p.status === 'active').length;
    const totalXpEarned = dayProgress.reduce((sum, p) => sum + p.xpEarned, 0);

    // Calculate progress per enrollment
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const allDays = enrollment.roadmap.weeks.flatMap((w) => w.days);
      const totalDays = allDays.length;
      const completedDayIds = new Set(
        dayProgress.filter((p) => p.status === 'completed').map((p) => p.dayId)
      );
      const completedCount = allDays.filter((d) => completedDayIds.has(d.id)).length;
      const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

      return {
        ...enrollment,
        totalDays,
        completedDays: completedCount,
        progressPercent,
      };
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        xp: user.xp,
        streak: user.streak,
        gems: user.gems,
        level: user.level,
        lastActiveAt: user.lastActiveAt,
      },
      enrollments: enrollmentsWithProgress,
      branchProgress,
      stats: {
        completedDays,
        activeDays,
        totalXpEarned,
        totalEnrollments: enrollments.length,
        totalBranchSelections: branchSelections.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب التقدم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
