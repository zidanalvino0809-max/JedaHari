<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Day-balance math (free time, segment layout, Indonesian time formatting) lives in `src/lib/day-balance.ts` with tests beside it; UI components only render its output, so the rules stay testable.
- Mood and activity content lives in `src/lib/activities.ts`; add new micro-activities there rather than in components.
- Theme is a `dark` class on `<html>`, set pre-hydration by an inline script in `__root.tsx` from localStorage, so there is no flash of the wrong theme.
- SVG coordinates computed with trig are rounded before rendering to avoid SSR/client hydration mismatches.
