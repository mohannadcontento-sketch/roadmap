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
      include: {
        enrollments: {
          include: {
            roadmap: {
              include: {
                weeks: {
                  include: {
                    days: {
                      orderBy: { sortOrder: 'asc' },
                    },
                  },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
        dayProgress: true,
        shares: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'مستخدم غير موجود' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب بيانات المستخدم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { onboarded } = body;

    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...(onboarded !== undefined && { onboarded: Boolean(onboarded) }),
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث بيانات المستخدم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
