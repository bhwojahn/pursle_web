# Pursle Agency — Full Website Build Specification
**Project:** Agency Landing Page (Systems / AI / Operations)
**Stack:** Vanilla HTML, CSS, JavaScript — no frameworks
**Approach:** Desktop-first. Single scrolling page. No SPA routing.
**Reference:** Figma PNG provided alongside this document.

---

# 0. Foundation

## 0.1 Color Tokens

```css
:root {
  --bg:        #0C0D14;   /* page background — near-black navy */
  --surface:   #11121C;   /* slightly lighter for section alternation, use subtly */
  --text:      #E8E8EB;   /* primary text, near-white */
  --grit:      #7A7A8A;   /* muted text — labels, learn more, captions */
  --ghost:     rgba(232, 232, 235, 0.06); /* large background numbers, watermark elements */
  --border:    rgba(232, 232, 235, 0.12); /* button borders, dividers */
  --accent:    #E8E8EB;   /* no bright accent color — restraint is the brand */
}
```

> There is no color accent like blue or orange. The entire palette is monochromatic. Contrast comes from typography weight and opacity, not hue.

---

## 0.2 Logo SVG (Global Asset)

```html
<svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 447.78267 817.22333" style="color:#E8E8EB;">
  <g transform="translate(-162.39799,-475.78748)">
    <rect fill="none" stroke="currentColor" stroke-width="35.9004" stroke-linecap="square"
      width="405.2561" height="405.2561" x="788.56946" y="-238.98636"
      transform="matrix(0.37696294,0.92622834,-0.37696294,0.92622834,0,0)"/>
    <rect fill="none" stroke="currentColor" stroke-width="35.7232" stroke-linecap="square"
      width="311.67856" height="311.67856" x="948.60107" y="-303.5296"
      transform="matrix(0.3814744,0.9243794,-0.3814744,0.9243794,0,0)"/>
    <rect fill="none" stroke="currentColor" stroke-width="35.7232" stroke-linecap="square"
      width="311.67856" height="311.67856" x="709.09277" y="-64.020409"
      transform="matrix(0.3814744,0.9243794,-0.3814744,0.9243794,0,0)"/>
  </g>
</svg>
```

The logo renders as three overlapping rotated squares (outlines only). It should be centered in the navbar. Height approximately 32–36px at nav scale.

---

## 0.3 Font Imports

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Libre+Baskerville:ital,wght@1,700&display=swap');
```

## 0.4 Utility Classes (Typography)

```css
.font-sans {
  font-family: 'Montserrat', sans-serif;
}

.font-serif-italic {
  font-family: 'Libre Baskerville', serif;
  font-style: italic;
  font-weight: 700;
}
```

## 0.5 Font Usage Rules (Global)

| Role | Font | Notes |
|---|---|---|
| Navigation | Montserrat 500 | Uppercase, letter-spacing: 0.08em |
| Body / Descriptions | Montserrat 400 | Default reading weight |
| Labels (// prefix) | Montserrat 500 | Uppercase, letter-spacing: 0.12em |
| Buttons | Montserrat 500 | No italics ever |
| Step numbers | Montserrat 300 | Light, large, decorative |
| Emphasis words in headlines | Libre Baskerville 700 Italic | Sparse — 10-15% of any given headline |

> Rule: If you are considering adding more serif italic, don't. The impact comes from rarity.

---

## 0.6 Layout Grid

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
```

- No CSS grid framework. Use flexbox and explicit positioning.
- Sections are full-width background, containers are centered.
- Vertical spacing between sections: `120px–160px` of padding top/bottom.
- Internal element spacing: multiples of 8px (8, 16, 24, 32, 48, 64, 96).

---

## 0.7 Spacing System

```
xs:  8px
sm:  16px
md:  24px
lg:  32px
xl:  48px
2xl: 64px
3xl: 96px
4xl: 128px
5xl: 160px
```

---

# 1. Navbar

## Layout
- Fixed to top of viewport. `position: fixed; top: 0; left: 0; width: 100%; z-index: 100;`
- Background: same as `--bg` with very subtle backdrop blur optional: `backdrop-filter: blur(8px); background: rgba(12, 13, 20, 0.92);`
- Height: 64px
- Three-column flex layout: `[left links] [center logo] [right links]`

## Left Links
- "brand" / "offerings"
- Montserrat 500, uppercase, letter-spacing: 0.1em
- Color: `--grit` at rest, `--text` on hover
- Transition: color 200ms ease

## Center
- Logo SVG, height 28px, color `--text`
- Horizontally and vertically centered in navbar

## Right Links
- "process" / "contact"
- Same style as left links

## Divider
- A single `1px` horizontal line at bottom of navbar: `border-bottom: 1px solid var(--border);`

---

# 2. Hero Section

## Container Dimensions
- Full viewport height: `min-height: 100vh`
- Content vertically centered or positioned at ~40% from top
- Padding top: 64px (navbar height offset)

## Headline

```html
<h1>
  <span class="font-sans">Your business,</span>
  <span class="font-serif-italic">reengineered</span>
  <br>
  <span class="font-sans">to scale</span>
  <span class="font-serif-italic">without friction.</span>
</h1>
```

- Font size: `clamp(40px, 6vw, 80px)`
- Line height: 1.1
- Color: `--text`
- Max-width: ~700px (left-aligned, not centered)
- The serif italic words visually interrupt the sans — this tension is intentional

## CTA Buttons

Displayed in a horizontal flex row, gap 16px, below headline with margin-top: 40px.

### "Book a call" (Primary)
```css
border: 1px solid var(--border);
padding: 12px 28px;
background: transparent;
color: var(--text);
font-family: 'Montserrat', sans-serif;
font-weight: 500;
letter-spacing: 0.06em;
text-transform: uppercase;
font-size: 13px;
cursor: pointer;
transition: border-color 200ms, color 200ms;
```
Hover: `border-color: var(--text);`

### "See our work" (Secondary)
- Same padding and font
- No border, no background
- Color: `--grit`
- Hover: `color: var(--text);`

---

# 3. Philosophy Section (Brand + Offerings)

Two subsections stacked vertically, each with a large ghost number as background decoration.

## Shared Layout Pattern

Each subsection uses a two-column flex layout within the container:
- Column widths approximately 50/50 or 40/60 depending on the block
- Large ghost number spans the full section width behind content as `position: absolute`

## Ghost Number Style

```css
.ghost-number {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(200px, 25vw, 320px);
  color: var(--ghost); /* rgba(232,232,235,0.06) */
  line-height: 1;
  position: absolute;
  user-select: none;
  pointer-events: none;
  z-index: 0;
}
```

Content sits above at `position: relative; z-index: 1;`

---

## 3.1 — // the brand (01)

### Section label
- "// the brand" — top-left
- Montserrat 500, uppercase, letter-spacing: 0.12em
- Color: `--grit`
- Font size: 12px

### Ghost number
- "01" — positioned so it bleeds left, partially cropped, very faint
- Anchored left side of section

### Text block (right column, ~55% width)
```html
<p>
  We don't replace what's working. We collaborate with it,
  <span class="font-serif-italic">creating</span>
  the missing pieces, and leave behind a system that carries your team's
  <span class="font-serif-italic">prestige.</span>
</p>
```
- Montserrat 400
- Font size: 18–20px
- Line height: 1.7
- Color: `--text`

---

## 3.2 — // our offerings (02)

### Section label
- "// our offerings" — top-right (right-aligned)
- Same label style as above

### Ghost number
- "02" — positioned right side, partially cropped
- Mirrored from 01 layout

### Text block (left column, ~55% width)
```html
<p>
  Every engagement is designed to
  <span class="font-serif-italic">remove friction,</span>
  align your systems, and create an operation that actually
  <span class="font-serif-italic">scales.</span>
</p>
```
- Same type styles as 3.1
- Layout alternates: text is now on the LEFT, ghost number on the RIGHT

### Layout Alternation Rule
- 01 block: ghost left, text right
- 02 block: ghost right, text left
- This alternation continues in the Services section

---

# 4. Services Section (// chatbots / consultancy / ai / data)

Four service blocks stacked vertically. Each block is visually separated by generous spacing (padding: 80px 0 per block minimum).

## Shared Block Structure

Every block contains:
1. A top row with: `[label // service-name]` on one side, `[number 01–04]` on the other
2. A body text column (occupies roughly 45% width, side alternates per block)
3. A "Learn more+" link at the bottom of the text

## Top Row Label Style
```css
/* Label (// chatbots) */
font-family: 'Montserrat', sans-serif;
font-weight: 500;
font-size: 12px;
text-transform: uppercase;
letter-spacing: 0.12em;
color: var(--grit);

/* Number (01) */
font-family: 'Montserrat', sans-serif;
font-weight: 300;
font-size: 12px;
color: var(--grit);
```

Both label and number are on opposite ends of a `display: flex; justify-content: space-between;` row spanning the full container width.

## Body Text Style
```css
font-family: 'Montserrat', sans-serif;
font-weight: 400;
font-size: 16px;
line-height: 1.75;
color: var(--text);
max-width: 420px;
```

## "Learn more+" Link
```css
font-family: 'Montserrat', sans-serif;
font-weight: 400;
font-size: 13px;
color: var(--grit);
margin-top: 24px;
display: inline-block;
letter-spacing: 0.04em;
transition: color 200ms;
```
Hover: `color: var(--text);`

---

## 4.1 — // chatbots (01)

- Label LEFT, number RIGHT
- Body text LEFT column
- Serif italic on: "chatbots" (first word, bold), "closing rates", "customer satisfaction"

```html
<p>
  <span class="font-serif-italic">chatbots</span> are revolutionizing the customer service
  business completely. Instead of leaving one of your team members to read, respond, and
  act upon the conversation, we help you automate this system for better
  <span class="font-serif-italic">closing rates</span> and
  <span class="font-serif-italic">customer satisfaction.</span>
</p>
```

---

## 4.2 — // operations consultancy (02)

- Label RIGHT, number LEFT
- Body text RIGHT column (alternating)
- Serif italic on: "engagement", "automation"

```html
<p>
  A short, intense <span class="font-serif-italic">engagement</span> where we sit beside
  your operators, document what actually happens (not what's on the org chart), and
  identify the 2-3 leverage points where <span class="font-serif-italic">automation</span>
  or process change pays back fastest.
</p>
```

---

## 4.3 — // ai automation (03)

- Label LEFT, number RIGHT
- Body text LEFT column
- Serif italic on: "design", "ship", "trusts"

```html
<p>
  We <span class="font-serif-italic">design</span> and
  <span class="font-serif-italic">ship</span> task-specific agents that read your inbox,
  triage tickets, summarize documents, draft replies, and trigger action across your stack
  built on the LLMs and orchestration layers your team already
  <span class="font-serif-italic">trusts.</span>
</p>
```

---

## 4.4 — // data and integrations (04)

- Label RIGHT, number LEFT
- Body text RIGHT column (alternating)
- Serif italic on: "connected", "Built clean"

```html
<p>
  Your CRM, billing, support, product analytics and internal apps,
  <span class="font-serif-italic">connected</span> so the right context is in the right
  place at the right time. <span class="font-serif-italic">Built clean</span> enough that
  the next hire can read it.
</p>
```

---

# 5. Process Section

## Section Label
- "// our process" — top-left
- Same label style (Montserrat 500, uppercase, `--grit`, letter-spacing: 0.12em, 12px)

## Section Headline

```html
<h2>
  <span class="font-sans">A four-step</span>
  <span class="font-serif-italic">system.</span>
</h2>
```

- Font size: `clamp(36px, 5vw, 64px)`
- Line height: 1.15
- Margin below: 64px before the steps

## Steps Grid

Four columns, equal width, flex or grid layout with gap: 32px.

### Each Step Structure
```html
<div class="step">
  <span class="step-number">01.</span>
  <h3 class="step-title">discovery</h3>
  <p class="step-description">...</p>
</div>
```

### Step Number Style
```css
.step-number {
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: 14px;
  color: var(--grit);
  display: block;
  margin-bottom: 8px;
}
```

### Step Title Style
```css
.step-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: var(--text);
  margin-bottom: 16px;
  text-transform: lowercase;
}
```

### Step Description Style
```css
.step-description {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.7;
  color: var(--grit);
}
```

### Step Content (from Figma)

| # | Title | Description |
|---|---|---|
| 01 | discovery | A 2-3 hour working session to understand your team, systems end to end. |
| 02 | design | We shortlist and spec the smallest change set with the highest leverage. Flows and scopes. |
| 03 | deploy | We build and test against your real data and integrate into your stack. For your team to use. |
| 04 | compound | Each system is a layer. You get a full-stack partner that keeps working without us. |

---

# 6. CTA Section

## Layout
- Full section, centered content
- Padding: 120px 0
- Background: `--bg` (no change)

## Headline

```html
<h2>
  <span class="font-sans">Where's the friction in</span>
  <br>
  <span class="font-serif-italic">your system?</span>
</h2>
```

- Font size: `clamp(32px, 4.5vw, 60px)`
- Line height: 1.2
- Text-align: center
- Color: `--text`
- Margin-bottom: 40px

## Button
- "Book a discovery call"
- Same ghost button style as primary CTA in hero
- Centered below headline

---

# 7. Footer

## Layout
- Background: `--bg` or `--surface` (very slight contrast from page — optional)
- Top border: `1px solid var(--border)`
- Padding: 64px 0 40px

## Left Side — Footer Statement

Large statement text spanning roughly 45% width:

```html
<p class="footer-statement">
  There are <span class="font-serif-italic">3</span> systems.
  Ours. And what they become
  <span class="font-serif-italic">Together...</span>
</p>
```

- Font: Montserrat 400
- "3" and "Together..." in Libre Baskerville Bold Italic
- Font size: `clamp(20px, 2.5vw, 32px)`
- Line height: 1.5
- Color: `--text`

## Right Side — Link Columns

Three columns: "agency", "reach", "elsewhere" (approximate labels from Figma).
Each column has a small heading and 2–4 plain text links below.

```css
.footer-col-heading {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--grit);
  margin-bottom: 16px;
}

.footer-link {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: var(--grit);
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  transition: color 200ms;
}

.footer-link:hover {
  color: var(--text);
}
```

## Bottom Bar
- Below a `1px solid var(--border)` divider line
- "© 2025 PURSLE" — left aligned
- Montserrat 400, 12px, color: `--grit`
- Padding-top: 24px

---

# 8. Micro-interactions and Transitions

These should be simple — nothing that distracts. The brand is restrained.

| Element | Interaction | Transition |
|---|---|---|
| Nav links | Color `--grit` to `--text` on hover | 200ms ease |
| CTA buttons (ghost) | Border-color opacity increase on hover | 200ms ease |
| "Learn more+" | Color `--grit` to `--text` on hover | 200ms ease |
| Footer links | Color `--grit` to `--text` on hover | 200ms ease |

No animations on scroll, no entrance effects, no parallax. Keep it static and sharp.

---

# 9. Section Flow (Full Page Order)

```
[Navbar — fixed]
[Hero — full viewport height]
[Philosophy 01 — // the brand]
[Philosophy 02 — // our offerings]
[Services — // chatbots]
[Services — // operations consultancy]
[Services — // ai automation]
[Services — // data and integrations]
[Process — // our process]
[CTA — Where's the friction]
[Footer]
```

Sections are not separated by dividers. The only separator is whitespace. The page should feel like one continuous document, not a series of cards.

---

# 10. What NOT to Do

These are as important as the specs above.

- No rounded corners anywhere. Not on buttons, not on cards, not on images. Zero.
- No drop shadows.
- No background fills on service blocks. No cards. Text floats on the dark background.
- No bright accent color. No blue, green, orange, purple. Monochrome only.
- No hero background image or video.
- No scroll-triggered animations.
- No gradient text effects.
- Do not center body text. Only the CTA section headline and footer bottom bar are centered.
- Do not overuse Libre Baskerville. If more than 2 phrases in any section use it, remove one.
- Do not use `font-weight: 700` for Montserrat. Max weight in use is 600.

---

# 11. Critical Design Ratios (Summary)

| Metric | Value |
|---|---|
| Montserrat usage | ~85–90% of all text |
| Libre Baskerville usage | ~10–15%, emphasis only |
| Max container width | 1200px |
| Section vertical padding | 120–160px |
| Button style | Ghost (border only, no fill) |
| Color palette | Monochromatic dark — no hues |
| Rounded corners | 0px — none |
| Box shadows | None |

---

# END