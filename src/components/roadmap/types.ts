export type NodeStatus = 'done' | 'active' | 'locked' | 'milestone' | 'branch';

export interface RoadmapNode {
  id: string;
  emoji: string;
  label: string;
  subtitle?: string;
  status: NodeStatus;
  description?: string;
  tags?: string[];
  week?: string;
}

export interface BranchPath {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

export const ROADMAP_DATA: RoadmapNode[] = [
  {
    id: 'awareness',
    emoji: '🌑',
    label: 'الوعي',
    subtitle: 'أنا فين دلوقتي؟',
    status: 'done',
    description: 'المستخدم يتعرف على التعفن الدماغي، يفهم كيف يأثر عليه، ويبدأ يراقب عاداته من غير ما يغير حاجة.',
    week: 'الأسبوع ١',
    tags: ['فيديو تعريفي ٣٠ ثانية', 'تسجيل يومي للعادات', 'تقييم أولي CBT', 'شارة البداية'],
  },
  {
    id: 'registration',
    emoji: '📋',
    label: 'التسجيل',
    subtitle: 'اختار مسارك',
    status: 'done',
    description: 'المستخدم يختار مسار هوايته الأولى من الـ ٥ مسارات ويفهم ليه هذا المسار بيساعده.',
    week: 'الأسبوع ٢',
    tags: ['اختيار المسار', 'تحديد الهدف الشخصي'],
  },
  {
    id: 'choose-path',
    emoji: '🎯',
    label: 'اختيار المسار',
    subtitle: 'واحد من الخمسة',
    status: 'active',
    description: 'اختار المسار اللي هتاخده — كل مسار بيساعدك تستبدل العادة الرقمية الضارة بهوية جديدة.',
    week: 'الأسبوع ٢',
  },
  // Branch paths will be rendered separately
  {
    id: 'first-challenge',
    emoji: '⚔️',
    label: 'التحدي الأول',
    subtitle: 'ابدأ تتغير',
    status: 'locked',
    description: 'أول تحدي في المسار — تحدي صغير يبني الثقة ويبدأ التغيير.',
    week: 'الأسبوع ٣',
    tags: ['تحدي أسبوعي', 'فيديو ٣٠ ثانية يومي', 'XP + ليدربورد'],
  },
  {
    id: 'streak-week',
    emoji: '🔥',
    label: 'أسبوع الاستمرار',
    subtitle: 'ثابت ومستمر',
    status: 'locked',
    description: 'حافظ على السلسلة — كل يوم بتحصل على XP وتتقدم في المسار.',
    week: 'الأسبوع ٤',
    tags: ['Streak يومي', 'Urge Surfing', 'مكافأة أسبوعية'],
  },
  {
    id: 'midpoint',
    emoji: '⭐',
    label: 'منتصف الرحلة',
    subtitle: 'فتح مسار ٢',
    status: 'milestone',
    description: 'بعد شهر ونص، المستخدم اللي ثابت يفتحله مسار هواية ثانية — مكافأة على الالتزام!',
    week: 'الأسبوع ٦',
    tags: ['فتح مسار ٢', 'شارة المنتصف', 'تقييم تقدم CBT', '+٥٠٠ XP'],
  },
  {
    id: 'identity',
    emoji: '🧱',
    label: 'تثبيت العادة',
    subtitle: 'الهوية الجديدة',
    status: 'locked',
    description: 'تحويل العادة الجديدة من جهد لهوية — تطبيق الأسلحة في الحياة اليومية.',
    week: 'الأسبوع ٧-٨',
    tags: ['Identity-Based Habits', 'تحديات متقدمة', 'مشاركات المجتمع'],
  },
  {
    id: 'resilience',
    emoji: '🛡️',
    label: 'الهوية الجديدة',
    subtitle: 'أنت تغيرت',
    status: 'locked',
    description: 'المرحلة الأخيرة — تثبيت التغيير والوقاية من الانتكاس.',
    week: 'الأسبوع ٩-١١',
    tags: ['Relapse Prevention', 'Identity Shift', 'المجتمع'],
  },
  {
    id: 'completion',
    emoji: '🏅',
    label: 'الإتمام',
    subtitle: 'شهادة وصال',
    status: 'milestone',
    description: 'تقييم نهائي، مقارنة مع التقييم الأولي، احتفال بالتغيير. شهادة إتمام وصال!',
    week: 'الأسبوع ١٢',
    tags: ['شارة المتعافي', 'شهادة إتمام', 'تقرير تقدم كامل'],
  },
];

export const BRANCH_PATHS: BranchPath[] = [
  {
    id: 'sports',
    emoji: '🏃',
    label: 'الرياضة',
    description: 'أعلى تأثير على الدوبامين الطبيعي',
    color: '#38bdf8',
  },
  {
    id: 'reading',
    emoji: '📚',
    label: 'القراءة',
    description: 'إعادة بناء قدرات التركيز العميق',
    color: '#2dd4bf',
  },
  {
    id: 'chess',
    emoji: '♟️',
    label: 'الشطرنج',
    description: 'تحدي ذهني بديل للألعاب',
    color: '#a78bfa',
  },
  {
    id: 'drawing',
    emoji: '🎨',
    label: 'الرسم',
    description: 'تعبير إبداعي يفتح مناطق جديدة',
    color: '#fb923c',
  },
  {
    id: 'writing',
    emoji: '✍️',
    label: 'الكتابة',
    description: 'يومياتك، أفكارك، قصصك',
    color: '#4ade80',
  },
];

// Zigzag positions (0 = center, -1 = left, 1 = right)
export const NODE_POSITIONS = [0, 1, 0, -1, 0, 1, 0, -1, 0];
