import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const VALID_TYPES = ['youtube_reel', 'game_challenge', 'article', 'task'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dayId } = await params;
    const body = await request.json();
    const { type, title, description, url, imageUrl, audioUrl, xpReward, sortOrder, settings } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'نوع المحتوى غير صالح. الأنواع المسموحة: youtube_reel, game_challenge, article, task' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json({ error: 'عنوان المحتوى مطلوب' }, { status: 400 });
    }

    // Verify day exists
    const day = await db.roadmapDay.findUnique({ where: { id: dayId } });
    if (!day) {
      return NextResponse.json({ error: 'اليوم غير موجود' }, { status: 404 });
    }

    const content = await db.contentItem.create({
      data: {
        dayId,
        type,
        title,
        description: description || null,
        url: url || null,
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null,
        xpReward: xpReward != null ? parseInt(xpReward) : 5,
        sortOrder: sortOrder != null ? parseInt(sortOrder) : 0,
        settings: settings ? JSON.stringify(settings) : null,
      },
    });

    return NextResponse.json({ content }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في إنشاء المحتوى';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
