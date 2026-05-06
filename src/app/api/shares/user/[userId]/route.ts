import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/shares/user/[userId] - Get user's shares
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const shares = await db.share.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ shares });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب المشاركات';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
