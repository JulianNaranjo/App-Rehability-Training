# Letter Hunt - Design System (Clínico/Profesional)

## Direction & Intent

**Producto:** Herramienta de rehabilitación cognitiva para mejorar atención y memoria

**Usuario:** Personas en rehabilitación neuropsicológica, terapeutas, o usuarios buscando entrenamiento mental estructurado

**Sentimiento:** Profesional, clínico, calmado, enfocado. Sin distracciones. La interfaz debe desaparecer para que el usuario se concentre en el ejercicio cognitivo.

---

## Color Palette

### Core Colors
- **Canvas:** `#f8f9fa` (blanco clínico cálido)
- **Surface:** `#ffffff` (superficies elevadas)
- **Elevated:** `#f1f3f4` (tarjetas y componentes)

### Text Hierarchy
- **Primary:** `#1a1a2e` (azul medianoche - profesional, no negro puro)
- **Secondary:** `#4a5568` (gris azulado - metadatos)
- **Tertiary:** `#718096` (gris suave - información secundaria)
- **Muted:** `#a0aec0` (placeholders, disabled)

### Brand Accent (Violeta desaturado)
- **Primary-50:** `#f5f3ff`
- **Primary-100:** `#ede9fe`
- **Primary-200:** `#ddd6fe`
- **Primary-300:** `#c4b5fd`
- **Primary-400:** `#a78bfa`
- **Primary-500:** `#8b5cf6` (main accent - usar con moderación)
- **Primary-600:** `#7c3aed`

### Semantic Colors (Desaturados)
- **Success:** `#10b981` → `#059669` (verde bosque)
- **Error:** `#ef4444` → `#dc2626` (rojo terracota)
- **Warning:** `#f59e0b` → `#d97706` (ámbar apagado)

### Border Scale
- **Border-soft:** `rgba(26, 26, 46, 0.06)`
- **Border-standard:** `rgba(26, 26, 46, 0.10)`
- **Border-emphasis:** `rgba(26, 26, 46, 0.15)`
- **Border-focus:** `rgba(139, 92, 246, 0.4)`

---

## Depth Strategy

**Approach:** Borders-only with subtle shadows on elevation

**Surface Elevation:**
- **Base (0):** `#f8f9fa` - canvas background
- **Surface (1):** `#ffffff` - cards, panels
- **Elevated (2):** `#ffffff` with subtle shadow - dropdowns, modals

**Shadows:**
- **Shadow-sm:** `0 1px 2px rgba(0, 0, 0, 0.04)`
- **Shadow-md:** `0 4px 6px -1px rgba(0, 0, 0, 0.06)`
- **Shadow-lg:** `0 10px 15px -3px rgba(0, 0, 0, 0.08)`

---

## Spacing System

**Base Unit:** 4px

**Scale:**
- **space-1:** 4px (micro gaps)
- **space-2:** 8px (tight components)
- **space-3:** 12px (internal padding)
- **space-4:** 16px (standard padding)
- **space-5:** 20px (section gaps)
- **space-6:** 24px (major sections)
- **space-8:** 32px (page sections)
- **space-10:** 40px (hero spacing)

---

## Typography

**Font Family:** Geist Sans (system-ui fallback)

**Hierarchy:**
- **H1:** 32px/40px, font-weight: 600, tracking: -0.02em
- **H2:** 24px/32px, font-weight: 600, tracking: -0.01em
- **H3:** 20px/28px, font-weight: 500
- **Body:** 16px/24px, font-weight: 400
- **Small:** 14px/20px, font-weight: 400
- **Label:** 12px/16px, font-weight: 500, letter-spacing: 0.02em

---

## Component Patterns

### Cards
- Background: white
- Border: 1px solid rgba(26, 26, 46, 0.10)
- Border-radius: 12px
- Padding: 24px
- Shadow: none or shadow-sm on hover

### Buttons
- Border-radius: 8px
- Font-weight: 500
- Padding: 12px 20px
- Primary: bg-primary-500, subtle shadow
- Secondary: bg-white, border, text-primary
- Ghost: transparent, hover:bg-gray-50

### Inputs
- Background: white
- Border: 1px solid rgba(26, 26, 46, 0.15)
- Focus: border-primary-400, ring-primary-400/20

### Game Tiles
- Border-radius: 8px
- Border: 1px solid rgba(26, 26, 46, 0.08)
- Selected: border-primary-400, bg-primary-50
- Correct: border-success, bg-success/5
- Wrong: border-error, bg-error/5
- Hint: subtle pulse animation

---

## Signature Elements

1. **Focus Glow:** Cuando se selecciona una letra, un brillo suave y respirante (border-primary con animación pulse)

2. **Feedback Waves:** Transiciones de estado usan ondas sutiles en lugar de cambios bruscos (opacity + scale transitions)

3. **Progress Serenity:** Barras de progreso con transiciones suaves, sin colores brillantes

4. **Clinical White Space:** Generoso espaciado entre elementos para reducir carga cognitiva

---

## Animation Principles

- **Duration micro:** 150ms (hovers, toggles)
- **Duration standard:** 250ms (transitions, reveals)
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1) - suave y profesional
- **No bounce, no spring** - mantener calma
