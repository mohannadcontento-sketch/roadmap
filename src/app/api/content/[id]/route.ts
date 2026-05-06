import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const content = await db.contentItem.update({
      where: { id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.xpReward !== undefined && { xpReward: parseInt(body.xpReward) }),
        ...(body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) }),
        ...(body.settings !== undefined && {
          settings: body.settings ? JSON.stringify(body.settings) : null,
        }),
      },
    });

    return NextResponse.json({ content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تحديث المحتوى';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.contentItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف المحتوى بنجاح' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في حذف المحتوى';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
