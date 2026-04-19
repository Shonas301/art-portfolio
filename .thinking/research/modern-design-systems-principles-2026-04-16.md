# Modern Design System Principles — Research

**researched:** 2026-04-16
**stream:** tinamation
**confidence:** medium-high overall (see per-section breakdown)

## Summary

This research synthesizes what five major design systems (Material Design 3, Apple HIG, Vercel Geist, Linear, Stripe) and practitioner writing (Refactoring UI, Jen Simmons, modernCSS) actually say about visual quality. The dominant theme across all sources is *constraint produces beauty*: great design systems encode taste through limited, intentional sets of values — not unlimited flexibility. A secondary theme is that the gap between polished and generic is mostly about *consistency* (spacing systems, shadow tiers, type scales) rather than any single dramatic design choice.

For a 3D artist portfolio specifically, the key tension is: let the work dominate, but give it a strong enough visual container that the site itself reads as crafted. Generic template feel comes from inconsistent spacing, too many type sizes, default shadows, and states (loading/empty/error) that were never designed.

**key insight:** Beauty in modern web design is mostly subtraction — fewer type sizes, fewer shadow variants, fewer spacing values, fewer colors. The remaining values need to be exactly right and applied with total consistency.

---

## Current Understanding

### What exists

Five distinct design philosophy traditions were examined:

1. **Material Design 3** (Google) — elevation through tonal color + subtle shadows, dynamic color, 8dp base grid. Focus on adaptive surfaces and accessible contrast.
2. **Apple HIG** — Clarity, Deference, Depth as core axioms. Content leads; chrome recedes. Typography hierarchy through San Francisco at defined sizes.
3. **Vercel Geist** — Swiss-influenced minimalism. High contrast, near-zero border radius, custom typeface (Geist Sans + Geist Mono) replacing Inter. Grid is central to aesthetic identity.
4. **Linear** — LCH color space for perceptual uniformity, reduced variable set (98 variables → 3: base/accent/contrast), density-optimized spacing, Inter Display for headings.
5. **Stripe** — Three-layer quality framework (Utility → Usability → Beauty), MVQP (Minimum Viable Quality Product), craft defined as "thinking, work, and mastery" not just appearance.

### How it works

**The spacing layer:** The 8pt grid is endorsed by both Apple HIG and Material Design. Every spacing value is a multiple of 8 (8, 16, 24, 32, 40, 48…). The half-grid (4pt) is used for micro-spacing within components. Adherence to this means any two elements on screen will have spacing relationships that are mathematically harmonious.

**The elevation layer:** Most design systems use 4–6 elevation levels, not unlimited shadows. The pattern:
- Level 0: flat (base layout, backgrounds)
- Level 1: cards, secondary containers
- Level 2: dropdowns, flyouts
- Level 3: modals, full-page overlays

Material Design 3 moved away from heavy shadows toward *tonal color elevation* — surfaces at higher elevation get a subtle color tint from the primary palette rather than a dark shadow.

**The type layer:** Professional type scales use mathematical ratios (1.25 = Major Third, 1.333 = Perfect Fourth) to derive sizes. A typical system needs 6–8 sizes maximum. Font weight, line height, and letter spacing change together as a unit — you don't independently tweak each. Semantic names (body, label, display, caption) are better than size names (14px, 16px).

**The constraint layer:** The surface-area-to-volume problem. Every new value you add to a system (a new color, a new spacing size, a new shadow) multiplies the number of possible combinations exponentially. Good design systems have roughly: 4 breakpoints, ~12 colors in regular use, 4 shadow levels, 6–9 font sizes, 3 border radius values, 8 spacing increments.

### What's interesting

- **LCH color space** (used by Linear, now supported in CSS): HSL lightness is perceptually non-uniform — a yellow at 80% lightness appears much brighter than a blue at 80% lightness. LCH fixes this. Direct application: when building a neutral palette, HSL grays can appear to have color casts; LCH-based tools produce truer neutrals.
- **Stripe's MVQP** reframes when to stop iterating: not "when it works" but "when it has a level of refinement that helps the user engage effectively."
- **Anti-AI design backlash** (2025–2026): there's an emerging aesthetic counter-movement favoring intentional imperfection, asymmetry, hand-drawn elements. The "pristine perfect gradient over a 3D blob" aesthetic is now identified as generic. For an artist portfolio, this is worth noting — authentic, opinionated layout choices beat safe symmetrical templates.

---

## Patterns Observed

### Pattern 1: Constraints produce consistency, consistency produces beauty

**what:** Every major design system achieves visual quality not by adding more options but by reducing to a carefully chosen minimal set. The Ellii system example: 4 breakpoints, 12 colors, 4 shadows, 9 font sizes, 5 letter-spacing values, 4 line heights, 3 border radii, 8 spacing increments. Everything else is derived from these.

**where seen:** Constraint-Based Design Systems (normalflow.pub), Linear redesign, Vercel Geist, Refactoring UI chapter on spacing/sizing systems.

**significance:** For tinamation: the MUI Joy theme is the constraint layer. It needs to be configured tightly — don't let components diverge from the theme values, don't introduce one-off spacing or colors that aren't in the token system.

**example:**
```
// the surface-area-to-volume problem:
2 colors → 2 combinations
3 colors → 6 combinations
4 colors → 24 combinations
// each new spacing value multiplies layout combinations similarly
```

### Pattern 2: Token hierarchy as the mechanism for systematic taste

**what:** Three tiers — primitives → semantic → component. Primitives are raw values (blue-50, spacing-24). Semantic tokens give meaning (text-primary, surface-elevated). Component tokens are the last mile (button-background, card-padding). Theme switching requires only redefining primitives.

**where seen:** goodpractices.design, Contentful design token system, MUI Joy CSS variables architecture.

**significance:** MUI Joy already implements this — CSS variables at the component level reference semantic tokens which reference palette primitives. The implication: customizing the theme at the primitive level (palette colors, spacing scale) automatically propagates everywhere without component-level overrides.

**example:**
```
// naming pattern: property + element + context + state + mode
color-text-feedback-error-enabled-on_light
// vs. anti-pattern: describes the value, not the purpose
blue-button-text
```

### Pattern 3: Elevation as a communication tool, not decoration

**what:** Shadows and surface differentiation should encode information hierarchy, not just add depth. Higher elevation = higher priority in the visual attention stack. The key principle: pair elevation with other cues (color, spacing, borders) rather than relying on shadow alone.

**where seen:** designsystems.surf elevation article, Material Design 3, Fluent 2.

**significance:** Inconsistent shadow usage is a common polish failure. If a card and a tooltip use similar shadows, the user has no way to infer their relative importance.

**example:**
```
// consistent elevation vocabulary:
Level 0: base (no shadow)          → background layout
Level 1: slight lift (sm shadow)   → cards, images
Level 2: lifted (md shadow)        → dropdowns, popovers
Level 3: floating (lg shadow)      → modals, dialogs
```

### Pattern 4: Animation timing as emotional communication

**what:** Duration 150–400ms for single transitions. Ease-out for elements entering view, ease-in for elements leaving. Custom cubic-bezier curves rather than browser presets. Only animate transform and opacity (GPU-accelerated). Opacity range 0.4–1.0 for fades, not 0–1. Slide distances 5–40px.

**where seen:** joshcollinsworth.com/blog/great-transitions (directly verified), Josh Comeau's CSS transitions guide.

**significance:** "When something seems off about an animation, odds are it's because it either starts or ends with unnatural suddenness." This is the most common amateur animation mistake.

**example:**
```css
/* entering: fast out (responsive feel) */
transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);

/* exiting: slow in (graceful departure) */
transition: transform 150ms cubic-bezier(0.4, 0, 1, 1);

/* never animate: height, width, padding, margin, border */
/* always: transform, opacity only */
```

### Pattern 5: Type hierarchy through weight and color, not size alone

**what:** Rather than using many different font sizes to create hierarchy, professional systems use 2–3 sizes and vary weight, color, and letter-spacing. Refactoring UI: "Don't use font size as the only tool for establishing hierarchy. Use color, weight, and contrast too." The book specifically recommends avoiding pure black — use dark gray (e.g., #111827) — and using lower-contrast for secondary text.

**where seen:** Refactoring UI principles, medium.com/design-bootcamp summary, Typography in Design Systems (EightShapes).

**significance:** For a portfolio: a page with `display`, `body`, and `caption` scales (3 sizes) with weight and color variation reads more unified than a page with 6 different sizes all at similar contrast.

**example:**
```
display:  32px, weight 700, color: primary (#111)
body:     16px, weight 400, color: secondary (#666)
caption:  12px, weight 500, color: tertiary (#999)

vs. anti-pattern:
h1: 48px, h2: 32px, h3: 24px, h4: 20px, h5: 18px, body: 16px, small: 14px
→ creates visual noise, not hierarchy
```

### Pattern 6: States as design opportunities

**what:** Loading, empty, and error states that "were never designed" are a primary signal of low-quality work. The principle: every state is part of the experience. Empty states need: message (what's empty), why (if relevant), and one clear CTA. Error states need: empathetic tone, specific context, actionable next step. Loading states should match the density of their target content (skeleton screens over spinners for content-heavy areas).

**where seen:** logrocket.com/ui-design-best-practices, Nielsen Norman Group (empty state article), agriculture design system patterns.

**significance:** In a portfolio app that fetches from Supabase, the loading → content transition is visible on every page load. If the skeleton/loading state doesn't match the content shape, the experience feels broken even when it's working correctly.

### Pattern 7: Intrinsic/fluid spacing over pixel-perfect breakpoints

**what:** Jen Simmons' intrinsic web design: spacing and layout should be sized relative to their context, not set at fixed pixel values. CSS techniques: `clamp()` for padding, `min()` for margins, `vmax` for gaps. Breakpoints should emerge from where content breaks, not from device sizes. Use `em` units in media queries, not `px`.

**where seen:** moderncss.dev/contextual-spacing, Jen Simmons' An Event Apart talks, polypane.app responsive ground rules.

**significance:** Fixed pixel spacing means every layout change requires media query overrides. Fluid spacing means one value works across all viewports. For a portfolio with large images and varying content density, fluid spacing is especially valuable.

**example:**
```css
/* fixed spacing: requires overrides at every breakpoint */
.card { padding: 24px; }
@media (max-width: 768px) { .card { padding: 16px; } }

/* fluid spacing: works everywhere */
--padding-md: clamp(1rem, 3%, 1.5rem);
.card { padding: var(--padding-md); }
```

### Connections

- **to stream focus:** tinamation uses MUI Joy which has a token system built in. These patterns map directly to how to configure that token system.
- **to other topics:** the Supabase-fetched content means loading/empty/error states are live concerns, not hypothetical.
- **to existing research:** comprehensive-pass-plan.md executed UI improvements; these principles form the theoretical basis for evaluating what was done and what remains.

---

## Contradictions & Tensions

1. **Heavy shadow vs. tonal elevation**
   - View A (MD2, most of the web): elevation = depth = dark box-shadow
   - View B (MD3, Linear): elevation = tonal shift in surface color; shadows used more sparingly
   - Significance: for dark mode specifically, dark shadows on dark surfaces don't work well. MD3's tonal approach is more appropriate for dark-mode-first designs.

2. **Minimalism vs. personality**
   - View A (Geist, Stripe): reduce to essentials; beauty through restraint
   - View B (anti-AI backlash, 2025): pure minimalism now reads as generic; personality requires deliberate asymmetry, texture, or imperfection
   - Significance: for an artist portfolio, pure Swiss minimalism may actually undermine the creative brand. Some personality is appropriate — the question is which kind.

3. **Fixed spacing scale vs. fluid/contextual spacing**
   - View A (8pt grid, design tokens): fixed values encode consistency; arbitrary values create visual chaos
   - View B (intrinsic design, Jen Simmons): fixed values break across viewport sizes; fluid values are inherently more correct
   - Resolution: these aren't opposed — use a fluid clamp() scale where the *min and max are still on the 8pt grid*. The fluidity happens within that constraint.

4. **Skeleton loaders vs. spinners**
   - Multiple sources advocate skeleton screens as the polished choice for content-heavy loads
   - Counter: skeleton screens that don't match the final content layout cause a jarring jump that's worse than a spinner
   - Resolution: skeleton screens require accurate knowledge of content shape; if that's not available, a well-designed spinner with low opacity is preferable to a bad skeleton.

---

## Anti-Patterns

Common mistakes that make sites look generic or AI-generated. Confidence: MEDIUM (multiple sources agree, some generalization).

### Visual anti-patterns

1. **Generic gradient backgrounds** — purple-to-cyan, pink-to-orange, or any loud multi-stop gradient over a hero. Now the primary signal of AI-generated design.
2. **Overused glassmorphism** — blur + transparency used as decoration rather than to communicate layering. Appropriate for overlays; inappropriate as a card style on every element.
3. **Floating 3D decorative shapes** — abstract blobs, orbs, or geometric shapes as background decoration. The visual equivalent of stock clipart.
4. **Corporate Memphis illustrations** — the round, flat, diverse-people-in-pastel style. Ubiquitous, therefore invisible.
5. **Pure black text** (#000000 on #ffffff) — too high contrast; use near-black (#111827 or similar) for a softer, more typographically sophisticated result.
6. **Identical shadow on all elements** — using the same box-shadow value on cards, buttons, and modals removes the elevation hierarchy entirely.

### Spacing anti-patterns

7. **Random spacing** — if spacing values between elements don't come from a scale, the eye registers the inconsistency as "cheap" even without consciously identifying why.
8. **Asymmetric unintentional padding** — padding-top ≠ padding-bottom within a component when it should be equal. Common with default browser styles leaking through.
9. **Too-tight spacing between sections** — sections of a page need breathing room. The eye needs a pause before a new content block. 80–120px between major sections is typical.

### Typography anti-patterns

10. **Too many font sizes** — more than 6–8 distinct sizes is almost always a mistake. The eye reads it as disorganized.
11. **All caps everything** — a small amount of uppercase in labels/navigation is a typographic accent. Applied broadly, it reduces readability and loses impact.
12. **Font weight inconsistency** — using font-weight 400 for both secondary text and primary body text removes the hierarchy. The weight step between adjacent levels should be ≥200 (e.g., 400 → 600, not 400 → 500).
13. **Line-height too tight** — body text needs at least 1.5x line height. Tighter than 1.4 for paragraphs causes readability fatigue.

### Interaction anti-patterns

14. **No hover states** — links and interactive elements with no hover feedback feel unfinished and unresponsive.
15. **Animating layout properties** — width, height, padding, margin. These force layout recalculation and cause jank. Only transform and opacity are GPU-accelerated.
16. **Linear easing everywhere** — linear motion feels mechanical and robotic. Everything should use some form of ease curve.
17. **Too-long transitions** — transitions over 400ms start to feel slow and bloated. Micro-interactions should feel instant.

### System anti-patterns

18. **Default component library aesthetic** — using MUI/Bootstrap/Tailwind with zero customization. The component shapes are recognizable to any developer. Customizing the token layer (colors, spacing, radius, shadow) is the minimum required to own the aesthetic.
19. **Mismatched border radius** — using different radii on elements at the same visual level (cards with 12px radius, buttons with 4px radius, inputs with 8px radius on the same page). Should follow a consistent scale.

---

## Open Questions

1. **How does MUI Joy's beta/hold status affect token strategy?**
   - What we know: MUI recommends new projects use Material UI over Joy UI; Joy UI is on hold.
   - What's unclear: whether Joy UI's CSS variable token architecture is compatible with a migration path to MUI Material or another system.
   - Worth exploring: yes — if tinamation needs to migrate off Joy UI eventually, the token layer should be designed to be system-agnostic.

2. **Does anti-AI imperfection aesthetic apply to professional portfolio sites?**
   - What we know: the backlash against pristine AI aesthetic is strong in 2025–2026; hand-crafted imperfection reads as premium.
   - What's unclear: the right balance for a 3D artist portfolio — it needs to feel crafted (not AI-generated) but also professional (not deliberately messy).
   - Worth exploring: yes — examining specific 3D artist and animator portfolios that are cited as exemplary would clarify the appropriate aesthetic register.

3. **LCH color space support and the current neutral palette**
   - What we know: Linear used LCH for their redesign because HSL grays have color casts; CSS supports LCH natively now.
   - What's unclear: whether the current tinamation color palette has the perceptual uniformity problem.
   - Worth exploring: medium — worth checking if the neutral grays in the current theme look chromatic in context.

4. **Skeleton screens vs. the actual Supabase load pattern**
   - What we know: skeleton screens require accurate knowledge of content shape to avoid jarring layout shift.
   - What's unclear: what the actual Supabase fetch timing looks like in production and whether the current loading states match content shape.
   - Worth exploring: yes — connects directly to the tinamation stream concern about the disconnected dynamic content layer.

---

## Sources

### Primary (high confidence)
- **joshcollinsworth.com/blog/great-transitions** — directly verified, specific animation timing values and rules
- **moderncss.dev/contextual-spacing-for-intrinsic-web-design/** — directly verified, CSS clamp/min formulas for fluid spacing
- **polypane.app/blog/responsive-design-ground-rules/** — directly verified, specific responsive design rules
- **normalflow.pub/posts/2022-08-12-an-introduction-to-constraint-based-design-systems** — directly verified, constraint system principles
- **goodpractices.design/articles/design-tokens** — directly verified, token hierarchy and naming
- **linear.app/now/how-we-redesigned-the-linear-ui** — directly verified, Linear redesign decisions (LCH, variable reduction)
- **creatoreconomy.so/p/how-stripe-crafts-quality-products-katie-dill** — directly verified, Stripe quality framework

### Secondary (medium confidence)
- **m3.material.io/styles/elevation/** — MD3 elevation system (fetched but JS-heavy page, principles confirmed by web search cross-reference)
- **vercel.com/geist/introduction** — Geist system principles (confirmed via multiple sources)
- **Refactoring UI** key principles — confirmed across multiple summaries; direct book access unavailable but principles consistent across sources
- **Apple HIG core principles** (Clarity, Deference, Depth) — confirmed across multiple secondary sources and Apple developer docs search result

### Tertiary (low confidence — needs validation)
- Anti-AI design backlash specifics — crea8ivesolution.net, dev.to/a_shokn — single or unverified sources, but pattern is consistent across multiple search results
- Typography scale rules (6–8 sizes max, modular ratios) — synthesized from multiple sources, none citing a single authoritative number
- Border radius consistency rules — extracted from anti-pattern lists; the specific values (4/8/16px hierarchy) mentioned in only one source

---

## Application to tinamation (Portfolio/Creative Site)

Based on patterns above, specific implications for this project:

**Spacing:**
- Verify all spacing in the MUI Joy theme is on an 8pt scale. One-off values (e.g., `margin: 14px`) are a polish failure.
- Consider replacing fixed padding values with `clamp()` variants for sections — especially the flipbook container and hero areas.

**Type:**
- Count distinct font sizes currently in use. If > 8, consolidate. More importantly: verify the hierarchy works through weight and color contrast, not size alone.
- The current site uses Inter (via MUI Joy default). Geist Sans is a tighter, more "designed" alternative if a typeface refresh is in scope.

**Elevation:**
- Audit whether cards, modals, and dropdowns use distinct shadow levels. If everything uses the same shadow, the elevation vocabulary is absent.
- In dark mode (tinamation appears to use dark backgrounds for the flipbook), prefer tonal surface differentiation over dark box-shadows.

**Animation:**
- All flipbook transitions are candidates for audit against the 150–400ms rule and GPU-only properties (transform/opacity).
- The framer-motion usage in the codebase gives good tools for custom easing curves — worth replacing any linear or ease-default values.

**States:**
- The Supabase disconnection means loading states are shown frequently. Whether these states are designed or defaulted is a first-impression quality signal.
- The artist's work is the content — the empty state between page load and content render should feel intentional, not broken.

**Anti-patterns to specifically check:**
- Border radius consistency across cards, buttons, and inputs
- Spacing consistency (no one-off margin/padding values outside the scale)
- Shadow consistency (single elevation vocabulary)
- Hover state coverage on all interactive elements

---

## Metadata

**confidence breakdown:**
- Animation timing values: HIGH — directly sourced from joshcollinsworth.com with specific numbers
- Elevation system structure: HIGH — consistent across MD3, Fluent 2, designsystems.surf
- Token hierarchy (3-tier): HIGH — consistent across multiple authoritative sources
- Refactoring UI specific principles: MEDIUM — synthesized from summaries, not direct access
- Anti-AI aesthetic backlash: LOW — emerging pattern, may not be stable
- Portfolio-specific principles: MEDIUM — general portfolio advice, limited creative-portfolio-specific sources

**research date:** 2026-04-16
**revisit:** this topic evolves slowly (design principles have long half-lives). Revisit in 6–12 months for any CSS capability shifts (container queries, `@layer` patterns, new color spaces) that change the implementation layer.
