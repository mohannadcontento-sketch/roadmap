---
Task ID: 1
Agent: Main
Task: Fix ALL errors and bugs, test entire platform

Work Log:
- Read and audited ALL 34 source files (components, API routes, pages, schema)
- Fixed `branches is not defined` ReferenceError in MainRoadmap.tsx (line 721) - variable was scoped inside if block
- Fixed Admin Dashboard calling GET on POST-only `/api/admin/init` endpoint + wrong property `usersData.users`
- Fixed week edit creating duplicate week in admin roadmaps/[id]/page.tsx
- Fixed PUT handler for progress not awarding XP to users
- Fixed Share views race condition by re-reading after increment
- Added `audioUrl` field to ContentItem interface in MainRoadmap.tsx (was missing, causing type mismatch with DayDetailSheet)
- Added `content` include to branches GET API (branch days had no content items!)
- Added `content` include to branches/[id] GET API
- Added `audioUrl` support to content creation API
- Verified build succeeds with 0 errors
- Verified all API endpoints work correctly
- Verified data structure (12 main weeks, 3 shared weeks, 20 branch weeks, 10 branches)
- Restarted dev server

Stage Summary:
- 10 bugs fixed across 8 files
- Build: ✅ Compiled successfully
- All API routes verified working
- Database properly seeded with all data
