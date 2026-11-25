# The Archive Desk

A primary and secondary sources game for Grades 6–8. Documents arrive on your desk: stamp them, catalogue them, and
answer researchers' questions. One rule: no answer without proof.

```
npm install
npm run dev      # http://localhost:5671
npm run check    # validate every unit's content
npm run build    # static site in dist/ (relative paths: works from any folder)
```

- `src/engine/`: the desk and its task types (subject-free).
- `src/units/`: one folder per unit. Start with `docs/UNITS.md`.
- `docs/DESIGN.md`: why it works the way it does, and what's next.
- `docs/SOURCES.md`: where every source comes from.
