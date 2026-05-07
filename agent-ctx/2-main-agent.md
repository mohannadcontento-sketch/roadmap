---
Task ID: 2
Agent: Main Agent
Task: Branch content system - separate branch tasks, shared tasks, interleaved display, progress integration

Work Log:
- Read and analyzed existing schema (Branch, RoadmapWeek with optional branchId, UserBranchSelection)
- Read and analyzed all existing API routes: branches, roadmaps, progress, day completion, branch selection
- Read and analyzed MainRoadmap.tsx, BranchSelection.tsx, DayDetailSheet.tsx components

### Files Created/Modified:

#### 1. `/src/app/api/seed/branch-content/route.ts` (NEW)
- Comprehensive seed endpoint with realistic Arabic content for 10 branches
- Each branch has 2 weeks × 4 days × 2-3 content items
- Hobby branches (5): الرياضة واللياقة, القراءة والكتب, الشطرنج والألعاب الذهنية, الرسم والإبداع, الكتابة والتعبير
- Skill branches (5): البرمجة والتكنولوجيا, التصوير والمونتاج, الطبخ والمطبخ, التأمل واليوغا, اللغات والترجمة
- Also seeds 3 shared review weeks: مراجعة نصف الطريق (sortOrder=100), مراجعة قبل النهاية (sortOrder=200), الأسبوع الأخير (sortOrder=300)
- Content types: youtube_reel, article, task, game_challenge
- All text in Arabic with realistic titles and descriptions

#### 2. `/src/components/MainRoadmap.tsx` (REWRITTEN)
- New `DisplaySection` union type for interleaved rendering
- `displaySections` useMemo that builds ordered sections:
  - Main weeks 1-2 → Branch selection (hobby) or selected hobby branch weeks → Main weeks 3-4 → Shared review "مراجعة نصف الطريق" → Main weeks 5-7 → Branch selection (skill) or selected skill branch weeks → Main weeks 8-10 → Shared review "مراجعة قبل النهاية" → Main weeks 11-12 → Shared "الأسبوع الأخير"
- New `BranchWeekSection` component with special purple (#e879f9) styling, right border accent, branch label
- New `BranchSelectionDivider` component for inline branch selection at proper positions
- Updated `WeekSection` with `isShared` prop for gold accent styling
- Branch days automatically unlocked when user selects a branch
- Next-day activation follows the displaySections order

#### 3. `/src/app/api/progress/[userId]/route.ts` (UPDATED)
- Added `branchProgress` field to response with per-branch completion stats
- Added `totalBranchSelections` to stats
- Filters main weeks (branchId: null) in enrollment progress calculation
- Includes branch weeks in branch selection progress with day completion info

#### 4. `/src/app/api/progress/[userId]/day/[dayId]/route.ts` (UNCHANGED)
- Already works for branch days since they use the same RoadmapDay/DayProgress models

### Seed Results:
- 10 branches processed
- 20 branch weeks created (2 per branch)
- 80 branch days created (4 per week)
- 228 content items created (mix of youtube_reel, article, task, game_challenge)
- 3 shared weeks created (مراجعة نصف الطريق, مراجعة قبل النهاية, الأسبوع الأخير)
- 11 shared days created
- Total: 23 weeks, 91 days, 228 content items

### Build Status:
- Lint: 0 errors, 0 warnings
- Dev server: Running, all routes serving correctly
- Page renders successfully with interleaved content

### Visual Design:
- Branch sections: Purple (#e879f9) right border, subtle purple background, GitBranch icon label showing "مسارك: [Branch Title]"
- Shared/combined weeks: Gold (#ffc800) accent with "مهمات مجمعة" badge
- Main weeks: Blue (#58c4dc) accent as before
- All content in Arabic RTL layout
