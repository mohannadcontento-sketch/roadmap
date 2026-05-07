import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const messages = await db.welcomeMessage.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب رسائل الترحيب';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
