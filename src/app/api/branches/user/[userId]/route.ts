import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const selections = await db.userBranchSelection.findMany({
      where: { userId },
      include: {
        branch: true,
      },
      orderBy: { selectedAt: 'desc' },
    });

    return NextResponse.json({ selections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب اختيارات المستخدم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
