import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, branchId } = body;

    if (!userId || !branchId) {
      return NextResponse.json({ error: 'معرف المستخدم والفرع مطلوبان' }, { status: 400 });
    }

    // Verify branch exists
    const branch = await db.branch.findUnique({ where: { id: branchId } });
    if (!branch) {
      return NextResponse.json({ error: 'الفرع غير موجود' }, { status: 404 });
    }

    // Check if user already selected this branch
    const existing = await db.userBranchSelection.findUnique({
      where: { userId_branchId: { userId, branchId } },
    });

    if (existing) {
      return NextResponse.json({ message: 'تم اختيار هذا الفرع بالفعل', selection: existing });
    }

    const selection = await db.userBranchSelection.create({
      data: { userId, branchId },
    });

    return NextResponse.json({ selection }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تسجيل الاختيار';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
