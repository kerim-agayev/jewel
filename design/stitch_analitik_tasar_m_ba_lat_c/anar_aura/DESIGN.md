---
name: Anar Aura
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#474741'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#787770'
  outline-variant: '#c8c7be'
  surface-tint: '#5f5e5a'
  primary: '#5f5e5a'
  on-primary: '#ffffff'
  primary-container: '#f9f6f0'
  on-primary-container: '#72706c'
  inverse-primary: '#c9c6c1'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#f9f6f5'
  on-tertiary-container: '#727070'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2dc'
  primary-fixed-dim: '#c9c6c1'
  on-primary-fixed: '#1c1c18'
  on-primary-fixed-variant: '#474743'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
  ivory-base: '#F9F6F0'
  antique-gold: '#C5A059'
  charcoal-text: '#1A1A1A'
  gold-light: '#E3D2B0'
  gold-dark: '#9E7B3B'
  surface-muted: '#F2EFE9'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system embodies a "Quiet Luxury" aesthetic tailored for the fine jewelry market in Baku. The brand personality is warm, trustworthy, and refined, eschewing flashy trends in favor of timeless elegance. 

The visual style is **Minimalist with Tactile accents**, characterized by:
- **Generous White Space:** Prioritizing breathing room to allow high-quality product photography to serve as the primary visual driver.
- **Warmth:** A shift away from "tech-cold" whites toward organic, creamy tones that mimic the feel of high-end stationary or a boutique interior.
- **Subtle Modernity:** Using clean lines and soft shadows to ensure the luxury feel is contemporary rather than dated.

The target audience seeks authenticity and craftsmanship. The UI should evoke a sense of calm confidence, making the purchase of gold feel like a significant, secure, and serene experience.

## Colors

The palette is anchored by **Ivory Base (#F9F6F0)**, which provides a warmer, more sophisticated alternative to pure white. This color should be used for the primary background of all customer-facing screens.

**Antique Gold (#C5A059)** serves as the sole accent color. It must be used with restraint—primarily for Call-to-Action buttons, active navigation states, and critical price highlights (like the live gold ticker). 

**Charcoal Text (#1A1A1A)** provides the necessary contrast for legibility while appearing softer and more premium than pure black. 

For the **Admin Dashboard**, the palette shifts toward functionality: use **Surface Muted (#F2EFE9)** for sidebar backgrounds and table headers to distinguish the internal tool's "utility" nature from the storefront's "luxury" nature.

## Typography

The typography strategy relies on a high-contrast pairing:
- **Serif (Playfair Display):** Reserved for headlines, product names, and editorial moments. It conveys the heritage and prestige of the jewelry.
- **Sans-Serif (Inter):** Used for all UI elements, price breakdowns, technical specifications, and the gold calculator. It ensures clarity and modern precision.

**Azerbaijani Language Considerations:** Ensure that the specific characters (ə, ı, ö, ü, ş, ç) are rendered correctly across all weights. 

For labels (e.g., "SON YENİLƏNMƏ"), use all-caps with increased letter spacing to create a sense of organized, professional information architecture.

## Layout & Spacing

This design system utilizes a **12-column Fixed Grid** for desktop and a **4-column Fluid Grid** for mobile. 

The layout philosophy emphasizes vertical rhythm and "breathing room." Section gaps are intentionally large (80px+) to prevent the page from feeling like a high-volume discount retailer. 

- **Desktop:** 1280px max-width container centered with 64px outer margins.
- **Mobile:** Full-width content with 20px safe-area margins. 
- **Product Grids:** On desktop, use 3 or 4 columns. On mobile, use a 2-column "card" grid to allow product details to remain legible.

For the **Gold Calculator**, use a centered, focused layout (600px max-width) to minimize distractions and emphasize the accuracy of the tool.

## Elevation & Depth

To maintain the "Quiet Luxury" feel, depth is conveyed through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

1.  **Base Layer:** Ivory (#F9F6F0).
2.  **Surface Layer:** Use pure White (#FFFFFF) for cards and modals to make them subtly "lift" from the ivory background.
3.  **Shadows:** Shadows should be extremely soft and diffused. Use a low-opacity charcoal tint: `0px 4px 20px rgba(26, 26, 26, 0.04)`. 
4.  **Interactive States:** When a user hovers over a product card, the shadow should slightly deepen and the card may lift 2-4px.
5.  **Admin Panel:** Use 1px borders in a light gray-gold tint instead of shadows to emphasize the "utility" and "structured" nature of the internal tool.

## Shapes

The shape language is defined by **Soft Roundedness**. 

- **Product Cards & Images:** Use `rounded-lg` (16px) to soften the photography and create a friendly, approachable luxury feel.
- **Buttons & Inputs:** Use `rounded-md` (8px). Avoid pill-shaped buttons as they feel too "startup/tech" and lack the architectural stability required for a jewelry brand.
- **Calculator Components:** Use consistent 8px rounding for input fields and result containers to maintain a cohesive system.
- **Checkboxes:** Keep a small 2px radius for a clean, professional look in the Admin panel.

## Components

### Buttons
- **Primary:** Antique Gold background, Charcoal text. Solid fill.
- **Secondary:** Transparent background, 1px Antique Gold border, Gold text.
- **WhatsApp CTA:** Use a specific brand-adjacent green (#25D366) only for the WhatsApp contact button to ensure immediate recognition, but keep it as a floating action button (FAB) or a secondary CTA.

### Cards
- **Product Card:** White background, soft shadow, 16px corner radius. The price and purity (əyar) should be clearly legible but not visually aggressive.
- **Price Breakdown Card:** In the product detail page, use a transparent card with a subtle 1px border to show the "Gold Value + Craftsmanship" calculation.

### Inputs
- **Field Style:** Understated. 1px border in a muted gold-gray. Background should be slightly lighter than the page background to indicate "interactivity."

### Gold Price Ticker
- **Style:** A thin, high-contrast bar at the very top of the page. Use Charcoal background with White or Gold text for an "urgent yet refined" news-ticker feel.

### Admin Dashboard Specifics
- **Data Tables:** Clean, no vertical borders. Use 1px horizontal dividers. Alternating row colors are not necessary; use hover highlights instead.
- **KPI Cards:** Large typography for the value (e.g., total AZN), with a smaller label above in the `label-sm` style.