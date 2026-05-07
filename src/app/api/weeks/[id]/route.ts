import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const week = await db.roadmapWeek.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            content: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        roadmap: {
          select: { id: true, title: true },
        },
      },
    });

    if (!week) {
      return NextResponse.json({ error: 'الأسبوع غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ week });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب الأسبوع';
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

    const week = await db.roadmapWeek.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) }),
        ...(body.icon !== undefined && { icon: body.icon }),
      },
    });

    return NextResponse.json({ week });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث الأسبوع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.roadmapWeek.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الأسبوع بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في حذف الأسبوع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
