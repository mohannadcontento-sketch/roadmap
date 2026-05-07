import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const messages = await db.welcomeMessage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب رسائل الترحيب';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, sortOrder, isActive, adminId, audioUrl } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'العنوان والرسالة مطلوبان' },
        { status: 400 }
      );
    }

    const welcomeMessage = await db.welcomeMessage.create({
      data: {
        title,
        message,
        sortOrder: sortOrder != null ? parseInt(sortOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        adminId: adminId || null,
        ...(audioUrl !== undefined && { audioUrl: audioUrl || null }),
      },
    });

    return NextResponse.json({ message: welcomeMessage }, { status: 201 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'خطأ في إنشاء رسالة الترحيب';
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
