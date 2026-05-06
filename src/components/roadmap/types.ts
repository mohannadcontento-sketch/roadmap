export type NodeStatus = 'done' | 'active' | 'locked' | 'milestone' | 'branch';

export interface RoadmapNode {
  id: string;
  icon: string;
  emoji: string;
  label: string;
  subtitle?: string;
  status: NodeStatus;
  description?: string;
  tags?: string[];
  week?: string;
  character?: string;
}

export interface BranchPath {
  id: string;
  icon: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

/* ═══════════════════════════════════════
   Color Palette - Enhanced Duolingo Dark Theme
   ═══════════════════════════════════════ */
export const COLORS = {
  bg: '#0f1f2e',
  bgLight: '#162d40',
  bgCard: '#1a3347',
  bgCardHover: '#1f3b52',
  primary: '#58c4dc',
  primaryDark: '#3a9bb5',
  primaryLight: '#8fd8eb',
  light: '#d6f3f4',
  cream: '#f8f5f0',
  dark: '#004346',
  mid: '#508992',
  gold: '#ffc800',
  goldDark: '#cc9f00',
  goldLight: '#ffe066',
  success: '#58cc02',
  successDark: '#46a302',
  successLight: '#7edc3f',
  danger: '#ff4b4b',
  textPrimary: '#f8f5f0',
  textSecondary: '#a3c4d0',
  textMuted: '#5a7f8f',
  border: 'rgba(88, 196, 220, 0.15)',
  borderLight: 'rgba(88, 196, 220, 0.25)',
  lockedBg: '#152535',
  lockedBorder: 'rgba(88, 196, 220, 0.06)',
  nodeShadow: 'rgba(0, 0, 0, 0.4)',
};

export const ROADMAP_DATA: RoadmapNode[] = [
  {
    id: 'awareness',
    icon: '/roadmap/icons/awareness.png',
    emoji: '🌑',
    label: 'الوعي',
    subtitle: 'أنا فين دلوقتي؟',
    status: 'done',
    description: 'المستخدم يتعرف على التعفن الدماغي، يفهم كيف يأثر عليه، ويبدأ يراقب عاداته من غير ما يغير حاجة. مرحلة المراقبة الصادقة.',
    week: 'الأسبوع ١',
    tags: ['فيديو تعريفي ٣٠ ثانية', 'تسجيل يومي للعادات', 'تقييم أولي CBT', 'شارة البداية'],
    character: '/roadmap/characters/mascot.png',
  },
  {
    id: 'registration',
    icon: '/roadmap/icons/registration.png',
    emoji: '📋',
    label: 'التسجيل',
    subtitle: 'اختار مسارك',
    status: 'done',
    description: 'المستخدم يختار مسار هوايته الأولى من الـ ٥ مسارات ويفهم ليه هذا المسار بيساعده يستبدل العادة الرقمية الضارة.',
    week: 'الأسبوع ٢',
    tags: ['اختيار المسار', 'تحديد الهدف الشخصي'],
    character: '/roadmap/characters/mascot.png',
  },
  {
    id: 'choose-path',
    icon: '/roadmap/icons/choose-path.png',
    emoji: '🎯',
    label: 'اختيار المسار',
    subtitle: 'واحد من الخمسة',
    status: 'active',
    description: 'اختار المسار اللي هتاخده — كل مسار بيساعدك تستبدل العادة الرقمية الضارة بهوية جديدة.',
    week: 'الأسبوع ٢',
    character: '/roadmap/characters/mascot.png',
  },
  {
    id: 'first-challenge',
    icon: '/roadmap/icons/challenge.png',
    emoji: '⚔️',
    label: 'التحدي الأول',
    subtitle: 'ابدأ تتغير',
    status: 'locked',
    description: 'أول تحدي في المسار — تحدي صغير يبني الثقة ويبدأ التغيير. الفيديوهات بتعلمك كيف تستبدل العادة.',
    week: 'الأسبوع ٣',
    tags: ['تحدي أسبوعي', 'فيديو ٣٠ ثانية يومي', 'XP + ليدربورد'],
    character: '/roadmap/characters/spark.png',
  },
  {
    id: 'streak-week',
    icon: '/roadmap/icons/streak.png',
    emoji: '🔥',
    label: 'أسبوع الاستمرار',
    subtitle: 'ثابت ومستمر',
    status: 'locked',
    description: 'حافظ على السلسلة — كل يوم بتحصل على XP وتتقدم في المسار. Urge Surfing تقنية.',
    week: 'الأسبوع ٤',
    tags: ['Streak يومي', 'Urge Surfing', 'مكافأة أسبوعية'],
    character: '/roadmap/characters/spark.png',
  },
  {
    id: 'midpoint',
    icon: '/roadmap/icons/milestone.png',
    emoji: '⭐',
    label: 'منتصف الرحلة',
    subtitle: 'فتح مسار ٢',
    status: 'milestone',
    description: 'بعد شهر ونص، المستخدم اللي ثابت يفتحله مسار هواية ثانية — مكافأة على الالتزام وبيضيف تنوع لرحلته!',
    week: 'الأسبوع ٦',
    tags: ['فتح مسار ٢', 'شارة المنتصف', 'تقييم تقدم CBT', '+٥٠٠ XP'],
    character: '/roadmap/characters/plant.png',
  },
  {
    id: 'identity',
    icon: '/roadmap/icons/identity.png',
    emoji: '🧱',
    label: 'تثبيت العادة',
    subtitle: 'الهوية الجديدة',
    status: 'locked',
    description: 'تحويل العادة الجديدة من جهد لهوية — تطبيق الأسلحة اللي اتعلمتها في الحياة اليومية بشكل طبيعي.',
    week: 'الأسبوع ٧-٨',
    tags: ['Identity-Based Habits', 'تحديات متقدمة', 'مشاركات المجتمع'],
    character: '/roadmap/characters/mascot.png',
  },
  {
    id: 'resilience',
    icon: '/roadmap/icons/resilience.png',
    emoji: '🛡️',
    label: 'المرونة',
    subtitle: 'أنت تغيرت',
    status: 'locked',
    description: 'المرحلة الأخيرة — تثبيت التغيير والوقاية من الانتكاس. Relapse Prevention.',
    week: 'الأسبوع ٩-١١',
    tags: ['Relapse Prevention', 'Identity Shift', 'المجتمع'],
    character: '/roadmap/characters/brainfog.png',
  },
  {
    id: 'completion',
    icon: '/roadmap/icons/completion.png',
    emoji: '🏅',
    label: 'الإتمام',
    subtitle: 'شهادة وصال',
    status: 'milestone',
    description: 'تقييم نهائي، مقارنة مع التقييم الأولي، احتفال بالتغيير. شهادة إتمام وصال!',
    week: 'الأسبوع ١٢',
    tags: ['شارة المتعافي', 'شهادة إتمام', 'تقرير تقدم كامل'],
    character: '/roadmap/characters/mascot.png',
  },
];

export const BRANCH_PATHS: BranchPath[] = [
  {
    id: 'sports',
    icon: '/roadmap/paths/sports.png',
    emoji: '🏃',
    label: 'الرياضة',
    description: 'أعلى تأثير على الدوبامين الطبيعي',
    color: '#58c4dc',
  },
  {
    id: 'reading',
    icon: '/roadmap/paths/reading.png',
    emoji: '📚',
    label: 'القراءة',
    description: 'إعادة بناء قدرات التركيز العميق',
    color: '#58cc02',
  },
  {
    id: 'chess',
    icon: '/roadmap/paths/chess.png',
    emoji: '♟️',
    label: 'الشطرنج',
    description: 'تحدي ذهني بديل للألعاب',
    color: '#ce82ff',
  },
  {
    id: 'drawing',
    icon: '/roadmap/paths/drawing.png',
    emoji: '🎨',
    label: 'الرسم',
    description: 'تعبير إبداعي يفتح مناطق جديدة',
    color: '#ff9600',
  },
  {
    id: 'writing',
    icon: '/roadmap/paths/writing.png',
    emoji: '✍️',
    label: 'الكتابة',
    description: 'يومياتك، أفكارك، قصصك',
    color: '#82c91e',
  },
];

// Zigzag positions (0 = center, -1 = left, 1 = right)
export const NODE_POSITIONS = [0, 1, 0, -1, 0, 1, 0, -1, 0];
