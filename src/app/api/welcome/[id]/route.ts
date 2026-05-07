import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, message, sortOrder, isActive, adminId, audioUrl } = body;

    const welcomeMessage = await db.welcomeMessage.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(adminId !== undefined && { adminId: adminId || null }),
        ...(audioUrl !== undefined && { audioUrl: audioUrl || null }),
      },
    });

    return NextResponse.json({ message: welcomeMessage });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'خطأ في تحديث رسالة الترحيب';
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.welcomeMessage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف رسالة الترحيب بنجاح' });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'خطأ في حذف رسالة الترحيب';
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
