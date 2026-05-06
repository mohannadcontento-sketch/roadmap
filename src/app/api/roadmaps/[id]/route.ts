import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const roadmap = await db.roadmap.findUnique({
      where: { id },
      include: {
        weeks: {
          include: {
            days: {
              include: {
                content: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: 'المسار غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ roadmap });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب المسار';
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

    const roadmap = await db.roadmap.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.price !== undefined && { price: body.price != null ? parseFloat(body.price) : null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) }),
        ...(body.targetAudience !== undefined && { targetAudience: body.targetAudience }),
        ...(body.icon !== undefined && { icon: body.icon }),
      },
    });

    return NextResponse.json({ roadmap });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث المسار';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.roadmap.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف المسار بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في حذف المسار';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
