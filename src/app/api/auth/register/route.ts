import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + '_' + str.length.toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, password, email } = body;

    if (!name) {
      return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ error: 'رقم الهاتف مطلوب' }, { status: 400 });
    }

    // Check if phone already exists
    const existingUser = await db.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'رقم الهاتف مسجل مسبقاً' }, { status: 400 });
    }

    const hashedPassword = password ? simpleHash(password) : null;

    // Create the user
    const user = await db.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        email: email || null,
      },
    });

    // Enroll in the first active roadmap
    const firstRoadmap = await db.roadmap.findFirst({
      where: { status: 'active' },
      orderBy: { sortOrder: 'asc' },
    });

    if (firstRoadmap) {
      await db.userEnrollment.create({
        data: {
          userId: user.id,
          roadmapId: firstRoadmap.id,
        },
      });

      // Unlock the first day of the first week
      const firstWeek = await db.roadmapWeek.findFirst({
        where: { roadmapId: firstRoadmap.id },
        orderBy: { sortOrder: 'asc' },
      });

      if (firstWeek) {
        const firstDay = await db.roadmapDay.findFirst({
          where: { weekId: firstWeek.id },
          orderBy: { sortOrder: 'asc' },
        });

        if (firstDay) {
          await db.dayProgress.create({
            data: {
              userId: user.id,
              dayId: firstDay.id,
              status: 'active',
            },
          });
        }
      }
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'تم التسجيل بنجاح', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في التسجيل';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
