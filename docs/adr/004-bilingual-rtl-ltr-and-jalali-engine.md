# ADR 004: Bilingual Localization (RTL/LTR) & Solar Hijri (Jalali) Engine

## Status
Accepted

## Context
Desktop applications built for Persian-speaking software engineers frequently suffer from improper text direction (broken punctuation, alignment bugs) and lack of native Jalali calendar support. Third-party UI libraries often introduce bloat and hardcoded emojis.

## Decision
1. **Lightweight Type-Safe i18n:**
   - Strict TypeScript interface (`TranslationDictionary`) guaranteeing 100% key parity between English and Persian.
   - Zero emojis in all copy; exclusively pure Lucide vector SVG icons.
2. **Dynamic Direction Engine:**
   - React `I18nProvider` dynamically updates document root: `html[dir="rtl"]` or `html[dir="ltr"]`.
   - Direction-aware CSS classes and layout mirroring.
   - Font swapping: Persian uses `IRANYekanRegular` / `Vazirmatn`; English uses system UI typography.
3. **Dual Calendar Formatting:**
   - Built on native browser `Intl.DateTimeFormat` with `fa-IR-u-ca-persian` calendar identifier.
   - Relative date helper (`Today`, `Tomorrow`, `Yesterday` / `امروز`, `فردا`, `دیروز`).

## Consequences
- **Instant Language Switching:** Zero page reload needed to swap language or direction.
- **Accuracy:** Native Jalali dates are correctly calculated without heavy legacy calendar libraries.
- **Consistent UX:** High-fidelity RTL typography mirroring Microsoft To Do and Linear desktop standards.

