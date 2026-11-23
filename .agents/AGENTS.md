# 🎯 Ghanchi Samaj App — Coding Rules & Standards

## 1. KISS Principle & Architecture (Keep It Simple & Smart)
- **Single Responsibility Principle (SRP)**: Each file should have one clear purpose. Do not mix data fetching, complex business logic, and UI rendering in a single monolithic file.
- **Domain-Driven Design (DDD)**: Group and split code by features/domains, not arbitrarily by line counts.
- **Component Modularity**: A 250-300 line limit is a *warning signal*, not a strict rule. If a file exceeds this, evaluate if it handles multiple responsibilities. If yes, extract them (e.g., separate hooks, smaller UI components). If it's a single cohesive responsibility, it's fine to be larger.
- **Single Source of Truth**: State management for global features (like Language Translation & Navigation) must use React Context (`LanguageContext`).
- **No Redundant Code**: Avoid duplications; use helper functions and shared type definitions (`@shared/types`). Extract highly reusable components into separate files.

## 2. Apple Glassmorphism Design System
- **Unified Glass Utility Classes**: Always use predefined utility classes from `index.css`:
  - `.glass-panel` for primary background cards & hero banners.
  - `.glass-card` for interactive hoverable grid items.
  - `.glass-nav` for frosted glass navigation headers.
  - `.apple-gradient-gold` for primary high-converting call-to-action buttons.
- **Responsive Layout Integrity**: Ensure top header controls (`Logo`, `Language Switcher`, `AI Bot`) and mobile bottom dock never overlap or collide.

## 3. Bilingual Support (Hindi & English)
- **Mandatory Translation Keys**: Every UI text string must be registered in `LanguageContext.tsx` with both `hi` (Hindi) and `en` (English) definitions.
- **Dynamic Translation Hook**: Access translations using `const { t } = useLanguage();`.

## 4. Code Quality & Performance
- **Zero Errors & Clean Build**: Code must compile cleanly with `npx tsc --noEmit`.
- **Standard CSS Imports**: Use `@import "tailwindcss/..."` syntax in `index.css` to prevent IDE CSS linter warnings.

## 5. Mandatory 100% Collision-Free Code Tagging Standard (`GSA-`)
- **File Header Tag (Line 1)**: Every file in `client/` and `server/` MUST declare an absolute namespace tag on Line 1: `// [GSA-<MODULE>-<TIER>-<TYPE>]` (e.g. `// [GSA-NAV-F-CM]`).
- **Numeric Section S.No (`-01`, `-02`)**: Main logic blocks MUST use numeric serial numbers (e.g. `// [GSA-MAT-F-PG-01: Filter State & Hooks]`).
- **Alphabetic Sub-Block S.No (`-01.A`, `-01.B`)**: Sub-logic branches MUST use alphabetic serial numbers (e.g. `// [GSA-MAT-F-PG-01.A: 2-Gotra Exclusion Helper]`).
- **No Semi/Short Abbreviations**: Abbreviated or ambiguous tags like `[GSA-MAT]` are strictly forbidden. Always use full namespaces.

## 6. Database Safety Rules (KhataHisab Standard)
- **Mandatory Migrations over Push**: Never use raw `drizzle-kit push` in production. Always use `drizzle-kit generate` to create SQL migration files in `./migrations`, manually review them to ensure no accidental `DROP TABLE` or `DROP COLUMN` statements exist, and then apply them.
- **Pre-Change Backup**: Any command affecting database schema or production data MUST be preceded by a full database backup.

## 7. Data Persistence (DB-First Rule)
- **No LocalStorage for Core Data**: Never use `localStorage` to save core business data like Member Profiles, KYC details, or Family Trees. All such data MUST be sent to the backend (PostgreSQL via API routes) immediately upon form submission so that the Admin Panel and Database remain the Single Source of Truth. LocalStorage is strictly reserved for UI preferences (like selected language or theme).