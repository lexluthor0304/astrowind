# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Astro app: `pages/` (routes), `components/` (UI blocks), `layouts/`, `assets/` (imported images/styles), `content/` (blog posts and content collections), and `utils/`.
- `public/` holds static files served as-is (e.g., `public/robots.txt`).
- Key config files: `astro.config.ts`, `tailwind.config.js`, `tsconfig.json`, and site settings in `src/config.yaml`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local dev server at `http://localhost:4321`.
- `npm run build`: generate a production build in `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run check`: run Astro type checks plus ESLint and Prettier validation.
- `npm run fix`: auto-fix lint and formatting issues.

## Coding Style & Naming Conventions
- Use ESM (`type: module`) and TypeScript where applicable.
- Formatting is enforced by Prettier (including Astro files); linting is enforced by ESLint with `eslint-plugin-astro` and TypeScript rules.
- Keep unused params prefixed with `_` to satisfy lint rules.
- Naming patterns: components in `src/components/` use `PascalCase.astro` (e.g., `Header.astro`), route files live in `src/pages/`, and blog posts use slug-based filenames in `src/content/post/` (e.g., `my-post.mdx`).

## Testing Guidelines
- There is no dedicated unit test runner configured; use `npm run check` as the baseline quality gate.
- For UI changes, verify pages through `npm run dev` and `npm run preview`.
- When a test runner is introduced, add framework-specific commands, test file naming patterns, and any coverage targets here.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `type(scope): summary` (scope optional), e.g., `feat(blog): add author bio`, `fix: correct nav labels`, `docs: update README`. Use imperative, present-tense summaries and add `!` for breaking changes.
- PRs should include a concise description, linked issue or discussion if applicable, and screenshots for visual changes.
- Note any updates to `src/config.yaml` or content under `src/content/` in the PR description.
