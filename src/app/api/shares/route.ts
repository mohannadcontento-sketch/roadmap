import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function generateShareKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, message, imageUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 });
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'مستخدم غير موجود' }, { status: 404 });
    }

    // Generate unique share key
    let shareKey = generateShareKey();
    let exists = await db.share.findUnique({ where: { shareKey } });
    while (exists) {
      shareKey = generateShareKey();
      exists = await db.share.findUnique({ where: { shareKey } });
    }

    const share = await db.share.create({
      data: {
        userId,
        title: title || null,
        message: message || null,
        imageUrl: imageUrl || null,
        shareKey,
      },
    });

    return NextResponse.json({ share }, { status: 201 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'خطأ في إنشاء المشاركة';
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
