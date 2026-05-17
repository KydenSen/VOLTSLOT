# Skill: Frontend Design

> **Source:** Adapted from [anthropics/claude-code/plugins/frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)
> **Purpose:** Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.

---

## When to Activate

Load this skill when the task involves:
- Building web components, pages, or full applications
- Creating UI/UX elements that need to look production-ready
- Frontend code that must be visually striking, not generic

---

## Phase 0: Design Thinking (Before Writing Code)

Before any implementation, answer these questions:

1. **Purpose** — What problem does this interface solve? Who uses it?
2. **Tone** — Pick a BOLD aesthetic direction:
   - Brutally minimal, maximalist chaos, retro-futuristic
   - Organic/natural, luxury/refined, playful/toy-like
   - Editorial/magazine, brutalist/raw, art deco/geometric
   - Soft/pastel, industrial/utilitarian
   - Or invent your own. Every UI must have a clear personality.
3. **Constraints** — Framework, performance, accessibility requirements
4. **Differentiation** — What makes this UNFORGETTABLE? What's the one thing someone remembers?

> **CRITICAL:** Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

---

## Implementation Requirements

All frontend code produced must be:
- ✅ Production-grade and functional
- ✅ Visually striking and memorable
- ✅ Cohesive with a clear aesthetic point-of-view
- ✅ Meticulously refined in every detail

---

## Aesthetics Guidelines

### Typography
- Choose fonts that are **beautiful, unique, and interesting**
- **NEVER** use generic fonts: Arial, Inter, Roboto, system fonts
- Pair a distinctive display font with a refined body font
- Unexpected, characterful font choices elevate everything

### Color & Theme
- Commit to a cohesive aesthetic. Use CSS variables for consistency
- Dominant colors with sharp accents > timid, evenly-distributed palettes
- **NEVER** use cliched color schemes (especially purple gradients on white)

### Motion & Animation
- Use animations for effects and micro-interactions
- Prioritize CSS-only solutions for vanilla HTML
- Use Motion library for React when available
- Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions
- Use scroll-triggering and hover states that surprise

### Spatial Composition
- Unexpected layouts. Asymmetry. Overlap. Diagonal flow
- Grid-breaking elements
- Generous negative space OR controlled density

### Backgrounds & Visual Details
- Create atmosphere and depth — never default to solid colors
- Apply creative forms: gradient meshes, noise textures, geometric patterns
- Layered transparencies, dramatic shadows, decorative borders
- Custom cursors, grain overlays

---

## Anti-Patterns (NEVER Do This)

| ❌ Anti-Pattern | ✅ Instead |
|---|---|
| Inter / Roboto / Arial / system fonts | Distinctive, characterful fonts |
| Purple gradients on white | Curated, context-specific palettes |
| Predictable card layouts | Unexpected spatial composition |
| Cookie-cutter component patterns | Context-designed, purpose-built elements |
| Same aesthetic every time | Vary between light/dark, different fonts, different moods |
| Converging on "safe" choices | Make bold, intentional decisions |

---

## Complexity Matching

- **Maximalist designs** → elaborate code, extensive animations, rich effects
- **Minimalist designs** → restraint, precision, careful spacing, typography, subtle details
- Elegance comes from executing the vision well, not from picking one style

---

## Integration with Toolkit Pipeline

This skill plugs into the main pipeline at:

```
brainstorming → repository_mapper → architect → planner → [frontend_design] → coder → tester
```

When the task is frontend-related, the AI should:
1. Run `SKILLS/brainstorming.md` to clarify requirements
2. Activate `SKILLS/frontend_design.md` (this file) for design thinking
3. Proceed to implementation with design direction locked in
4. Apply `SKILLS/lint_and_validate.md` to verify code quality
5. Apply `SKILLS/self_review.md` for final polish

---

*Adapted for AI Tool Kit v3.0 by Dhanush M*
