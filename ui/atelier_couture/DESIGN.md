---
name: Atelier Couture
colors:
  surface: '#faf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#faf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e8'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5f5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1a1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#faf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
  caption:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
---

## Brand & Style

This design system embodies the meticulous craftsmanship and heritage of a high-end fashion atelier. The visual language is rooted in **Editorial Minimalism**, drawing inspiration from high-fashion print media. It prioritizes clarity, prestige, and a sense of "quiet luxury."

The design focuses on:
- **Spatial Precision:** Utilizing generous whitespace to allow product imagery to breathe, treating the screen like a gallery wall.
- **Asymmetric Balance:** Breaking standard grid expectations to create a dynamic, bespoke feel that reflects unique tailoring.
- **Structural Integrity:** Using sharp edges and fine lines instead of decorative shadows or gradients.
- **Craftsmanship:** Highlighting detail through microscopic typography and subtle metallic accents.

## Colors

The palette is restrained and sophisticated, designed to complement high-resolution editorial photography.

- **Deep Charcoal (#1A1A1A):** Used for primary text, structural borders, and high-impact backgrounds. It provides the "ink" on the page.
- **Warm Ivory (#FAF9F6):** The primary canvas color. It is softer and more premium than pure white, evoking the feel of high-quality vellum or silk.
- **Champagne Gold (#D4AF37):** A surgical accent color. Use this exclusively for active states, fine dividers, and delicate iconography. It should never dominate the layout.
- **Soft Neutral (#8E8E8E):** For secondary metadata, placeholders, and subtle instructional text.

## Typography

Typography is the cornerstone of this design system. It utilizes a high-contrast serif for narrative elements and a geometric sans-serif for functional utility.

- **Display & Headlines:** Use Playfair Display. Headlines should often be paired with significant vertical margins. Large display type should use tighter letter spacing for a polished, editorial look.
- **Body Text:** Use Montserrat with a light weight (300) for long-form reading to maintain an airy feel. 
- **Labels:** Use uppercase Montserrat with generous letter spacing (0.15em) for navigation, buttons, and section headers to evoke the branding found on luxury labels and hangtags.

## Layout & Spacing

The layout philosophy follows a **Deconstructed Grid**. While technically aligned to a 12-column system, elements should frequently "break" the grid—such as images overlapping column gutters or text blocks being offset—to create an artisanal, non-templated appearance.

- **Margins:** Desktop views require wide gutters (32px) and substantial outer margins (64px) to frame the content like a mat in a picture frame.
- **Asymmetry:** Pair large, high-aspect-ratio images with small, tightly packed text blocks positioned in the lower quadrants of the opposite side.
- **Rhythm:** Use a base 8px unit, but prefer larger jumps (48px, 64px, 128px) between sections to enforce the feeling of space.

## Elevation & Depth

This design system rejects traditional shadows in favor of **Tonal Layering** and **Hairline Borders**.

- **Surfaces:** Use the Ivory base for the primary background. For "elevated" sections (like a cart drawer or modal), use the Charcoal background with Ivory text.
- **Borders:** Depth is defined by 0.5pt or 1pt solid lines. Use the Champagne Gold for borders on hovered elements and Deep Charcoal for static structural dividers.
- **Glassmorphism:** Reserved exclusively for navigation bars that overlay hero imagery. Use a subtle backdrop blur (10px) with a 95% opacity Ivory tint.
- **Shadows:** No shadows should be used on buttons, cards, or inputs. Only a very soft, high-diffusion "ambient glow" (0%–5% opacity) may be used on top-level modals.

## Shapes

The shape language is strictly **Architectural and Sharp**. 

- **Corners:** All UI elements (buttons, inputs, cards, images) must have a 0px border radius. Sharp corners communicate precision and the "edge" of high fashion.
- **Iconography:** Icons must be thin-stroke (1px or 1.5px), utilizing geometric shapes and open paths.
- **Decorative Elements:** Use vertical or horizontal hairline strokes to guide the eye, mimicking the straight lines of a drafting table or a needle.

## Components

### Buttons
- **Primary:** Deep Charcoal background, Ivory text, uppercase Montserrat, no border-radius. On hover: background shifts to Champagne Gold.
- **Secondary:** Transparent background, 1px Charcoal border, Charcoal text.
- **Tertiary:** Text only, uppercase with a 1px Champagne Gold underline that expands on hover.

### Input Fields
- Underline style only. A 1px Charcoal bottom border that turns Gold on focus. Labels sit above the line in small-caps Montserrat.

### Cards
- No background or shadow. Cards are defined by their content and a 1px frame that only appears on hover. Imagery within cards should occupy 100% of the width.

### Navigation
- A centered logo with navigation links in small-caps Montserrat. Use a "reveal" animation for sub-menus rather than traditional dropdowns to keep the interface clean.

### Product Detail
- Use a "sticky" scroll for product details on the right while the high-resolution image gallery scrolls vertically on the left. This creates an immersive catalog experience.