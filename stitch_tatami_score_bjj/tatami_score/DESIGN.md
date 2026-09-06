---
name: Tatami Score
colors:
  surface: '#0e141b'
  surface-dim: '#0e141b'
  surface-bright: '#343a42'
  surface-container-lowest: '#090f16'
  surface-container-low: '#161c23'
  surface-container: '#1a2027'
  surface-container-high: '#252a32'
  surface-container-highest: '#2f353d'
  on-surface: '#dde3ed'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dde3ed'
  inverse-on-surface: '#2b3139'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ffb3ad'
  on-secondary: '#68000a'
  secondary-container: '#a40217'
  on-secondary-container: '#ffaea8'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930013'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0e141b'
  on-background: '#dde3ed'
  surface-variant: '#2f353d'
typography:
  display-clock:
    fontFamily: JetBrains Mono
    fontSize: 112px
    fontWeight: '700'
    lineHeight: 112px
    letterSpacing: -0.04em
  display-clock-mobile:
    fontFamily: JetBrains Mono
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-score:
    fontFamily: Oswald
    fontSize: 128px
    fontWeight: '700'
    lineHeight: 120px
    letterSpacing: -0.02em
  display-score-mobile:
    fontFamily: Oswald
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: 0em
  headline-xl:
    fontFamily: Oswald
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: 0.02em
  headline-xl-mobile:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0.04em
  headline-md:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.04em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  touch-min: 3.5rem
  touch-lg: 4.5rem
  gutter-xs: 0.5rem
  gutter-sm: 0.75rem
  gutter-md: 1rem
  gutter-lg: 1.5rem
  gutter-xl: 2rem
  mat-split: 1.5rem
  screen-padding: 1.5rem
---

## Brand & Style

This design system is engineered for Brazilian Jiu-Jitsu tournament operations, mat-side scorekeeping, and remote arena spectatorship. It marries the calculated discipline of martial arts with high-stakes digital athletic instrumentation.

The interface prioritizes immediate legibility at distances up to 25 meters under harsh gym fluorescent lighting. The visual style balances high-contrast utilitarian sport brutalism with precision tactical software:
- **Tone:** Authoritative, razor-sharp, athletic, uncompromising, and highly legible.
- **Physicality:** Large tactile interaction zones optimized for mat-side table tablets operated under fast-paced, high-pressure match scenarios.
- **Focus:** Complete elimination of decorative ambiguity. Visual cues immediately map to match-critical states (Fighter 1/Blue, Fighter 2/Red, Advantages, Penalties, Match Clocks).

## Colors

The palette uses an ultra-deep petrol blue foundation that minimizes glare while outperforming pure jet-black in spatial depth and eye fatigue reduction.

### Surface Architecture
- **Base Background:** `#0B1118` (Deep petrol obsidian)
- **Layer 1 Surface:** `#0F172A` (Slate-950 mat background)
- **Layer 2 Container / Cards:** `#162232` (Dark petrol slate)
- **Layer 3 Elevated Cards / Active Containers:** `#1E2D3D` (Interactive slate)
- **Structural Borders:** `#2A3C50` (Low-glare containment border)
- **Focus / Highlight Border:** `#47617D`

### Athletic & Match Logic Accents
- **Fighter A (Blue Corner):**
  - Primary: `#3B82F6`
  - High-Vis Glow / Hover: `#60A5FA`
  - Container / Dark Tint: `#1E3A8A`
- **Fighter B (Red / Coral Corner):**
  - Primary: `#EF4444`
  - High-Vis Glow / Hover: `#F87171`
  - Container / Dark Tint: `#7F1D1D`
- **Advantage (Amber / Gold):** `#F59E0B`
- **Penalty (Rose / Warning Crimson):** `#F43F5E`
- **Match Active (Volt Emerald):** `#10B981`

### Text & Contrast Hierarchy
- **High-Visibility Data (Numbers, Clocks, Names):** `#FFFFFF` (100% contrast against dark surfaces)
- **Sub-labels & Secondary Context:** `#94A3B8` (Cool muted slate)
- **Tertiary Inactive / Structural Labels:** `#64748B` (Muted petrol gray)

## Typography

The typography system relies on three distinct typographic engines:
1. **Oswald:** Used for high-impact match scores, division titling, and competitor surnames. Its condensed proportions allow fighter names and massive double-digit points to fill horizontal bounds without truncating.
2. **JetBrains Mono:** Dedicated exclusively to temporal measurement (match clock, medical timers, penalty timers) and granular point increments (+2, +3, +4). Fixed-width numerical spacing guarantees that running stopwatches do not produce jitter or layout instability.
3. **Inter:** Deployed across interactive utility layers, modals, brackets, registration tables, and administrative metadata.

All display titles and status badges employ uppercase styling to enforce military-grade sports presentation.

## Layout & Spacing

### Scoreboard Viewport Strategy
Scoreboards operate on a full-bleed, 100vh locked layout model to prevent scrolling during live scoring sessions. 
- **The Tatami Split:** The primary canvas divides into a 50/50 dual-column zone for desktop/tablet landscape (Blue Corner on the left, Red Corner on the right).
- **Control Bar / Time Axis:** A centralized or pinned bottom strip houses global match controls (Play/Pause, Reset, Period, Division Info).
- **Touch Ergonomics:** All actionable scoring triggers (+2 Takedown/Sweep/Knee-on-Belly, +3 Guard Pass, +4 Mount/Back Control, Advantage, Penalty) mandate a minimum touch target size of `56px` (`3.5rem`), scaling up to `72px` (`4.5rem`) on dedicated mat-operator tablets.

### Responsive Breakpoints & Adaptations
- **Tablet Landscape & Scoreboard Screens (≥ 1024px):** Strict 2-column split layout with central header for match duration and mat number.
- **Operator Tablet Portrait / Mobile (≤ 768px):** The split stacks vertically with the Blue Fighter dominating the upper hemisphere and Red dominating the lower hemisphere. The central clock acts as the physical dividing horizon.
- **Administrative / Bracket Management:** A responsive 12-column grid with `1.5rem` gutters, collapsing into dense tabular listings on compact screens.

## Elevation & Depth

To maintain optical clarity in brightly lit arenas, depth is produced via structural containment and high-contrast tonal layering rather than fuzzy drop shadows.

- **Floor (Level 0):** `#0B1118` - Canvas boundary and scoreboard frame.
- **Card / Module Base (Level 1):** `#162232` with a `1px` solid outline of `#2A3C50`. Outlines prevent elements from bleeding together when backlights dim or viewing angles degrade.
- **Tactile Surface (Level 2):** `#1E2D3D` used for increment buttons and active operational modules. Elevated with an inset top highlight (`border-t: 1px solid rgba(255, 255, 255, 0.08)`) simulating physical hardware buttons.
- **Live State Glow:** Score boxes and match clocks deploy zero-spread chromatic backdrops rather than traditional ambient shadows:
  - Blue Corner active scoring: `box-shadow: 0 0 24px -4px rgba(59, 130, 246, 0.35);`
  - Red Corner active scoring: `box-shadow: 0 0 24px -4px rgba(239, 68, 68, 0.35);`
  - Golden Score / Overtime state: `box-shadow: 0 0 32px 0 rgba(245, 158, 11, 0.25);`

## Shapes

The design system employs a soft-industrial radius profile (`roundedness: 1`). 
- Default components, buttons, and sub-score panels use `0.25rem` (4px).
- Main fighter cards, modals, and timer enclosures use `0.5rem` (8px).
- Status badges and match state indicators use `0.25rem` or crisp rectangular profiles.

Curved pill shapes (`9999px`) are strictly prohibited for primary controls, as corner radius reduction maximizes usable interaction surface area and reinforces an authoritative athletic instrument aesthetic.

## Components

### 1. Point Scoring Actuators (Buttons)
- **Structure:** Block-style tactical panels. The point value (`+2`, `+3`, `+4`, `-1`) is rendered in Oswald or JetBrains Mono, paired with a sub-label indicating the scoring technique (`SWEEP/TAKE`, `PASS`, `MOUNT/BACK`).
- **Blue Corner Actuator:** Background `#162232`, border `1px solid #2563EB`, text `#60A5FA`. On press: shifts to `#2563EB` with `#FFFFFF` text.
- **Red Corner Actuator:** Background `#162232`, border `1px solid #DC2626`, text `#F87171`. On press: shifts to `#DC2626` with `#FFFFFF` text.
- **Physical Feel:** Active states invoke a `translate-y-[1px]` tactile depression effect.

### 2. Match Scoreboard Panels
- **Fighter Identification:** Fighter surname displayed in `headline-xl` (Oswald, uppercase). Academy/team displayed directly beneath in `label-caps` (`#94A3B8`).
- **Main Points Counter:** Massive display numbers (`128px`), crisp white on dark petrol slate, bounded inside an accented container displaying the corner color strip along the lateral border.
- **Advantage & Penalty Sub-Boxes:** Nested mini-cards directly below main points.
  - Advantages: Gold text (`#F59E0B`) with gold-tinted border (`rgba(245, 158, 11, 0.3)`).
  - Penalties: Rose/Crimson text (`#F43F5E`) with crimson-tinted border (`rgba(244, 63, 94, 0.3)`). Accompanied by circular penalty pips (1 to 3 dots, with 4th indicating Disqualification).

### 3. Master Timer Engine
- **Timer Typography:** Monospaced clock readout (`MM:SS`) using JetBrains Mono at `112px`.
- **States:**
  - Running: `#FFFFFF` numbers with a steady `#10B981` (Emerald) running indicator beacon.
  - Paused / Stopped: `#F59E0B` (Amber) pulsating indicator.
  - Overtime / Golden Score: `#F59E0B` text with an explicit "GOLDEN SCORE" badge.
  - Match Concluded: `#EF4444` (Coral red) borders with an audible alert waveform icon.

### 4. Input Fields & Selectors
- Background `#0F172A`, border `1px solid #2A3C50`, text `#FFFFFF`.
- Focus state switches border to `#3B82F6` with an outline-free `box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2)`.

### 5. Match Control Chips
- Compact, high-contrast pills used to designate belt ranks (White, Blue, Purple, Brown, Black), gender, and weight classes. 
- Belt chips feature literal belt-color strips backed by `#1E2D3D` containers to ensure immediate mat assignment recognition.