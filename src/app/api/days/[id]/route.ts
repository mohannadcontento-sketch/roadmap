import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const day = await db.roadmapDay.findUnique({
      where: { id },
      include: {
        content: {
          orderBy: { sortOrder: 'asc' },
        },
        week: {
          select: {
            id: true,
            title: true,
            roadmap: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    if (!day) {
      return NextResponse.json({ error: 'اليوم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ day });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب اليوم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const day = await db.roadmapDay.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.xpReward !== undefined && { xpReward: parseInt(body.xpReward) }),
      },
    });

    return NextResponse.json({ day });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث اليوم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.roadmapDay.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف اليوم بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في حذف اليوم';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
