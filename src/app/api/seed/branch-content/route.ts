import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* ═══════════════════════════════════════
   Branch Content Seed Endpoint
   Creates weeks, days, and content items for each branch
   ═══════════════════════════════════════ */

interface DayContent {
  title: string;
  description: string;
  items: Array<{
    type: 'youtube_reel' | 'article' | 'task' | 'game_challenge';
    title: string;
    description: string;
    xpReward: number;
    sortOrder: number;
  }>;
}

interface WeekData {
  title: string;
  description: string;
  sortOrder: number;
  days: DayContent[];
}

interface BranchData {
  title: string;
  branchType: 'hobby' | 'skill';
  weeks: WeekData[];
}

/* ─── Hobby Branches Content ──────────── */
const hobbyBranchesContent: BranchData[] = [
  {
    title: 'الرياضة واللياقة',
    branchType: 'hobby',
    weeks: [
      {
        title: 'أسبوع البداية',
        description: 'ابدأ رحلتك الرياضية وابنِ عادات صحية',
        sortOrder: 0,
        days: [
          {
            title: 'لماذا الرياضة مهمة؟',
            description: 'اكتشف الفوائد الجسدية والنفسية للرياضة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تأثير الرياضة على الدماغ', description: 'شاهد كيف تغير الرياضة بنية الدماغ وتحسن المزاج والتركيز', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: ١٠ فوائد لا تعرفها عن التمارين اليومية', description: 'تعرف على الفوائد المذهلة للتمارين المنتظمة على الصحة الجسدية والنفسية والاجتماعية', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: حدد هدفك الرياضي الأول', description: 'اكتب هدف رياضي واقعي تريد تحقيقه خلال ٣٠ يوماً', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'التحضير للتمرين الأول',
            description: 'تعلم كيف تستعد لتمرينك الأول بأمان',
            items: [
              { type: 'youtube_reel', title: 'فيديو: الإحماء الصحيح قبل التمرين', description: 'دقيقة واحدة لإحماء جسمك بطريقة صحيحة وتجنب الإصابات', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: جرب تمرين إحماء كامل', description: 'قم بعمل تمارين الإحماء الموضحة في الفيديو لمدة ٥ دقائق', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'تبني عادة الحركة',
            description: 'كيف تجعل الرياضة جزءاً من يومك',
            items: [
              { type: 'article', title: 'مقال: قاعدة الـ ٢١ يوماً لبناء العادات', description: 'تعلم العلم وراء بناء العادات وكيف تطبقها في حياتك الرياضية', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حدد موعد يومي للرياضة', description: 'اختر وقتاً محدداً كل يوم لممارسة الرياضة والزم به لمدة أسبوع', xpReward: 12, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار معلوماتك الرياضية', description: 'اختبر معرفتك بأساسيات اللياقة البدنية والتغذية الصحية', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'خطتك الأسبوعية',
            description: 'ضع خطة واقعية لأسبوعك الأول',
            items: [
              { type: 'youtube_reel', title: 'فيديو: برنامج تمارين للمبتدئين في المنزل', description: 'تمارين بسيطة لا تحتاج معدات ويمكنك فعلها في غرفتك', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب خطة الأسبوع', description: 'حدد الأيام والتمارين التي ستقوم بها هذا الأسبوع مع أوقات محددة', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع التطور',
        description: 'طور أدائك وتابع تقدمك بذكاء',
        sortOrder: 1,
        days: [
          {
            title: 'تتبع تقدمك',
            description: 'تعلم كيف تقيس تطورك وتحتفز نفسك',
            items: [
              { type: 'article', title: 'مقال: أهمية تسجيل التمارين', description: 'لماذا يساعدك تدوين تمارينك على البقاء منتظماً وتحقيق أهدافك أسرع', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: أنشئ جدول تتبع خاص بك', description: 'صمم جدولاً لتوثيق تمارينك اليومية ومتابعة تطورك', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'التغذية والرياضة',
            description: 'الطاقة الصحيحة لأداء أفضل',
            items: [
              { type: 'youtube_reel', title: 'فيديو: وجبات ما قبل وبعد التمرين', description: 'أفضل الأطعمة لتناولها قبل التمرين للحصول على طاقة وبعده للتعافي', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: اختر الوجبة الصحية', description: 'اختر من بين عدة خيارات الوجبة الأنسب لوقت التمرين', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: خطط وجبة رياضية متكاملة', description: 'صمم وجبة صحية تحتوي على البروتين والكربوهيدرات المناسبة', xpReward: 10, sortOrder: 2 },
            ],
          },
          {
            title: 'تطوير الأداء',
            description: 'تقنيات متقدمة لتحسين مستواك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تمارين HIIT للمبتدئين', description: 'تمارين شدة عالية قصيرة المدة تحرق الدهون وتحسن اللياقة', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: كيف تتجاوز مرحلة الثبات', description: 'نصائح للتغلب على فترات عدم التقدم في التمارين', xpReward: 8, sortOrder: 1 },
            ],
          },
          {
            title: 'حافظ على الاستمرارية',
            description: 'استراتيجيات للحفاظ على عادتك الرياضية',
            items: [
              { type: 'article', title: 'مقال: عندما تفقد الحافز', description: 'ماذا تفعل عندما لا تشعر بالرغبة في التمرين وكيف تتغلب على ذلك', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب رسالة لنفسك المستقبلية', description: 'اكتب رسالة تحفيزية لنفسك تقرأها عندما تفقد الدافع', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: قياس إنجازك', description: 'اختبر مدى تحسنك خلال الأسبوعين الماضيين', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'القراءة والكتب',
    branchType: 'hobby',
    weeks: [
      {
        title: 'أسبوع عادة القراءة',
        description: 'ابنِ عادة القراءة اليومية من الصفر',
        sortOrder: 0,
        days: [
          {
            title: 'لماذا نقرأ؟',
            description: 'اكتشف قوة القراءة في تطوير عقلك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: ماذا يحدث لدماغك عند القراءة', description: 'تغييرات مذهلة تحدث في الدماغ عندما تقرأ بانتظام', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: كيف غيرت القراءة حياة أشخاص ناجحين', description: 'قصص حقيقية عن كيف جعلت القراءة أشخاصاً عاديين ناجحين', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: حدد نوع الكتب المفضلة', description: 'اكتب ٣ أنواع من الكتب تستمتع بقراءتها أو تريد تجربتها', xpReward: 10, sortOrder: 2 },
            ],
          },
          {
            title: 'اختيار الكتاب المناسب',
            description: 'كيف تختار كتابك الأول بذكاء',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نصائح لاختيار كتاب ممتع', description: 'معايير بسيطة تساعدك تختار كتاب يخطف انتباهك من الصفحة الأولى', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اختر كتاباً وابدأ بقراءة أول ١٠ صفحات', description: 'اختر كتاباً واقرأ أول ١٠ صفحات ثم اكتب انطباعك عنها', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'بيئة القراءة المثالية',
            description: 'كيف تجهز مكانك للقراءة المركزة',
            items: [
              { type: 'article', title: 'مقال: أنشئ ركن قراءتك الخاص', description: 'كيف تصمم مكان مريح يشجعك على القراءة كل يوم', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: رتب ركن القراءة', description: 'خصص مكاناً في غرفتك للقراءة وضع فيه كتابك والإضاءة المناسبة', xpReward: 12, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار عادات القراءة', description: 'اختبر معلوماتك عن العادات الصحية للقراءة', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'وقت القراءة اليومي',
            description: 'خصص وقتاً ثابتاً للقراءة كل يوم',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تقنية القراءة لمدة ٢٥ دقيقة', description: 'استخدم تقنية بومودورو لقراءة مركزة وفعالة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حدد موعد القراءة اليومي', description: 'اختر ٢٥ دقيقة يومياً للقراءة وسجل التزامك لمدة أسبوع', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع التعمق',
        description: 'طور مهارات القراءة التحليلية والنقدية',
        sortOrder: 1,
        days: [
          {
            title: 'القراءة النشطة',
            description: 'كيف تقرأ بتركيز وتستفيد أكثر',
            items: [
              { type: 'article', title: 'مقال: الفرق بين القراءة السلبية والنشطة', description: 'تعلم تقنيات القراءة النشطة التي تجعلك تستفيد من كل صفحة', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: طبّق القراءة النشطة', description: 'اقرأ فصلاً باستخدام تقنيات القراءة النشطة وسجل ملاحظاتك', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'التلخيص والاستنتاج',
            description: 'مهارة استخلاص الأفكار من النصوص',
            items: [
              { type: 'youtube_reel', title: 'فيديو: فن التلخيص والكتابة', description: 'كتبة محترفون يشاركونك أسرار التلخيص الفعال', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: لخّص ما قرأته', description: 'اكتب تلخيصاً من ٥ أسطر لما قرأته هذا الأسبوع', xpReward: 12, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار فهم المقروء', description: 'اختبر قدرتك على استيعاب وفهم النصوص المقروءة', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'بناء مكتبتك',
            description: 'أنشئ قائمة قراءة مستقبلية متنوعة',
            items: [
              { type: 'article', title: 'مقال: ٢٠ كتاباً غيّرت حياة الملايين', description: 'قائمة كلاسيكية من الكتب التي يستحق كل شخص قراءتها', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: أنشئ قائمة القراءة الخاصة بك', description: 'اختر ١٠ كتب تريد قراءتها هذا العام ورتبها حسب الأهمية', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'مشاركة ما تقرأ',
            description: 'شارك أفكارك مع الآخرين',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تكتب مراجعة كتاب رائعة', description: 'نصائح عملية لكتابة مراجعة تفيد الآخرين وتثري معرفتك', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب مراجعة قصيرة لكتاب', description: 'اكتب مراجعة من ١٠ أسطر لكتاب أثار إعجابك', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: تحدي الكتب الكلاسيكية', description: 'اختبر معرفتك بالكتب الأكثر تأثيراً في التاريخ', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'الشطرنج والألعاب الذهنية',
    branchType: 'hobby',
    weeks: [
      {
        title: 'أسبوع الأساسيات',
        description: 'تعلم قواعد وأساسيات الشطرنج',
        sortOrder: 0,
        days: [
          {
            title: 'التعرف على اللوحة والقطع',
            description: 'تعلم أسماء القطع وحركاتها الأساسية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: شرح مبسط لقطع الشطرنج', description: 'تعرف على كل قطعة وخطواتها المسموح بها على اللوحة', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: تعرّف على القطع', description: 'اختبار سريع لمعرفة أسماء وحركات قطع الشطرنج', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: ارسم لوحة شطرنج وصِف كل قطعة', description: 'ارسم لوحة شطرنج واكتب بجانب كل قطعة مسار حركتها', xpReward: 10, sortOrder: 2 },
            ],
          },
          {
            title: 'القواعد الأساسية',
            description: 'كيف تبدأ وتنهي مباراة شطرنج',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تلعب مباراة كاملة', description: 'تابع مباراة كاملة من البداية للنهاية مع شرح كل حركة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: لعب أول مباراة', description: 'العب مباراة شطرنج كاملة مع صديق أو على تطبيق وسجل النتيجة', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الفتحات الشهيرة',
            description: 'تعلم أبسط الافتتاحيات في الشطرنج',
            items: [
              { type: 'article', title: 'مقال: ٣ فتحات للمبتدئين', description: 'تعلم أبسط وأقوى افتتاحيات الشطرنج التي يستخدمها المحترفون', xpReward: 8, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: اختر الفتحة الصحيحة', description: 'اختبر معرفتك بالافتتاحيات من خلال سيناريوهات لعب', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'التفكير الاستراتيجي',
            description: 'ابدأ بالتفكير بخطوات متقدمة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تفكر كلاعب شطرنج', description: 'تعلم طريقة تفكير المحترفين عند كل حركة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حل ٣ مسائل شطرنج', description: 'حل ٣ مسائل شطرنج بسيطة لتطوير تفكيرك الاستراتيجي', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع التكتيك',
        description: 'تعلم حيل ونصائح متقدمة للفوز',
        sortOrder: 1,
        days: [
          {
            title: 'الشَك والكش مات',
            description: 'تعلم أساسيات الهجوم على الملك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أشهر حركات الكش مات', description: 'شاهد ٥ حركات كش مات رائعة يمكنك استخدامها في مبارياتك', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: وجّه كش مات!', description: 'ضع نفسك في موقف وانظر إن كنت تستطيع إنهاء المباراة بكش مات', xpReward: 15, sortOrder: 1 },
              { type: 'task', title: 'مهمة: تمرّن على ٥ مسائل كش مات', description: 'حل ٥ مسائل كش مات من مستوى مبتدئ على تطبيق شطرنج', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'الدفاع الذكي',
            description: 'كيف تحمي قطعك وتتجنب الأفخاخ',
            items: [
              { type: 'article', title: 'مقال: الأخطاء الشائعة للمبتدئين', description: 'تعرف على أكثر ٥ أخطاء يقع فيها المبتدئون وكيف تتجنبها', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: راجع مباراتك السابقة', description: 'راجع آخر مباراة لعبها وحدد ٣ أخطاء ارتكبتها', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'ألعاب ذهنية أخرى',
            description: 'وسّع مهاراتك بألعاب ذهنية متنوعة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: ألعاب ذهنية تقوي ذكاءك', description: 'تعرف على ألعاب مثل السودوكو والألغاز المنطقية', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: لغز منطقي', description: 'حل لغز منطقي يحتاج تفكير عميق وترتيب أفكار', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'التخطيط للمستقبل',
            description: 'طور مهاراتك في الشطرنج والألعاب الذهنية',
            items: [
              { type: 'article', title: 'مقال: خطة تطوير لمدة ٣٠ يوماً', description: 'خطة يومية لتحسين مستواك في الشطرنج والألعاب الذهنية', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ضع جدول التدوين الذهني', description: 'أنشئ جدولاً أسبوعياً لممارسة الشطرنج والألعاب الذهنية', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار نهائي الشطرنج', description: 'اختبر شامل لكل ما تعلمته خلال الأسبوعين', xpReward: 20, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'الرسم والإبداع',
    branchType: 'hobby',
    weeks: [
      {
        title: 'أسبوع التعبير',
        description: 'اكتشف إبداعك من خلال الرسم الأساسي',
        sortOrder: 0,
        days: [
          {
            title: 'أدوات الرسم الأساسية',
            description: 'تعرف على الأدوات التي تحتاجها للبدء',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أدوات رسم للمبتدئين', description: 'دليلك لاختيار أدوات الرسم المناسبة دون إنفاق كثير', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: دليل المبتدئ في اختيار أدوات الرسم', description: 'مقارنة بين أنواع الورق والأقلام والفرش وكل ما تحتاجه', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: جهّز حقيبة الرسم', description: 'اجمع أدوات رسم أساسية في مكان واحد وجاهزة للاستخدام', xpReward: 10, sortOrder: 2 },
            ],
          },
          {
            title: 'الخطوط والأشكال',
            description: 'أساس كل رسم يبدأ بخطوط وأشكال بسيطة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تمارين الخطوط والأشكال', description: 'تمارين يومية لتحسين ثبات يدك ودقة خطوطك', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ارسم ١٠ أشكال أساسية', description: 'تدرب على رسم الدوائر والمربعات والمثلثات بأنواع مختلفة', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الرسم بالمنظور',
            description: 'أضف عمقاً لرسوماتك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: رسم المنظور البسيط', description: 'تعلم كيف ترسم أشياء ثلاثية الأبعاد بمنظور واحد', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: ارسم مكعب بمنظور', description: 'ارسم مكعباً بثلاثة خطوط اختفاء وحصل على أعلى تقييم', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: ارسم غرفتك بمنظور', description: 'حاول رسم غرفتك بمنظور نقطة واحدة', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'الرسم بالظل والضوء',
            description: 'اجعل رسوماتك حقيقية بإضافة الظلال',
            items: [
              { type: 'article', title: 'مقال: أسرار الظل والضوء في الرسم', description: 'تعلم كيف تحدد مصدر الضوء وتضيف ظلال واقعية لرسوماتك', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ارسم كرة مع ظلال', description: 'ارسم كرة وأضف ظلالاً تجعلها تبدو حقيقية ثلاثية الأبعاد', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع الإبداع',
        description: 'تقنيات إبداعية لتطوير أسلوبك الفني',
        sortOrder: 1,
        days: [
          {
            title: 'رسم الوجوه',
            description: 'ادخل عالم رسم البورتريه',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف ترسم وجه إنسان', description: 'خطوات مبسطة لرسم وجه بشر متناسب وجذاب', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ارسم وجه من الصورة', description: 'اختر صورة شخص وحاول رسمها بالقلم الرصاص', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'استخدام الألوان',
            description: 'اكتشف عالم الألوان ودورتها',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نظرية الألوان للمبتدئين', description: 'تعلم العلاقات بين الألوان وكيف تختار تدرجات متناسقة', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: اختبار نظرية الألوان', description: 'اختبر معرفتك بالألوان الأساسية والثانوية والتكميلية', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: اعمل دائرة ألوان', description: 'ارسم دائرة الألوان الكاملة وحدد العلاقات بينها', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'الرسم التعبيري',
            description: 'عبّر عن مشاعرك من خلال الفن',
            items: [
              { type: 'article', title: 'مقال: الفن التعبيري وعلم النفس', description: 'كيف يساعد الرسم التعبيري في التخلص من التوتر والتعبير عن المشاعر', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ارسم مشاعرك اليوم', description: 'ارسم مشاعرك الحالية بألوان وأشكال حرة بدون قواعد', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'مشروعك الإبداعي',
            description: 'أنشئ عملاً فنياً كاملاً',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نصائح لإنهاء مشروع فني', description: 'كيف تبدأ وأنهي عملاً فنياً من الفكرة للتنفيذ النهائي', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ارسم لوحة كاملة', description: 'ارسم لوحة من اختيارك باستخدام كل ما تعلمته خلال الأسبوعين', xpReward: 20, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار الفن والإبداع', description: 'اختبر شامل لمعلوماتك الفنية ومهاراتك في الرسم', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'الكتابة والتعبير',
    branchType: 'hobby',
    weeks: [
      {
        title: 'أسبوع الكتابة',
        description: 'ابدأ رحلتك في عالم الكتابة الإبداعية',
        sortOrder: 0,
        days: [
          {
            title: 'لماذا نكتب؟',
            description: 'اكتشف قوة الكتابة في تنظيم أفكارك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: فوائد الكتابة اليومية', description: 'كيف تغير الكتابة حياتك وتنظم أفكارك ومشاعرك', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: الكتابة كأداة علاجية', description: 'العلم وراء تأثير الكتابة على الصحة النفسية والذكاء العاطفي', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: اكتب صفحة عن نفسك', description: 'اكتب صفحة كاملة تصف فيها شخصيتك وأحلامك', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'اليوميات الشخصية',
            description: 'تعلم فن كتابة اليوميات',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تكتب يوميات فعالة', description: 'نصائح عملية لتحويل كتابة اليوميات من عادة عادية لأداة تطوير شخصي', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب يومياتك لمدة ٣ أيام', description: 'سجّل أحداث ومشاعر أفكارك لمدة ٣ أيام متتالية', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الكتابة الوصفية',
            description: 'تعلم وصف الأشخاص والأماكن بأسلوب جذاب',
            items: [
              { type: 'article', title: 'مقال: أسرار الكتابة الوصفية', description: 'تقنيات لتحويل وصف بسيط إلى نص حي يخطف القارئ', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: صِف مكانك المفضل', description: 'اكتب فقرة صفحة كاملة تصف فيها مكانك المفضل بكل حواسك', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختر الوصف الأجمل', description: 'قارن بين عدة نصوص وصفية واختر الأجمل وأخبر لماذا', xpReward: 10, sortOrder: 2 },
            ],
          },
          {
            title: 'الكتابة الحرة',
            description: 'اترك أفكارك تتدفق بدون رقابة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تقنية الكتابة الحرة', description: 'تعلم كيف تكتب لمدة ١٠ دقائق متواصلة بدون توقف', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: جلسة كتابة حرة لمدة ١٠ دقائق', description: 'اكتب كل ما يخطر في بالك لمدة ١٠ دقائق بدون توقف أو تصحيح', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع التطوير',
        description: 'طور مهاراتك الكتابية واحترف أساليب متقدمة',
        sortOrder: 1,
        days: [
          {
            title: 'القصة القصيرة',
            description: 'تعلم عناصر كتابة القصة القصيرة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: عناصر القصة القصيرة', description: 'الشخصية والحبكة والعقدة والحل - أساسيات كل قصة ناجحة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب قصة قصيرة', description: 'اكتب قصة قصيرة من ٣٠٠ كلمة تبدأ بجملة محددة', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'تحرير وتنقيح النصوص',
            description: 'المهارة السرية للكتاب المحترفين',
            items: [
              { type: 'article', title: 'مقال: فن التحرير والتنقيح', description: 'كيف تحول نصك العادي إلى نص احترافي بخطوات بسيطة', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حرّر نصاً كتبته سابقاً', description: 'اختر نصاً كتبته هذا الأسبوع وعدّله ٣ مرات على الأقل', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: أصلح الأخطاء', description: 'جد الأخطاء الإملائية والنحوية والأسلوبية في النص المعروض', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'أساليب أدبية متنوعة',
            description: 'اكتشف أنواعاً مختلفة من الكتابة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أنواع الكتابة الأدبية', description: 'تعرف على المقال والخاطرة والقصة والشعر والنثر', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: جرّب أسلوباً جديداً', description: 'اختر نوع كتابة لم تجربه من قبل واكتب فيه نصاً قصيراً', xpReward: 12, sortOrder: 1 },
            ],
          },
          {
            title: 'مشروعك الكتابي',
            description: 'أنهِ مشروعك الأول في الكتابة',
            items: [
              { type: 'article', title: 'مقال: كيف تنشر كتابك الأول', description: 'خطوات عملية من الكتابة حتى النشر على منصات عربية وعالمية', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اجمع أفضل كتاباتك في ملف واحد', description: 'اجمع أفضل ما كتبته خلال الأسبوعين ونظّمه في ملف خاص بك', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار الكتابة النهائي', description: 'اختبر شامل لكل ما تعلمته عن فنون الكتابة', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
];

/* ─── Skill Branches Content ──────────── */
const skillBranchesContent: BranchData[] = [
  {
    title: 'البرمجة والتكنولوجيا',
    branchType: 'skill',
    weeks: [
      {
        title: 'أسبوع أساسيات البرمجة',
        description: 'ابدأ رحلتك في عالم البرمجة والتكنولوجيا',
        sortOrder: 0,
        days: [
          {
            title: 'ما هي البرمجة؟',
            description: 'تعرف على عالم البرمجة وتطبيقاته',
            items: [
              { type: 'youtube_reel', title: 'فيديو: مدخل إلى عالم البرمجة', description: 'شرح مبسط عن البرمجة ولغاتها وكيف تغير حياتنا اليومية', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: لماذا يتعلم الجميع البرمجة؟', description: 'أهم ٧ أسباب تجعل البرمجة مهارة أساسية في العصر الرقمي', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: اكتب أول كود لك', description: 'استخدم بيئة برمجة مجانية واكتب أول سطر كود طباعة', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'المنطق البرمجي',
            description: 'تعلم أساسيات التفكير البرمجي',
            items: [
              { type: 'youtube_reel', title: 'فيديو: الخوارزميات والمنطق', description: 'ما هي الخوارزميات وكيف نستخدم المنطق لحل المشكلات', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: لغز برمجي منطقي', description: 'حل لغز منطقي باستخدام التفكير البرمجي والخوارزميات', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'المتغيرات والعمليات',
            description: 'أساسيات أي لغة برمجة',
            items: [
              { type: 'article', title: 'مقال: المتغيرات وأنواع البيانات', description: 'تعرف على المفاهيم الأساسية للمتغيرات وكيفية تخزين البيانات', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب برنامج آلة حاسبة بسيطة', description: 'أنشئ برنامجاً يقوم بعمليات حسابية بسيطة باستخدام المتغيرات', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار المتغيرات', description: 'اختبر فهمك للمتغيرات وأنواع البيانات', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'تطوير الويب',
            description: 'ادخل عالم مواقع الإنترنت',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تعمل مواقع الإنترنت', description: 'شرح مبسط عن HTML وCSS وكيف يعرض المتصفح صفحات الويب', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: أنشئ صفحة ويب أولى', description: 'استخدم HTML وCSS لإنشاء صفحة ويب بسيطة عن نفسك', xpReward: 20, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع تطوير الويب',
        description: 'ابنِ أول مشروع ويب حقيقي لك',
        sortOrder: 1,
        days: [
          {
            title: 'HTML المتقدم',
            description: 'وسوم وتقنيات متقدمة لبناء صفحات أقوى',
            items: [
              { type: 'article', title: 'مقال: الوسوم الدلالية في HTML', description: 'تعرف على الوسوم التي تعطي معنى لمحتوى صفحتك وتحسن SEO', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اعمل هيكل صفحة متكامل', description: 'ابنِ هيكل HTML كامل يحتوي على header وmain وfooter', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'CSS والتصميم',
            description: 'اجعل صفحاتك جميلة ومتجاوبة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أساسيات CSS لصفحات جميلة', description: 'تعلم الألوان والخطوط والتخطيطات الأساسية في CSS', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: صمم صفحة سيرتك الذاتية', description: 'استخدم CSS لتنسيق وتجميل صفحة HTML التي عملتها بالأمس', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار CSS', description: 'اختبر معلوماتك عن خصائص CSS المختلفة', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'JavaScript الأساسيات',
            description: 'أضف التفاعل لصفحاتك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أول خطوات في JavaScript', description: 'تعلم كيف تكتب JavaScript وتضيفه لصفحات الويب', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: أضف تفاعل لصفحتك', description: 'اكتب كود JavaScript يتفاعل مع نقرات المستخدم', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'مشروعك الأول',
            description: 'اجمع كل ما تعلمته في مشروع واحد',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نصائح لبناء مشروعك الأول', description: 'خطوات عملية لتحويل فكرتك إلى مشروع ويب يعمل', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ابنِ تطبيق قائمة مهام', description: 'أنشئ تطبيق قائمة مهام بسيط بـ HTML وCSS وJavaScript', xpReward: 25, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار البرمجة الشامل', description: 'اختبر شامل لكل ما تعلمته عن البرمجة وتطوير الويب', xpReward: 20, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'التصوير والمونتاج',
    branchType: 'skill',
    weeks: [
      {
        title: 'أسبوع أساسيات التصوير',
        description: 'تعلم مبادئ التصوير الفوتوغرافي',
        sortOrder: 0,
        days: [
          {
            title: 'التعرف على الكاميرا',
            description: 'تعلم أجزاء الكاميرا ووظيفة كل منها',
            items: [
              { type: 'youtube_reel', title: 'فيديو: شرح أجزاء الكاميرا', description: 'تعرف على العدسة وفتحة العدسة وسرعة الغالق والحساسية', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: التصوير بالهاتف المحمول', description: 'نصائح للحصول على صور احترافية بكاميرا هاتفك فقط', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: صوّر ٥ صور بتقنيات مختلفة', description: 'التقط ٥ صور باستخدام أوضاع مختلفة في كاميرا هاتفك', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'التكوين والإطار',
            description: 'أساسيات التكوين الجذاب للصور',
            items: [
              { type: 'youtube_reel', title: 'فيديو: قواعد التكوين في التصوير', description: 'قاعدة الأثلاث والتكوين الذهبي وطرق إطار الصورة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: طبّق قاعدة الأثلاث', description: 'التقط ٣ صور باستخدام قاعدة الأثلاث بوضوح', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الإضاءة والظلال',
            description: 'الضوء هو سر كل صورة جميلة',
            items: [
              { type: 'article', title: 'مقال: أنواع الإضاءة في التصوير', description: 'تعلم الفرق بين الضوء الطبيعي والصناعي وكيف تستخدم كل نوع', xpReward: 8, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: اختر الإضاءة الأفضل', description: 'في سيناريوهات مختلفة اختر نوع الإضاءة المناسب', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: صوّر بنور ذهبي', description: 'التقط صوراً في الساعة الذهبية لمدة يومين متتاليين', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'أنواع التصوير',
            description: 'اكتشف مجالات التصوير المختلفة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أنواع التصوير الفوتوغرافي', description: 'تعرف على تصوير البورتريه والمناظر الطبيعية والمنتجات', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: جرّب نوعين مختلفين', description: 'التقط صوراً في مجالين مختلفين على الأقل', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع المونتاج',
        description: 'تعلم تحرير الصور والفيديو',
        sortOrder: 1,
        days: [
          {
            title: 'تحرير الصور',
            description: 'اجعل صورك أفضل بالتعديل',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تطبيقات تعديل الصور المجانية', description: 'أفضل تطبيقات الهاتف لتعديل الصور بسهولة وبدون خبرة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: عدّل ٣ صور من تصويرك', description: 'استخدم تطبيق تعديل لتحسين ٣ صور التقطتها هذا الأسبوع', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'أساسيات تصوير الفيديو',
            description: 'كيف تصور فيديو احترافي',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نصائح لتصوير فيديو بالهاتف', description: 'حيل بسيطة تحوّل فيديوهاتك العادية إلى محتوى احترافي', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: صوّر فيديو مدة دقيقة', description: 'التقط فيديو مدته ٦٠ ثانية عن موضوع تحبه', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار التصوير', description: 'اختبر معلوماتك عن أساسيات التصوير والمونتاج', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'المونتاج البسيط',
            description: 'قصة وتحميل الفيديوهات',
            items: [
              { type: 'article', title: 'مقال: أدوات المونتاج المجانية', description: 'مقارنة بين أفضل برامج وتطبيقات المونتاج المجانية', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اقطع وعدّل فيديوك', description: 'استخدم أداة مونتاج لقص وتعديل الفيديو الذي صورته بالأمس', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'مشروعك البصري',
            description: 'أنشئ معرضك الأول',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تبني معرضاً رقمياً', description: 'نصائح لعرض أفضل أعمالك بشكل منظم وجذاب', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اختر أفضل ١٠ صور', description: 'راجع كل ما صورته واختر أفضل ١٠ صور واعرضها في معرض', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار التصوير والمونتاج', description: 'اختبر شامل لكل ما تعلمته في التصوير والمونتاج', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'الطبخ والمطبخ',
    branchType: 'skill',
    weeks: [
      {
        title: 'أسبوع أساسيات المطبخ',
        description: 'تعلم أساسيات الطبخ وأدوات المطبخ',
        sortOrder: 0,
        days: [
          {
            title: 'تعرف على مطبخك',
            description: 'الأدوات والمكونات الأساسية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أدوات مطبخ أساسية', description: 'الـ ١٥ أداة التي يحتاجها كل شخص في مطبخه', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: مكونات التخزين الذكي', description: 'ما الذي يجب أن يكون دائماً في مخزن مطبخك', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: نظّف ونظّف مطبخك', description: 'رتّب مطبخك ونظّف الأدوات وتأكد من جاهزية المكونات الأساسية', xpReward: 10, sortOrder: 2 },
            ],
          },
          {
            title: 'السلامة في المطبخ',
            description: 'قواعد مهمة لحماية نفسك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نصائح السلامة في المطبخ', description: 'كيف تتعامل مع السكاكين والنار والزيت بأمان', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: اختبار السلامة', description: 'اختبر معرفتك بقواعد السلامة والنظافة في المطبخ', xpReward: 12, sortOrder: 1 },
            ],
          },
          {
            title: 'تقنيات الطبخ الأساسية',
            description: 'السلق والشوي والقلي',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أساسيات الطبخ للمبتدئين', description: 'تعلم أهم ٤ تقنيات طبخ كل شخص يجب أن يعرفها', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اسلق بيضة بشكل مثالي', description: 'تدرب على سلق البيضة بالدرجة التي تفضلها', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: اعمل وجبة فطور كاملة', description: 'حضّر فطوراً صحياً يتكون من ٣ عناصر على الأقل', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'قراءة الوصفات',
            description: 'كيف تفهم وتنفذ أي وصفة',
            items: [
              { type: 'article', title: 'مقال: لغة الوصفات', description: 'شرح المصطلحات المستخدمة في الوصفات وكيفية قراءة المقادير', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اختر وصفة ونفّذها', description: 'اختر وصفة بسيطة ونفّذها خطوة بخطوة', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع الوصفات الصحية',
        description: 'تعلم تحضير وجبات صحية ولذيذة',
        sortOrder: 1,
        days: [
          {
            title: 'الوجبات الصحية',
            description: 'طبخ صحي لا يفقد الطعم',
            items: [
              { type: 'youtube_reel', title: 'فيديو: وصفات صحية في ١٥ دقيقة', description: '٣ وصفات صحية وسريعة التحضير ولذيذة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حضّر سلطة صحية', description: 'اعمل سلطة متكاملة تحتوي بروتين وخضار ودهون صحية', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الوجبات العربية التقليدية',
            description: 'أتقن أشهر الأطباق العربية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: طبخ الأطباق العربية الشهيرة', description: 'تعلم تحضير أشهر الأطباق العربية بطريقة سهلة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حضّر طبقاً عربياً تقليدياً', description: 'اختر طبقاً عربياً وتعلم تحضيره من الصفر', xpReward: 20, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار التوابل العربية', description: 'اختبر معرفتك بالتوابل والمكونات العربية', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'الحلويات البسيطة',
            description: 'أطباق حلوى سهلة ومضمونة',
            items: [
              { type: 'article', title: 'مقال: حلويات من ٣ مكونات', description: 'وصفات حلويات سهلة جداً تحتاج فقط ٣ مكونات', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اعمل حلوى بسيطة', description: 'اختر وصفة حلوى بسيطة ونفّذها وشاركها مع عائلتك', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'مشروع الطبخ',
            description: 'قدم وليمة كاملة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تقدم وليمة كاملة', description: 'نصائح لتحضير وتقديم وجبة كاملة من المقبلات للحلوى', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حضّر وجبة كاملة من ٤ أطباق', description: 'اعمل وجبة كاملة تشمل مقبلات رئيسي وسلطة وحلوى', xpReward: 25, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار الطبخ الشامل', description: 'اختبر شامل لكل ما تعلمته عن الطبخ والمطبخ', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'التأمل واليوغا',
    branchType: 'skill',
    weeks: [
      {
        title: 'أسبوع التأمل الأساسي',
        description: 'تعلم أساسيات التأمل والهدوء الذهني',
        sortOrder: 0,
        days: [
          {
            title: 'ما هو التأمل؟',
            description: 'اكتشف ماهية التأمل وفوائده',
            items: [
              { type: 'youtube_reel', title: 'فيديو: مدخل إلى التأمل', description: 'شرح مبسط عن التأمل وكيف يغير حياتك في دقائق يومية', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: العلم وراء التأمل', description: 'ماذا يحدث في دماغك عندما تتأمل؟ أحدث الأبحاث العلمية', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: جلسة تأمل ٥ دقائق', description: 'اجلس في مكان هادئ وتأمل لمدة ٥ دقائق مع التركيز على التنفس', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'التنفس الواعي',
            description: 'تعلم تقنيات التنفس العميق',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تمارين التنفس العميق', description: '٣ تقنيات تنفس تساعدك على الهدوء والتركيز الفوري', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: تمرّن على التنفس ٤-٧-٨', description: 'طبّق تقنية التنفس ٤-٧-٨ لمدة ٥ دقائق مرتين اليوم', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'التأمل الموجه',
            description: 'جلسات تأمل بإرشادات صوتية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تأمل موجه للمبتدئين', description: 'جلسة تأمل موجهة مدتها ١٠ دقائق للاسترخاء العميق', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: سجّل صوت تأملك الخاص', description: 'سجّل صوتك يقرأ نص تأمل قصير واستمع إليه', xpReward: 12, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار التأمل', description: 'اختبر معلوماتك عن التأمل وفوائده وتقنياته', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'بناء روتين التأمل',
            description: 'اجعل التأمل عادة يومية',
            items: [
              { type: 'article', title: 'مقال: كيف تجعل التأمل عادة يومية', description: 'نصائح عملية للحفاظ على التأمل كل يوم حتى في الأيام المزدحمة', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: تأمل كل يوم لمدة أسبوع', description: 'التزم بجلسة تأمل يومية لمدة ٧ أيام متتالية', xpReward: 20, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع اليوغا المتقدمة',
        description: 'تقنيات يوغا وتأمل متقدمة',
        sortOrder: 1,
        days: [
          {
            title: 'أساسيات اليوغا',
            description: 'تعلم الوضعيات الأساسية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: وضعيات يوغا للمبتدئين', description: '٥ وضعيات بسيطة يمكن لأي شخص فعلها بدون خبرة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: تمرّن على ٣ وضعيات', description: 'تدرب على ٣ وضعيات يوغا أساسية لمدة ١٥ دقيقة', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'يوغا الاسترخاء',
            description: 'تقنيات يوغا للهدوء والاسترخاء',
            items: [
              { type: 'youtube_reel', title: 'فيديو: يوغا قبل النوم', description: 'تمارين يوغا هادئة تساعدك على النوم العميق', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: جلسة يوغا مسائية', description: 'قم بجلسة يوغا استرخاء قبل النوم لمدة ٣ أيام', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار اليوغا', description: 'اختبر معلوماتك عن وضعيات اليوغا وفوائدها', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'اليقظة الذهنية',
            description: 'كن حاضراً في كل لحظة',
            items: [
              { type: 'article', title: 'مقال: اليقظة الذهنية في الحياة اليومية', description: 'كيف تمارس اليقظة في كل أنشطتك اليومية', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: وجبة يقظة ذهنية', description: 'تناول وجبة واحدة بوعي كامل دون تشتت لمدة ٣ أيام', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'روتينك الشامل',
            description: 'اجمع التأمل واليوغا في روتين يومي',
            items: [
              { type: 'youtube_reel', title: 'فيديو: روتين صباحي متكامل', description: 'روتين ٢٠ دقيقة يجمع بين التأمل واليوغا والتنفس', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: طبّق الروتين لمدة أسبوع', description: 'التزم بالروتين الصباحي المتكامل لمدة ٧ أيام', xpReward: 25, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار التأمل واليوغا', description: 'اختبر شامل لكل ما تعلمته عن التأمل واليوغا', xpReward: 15, sortOrder: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'اللغات والترجمة',
    branchType: 'skill',
    weeks: [
      {
        title: 'أسبوع تعلم اللغات',
        description: 'ابدأ رحلتك في تعلم لغة جديدة',
        sortOrder: 0,
        days: [
          {
            title: 'كيف تتعلم لغة جديدة؟',
            description: 'استراتيجيات فعالة لتعلم اللغات',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أسرار تعلم اللغات بسرعة', description: 'نصائح من متحدثين بـ ٥ لغات حول أسرع طرق التعلم', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: أفضل تطبيقات تعلم اللغات', description: 'مقارنة بين أشهر تطبيقات تعلم اللغات المجانية والمدفوعة', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: اختر لغة وحدد هدفك', description: 'اختر لغة تريد تعلمها واكتب هدفاً واضحاً لمدة ٣٠ يوماً', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'المفردات الأولى',
            description: 'ابنِ مخزونك الأول من الكلمات',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تعلم ١٠٠ كلمة أساسية', description: 'الكلمات الأكثر استخداماً في أي لغة جديدة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: احفظ ٢٠ كلمة جديدة', description: 'تعلم وحفظ ٢٠ كلمة جديدة في اللغة التي اخترتها', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الاستماع والمحادثة',
            description: 'تدرب على فهم اللغة والتحدث بها',
            items: [
              { type: 'youtube_reel', title: 'فيديو: تقنيات تحسين الاستماع', description: 'كيف تفهم المحتوى بلغة جديدة حتى لو لم تفهم كل كلمة', xpReward: 10, sortOrder: 0 },
              { type: 'game_challenge', title: 'تحدي: اختبار المفردات', description: 'اختبر حفظك للمفردات التي تعلمتها', xpReward: 12, sortOrder: 1 },
              { type: 'task', title: 'مهمة: استمع لبودكاست ١٥ دقيقة', description: 'استمع لمحتوى باللغة الجديدة لمدة ١٥ دقيقة يومياً', xpReward: 12, sortOrder: 2 },
            ],
          },
          {
            title: 'القواعد الأساسية',
            description: 'تعلم بنية الجمل البسيطة',
            items: [
              { type: 'article', title: 'مقال: القواعد الأساسية للمبتدئين', description: 'أهم القواعد النحوية التي تحتاجها لتكوين جمل بسيطة', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب ١٠ جمل بسيطة', description: 'استخدم المفردات والقواعد لتكوين ١٠ جمل صحيحة', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
      {
        title: 'أسبوع الترجمة والممارسة',
        description: 'طبّق مهاراتك وابدأ في الترجمة',
        sortOrder: 1,
        days: [
          {
            title: 'أساسيات الترجمة',
            description: 'مبادئ الترجمة من وإلى العربية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: فن الترجمة', description: 'تعرف على الفرق بين الترجمة الحرفية والمعنوية', xpReward: 10, sortOrder: 0 },
              { type: 'article', title: 'مقال: أخطاء شائعة في الترجمة', description: 'أكثر الأخطاء شيوعاً في الترجمة وكيف تتجنبها', xpReward: 8, sortOrder: 1 },
              { type: 'task', title: 'مهمة: ترجم ٥ جمل', description: 'ترجم ٥ جمل من اللغة التي تتعلمها إلى العربية', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'الترجمة الأدبية',
            description: 'ترجمة النصوص الإبداعية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: ترجمة الشعر والنثر', description: 'تحديات ترجمة النصوص الأدبية وكيف تتغلب عليها', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ترجم مقطعاً أدبياً', description: 'اختر مقطعاً قصيراً وترجمه مع الحفاظ على جمال النص', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'الممارسة اليومية',
            description: 'حافظ على تعلمك اليومي',
            items: [
              { type: 'article', title: 'مقال: أدوات مجانية لتعلم اللغات', description: 'أفضل المواقع والتطبيقات والقنوات لتعلم أي لغة مجاناً', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ٣٠ دقيقة يومياً لمدة أسبوع', description: 'التزم بـ ٣٠ دقيقة تعلم يومي لمدة ٧ أيام', xpReward: 20, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار اللغة', description: 'اختبر شامل لكل ما تعلمته خلال الأسبوعين', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'خطة التعلم المستمر',
            description: 'ضع خطة لتطوير مهاراتك اللغوية',
            items: [
              { type: 'youtube_reel', title: 'فيديو: نصائح للوصول للاحتراف', description: 'خطة من ٦ أشهر للوصول لمستوى محادثة مريح في أي لغة', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب خطة ٣٠ يوماً', description: 'اكتب خطة تعلم يومية مفصلة لمدة ٣٠ يوماً قادمة', xpReward: 15, sortOrder: 1 },
            ],
          },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════
   POST - Seed all branch content
   ═══════════════════════════════════════ */
export async function POST() {
  try {
    // Get the first active roadmap
    const roadmap = await db.roadmap.findFirst({ where: { status: 'active' } });
    if (!roadmap) {
      return NextResponse.json({ error: 'لا يوجد مسار نشط' }, { status: 400 });
    }

    let totalWeeksCreated = 0;
    let totalDaysCreated = 0;
    let totalContentCreated = 0;

    // Process all branch content
    const allBranchContent = [...hobbyBranchesContent, ...skillBranchesContent];

    for (const branchData of allBranchContent) {
      // Find the branch by title and roadmap
      const branch = await db.branch.findFirst({
        where: { roadmapId: roadmap.id, title: branchData.title },
      });

      if (!branch) {
        console.log(`Branch not found: ${branchData.title}`);
        continue;
      }

      // Check if weeks already exist for this branch
      const existingWeeks = await db.roadmapWeek.findMany({
        where: { branchId: branch.id },
      });

      if (existingWeeks.length > 0) {
        console.log(`Branch ${branchData.title} already has ${existingWeeks.length} weeks, skipping`);
        continue;
      }

      // Create weeks with days and content
      for (const weekData of branchData.weeks) {
        const week = await db.roadmapWeek.create({
          data: {
            roadmapId: roadmap.id,
            branchId: branch.id,
            title: weekData.title,
            description: weekData.description,
            sortOrder: weekData.sortOrder,
            icon: null,
          },
        });
        totalWeeksCreated++;

        // Create days for each week
        for (const dayData of weekData.days) {
          const day = await db.roadmapDay.create({
            data: {
              weekId: week.id,
              title: dayData.title,
              description: dayData.description,
              sortOrder: weekData.days.indexOf(dayData),
              xpReward: 15,
            },
          });
          totalDaysCreated++;

          // Create content items for each day
          for (const item of dayData.items) {
            await db.contentItem.create({
              data: {
                dayId: day.id,
                type: item.type,
                title: item.title,
                description: item.description,
                xpReward: item.xpReward,
                sortOrder: item.sortOrder,
              },
            });
            totalContentCreated++;
          }
        }
      }

      console.log(`✅ Branch "${branchData.title}" seeded: 2 weeks, ${branchData.weeks.reduce((s, w) => s + w.days.length, 0)} days`);
    }

    // ─── Seed shared weeks ────────────────
    const sharedWeeksData = [
      {
        title: 'مراجعة نصف الطريق',
        description: 'مراجعة شاملة لكل ما تعلمته في الأسابيع الأولى',
        sortOrder: 100, // After week 4 (sortOrder 0-3), before week 5
        icon: null,
        days: [
          {
            title: 'مراجعة الأسبوعين الأولين',
            description: 'راجع أهم ما تعلمته في الوعي وتغيير العادات',
            items: [
              { type: 'article', title: 'مقال: ملخص رحلتك حتى الآن', description: 'توقف وراجع كل ما حققته منذ بداية الرحلة وكيف تغيرت حياتك', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب رسالة لنفسك', description: 'اكتب ما تشعر به الآن مقارنة ببداية الرحلة وما الذي تغير', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار نصف الطريق', description: 'اختبر شامل لكل ما تعلمته في النصف الأول من البرنامج', xpReward: 20, sortOrder: 2 },
            ],
          },
          {
            title: 'تقييم تقدمك',
            description: 'قيّم إنجازاتك وحدد نقاط التحسين',
            items: [
              { type: 'article', title: 'مقال: كيف تقيس تقدمك الحقيقي', description: 'مقاييس للتقدم تتجاوز مجرد إكمال المهام', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ملخص الإنجازات', description: 'اكتب قائمة بـ ٥ إنجازات حققتها و٣ أشياء تريد تحسينها', xpReward: 15, sortOrder: 1 },
            ],
          },
          {
            title: 'التحضير للنصف الثاني',
            description: 'استعد للمرحلة القادمة بطاقة متجددة',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تحافظ على الدافع', description: 'استراتيجيات مثبتة علمياً للحفاظ على الحماس والالتزام', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: حدد أهداف النصف الثاني', description: 'اكتب ٣ أهداف محددة تريد تحقيقها في النصف الثاني', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: بناء طاقة إيجابية', description: 'تحدٍ تفاعلي لإعادة شحن طاقتك وتحفيزك', xpReward: 12, sortOrder: 2 },
            ],
          },
        ],
      },
      {
        title: 'مراجعة قبل النهاية',
        description: 'مراجعة نهائية شاملة قبل إكمال الرحلة',
        sortOrder: 200, // After week 10 (sortOrder 0-9)
        icon: null,
        days: [
          {
            title: 'مراجعة الأشواط المتقدمة',
            description: 'راجع المهارات المتقدمة التي تعلمتها',
            items: [
              { type: 'article', title: 'مقال: ما الذي حققته فعلاً؟', description: 'تقييم صادق لكل ما تعلمته في المهارات والعادات الجديدة', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: انعكاس عميق', description: 'اكتب صفحة كاملة عن كيف تغيرت حياتك خلال هذه الرحلة', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: اختبار شامل نهائي', description: 'اختبر شامل لكل محتوى البرنامج من البداية للنهاية', xpReward: 25, sortOrder: 2 },
            ],
          },
          {
            title: 'توثيق الإنجازات',
            description: 'وثّق رحلتك وإنجازاتك',
            items: [
              { type: 'youtube_reel', title: 'فيديو: أهمية توثيق الإنجازات', description: 'لماذا يعد توثيق إنجازاتك خطوة مهمة لتحفيزك المستقبلي', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: أنشئ ملف إنجازاتك', description: 'اجمع أهم لحظاتك وإنجازاتك في ملف أو فيديو قصير', xpReward: 20, sortOrder: 1 },
            ],
          },
          {
            title: 'الاستعداد للتخرج',
            description: 'هيّئ نفسك للمرحلة الأخيرة',
            items: [
              { type: 'article', title: 'مقال: ما بعد التخرج', description: 'كيف تحافظ على إنجازاتك وتستمر في التطور بعد البرنامج', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: خطة ما بعد البرنامج', description: 'اكتب خطة عملية للحفاظ على عاداتك الجديدة', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: التحدي الأخير', description: 'تحدٍ خاص يختبر كل ما تعلمته ويحضرك للتخرج', xpReward: 20, sortOrder: 2 },
            ],
          },
        ],
      },
      {
        title: 'الأسبوع الأخير',
        description: 'اختتم رحلتك بمهمات ختامية مميزة',
        sortOrder: 300, // After week 12 (sortOrder 0-11)
        icon: null,
        days: [
          {
            title: 'رسالة الوداع',
            description: 'اكتب رسالة لنفسك وللمجتمع',
            items: [
              { type: 'article', title: 'مقال: فن كتابة رسالة الوداع', description: 'كيف تكتب رسالة مؤثرة تعبر عن رحلتك وتلهم الآخرين', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: اكتب رسالة لنفسك بعد سنة', description: 'اكتب رسالة ستقرأها بعد عام تذكّر فيها هذه الرحلة', xpReward: 20, sortOrder: 1 },
            ],
          },
          {
            title: 'مشاركة الرحلة',
            description: 'شارك تجربتك وألهم الآخرين',
            items: [
              { type: 'youtube_reel', title: 'فيديو: كيف تشارك قصتك بفاعلية', description: 'نصائح لمشاركة تجربتك بطريقة تلهم الآخرين على التغيير', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: شارك إنجازك', description: 'شارك تجربتك مع صديق أو على وسائل التواصل الاجتماعي', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: تحدي الإلهام', description: 'اكتب رسالة تحفيزية قصيرة يمكن أن تلهم شخصاً آخر', xpReward: 15, sortOrder: 2 },
            ],
          },
          {
            title: 'استراتيجيات الاستمرار',
            description: 'خطط للمستقبل بعد البرنامج',
            items: [
              { type: 'article', title: 'مقال: ٥ استراتيجيات للاستمرار بعد البرنامج', description: 'كيف تحافظ على عاداتك وتستمر في التطور بعد انتهاء البرنامج', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: ضع خطة ٩٠ يوماً', description: 'اكتب خطة مفصلة لمدة ٣ أشهر للحفاظ على إنجازاتك', xpReward: 20, sortOrder: 1 },
            ],
          },
          {
            title: 'التخرج والاحتفال',
            description: 'احتفل بإنجازك الكبير!',
            items: [
              { type: 'youtube_reel', title: 'فيديو: قوة الاحتفال بالإنجازات', description: 'لماذا الاحتفال بإنجازاتك يعزز ثقتك ويدفعك للأمام', xpReward: 10, sortOrder: 0 },
              { type: 'task', title: 'مهمة: كافئ نفسك!', description: 'اختر طريقة للاحتفال بإكمالك البرنامج وكافئ نفسك', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: حفل التخرج', description: 'اختبر شامل نهائي يختتم رحلتك بأسئلة تحفيزية', xpReward: 25, sortOrder: 2 },
            ],
          },
          {
            title: 'بداية جديدة',
            description: 'رحلتك لم تنتهِ بل بدأت للتو',
            items: [
              { type: 'article', title: 'مقال: التخرج هو البداية', description: 'كيف تحول ما تعلمته إلى نمط حياة دائم ومستمر', xpReward: 8, sortOrder: 0 },
              { type: 'task', title: 'مهمة: رسالة شكر', description: 'اكتب رسالة شكر لكل شخص ساعدك في رحلتك حتى لو بنصيحة', xpReward: 15, sortOrder: 1 },
              { type: 'game_challenge', title: 'تحدي: وعد المستقبل', description: 'اكتب وعداً لنفسك بالاستمرار في التطور والتعلم', xpReward: 20, sortOrder: 2 },
            ],
          },
        ],
      },
    ];

    // Seed shared weeks (no branchId)
    for (const sharedWeek of sharedWeeksData) {
      const existing = await db.roadmapWeek.findFirst({
        where: {
          roadmapId: roadmap.id,
          title: sharedWeek.title,
          branchId: null,
        },
      });

      if (existing) {
        console.log(`Shared week "${sharedWeek.title}" already exists, skipping`);
        continue;
      }

      const week = await db.roadmapWeek.create({
        data: {
          roadmapId: roadmap.id,
          title: sharedWeek.title,
          description: sharedWeek.description,
          sortOrder: sharedWeek.sortOrder,
          icon: sharedWeek.icon,
        },
      });
      totalWeeksCreated++;

      for (const dayData of sharedWeek.days) {
        const day = await db.roadmapDay.create({
          data: {
            weekId: week.id,
            title: dayData.title,
            description: dayData.description,
            sortOrder: sharedWeek.days.indexOf(dayData),
            xpReward: 15,
          },
        });
        totalDaysCreated++;

        for (const item of dayData.items) {
          await db.contentItem.create({
            data: {
              dayId: day.id,
              type: item.type,
              title: item.title,
              description: item.description,
              xpReward: item.xpReward,
              sortOrder: item.sortOrder,
            },
          });
          totalContentCreated++;
        }
      }

      console.log(`✅ Shared week "${sharedWeek.title}" seeded`);
    }

    return NextResponse.json({
      message: 'تم زراعة المحتوى بنجاح! 🎉',
      summary: {
        totalBranchesProcessed: allBranchContent.length,
        totalWeeksCreated,
        totalDaysCreated,
        totalContentCreated,
        sharedWeeksSeeded: sharedWeeksData.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ في زراعة المحتوى';
    console.error('Seed error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
