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
    const { phone, password } = body;

    if (!phone) {
      return NextResponse.json({ error: 'رقم الهاتف مطلوب' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'كلمة المرور مطلوبة' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({ error: 'مستخدم غير موجود' }, { status: 404 });
    }

    if (user.password && user.password !== simpleHash(password)) {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // Update last active
    await db.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تسجيل الدخول';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
