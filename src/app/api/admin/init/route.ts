import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + '_' + str.length.toString(36);
}

const WEEK_TITLES = [
  'الأسبوع الأول: الوعي والاعتراف',
  'الأسبوع الثاني: التخلص من السموم الرقمية',
  'الأسبوع الثالث: بناء عادات صحية',
  'الأسبوع الرابع: إعادة برمجة العقل',
  'الأسبوع الخامس: القراءة والتفكير النقدي',
  'الأسبوع السادس: الإنتاجية الحقيقية',
  'الأسبوع السابع: العلاقات الاجتماعية',
  'الأسبوع الثامن: النمو الشخصي',
  'الأسبوع التاسع: الصحة العقلية والجسدية',
  'الأسبوع العاشر: الإبداع والإنتاج',
  'الأسبوع الحادي عشر: بناء المستقبل',
  'الأسبوع الثاني عشر: الاستمرارية والحفاظ على المكتسبات',
];

const WEEK_DESCRIPTIONS = [
  'في هذا الأسبوع سنتعرف على ما هو التعفن الدماغي وكيف يؤثر على حياتنا اليومية',
  'خطوات عملية للتقليل التدريجي من استخدام وسائل التواصل الاجتماعي والمحتوى السلبي',
  'نبدأ ببناء عادات بديلة صحية تحل محل الوقت المستهلك في التصفح العشوائي',
  'تعلم تقنيات إعادة برمجة العقل للتفكير بشكل أفضل وأكثر عمقاً',
  'نعود إلى عادة القراءة ونطور مهارات التفكير النقدي والتحليلي',
  'ننتقل من الاستهلاك إلى الإنتاجية الحقيقية وتحقيق الأهداف',
  'نعيد بناء علاقاتنا الاجتماعية الحقيقية بعيداً عن الشاشات',
  'نركز على النمو الشخصي وتطوير المهارات والقدرات',
  'نعطي اهتماماً خاصاً للصحة العقلية والجسدية كأساس للتعافي',
  'نكتشف قدراتنا الإبداعية ونبدأ في إنتاج محتوى قيم',
  'نضع خطة واضحة لمستقبلنا ونسير بخطوات ثابتة نحو أهدافنا',
  'نتعلم كيف نحافظ على مكتسباتنا ونستمر في مسيرة التعافي',
];

const DAY_TITLES = [
  'اليوم الأول',
  'اليوم الثاني',
  'اليوم الثالث',
  'اليوم الرابع',
  'اليوم الخامس',
  'اليوم السادس',
  'اليوم السابع',
];

const DAY_DESCRIPTIONS = [
  'بداية الرحلة - دعونا نتعرف على الخطوة الأولى',
  'نواصل المسيرة خطوة بخطوة',
  'نحن في منتصف الطريق هذا الأسبوع',
  'استمر في التقدم - أنت تقوم بعمل رائع',
  'قريب من نهاية الأسبوع - لا تستسلم',
  'تخطينا معظم العقبات - هيا بنا',
  'يوم المراجعة والاستعداد للأسبوع القادم',
];

// Sample content items for specific days (weekIndex, dayIndex) -> content array
interface SampleContent {
  type: string;
  title: string;
  description: string;
  url?: string;
  xpReward?: number;
}

const SAMPLE_CONTENT: Record<string, SampleContent[]> = {
  '0-0': [
    {
      type: 'youtube_reel',
      title: 'ما هو التعفن الدماغي؟',
      description: 'فيديو قصير يشرح مفهوم التعفن الدماغي Brain Rot وتأثيره على الإنتاجية والتفكير',
      xpReward: 10,
    },
    {
      type: 'article',
      title: 'مقال: كيف تؤثر وسائل التواصل على عقلك',
      description: 'مقال علمي مبسط يشرح التأثيرات السلبية للاستخدام المفرط للشاشات',
      xpReward: 15,
    },
    {
      type: 'task',
      title: 'مهمة اليوم: حساب وقت الشاشة',
      description: 'تحقق من إعدادات هاتفك وسجل كم ساعة تقضي يومياً على الشاشة. اكتب الرقم واحتفظ به للمقارنة لاحقاً.',
      xpReward: 20,
    },
  ],
  '0-1': [
    {
      type: 'youtube_reel',
      title: 'علامات التعفن الدماغي التي يجب أن تعرفها',
      description: 'فيديو يوضح أهم العلامات التي تدل على إصابتك بالتعفن الدماغي',
      xpReward: 10,
    },
    {
      type: 'game_challenge',
      title: 'تحدي الذاكرة: اختبر تركيزك',
      description: 'لعبة بسيطة لاختبار مدى تركيزك وذاكرتك قصيرة المدى',
      xpReward: 15,
    },
  ],
  '0-6': [
    {
      type: 'task',
      title: 'مراجعة نهاية الأسبوع الأول',
      description: 'اكتب 3 أشياء تعلمتها هذا الأسبوع عن التعفن الدماغي وكيف تؤثر على حياتك. هل لاحظت تغييراً في سلوكك؟',
      xpReward: 25,
    },
    {
      type: 'article',
      title: 'خطة الأسبوع القادم: التخلص من السموم الرقمية',
      description: 'نظرة مسبقة على ما سنفعله في الأسبوع الثاني والتحضيرات المطلوبة',
      xpReward: 10,
    },
  ],
  '1-0': [
    {
      type: 'task',
      title: 'مهمة اليوم: تقليل ساعة واحدة من الشاشة',
      description: 'حاول تقليل وقت استخدام الشاشة اليوم بمقدار ساعة واحدة مقارنة بمعدلك المعتاد',
      xpReward: 20,
    },
    {
      type: 'youtube_reel',
      title: 'نصائح للاستخدام الصحي للهاتف',
      description: 'فيديو يحتوي على نصائح عملية لاستخدام الهاتف بطريقة صحية',
      xpReward: 10,
    },
  ],
  '1-3': [
    {
      type: 'game_challenge',
      title: 'تحدي الابتعاد: 4 ساعات بدون هاتف',
      description: 'حاول البقاء بعيداً عن هاتفك لمدة 4 ساعات متواصلة وسجل ما شعرت به',
      xpReward: 30,
    },
    {
      type: 'article',
      title: 'مقال: قوة التأمل والهدوء',
      description: 'تعلم كيف تساعدك لحظات الهدوء على استعادة تركيزك',
      xpReward: 15,
    },
  ],
  '2-0': [
    {
      type: 'task',
      title: 'مهمة اليوم: ابدأ بعادة الاستيقاظ المبكر',
      description: 'حاول الاستيقاظ قبل موعدك المعتاد بـ 30 دقيقة واستخدم الوقت في شيء مفيد',
      xpReward: 20,
    },
    {
      type: 'youtube_reel',
      title: 'قوة العادات الصغيرة',
      description: 'كيف يمكن للعادات الصغيرة أن تحدث تغييراً كبيراً في حياتك',
      xpReward: 10,
    },
    {
      type: 'article',
      title: 'دليل بناء العادات: 21 يوم لتغيير حياتك',
      description: 'دليل عملي شامل لبناء عادات جديدة صحية',
      xpReward: 15,
    },
  ],
  '3-0': [
    {
      type: 'youtube_reel',
      title: 'كيف يعمل عقلك؟ مقدمة في علم الأعصاب',
      description: 'فيديو مبسط عن كيفية عمل الدماغ وآليات التعلم والتذكر',
      xpReward: 10,
    },
    {
      type: 'task',
      title: 'مهمة اليوم: التأمل لمدة 10 دقائق',
      description: 'خصص 10 دقائق اليوم للتأمل الصامت. ركز على تنفسك فقط.',
      xpReward: 25,
    },
  ],
  '4-0': [
    {
      type: 'article',
      title: 'لماذا القراءة أهم من التصفح؟',
      description: 'مقارنة علمية بين القراءة والتصفح العشوائي وتأثير كل منهما على الدماغ',
      xpReward: 15,
    },
    {
      type: 'task',
      title: 'مهمة اليوم: اقرأ 15 صفحة',
      description: 'اختر كتاباً واقرأ 15 صفحة على الأقل. سجل أهم ما تعلمته.',
      xpReward: 25,
    },
  ],
  '5-2': [
    {
      type: 'game_challenge',
      title: 'تحدي إدارة الوقت: خطط ليومك كاملاً',
      description: 'اكتب جدولاً زمنياً ليومك بالكامل مع تحديد أوقات للعمل والراحة والتعلم',
      xpReward: 20,
    },
    {
      type: 'article',
      title: 'مقال: قاعدة 80/20 في الإنتاجية',
      description: 'تعلم كيف تطبق مبدأ باريتو لتحقيق أقصى إنتاجية بأقل جهد',
      xpReward: 15,
    },
  ],
  '6-0': [
    {
      type: 'task',
      title: 'مهمة اليوم: تواصل مع شخص حقيقي',
      description: 'تواصل مع صديق أو فرد من العائلة وجهاً لوجه أو عبر مكالمة هاتفية (ليس رسالة!)',
      xpReward: 20,
    },
    {
      type: 'youtube_reel',
      title: 'فن المحادثة الحقيقية',
      description: 'كيف تعيد بناء مهارات التواصل الاجتماعي بعيداً عن الشاشات',
      xpReward: 10,
    },
  ],
  '7-3': [
    {
      type: 'article',
      title: 'مقال: 10 مهارات يجب أن تتعلمها هذا العام',
      description: 'قائمة بالمهارات الأكثر طلباً في العصر الحديث وكيف تبدأ بتعلمها',
      xpReward: 15,
    },
    {
      type: 'task',
      title: 'مهمة اليوم: ابدأ بتعلم مهارة جديدة',
      description: 'اختر مهارة جديدة تريد تعلمها وابدأ بالخطوة الأولى اليوم',
      xpReward: 25,
    },
    {
      type: 'game_challenge',
      title: 'تحدي: حل مسألة ذكاء',
      description: 'تمرين ذهني لتنشيط قدراتك العقلية وتحسين تفكيرك المنطقي',
      xpReward: 15,
    },
  ],
  '8-0': [
    {
      type: 'task',
      title: 'مهمة اليوم: تمارين رياضية لمدة 20 دقيقة',
      description: 'خصص 20 دقيقة لممارسة الرياضة. يمكن أن تكون مشياً أو تمارين في المنزل.',
      xpReward: 20,
    },
    {
      type: 'youtube_reel',
      title: 'العلاقة بين الرياضة وصحة الدماغ',
      description: 'كيف تؤثر التمارين الرياضية على وظائف الدماغ والمزاج والإنتاجية',
      xpReward: 10,
    },
  ],
  '9-0': [
    {
      type: 'article',
      title: 'مقال: كيف تكتشف مواهبك الإبداعية',
      description: 'دليل عملي لاكتشاف قدراتك الإبداعية الكامنة واستثمارها',
      xpReward: 15,
    },
    {
      type: 'task',
      title: 'مهمة اليوم: أنتج شيئاً جديداً',
      description: 'اكتب مقالاً، ارسم صورة، سجل فيديو، أو أنتج أي شيء من إبداعك',
      xpReward: 30,
    },
  ],
  '10-2': [
    {
      type: 'task',
      title: 'مهمة اليوم: اكتب رسالة لنفسك بعد سنة',
      description: 'اكتب رسالة تخاطب بها نفسك بعد سنة من الآن. ما الذي تأمل أن تحققه؟',
      xpReward: 25,
    },
    {
      type: 'article',
      title: 'مقال: كيف تضع أهدافاً ذكية SMART',
      description: 'تعلم إطار عمل SMART لتحديد أهداف واضحة وقابلة للتحقيق',
      xpReward: 15,
    },
  ],
  '11-6': [
    {
      type: 'task',
      title: 'مراجعة نهائية: احتفل بإنجازاتك!',
      description: 'اكتب قائمة بكل الإنجازات التي حققتها خلال 12 أسبوعاً. كافئ نفسك!',
      xpReward: 50,
    },
    {
      type: 'article',
      title: 'مقال: كيف تحافظ على تقدمك بعد انتهاء البرنامج',
      description: 'نصائح واستراتيجيات لضمان استمرارك في مسيرة التعافي والنمو',
      xpReward: 15,
    },
    {
      type: 'youtube_reel',
      title: 'قصص نجاح: أشخاص تخلصوا من التعفن الدماغي',
      description: 'إلهام من قصص حقيقية لأشخاص نجحوا في التغيير',
      xpReward: 10,
    },
  ],
};

export async function POST() {
  try {
    // 1. Create default admin if not exists
    let admin = await db.admin.findUnique({ where: { username: 'admin' } });

    if (!admin) {
      admin = await db.admin.create({
        data: {
          username: 'admin',
          password: simpleHash('admin123'),
          name: 'المشرف',
        },
      });
    }

    // 2. Create welcome messages if none exist
    const existingMessages = await db.welcomeMessage.count();
    if (existingMessages === 0) {
      await db.welcomeMessage.createMany({
        data: [
          {
            adminId: admin.id,
            title: 'مرحباً بك في وصال! 🌟',
            message:
              'أهلاً وسهلاً بك في رحلتك نحو التحرر من التعفن الدماغي. نحن هنا ندعمك في كل خطوة. هذا البرنامج مصمم خصيصاً لمساعدتك على استعادة تركيزك وإنتاجيتك والسيطرة على وقتك. أنت لست وحدك في هذه الرحلة!',
            sortOrder: 0,
            isActive: true,
          },
          {
            adminId: admin.id,
            title: 'التعفن الدماغي - ما هو؟ 🧠',
            message:
              'التعفن الدماغي (Brain Rot) هو مصطلح يصف الحالة التي يصبح فيها عقلك مهووساً بالمحتوى الترفيهي السطحي مثل فيديوهات التيك توك والريلز القصيرة والميمز. ينتج عن ذلك ضعف في التركيز، انخفاض في القدرة على التفكير العميق، وقلة الإنتاجية. لكن الحل موجود وبإمكانك التعافي!',
            sortOrder: 1,
            isActive: true,
          },
          {
            adminId: admin.id,
            title: 'كيف سيساعدك هذا البرنامج؟ 💪',
            message:
              'خلال 12 أسبوعاً، ستمر برحلة منظمة تشمل: الوعي بالمشكلة، التخلص التدريجي من المحتوى السلبي، بناء عادات صحية بديلة، تطوير مهارات التفكير النقدي والقراءة، تعلم الإنتاجية الحقيقية، وتحسين علاقاتك الاجتماعية. كل يوم فيه محتوى تعليمي وتمارين عملية وتحديات ممتعة. جهز نفسك للتغيير! 🚀',
            sortOrder: 2,
            isActive: true,
          },
        ],
      });
    }

    // 3. Create sample roadmap if none exists
    const existingRoadmap = await db.roadmap.findFirst({
      where: { title: 'رحلة التعافي من التعفن الدماغي' },
    });

    if (!existingRoadmap) {
      const roadmap = await db.roadmap.create({
        data: {
          title: 'رحلة التعافي من التعفن الدماغي',
          description:
            'برنامج شامل مدته 12 أسبوعاً لمساعدتك على التحرر من التعفن الدماغي واستعادة تركيزك وإنتاجيتك. يشمل تمارين عملية، فيديوهات تعليمية، مقالات، وتحديات يومية.',
          type: 'free',
          status: 'active',
          sortOrder: 0,
          targetAudience: 'كل شخص يشعر بتأثير وسائل التواصل الاجتماعي السلبي على حياته',
          icon: '🧠',
        },
      });

      // Create 12 weeks with 7 days each
      for (let w = 0; w < 12; w++) {
        const week = await db.roadmapWeek.create({
          data: {
            roadmapId: roadmap.id,
            title: WEEK_TITLES[w],
            description: WEEK_DESCRIPTIONS[w],
            sortOrder: w,
          },
        });

        for (let d = 0; d < 7; d++) {
          const day = await db.roadmapDay.create({
            data: {
              weekId: week.id,
              title: DAY_TITLES[d],
              description: DAY_DESCRIPTIONS[d],
              sortOrder: d,
              xpReward: 10 + (d * 2), // Increasing XP through the week
            },
          });

          // Add sample content for certain days
          const contentKey = `${w}-${d}`;
          const contents = SAMPLE_CONTENT[contentKey];
          if (contents) {
            for (let c = 0; c < contents.length; c++) {
              await db.contentItem.create({
                data: {
                  dayId: day.id,
                  type: contents[c].type,
                  title: contents[c].title,
                  description: contents[c].description,
                  url: contents[c].url || null,
                  xpReward: contents[c].xpReward || 5,
                  sortOrder: c,
                },
              });
            }
          }
        }
      }

      return NextResponse.json(
        {
          message: 'تم تهيئة النظام بنجاح! ✅',
          admin: { username: admin.username, name: admin.name },
          roadmap: { id: roadmap.id, title: roadmap.title },
          stats: {
            weeksCreated: 12,
            daysCreated: 84,
            welcomeMessagesCreated: 3,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json({
      message: 'النظام مهيأ مسبقاً - لا توجد بيانات جديدة مطلوبة',
      admin: { username: admin.username, name: admin.name },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في تهيئة النظام';
    console.error('Admin init error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
