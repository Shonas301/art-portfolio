---
domain: design-foundations
confidence: high
researched: 2026-04-16
stream: tinamation
tags:
  - researched-jason-beaird
  - summary-researched-jason
  - researched-jason
  - color
  - design
  - white-space
  - space
  - tinamation
---




#researched-jason-beaird #summary-researched-jason #researched-jason #color #design #white-space #space #tinamation


# beautiful web design foundations — research

**researched:** 2026-04-16
**stream:** tinamation (3d artist portfolio, next.js 15 + mui joy)
**confidence:** high (layout, color, typography) / medium (texture specifics)

## summary

Researched Jason Beaird's "Principles of Beautiful Web Design" (4th ed., 2020, with Alex Walker and James George), cross-referenced with NNG eye-tracking research, WCAG contrast standards, and IxDF design literature. The book organizes visual web design into five domains: layout/composition, color, texture, typography, and imagery — all of which map cleanly onto portfolio/showcase concerns.

Key through-line across all five areas: **constraint produces quality**. Limit palette to 3-4 colors, limit type families to 2-3, limit texture to purposeful accents, let white space do the heavy lifting. Portfolio sites in particular benefit from restraint — the artwork is the signal; every design decision is either amplifying or competing with that signal.

The tinamation site has a defined color palette (purple primary, pink accent, warm-cool gradient background) and a system font stack. The opportunities for applying these principles are mostly in typography scale, white space handling, and image treatment — not in rethinking the palette from scratch.

**key insight:** white space isn't absence — it's the loudest signal of visual priority. portfolio sites that fail to show the work well almost always fail through crowding, not emptiness.

---

## 1. layout & composition

**confidence: high** — cross-referenced Beaird ch.1, NNG eye-tracking research, IxDF rule-of-thirds literature

### what exists

Grid-based layout with a 3×3 rule-of-thirds framework is the foundational approach. The web page anatomy Beaird defines: containing block, logo, navigation, content area, footer, whitespace. Compositional balance comes in two forms: symmetrical (formal, static) and asymmetrical (dynamic, tension-driven).

### core principles

**rule of thirds**
- divide the canvas into a 3×3 grid (two horizontal lines, two vertical lines)
- the four intersection points are "sweet spots" — natural focal zones
- a 2024 eye-movement study confirmed off-center placement at intersections produces longer fixation durations than centered alternatives
- apply to: hero image subject position, primary CTA placement, section anchor elements
- do: place the key artwork or CTA at an intersection, not dead center
- avoid: perfectly centered everything — symmetry reads as static and corporate

**F-pattern and Z-pattern scanning**
- F-pattern (NNG): users scan top-left → right, then shorter scan partway down, then left-column vertical scan. applies to text-heavy pages (blogs, articles)
- Z-pattern: top-left → top-right, then diagonal to bottom-left, then bottom-right. applies to visual/sparse pages — exactly what a portfolio is
- attention distribution within F-pattern: top-left gets >40%, bottom-left ~25%, top-right ~20%, bottom-right is lowest
- do: place name/title top-left, work preview top-right, nav top, CTA bottom-right (Z terminus)
- avoid: important content in bottom-right without Z-pattern intentionality

**visual balance via proximity and repetition**
- proximity: group related elements — brain infers relationship from closeness (Gestalt)
- repetition: repeat visual motifs (card radius, shadow depth, color usage) to build cohesion
- emphasis: one dominant element per composition, not several competing for top billing
- do: pick one focal element per section, let everything else recede
- avoid: five "hero" elements on the same page — they cancel each other

**white space as primary design element**
- macro white space: the large gaps between sections, the breathing room around hero content
- micro white space: letter spacing, line height, inter-element gaps
- isolation through white space signals importance — wrapping an element in empty space makes it feel precious
- luxury and art brands maximally exploit this: white space = confidence = quality
- portfolio application: sparse gallery grids with generous gutters > packed thumbnail grids
- do: let artwork breathe; a single piece with space around it reads as more valuable than six pieces crammed together
- avoid: filling every pixel — whitespace is not wasted space

**symmetrical vs asymmetrical balance**
- symmetrical: both halves mirror — formal, trustworthy, static
- asymmetrical: elements balance by visual weight rather than position — dynamic, interesting, modern
- asymmetric balance rule: one large low-contrast element can balance one small high-contrast element (weight is perceptual, not geometric)
- portfolio application: text block left + large artwork right (60/40 or 50/50 split) is asymmetric balance in practice

### connections to tinamation

The flipbook metaphor enforces a natural Z-layout: the book spine is a strong vertical left anchor, content flows right. The BinderTabs run top-left → top-right, which aligns with the Z entry point. The gallery sections below the fold could leverage rule-of-thirds grid placement rather than standard CSS Grid equal columns.

The `globals.css` gradient background (`#fef9f3 → #fdf4f8 → #f3f7fe`) provides macro-level warmth-to-cool progression that could be reinforced by the compositional flow — warm tones anchoring the entry, cool tones settling the exit.

---

## 2. color theory for web

**confidence: high** — cross-referenced Beaird ch.2, NNG color article, WCAG standards, Clay color guide

### what exists

Color is the fastest communicator in visual design. Users form color impressions in milliseconds before reading a single word. Three core harmony types form the basis of nearly all good palettes.

### core principles

**color harmonies**

| harmony | relationship | feel | use case |
|---|---|---|---|
| complementary | opposite on wheel | high contrast, vibrant | CTAs, emphasis |
| analogous | adjacent on wheel | calm, cohesive | backgrounds, ambient tone |
| triadic | 120° apart | stimulating, balanced | full brand palette |
| split-complementary | one + two adjacent to its complement | softer contrast than complementary | good for portfolios |
| monochromatic | same hue, varied lightness/saturation | sophisticated, unified | luxury/art brands |

The tinamation palette uses a near-split-complementary logic: purple (primary) + pink (accent, ~30° from red, which is opposite green, not purple) — these two work because they share warm-cool balance. The amber warning tone adds a triadic note.

**60-30-10 rule**
- 60%: dominant color — backgrounds, large surfaces (in tinamation: off-white/neutral)
- 30%: secondary color — sidebar, cards, secondary elements (in tinamation: purple)
- 10%: accent color — CTAs, highlights, focal points (in tinamation: pink)
- this ratio creates hierarchy without exhausting the eye
- do: use the accent (10%) only for the most important interactive or focal elements
- avoid: using the accent color at 40% — it stops being an accent and starts being noise

**emotional associations (Beaird + Clay)**
- purple: creativity, mystery, luxury, imagination — ideal for a 3D artist
- pink: warmth, approachability, playfulness — softens the purple's formality
- warm neutrals (#fef9f3 background): comfort, organic quality, non-clinical — good for art
- blue-leaning neutrals (#f3f7fe background): calm, trustworthy, intellectual — good bookend
- the gradient background captures both poles: warm welcome, cool resolve

**contrast ratios (WCAG)**
- AA normal text: 4.5:1 minimum
- AA large text (18px+ or 14px+ bold): 3:1 minimum
- AAA normal text: 7:1
- graphics and UI components: 3:1
- color contrast is the #1 accessibility violation (83.6% of sites per WebAIM 2024 Million analysis)
- practical check: `purple-600 (#9333ea)` on white background — needs verification against 4.5:1 before use as text
- do: use official contrast checkers (webaim.org/resources/contrastchecker) before finalizing any text/background combo
- avoid: assuming brand colors are accessible — purple on pale purple fails silently

**palette construction for portfolios**
- neutral-dominant palette puts the artwork at center stage (correct approach for tinamation)
- accent color should match the emotional tone of the work, not just the brand
- keep palette consistent across all sections — same purple means CTA everywhere, not decorative in one place and functional in another
- do: use color consistently as a semantic system (purple = interactive, pink = highlight, neutral = content)
- avoid: using the same color for decoration and for action — breaks the user's mental model

### connections to tinamation

The current theme.ts defines a well-structured purple primary + pink accent + neutral scale. The 60-30-10 rule suggests the current balance is approximately right but worth auditing: are there sections where pink appears too frequently and loses its accent status? The background gradient is analogous (warm → neutral → cool) which is correct — it's ambient, not competing.

One open question: `purple-600 (#9333ea)` contrast ratio against `#fefefe` (body background). This needs a contrast check — purple at mid-range saturation against near-white often hovers around 4-5:1 depending on exact values.

---

## 3. typography

**confidence: high** — cross-referenced Beaird ch.4, design.dev guide, Ellen Lupton's "Thinking with Type" (3rd ed.)

### what exists

Typography controls legibility, hierarchy, personality, and pace. Ellen Lupton's framework (from "Thinking with Type"): the discipline divides into three scales — letter (individual glyph), text (paragraph/block), grid (layout relationship). All three scales must be addressed, not just font selection.

### core principles

**type scale and hierarchy**
- use a mathematical ratio for sizing — Minor Third (1.2×) is conservative and works for most sites; Major Third (1.25×) gives more separation
- tinamation's current scale (0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.875, 2.25rem) approximates a 1.2 ratio — coherent
- 6-8 distinct levels is enough; more creates confusion about which level means what
- H1 should be 32–48px; body text 16–18px
- do: establish semantic names for each level and use them consistently
- avoid: setting H2 at 24px on one page and 20px on another — inconsistency destroys hierarchy

**line height and letter spacing**
- body text: 1.5–1.6 line height (leads to ~24px on 16px text)
- headings: 1.1–1.3 (tight — headings are scanned, not read line-by-line)
- large display headings (>48px): -0.02em to -0.04em letter spacing (optical tightening)
- body text: zero additional letter spacing unless a design reason exists
- all-caps labels: +0.05em to +0.15em spacing (prevents crowding)
- maximum line length: 45–75 characters; `max-width: 65ch` is a good default

**font pairing**
- the most common and reliable pairing: serif heading + sans-serif body, or vice versa
- contrast principle: fonts must be different enough to warrant two families — two similar sans-serifs create ambiguity without benefit
- superfamily pairs (designed to work together) are the lowest-risk option
- for portfolio sites: personality matters — a 3D artist benefits from a display typeface that signals craft, paired with a neutral body font that doesn't compete
- tinamation currently uses `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for both body and display — zero personality differentiation
- do: introduce a distinct display typeface (or variable-weight version of a geometric sans) for H1/H2 to signal "artist" not "startup"
- avoid: using the same system font stack for headings and body — it collapses the hierarchy

**readability vs personality**
- body text prioritizes readability: sufficient size, adequate line height, high contrast, restrained tracking
- display/heading text can lean into personality: unusual weights, wider/tighter tracking, distinctive letterforms
- these two registers should not bleed into each other — display fonts in body text is unreadable; body fonts in hero headings are forgettable
- portfolio specific: the artist's name and work titles are prime personality real estate; body copy describing the work should be clean and neutral

**Lupton's key insight**: typography is not decoration on top of content — it IS the form of the content. The space between letters, the rhythm of line spacing, the weight of headings — these are the design, not a finishing touch.

### connections to tinamation

The current font stack (system fonts for both display and body) is functional but neutral to the point of invisibility. This is documented in the comprehensive-pass-plan as deferred: "4.3 display typeface — design decision for christina." That decision is now overdue — it's the highest-leverage single typography change available. A well-chosen geometric sans or humanist serif for H1/H2 would signal "artist portfolio" vs "generic SaaS app."

The type scale in theme.ts is well-structured. The missing piece is: are these sizes actually applied with semantic consistency? If xl4 (2.25rem) is used for H1 only, that's correct. If it appears in cards and CTAs too, hierarchy collapses.

---

## 4. texture & depth

**confidence: medium** — primary source is Beaird ch.3 via structured summary; secondary sources are 2025 trend articles

### what exists

Beaird defines texture through five building blocks: points, lines, shapes, volume/depth, and pattern. These are not cosmetic choices — they are how 2D surfaces communicate dimensionality and tactility. The current design landscape (2025-2026) has evolved from flat design → neumorphism → a pragmatic hybrid where subtle depth signals are used sparingly to provide affordance cues, not decorative layering.

### core principles

**points, lines, shapes (Beaird's vocabulary)**
- points: the atomic unit — a dot, a pixel. grouped points form lines; grouped lines form shapes
- lines: diagonal = movement/energy; horizontal = calm/stability; vertical = strength/formality; curved = organic/relaxed
- shapes: geometric = structure and order; organic/freeform = creativity and life
- the choice of shape vocabulary pervades a design — rounded corners (like tinamation's 4–24px radius scale) read as friendly/approachable; sharp corners read as precise/corporate

**depth and shadow**
- light source consistency: all shadows should behave as if cast from the same source (typically upper-left in Western conventions)
- box shadows create depth hierarchy: elements closer to the viewer cast stronger, more diffuse shadows; embedded elements have inner shadows or no shadow
- tinamation's cards already use translateY(-4px) on hover — this is correct direction but shadow lift should accompany the transform for full depth convincingness
- do: pair vertical translate with shadow expansion on hover (translate up + shadow grows = card "lifts")
- avoid: shadows that don't have directional consistency — random shadow offsets feel broken

**gradients**
- 2025 gradient best practice: clean, subtle, neighboring hues — depth without distraction
- tinamation's background gradient (`#fef9f3 → #fdf4f8 → #f3f7fe`, 135°) follows this: gentle warmth-to-cool transition, not garish
- gradients on interactive elements (buttons, cards) should be very subtle or used as a hover reward, not as a default state
- avoid: heavy multi-stop gradients with high saturation jumps — they overwhelm content and read as early-2010s

**neumorphism / flat / glassmorphism**
- flat design: no shadows, no gradients, pure geometry — clean but can feel lifeless
- neumorphism: soft same-hue shadows suggesting elements protrude from the background — works for wellness/boutique contexts; accessibility issue (low contrast between element and background)
- glassmorphism: frosted-glass effect with background blur — 2021-2023 peak trend, now background usage only (not primary UI chrome)
- for an artist portfolio: a restrained flat-with-depth approach is most appropriate — flat enough to not compete with the artwork, enough depth to give the UI tactility and hierarchy
- tinamation is currently at this position — cards have subtle radius and hover transforms, no heavy skeuomorphism

**pattern and visual noise**
- subtle background textures (grain, paper, noise) can add warmth and prevent flatness from feeling sterile
- rule: if the texture is visible when squinted at from arm's length, it's too heavy
- CSS-native grain: `filter: url(#svg-noise)` or subtle `background-image` with very low opacity
- portfolio application: a faint grain on the background gradient would add tactile warmth without competing with artwork

### connections to tinamation

The tinamation background gradient is already at the right level of subtlety. The flipbook itself has natural texture through its page-curl animations and layered paper metaphor — this is the primary depth/texture statement of the site, and it's strong. Supporting UI elements should not compete with this.

One tension: the card hover (`translateY(-4px)`) is a depth signal without a corresponding shadow change. Adding `box-shadow` expansion on hover would complete the physical metaphor. This is a small change with real perceptual impact.

---

## 5. imagery & visual weight

**confidence: high** — Beaird ch.5, Codrops portfolio hero guide, Halo Lab negative space research

### what exists

Imagery is the primary signal in an art portfolio — all other design elements exist to serve the images. Beaird's criteria for image selection: relevance, interest, appeal. For a portfolio, "relevance" is always satisfied; the work is the art. Interest and appeal are selection and curation questions.

### core principles

**visual weight hierarchy**
- size: larger = heavier visual weight, draws eye first
- contrast: high contrast = heavy; low contrast = recedes
- color: saturated/warm colors are heavier than desaturated/cool
- isolation: an element surrounded by white space is heavier than one in a crowd
- position: top and left carry more weight in F/Z scanning patterns
- faces: carry exceptional visual weight — human eyes are drawn to human faces almost involuntarily
- for 3D artwork: the most striking render should anchor the composition; secondary work recedes

**negative space in image composition**
- negative space within an image (the empty areas of the composition itself) interacts with the page layout's negative space
- a 3D artwork with internal breathing room (negative space in the render) can be placed close to text without visual collision
- a dense/busy render needs more page negative space as buffer
- do: consider the internal composition of each artwork when placing it in a layout; dense renders need more padding
- avoid: cramming a visually busy piece against other elements — the eye can't resolve what to look at

**hero section principles**
- the hero's job: establish emotional connection, communicate core identity, create path forward
- for a 3D artist portfolio: the hero should show the best work or a striking stylistic statement
- hero image should directly represent the type of work (Codrops)
- background strategy options: showcase work directly, use abstract/atmospheric backdrop, solid color/gradient (use when work speaks for itself and needs clean setting)
- avoid: hero images unrelated to the creative discipline — misaligned imagery confuses the message
- the hero CTA should guide to the primary action (viewing work, contacting, etc.)

**aspect ratios and cropping**
- consistent aspect ratios in gallery grids create visual rhythm — the eye can predict the pattern and scan efficiently
- common portfolio grid ratios: 1:1 (square, modern), 4:3 (traditional), 16:9 (cinematic/3D renders)
- 3D renders often have strong built-in framing — avoid cropping away the negative space within the render itself
- mixing aspect ratios in a grid: acceptable for masonry layouts, problematic in strict grids (creates visual jitter)
- do: pick one dominant ratio for gallery grids; use a masonry/variable approach only with intentional design of the layout

**image treatment techniques**
- color tinting: semi-transparent brand color overlay (using CSS `mix-blend-mode: color` or pseudo-element) unifies a diverse image set
- hover overlays: reveal metadata or project details on hover — keeps the grid clean at rest, reveals detail on interest
- CSS technique: `::before` pseudo-element with `opacity: 0 → 1` transition on hover is cheaper to animate than per-image filters
- do: use consistent hover treatment across all gallery items — inconsistency signals incompleteness
- avoid: heavy color overlays on default state — the work should be seen, not hidden behind a tint

**focal point placement**
- rule of thirds applies within individual images as much as to page layout
- the most impactful 3D artwork tends to place the subject off-center with intentional background negative space — this already follows rule-of-thirds intuitively
- when placing artwork in a page layout, align the internal focal point of the image with the page's sweet spot, not the image boundary

### connections to tinamation

The flipbook gallery is tinamation's primary image showcase. The current architecture renders artwork through PageStack with up to 30 page elements — the visual concern here is whether gallery items have consistent aspect ratios and sufficient padding within the page context.

Key open question: tinamation hasn't surfaced whether gallery images have consistent aspect ratios in Supabase. If the uploaded renders are mixed 16:9, 1:1, and portrait, the grid will have rhythm problems regardless of CSS. The content curation question (aspect ratio standardization) may be more impactful than any CSS change.

The site's purple/pink brand color could be used for a subtle hover overlay tint on gallery items — this would tie the art to the brand without hiding it.

---

## patterns observed

### pattern 1: constraint as quality signal
**what:** across all five design domains, the highest-quality portfolio sites use fewer choices more deliberately — fewer colors, fewer type families, more white space, simpler texture
**where seen:** luxury brand portfolios, award-winning creative sites (Awwwards, Behance top picks)
**significance:** for tinamation, the temptation to add more (more accent colors, more font weights, more animation) should be resisted — the work should be the complexity, not the container

### pattern 2: the "frame the work" principle
**what:** every layout, color, typography, and texture decision on a portfolio site is either amplifying or competing with the artwork. the right default question is "does this element make the artwork look better?"
**where seen:** Beaird ch.1 (emphasis principle), Codrops hero guide, negative space research
**significance:** a design decision that would be excellent on an editorial or SaaS site may be wrong for an artist portfolio if it draws attention to itself

### pattern 3: perceptual psychology as foundation
**what:** F/Z-pattern scanning, gestalt proximity, visual weight hierarchy — these aren't aesthetic preferences, they're documented perceptual behaviors. design principles derived from eye-tracking and cognitive science have higher reliability than trend-based rules
**where seen:** NNG F-pattern research (11-year replication), 2024 Journal of Eye Movement Research rule-of-thirds study, WCAG contrast rationale
**significance:** when in doubt about a design decision, asking "what does the eye do here?" is more reliable than asking "does this look good?"

### connections

- to stream focus: tinamation's V2 flipbook is the primary product — these principles should be evaluated against how well they serve the flipbook gallery, not the site generally
- to existing research: comprehensive-pass-plan.md deferred "4.3 display typeface" — typography section above provides the rationale for why this is worth revisiting
- to prior decisions: the purple/pink palette was established; this research confirms it's structurally sound (split-complementary, warm/cool balance, cream neutrals)

---

## contradictions & tensions

1. **personality vs clarity in typography**
   - view a: a display typeface for an artist portfolio signals creativity and differentiates from generic sites
   - view b: system fonts are extremely well-optimized for rendering, zero font-load cost, and familiar — switching introduces risk and potential loading jank
   - significance: the right answer depends on whether tinamation's identity goal is "distinctive artist" or "reliable professional" — probably the former, which tips toward a display typeface, but requires careful performance budgeting (font-display: swap, preload)

2. **animated depth vs static clarity**
   - view a: the flipbook animation is tinamation's signature — it adds depth, delight, tactility
   - view b: heavy animation (60fps re-renders from rAF + useState, 30+ willChange layers) competes with the content and has documented performance issues
   - significance: the design intention (depth through animation) is right; the current implementation has known performance debt (from concerns.md)

3. **generous white space vs information density**
   - view a: portfolio sites should let work breathe — maximalist white space signals confidence
   - view b: the flipbook metaphor has limited real estate per page; cramming work into pages may be unavoidable
   - significance: white space within each flipbook page vs between sections is a different design constraint than a standard scroll layout

---

## open questions

1. **display typeface decision**
   - what we know: system font stack is functional but personality-less; a display typeface would differentiate
   - what's unclear: Christina's brand voice preference (geometric sans? humanist serif? hand-drawn?); performance budget for web font loading
   - worth exploring: yes — this is the highest-ROI single change on the typography axis

2. **gallery aspect ratio consistency**
   - what we know: artworks are stored in Supabase; 41 artworks across 7 sections
   - what's unclear: whether uploaded renders share consistent aspect ratios or are mixed
   - worth exploring: yes — inconsistent ratios in a grid are visually disruptive and no amount of CSS fixes it at source

3. **contrast audit on purple-600 (#9333ea)**
   - what we know: purple-600 is the primary brand/interactive color; used on buttons and likely on text
   - what's unclear: actual contrast ratio against #fefefe body background; whether it passes 4.5:1
   - worth exploring: yes — color contrast is the #1 accessibility violation; this should be a quick check

4. **hover overlay tint for gallery items**
   - what we know: CSS overlay tints are cheap to animate, can tie artwork to brand identity
   - what's unclear: whether a purple tint overlay would complement or clash with tinamation's artwork aesthetic
   - worth exploring: medium priority — requires seeing the actual artwork to decide

---

## sources

### primary (high confidence)

- Beaird, Walker, George — "The Principles of Beautiful Web Design" 4th ed. (2020) — https://www.oreilly.com/library/view/the-principles-of/9781098124717/
- Nielsen Norman Group — "F-Shaped Pattern for Reading Web Content" — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Nielsen Norman Group — "Using Color to Enhance Your Design" — https://www.nngroup.com/articles/color-enhance-design/
- W3C / WAI — WCAG 2.1 Contrast (Minimum) 1.4.3 — https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- IxDF — "The Rule of Thirds: Know Your Layout Sweet Spots" — https://ixdf.org/literature/article/the-rule-of-thirds-know-your-layout-sweet-spots
- design.dev — Typography & Font Hierarchy Guide — https://design.dev/guides/typography-web-design/
- Lupton, Ellen — "Thinking with Type" 3rd ed. (2023) — https://papress.com/products/thinking-with-type-3-edition

### secondary (medium confidence)

- Halo Lab — "Negative Space in Design" — https://www.halo-lab.com/blog/negative-space-in-design
- Clay Global — "Color Theory in Web Design" — https://clay.global/blog/color-theory-in-web-design
- Codrops — "How to Design the Ideal Hero Image for Your Online Portfolio" (2022) — https://tympanus.net/codrops/2022/11/15/how-to-design-the-ideal-hero-image-for-your-online-portfolio/
- 99designs — "Using F and Z Patterns to Create Visual Hierarchy" — https://99designs.com/blog/tips/visual-hierarchy-landing-page-designs/
- UX Planet — "The 60-30-10 Rule for UI Design" — https://uxplanet.org/the-60-30-10-rule-a-foolproof-way-to-choose-colors-for-your-ui-design-d15625e56d25
- WebAIM — "Contrast and Color Accessibility" — https://webaim.org/articles/contrast/

### tertiary (low confidence — trend articles, single sources)

- DesignRush — "Is Neumorphism Still Relevant in 2025?" — https://www.designrush.com/best-designs/websites/trends/neumorphism-website
- Zignuts — "Neumorphism vs Glassmorphism 2026" — https://www.zignuts.com/blog/neumorphism-vs-glassmorphism
- Medianic — "10 Essential Web Design Principles" (2026) — https://www.medianic.co.uk/2026/04/14/10-essential-web-design-principles-every-new-designer-should-know/

---

## metadata

**confidence breakdown:**
- layout principles (rule of thirds, F/Z-pattern, white space): HIGH — multiple primary sources, peer-reviewed eye-tracking data
- color theory (harmonies, 60-30-10, emotional associations): HIGH — Beaird + NNG + WCAG standards
- typography (scale, line height, pairing): HIGH — design.dev guide + Lupton framework
- texture/depth (neumorphism landscape, shadow theory): MEDIUM — primary source is Beaird ch.3 summary; trend articles are LOW individually but directionally consistent
- imagery/visual weight: HIGH — Beaird + Codrops + NNG visual hierarchy research
- tinamation-specific connections: MEDIUM — inferred from theme.ts, globals.css, and prior TAS research; not verified against live site rendering

**research date:** 2026-04-16
**revisit:** if tinamation undertakes a full visual redesign (currently deferred in comprehensive-pass-plan); or when display typeface decision is made
