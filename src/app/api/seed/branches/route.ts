import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get the first active roadmap
    const roadmap = await db.roadmap.findFirst({ where: { status: 'active' } });
    if (!roadmap) {
      return NextResponse.json({ error: 'لا يوجد مسار نشط' }, { status: 400 });
    }

    // Hobby branches (after week 2)
    const hobbyBranches = [
      { title: 'الرياضة واللياقة', description: 'طور جسمك وذهنك مع تمارين رياضية يومية', icon: '⚽', branchType: 'hobby', sortOrder: 0, requiredWeekIndex: 2 },
      { title: 'القراءة والكتب', description: 'اكتشف عالم الكتب وطور مهارات القراءة', icon: '📚', branchType: 'hobby', sortOrder: 1, requiredWeekIndex: 2 },
      { title: 'الشطرنج والألعاب الذهنية', description: 'حفز ذكائك مع ألعاب التفكير الاستراتيجي', icon: '♟️', branchType: 'hobby', sortOrder: 2, requiredWeekIndex: 2 },
      { title: 'الرسم والإبداع', description: 'أطلق إبداعك الفني وتعلم مهارات الرسم', icon: '🎨', branchType: 'hobby', sortOrder: 3, requiredWeekIndex: 2 },
      { title: 'الكتابة والتعبير', description: 'عبّر عن أفكارك وتعلم فن الكتابة الإبداعية', icon: '✍️', branchType: 'hobby', sortOrder: 4, requiredWeekIndex: 2 },
    ];

    // Skill branches (after week 7)
    const skillBranches = [
      { title: 'البرمجة والتكنولوجيا', description: 'تعلم أساسيات البرمجة والتقنية الحديثة', icon: '💻', branchType: 'skill', sortOrder: 0, requiredWeekIndex: 7 },
      { title: 'التصوير والمونتاج', description: 'اكتشف فن التصوير وتحرير الفيديو', icon: '📷', branchType: 'skill', sortOrder: 1, requiredWeekIndex: 7 },
      { title: 'الطبخ والمطبخ', description: 'تعلم وصفات صحية ومهارات الطبخ', icon: '👨‍🍳', branchType: 'skill', sortOrder: 2, requiredWeekIndex: 7 },
      { title: 'التأمل واليوغا', description: 'مارس الهدوء الذهني والاسترخاء العميق', icon: '🧘', branchType: 'skill', sortOrder: 3, requiredWeekIndex: 7 },
      { title: 'اللغات والترجمة', description: 'تعلم لغة جديدة وطور مهارات الترجمة', icon: '🌍', branchType: 'skill', sortOrder: 4, requiredWeekIndex: 7 },
    ];

    const allBranches = [...hobbyBranches, ...skillBranches];
    const created = [];

    for (const branch of allBranches) {
      // Check if already exists
      const existing = await db.branch.findFirst({
        where: { roadmapId: roadmap.id, title: branch.title },
      });
      if (!existing) {
        const createdBranch = await db.branch.create({
          data: {
            roadmapId: roadmap.id,
            title: branch.title,
            description: branch.description,
            icon: branch.icon,
            branchType: branch.branchType,
            sortOrder: branch.sortOrder,
            requiredWeekIndex: branch.requiredWeekIndex,
          },
        });
        created.push(createdBranch);
      }
    }

    return NextResponse.json({
      message: `تم إنشاء ${created.length} فرع جديد`,
      created: created.length,
      total: allBranches.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في إنشاء الفروع';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
