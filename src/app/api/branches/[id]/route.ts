import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const branch = await db.branch.findUnique({
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
        selections: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'الفرع غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ branch });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في جلب الفرع';
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

    const branch = await db.branch.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.branchType !== undefined && { branchType: body.branchType }),
        ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) }),
        ...(body.requiredWeekIndex !== undefined && { requiredWeekIndex: parseInt(body.requiredWeekIndex) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return NextResponse.json({ branch });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث الفرع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.branch.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف الفرع بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في حذف الفرع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
