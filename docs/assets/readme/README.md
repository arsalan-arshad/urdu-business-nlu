# README assets

Durable visuals for the project README. Diagrams describe the **shipped rules-only v0** flow (M3 GO), not a hosted SaaS UI.

| File | Purpose |
|---|---|
| `architecture-flow.mmd` | Mermaid source: message → propose → validator → auto \| confirm \| reject |
| `architecture-flow.svg` | Same flow as static SVG (ink/teal on warm paper) |
| `example-flow-card.svg` | Synthetic Roman-Urdu input → candidate → `confirm` (UTF-8 only; Latin-1 middle-dots break GitHub `<img>` render) |
| `hero-dataflow-abstract.jpg` | Abstract hero visual (no people, no brand logos, no fake UI) |

Rendering note: GitHub and most Markdown viewers render Mermaid from fenced `mermaid` blocks; the `.mmd` file is the source of truth if the README block drifts. Prefer the SVG when Mermaid is unavailable. Keep SVGs valid UTF-8.
