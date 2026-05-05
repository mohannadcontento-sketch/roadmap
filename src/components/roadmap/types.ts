export type NodeStatus = 'done' | 'active' | 'locked' | 'milestone' | 'branch';

export interface RoadmapNode {
  id: string;
  icon: string; // path to 3D icon image
  emoji: string; // fallback emoji
  label: string;
  subtitle?: string;
  status: NodeStatus;
  description?: string;
  tags?: string[];
  week?: string;
  character?: string; // path to character image shown alongside
}

export interface BranchPath {
  id: string;
  icon: string; // path to 3D icon image
  emoji: string; // fallback
  label: string;
  description: string;
  color: string;
}

/* ═══════════════════════════════════════
   Color Palette
   ═══════════════════════════════════════ */
export const COLORS = {
  bg: '#172a39',          // main dark background
  bgLight: '#1e3a4d',    // lighter surface
  bgCard: '#1a3344',     // card background
  primary: '#73b3ce',    // main accent - cyan blue
  light: '#d6f3f4',      // very light cyan
  cream: '#f8f5f0',      // off-white text
  dark: '#004346',        // deep teal
  mid: '#508992',         // mid teal
  gold: '#e8b931',        // gold for milestones
  success: '#4ecdc4',     // success green
  danger: '#ff6b6b',      // danger red
  textPrimary: '#f8f5f0',
  textSecondary: '#9ab8c4',
  textMuted: '#5a7f8f',
  border: 'rgba(115, 179, 206, 0.12)',
  borderLight: 'rgba(115, 179, 206, 0.2)',
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
    label: 'الهوية الجديدة',
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
    color: '#73b3ce',
  },
  {
    id: 'reading',
    icon: '/roadmap/paths/reading.png',
    emoji: '📚',
    label: 'القراءة',
    description: 'إعادة بناء قدرات التركيز العميق',
    color: '#4ecdc4',
  },
  {
    id: 'chess',
    icon: '/roadmap/paths/chess.png',
    emoji: '♟️',
    label: 'الشطرنج',
    description: 'تحدي ذهني بديل للألعاب',
    color: '#a78bfa',
  },
  {
    id: 'drawing',
    icon: '/roadmap/paths/drawing.png',
    emoji: '🎨',
    label: 'الرسم',
    description: 'تعبير إبداعي يفتح مناطق جديدة',
    color: '#fb923c',
  },
  {
    id: 'writing',
    icon: '/roadmap/paths/writing.png',
    emoji: '✍️',
    label: 'الكتابة',
    description: 'يومياتك، أفكارك، قصصك',
    color: '#4ade80',
  },
];

// Zigzag positions (0 = center, -1 = left, 1 = right)
export const NODE_POSITIONS = [0, 1, 0, -1, 0, 1, 0, -1, 0];
