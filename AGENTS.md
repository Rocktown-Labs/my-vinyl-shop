# AGENTS.md - Coding guidelines for My Vinyl Shop

## Build, lint, and test

- **Dev server**: `pnpm dev` (or `npm run dev`)
- **Build**: `pnpm build` (or `npm run build`)
- **Lint**: `pnpm lint` (or `npm run lint`)
- **Start production**: `pnpm start` (or `npm run start`)
- **Tests**: No test runner yet; when added, prefer Vitest/Jest with `pnpm test` and single-file runs via `pnpm test path/to/file.test.ts`

## Code style

- **Language**: TypeScript + React App Router; enable strict types and `use client` for client components.
- **Imports**: Order as React/Next, third-party, then internal `@/...`; import types with `import type { Foo } from '...'`.
- **Components**: PascalCase for components, `use`-prefixed camelCase for hooks, camelCase for functions, PascalCase for types.
- **Files**: Prefer kebab-case for components/hooks (e.g., `vinyl-card.tsx`) and utilities in `lib/` and `hooks/`.
- **UI**: Use shadcn/ui + Tailwind; compose classes with the shared `cn` helper; keep layout responsive via Tailwind breakpoints.
- **Data & validation**: Co-locate Zod schemas in `lib/validations.ts`, share types via `lib/types.ts`, and infer types from schemas (`z.infer`).
- **APIs & DB**: Use database helpers in `lib/db` and keep route handlers thin; validate input/output and avoid ad-hoc SQL in components.
- **Error handling**: Wrap async server/client logic in `try/catch`, surface user-facing errors via UX components, and avoid `console.log` in production paths.
- **Performance**: Prefer React Server Components where possible, use `React.memo`/`useMemo` sparingly for hot paths, and use Next.js `Image` and dynamic imports for heavy UI.
- **Agent notes**: Respect any `.cursor` automation, keep changes type-safe, and mirror existing patterns in nearby code.
