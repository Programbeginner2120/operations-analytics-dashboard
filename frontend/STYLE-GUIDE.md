# Operations Analytics Dashboard - Style Guide

This document provides a comprehensive reference for all visual design assets, colors, typography, spacing, and UI components used in the Operations Analytics Dashboard. Use this guide to ensure consistency when developing or extending the dashboard.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Component Specifications](#component-specifications)
5. [Theme Switching](#theme-switching)
6. [Data Sources & Visualizations](#data-sources--visualizations)

---

## Color Palette

### Primary Brand Colors

The dashboard uses a blue-purple (indigo) color scheme as its primary brand color.

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Primary (Indigo) | `#6366F1` | `rgb(99, 102, 241)` | Primary buttons, chart elements, brand identity |
| Primary Dark | `#4F46E5` | `rgb(79, 70, 229)` | Hover states for primary elements |
| Primary Light | `#818CF8` | `rgb(129, 140, 248)` | Active/focus states, highlights |

### Light Mode Colors

#### Backgrounds
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Page Background | `#F5F5F7` | `rgb(245, 245, 247)` | Main page background |
| Card Background | `#FFFFFF` | `rgb(255, 255, 255)` | Panel cards, modal backgrounds |
| Input Background | `#FFFFFF` | `rgb(255, 255, 255)` | Form input fields |

#### Text Colors
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Primary Text | `#1F2937` | `rgb(31, 41, 55)` | Headings, main content |
| Secondary Text | `#6B7280` | `rgb(107, 114, 128)` | Descriptions, labels, supporting text |
| Muted Text | `#9CA3AF` | `rgb(156, 163, 175)` | Chart labels, timestamps, placeholders |

#### Borders & Dividers
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Border | `#E5E7EB` | `rgb(229, 231, 235)` | Card borders, input borders, dividers |
| Border Hover | `#D1D5DB` | `rgb(209, 213, 219)` | Interactive element borders on hover |

### Dark Mode Colors

#### Backgrounds
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Page Background | `#0F172A` | `rgb(15, 23, 42)` | Main page background (slate-900) |
| Card Background | `#1E293B` | `rgb(30, 41, 59)` | Panel cards, modal backgrounds (slate-800) |
| Input Background | `#0F172A` | `rgb(15, 23, 42)` | Form input fields |

#### Text Colors
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Primary Text | `#F8FAFC` | `rgb(248, 250, 252)` | Headings, main content |
| Secondary Text | `#CBD5E1` | `rgb(203, 213, 225)` | Descriptions, labels, supporting text |
| Muted Text | `#64748B` | `rgb(100, 116, 139)` | Chart labels, timestamps, placeholders |

#### Borders & Dividers
| Element | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Border | `#334155` | `rgb(51, 65, 85)` | Card borders, input borders, dividers (slate-700) |
| Border Hover | `#475569` | `rgb(71, 85, 105)` | Interactive element borders on hover |

### Chart Color Palette

The dashboard uses a consistent 5-color palette for data visualizations:

| Category | Color Name | Hex Code | RGB | Usage |
|----------|-----------|----------|-----|-------|
| Electronics | Blue/Indigo | `#6366F1` | `rgb(99, 102, 241)` | Primary data series, Electronics category |
| Clothing | Teal/Cyan | `#14B8A6` | `rgb(20, 184, 166)` | Secondary data series, Clothing category |
| Home & Garden | Yellow/Amber | `#F59E0B` | `rgb(245, 158, 11)` | Tertiary data series, Home & Garden category |
| Sports | Orange/Red | `#F97316` | `rgb(249, 115, 22)` | Quaternary data series, Sports category |
| Books | Purple/Magenta | `#A855F7` | `rgb(168, 85, 247)` | Additional data series, Books category |

### Semantic Colors

| Purpose | Hex Code | RGB | Usage |
|---------|----------|-----|-------|
| Success/Positive | `#10B981` | `rgb(16, 185, 129)` | Positive metrics, upward trends (green-500) |
| Warning | `#F59E0B` | `rgb(245, 158, 11)` | Warning states, alerts (amber-500) |
| Error/Danger | `#EF4444` | `rgb(239, 68, 68)` | Destructive actions, error states (red-500) |
| Info | `#3B82F6` | `rgb(59, 130, 246)` | Information indicators (blue-500) |

### Button Colors

| Button Type | Background (Light) | Background (Dark) | Text Color | Border |
|-------------|-------------------|-------------------|------------|--------|
| Primary | `#6366F1` | `#6366F1` | `#FFFFFF` | None |
| Primary Hover | `#4F46E5` | `#4F46E5` | `#FFFFFF` | None |
| Secondary | `transparent` | `transparent` | `#1F2937` / `#F8FAFC` | `#E5E7EB` / `#334155` |
| Secondary Hover | `#F9FAFB` | `#334155` | `#1F2937` / `#F8FAFC` | `#D1D5DB` / `#475569` |
| Destructive | `#EF4444` | `#DC2626` | `#FFFFFF` | None |
| Destructive Hover | `#DC2626` | `#B91C1C` | `#FFFFFF` | None |

### Overlay & Modal

| Element | Hex Code | RGBA | Usage |
|---------|----------|------|-------|
| Modal Overlay (Light) | N/A | `rgba(0, 0, 0, 0.5)` | Semi-transparent backdrop |
| Modal Overlay (Dark) | N/A | `rgba(0, 0, 0, 0.7)` | Semi-transparent backdrop (darker) |

---

## Typography

### Font Family

The dashboard uses a modern sans-serif font stack:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
             sans-serif;
```

### Heading Styles

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| H1 | `28px` (1.75rem) | 700 (Bold) | 1.2 | -0.01em | Main dashboard title |
| H2 | `24px` (1.5rem) | 600 (Semibold) | 1.3 | -0.005em | Modal titles, section headers |
| H3 | `18px` (1.125rem) | 600 (Semibold) | 1.4 | 0 | Card titles, panel headers |

### Body Text

| Type | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Large | `16px` (1rem) | 400 (Regular) | 1.5 | Primary content, form labels |
| Base | `14px` (0.875rem) | 400 (Regular) | 1.5 | Default body text, descriptions |
| Small | `12px` (0.75rem) | 400 (Regular) | 1.4 | Chart labels, captions, metadata |

### Number Display

| Type | Size | Weight | Usage |
|------|------|--------|-------|
| KPI Large | `48px` (3rem) | 700 (Bold) | Large metric displays (e.g., "116.6K") |
| KPI Medium | `32px` (2rem) | 600 (Semibold) | Medium metric values |
| Chart Values | `12px` (0.75rem) | 500 (Medium) | Axis values, data labels |

### Text Colors by Context

#### Light Mode
- **Headings**: `#1F2937` (gray-800)
- **Body Text**: `#374151` (gray-700)
- **Secondary Text**: `#6B7280` (gray-500)
- **Muted/Placeholder**: `#9CA3AF` (gray-400)

#### Dark Mode
- **Headings**: `#F8FAFC` (slate-50)
- **Body Text**: `#E2E8F0` (slate-200)
- **Secondary Text**: `#CBD5E1` (slate-300)
- **Muted/Placeholder**: `#64748B` (slate-500)

---

## Spacing System

The dashboard uses an 8px-based spacing system for consistency:

### Base Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | Tight spacing between related elements |
| `space-2` | `8px` | Small gaps, icon spacing |
| `space-3` | `12px` | Form field spacing, small padding |
| `space-4` | `16px` | Default spacing unit, card padding |
| `space-5` | `20px` | Medium spacing between sections |
| `space-6` | `24px` | Large padding, section spacing |
| `space-8` | `32px` | Extra large spacing, page margins |
| `space-10` | `40px` | Major section dividers |
| `space-12` | `48px` | Page-level spacing |

### Component Spacing

#### Dashboard Layout
- **Page Padding**: `32px` (space-8) on desktop, `16px` (space-4) on mobile
- **Card Grid Gap**: `24px` (space-6) between cards
- **Card Padding**: `24px` (space-6) internal padding

#### Card Layout
- **Header to Content**: `16px` (space-4)
- **Title to Action Button**: Justified (space-between)
- **Chart Margins**: `16px` (space-4) on all sides

#### Form Elements
- **Field Spacing**: `20px` (space-5) between form fields
- **Label to Input**: `8px` (space-2)
- **Input Padding**: `12px 16px` (space-3 space-4)
- **Button Spacing**: `12px` (space-3) between buttons

#### Modal
- **Modal Padding**: `32px` (space-8)
- **Header to Content**: `24px` (space-6)
- **Footer Spacing**: `24px` (space-6) from content
- **Button Group Gap**: `12px` (space-3)

### Border Radius

| Element | Radius | Usage |
|---------|--------|-------|
| Small | `6px` | Buttons, small elements |
| Medium | `8px` | Input fields, dropdowns |
| Large | `12px` | Cards, panels |
| XLarge | `16px` | Modals, large containers |
| Full | `9999px` | Pills, badges, circular elements |

---

## Component Specifications

### Buttons

#### Primary Button
```
Size: Height 40px (medium), 36px (small), 44px (large)
Padding: 12px 24px (medium)
Border Radius: 6px
Font: 14px, weight 600
Background: #6366F1
Text: #FFFFFF
Hover: Background #4F46E5
Active: Background #4338CA
Icon Spacing: 8px between icon and text
```

#### Secondary Button
```
Size: Height 40px (medium)
Padding: 12px 24px
Border Radius: 6px
Border: 1px solid #E5E7EB (light) / #334155 (dark)
Font: 14px, weight 600
Background: transparent
Text: #1F2937 (light) / #F8FAFC (dark)
Hover: Background #F9FAFB (light) / #334155 (dark)
```

#### Destructive Button
```
Size: Height 40px (medium)
Padding: 12px 24px
Border Radius: 6px
Font: 14px, weight 600
Background: #EF4444
Text: #FFFFFF
Hover: Background #DC2626
Active: Background #B91C1C
```

#### Icon Button
```
Size: 32px × 32px (small), 40px × 40px (medium)
Border Radius: 6px
Background: transparent
Hover: Background rgba(0,0,0,0.05) (light) / rgba(255,255,255,0.1) (dark)
Icon Size: 20px
```

### Cards/Panels

```
Background: #FFFFFF (light) / #1E293B (dark)
Border: 1px solid #E5E7EB (light) / #334155 (dark)
Border Radius: 12px
Padding: 24px
Shadow (Light): 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
Shadow (Dark): 0 1px 3px rgba(0, 0, 0, 0.3)
Min Height: 300px (for chart panels)
```

#### Card Header
```
Display: flex, justify-content: space-between
Margin Bottom: 16px
Title: H3 (18px, weight 600)
Action Button: Icon button (32×32px)
```

### Form Elements

#### Text Input
```
Height: 44px
Padding: 12px 16px
Border: 1px solid #E5E7EB (light) / #334155 (dark)
Border Radius: 8px
Background: #FFFFFF (light) / #0F172A (dark)
Font: 16px, weight 400
Placeholder: #9CA3AF (light) / #64748B (dark)

Focus State:
  Border: 2px solid #6366F1
  Outline: 2px solid rgba(99, 102, 241, 0.2)
  Outline Offset: 2px
```

#### Select/Combobox
```
Height: 44px
Padding: 12px 16px
Border: 1px solid #E5E7EB (light) / #334155 (dark)
Border Radius: 8px
Background: #FFFFFF (light) / #0F172A (dark)
Font: 16px, weight 400
Chevron Icon: 20px, positioned right 12px

Expanded State:
  Border: 2px solid #6366F1

Dropdown Menu:
  Background: #FFFFFF (light) / #1E293B (dark)
  Border: 1px solid #E5E7EB (light) / #334155 (dark)
  Border Radius: 8px
  Shadow: 0 10px 25px rgba(0, 0, 0, 0.15)
  Max Height: 300px
  Overflow: auto

Dropdown Option:
  Padding: 12px 16px
  Hover: Background #F9FAFB (light) / #334155 (dark)
  Selected: Background #EEF2FF (light) / #312E81 (dark)
  Check Icon: 20px (for selected item)
```

#### Form Labels
```
Font: 14px, weight 600
Color: #374151 (light) / #E2E8F0 (dark)
Margin Bottom: 8px
Display: block
```

### Modal/Dialog

```
Width: 600px (max-width: 90vw)
Background: #FFFFFF (light) / #1E293B (dark)
Border Radius: 16px
Padding: 32px
Shadow: 0 20px 50px rgba(0, 0, 0, 0.3)
Backdrop: rgba(0, 0, 0, 0.5) (light) / rgba(0, 0, 0, 0.7) (dark)

Header:
  Margin Bottom: 24px
  Title: H2 (24px, weight 600)
  Close Button: Top right, 32×32px icon button

Footer:
  Margin Top: 32px
  Display: flex, justify-content: space-between
  Gap: 12px
```

### Charts

#### Line Chart
```
Line Color: #6366F1 (primary data)
Line Width: 2px
Point Radius: 4px
Grid Lines: #E5E7EB (light) / #334155 (dark)
Grid Line Width: 1px
Axis Labels: 12px, #6B7280 (light) / #94A3B8 (dark)
```

#### Bar Chart
```
Bar Color: #6366F1 (primary data)
Bar Corner Radius: 4px (top corners)
Bar Width: Auto (with gaps)
Grid Lines: #E5E7EB (light) / #334155 (dark)
Axis Labels: 12px, #6B7280 (light) / #94A3B8 (dark)
```

#### Pie/Donut Chart
```
Slice Colors: Use chart color palette (5 colors)
Donut Thickness: 20% of radius
Legend Position: Below chart
Legend Font: 14px
Legend Item Spacing: 16px
Legend Marker: 12px square with 2px border radius
```

#### KPI Number Display
```
Value:
  Font: 48px, weight 700
  Color: #1F2937 (light) / #F8FAFC (dark)

Label:
  Font: 14px, weight 400
  Color: #6B7280 (light) / #94A3B8 (dark)
  Margin Top: 8px

Trend Indicator:
  Font: 14px, weight 600
  Icon: 16px
  Color: #10B981 (positive) / #EF4444 (negative)
  Display: flex, align-items: center, gap: 4px
  Margin Top: 12px
```

### Icons

The dashboard uses consistent icon sizing:

| Context | Size | Usage |
|---------|------|-------|
| Button Icon | 20px | Icons within buttons |
| Card Action Icon | 20px | Configure panel, menu icons |
| Form Icon | 20px | Dropdown chevrons, input icons |
| Brand Icon | 32px | Logo/brand identity |
| Trend Icon | 16px | Up/down arrows in metrics |

Icon Color:
- Light Mode: `#6B7280` (default), `#1F2937` (active)
- Dark Mode: `#94A3B8` (default), `#F8FAFC` (active)

---

## Theme Switching

The dashboard supports light and dark themes with a toggle button in the header.

### Theme Toggle Button
```
Position: Header, right side
Size: 40×40px
Border Radius: 8px
Background: transparent
Hover: rgba(0,0,0,0.05) (light) / rgba(255,255,255,0.1) (dark)
Icon: Sun (light mode) / Moon (dark mode), 20px
```

### Theme Persistence
- Store theme preference in localStorage
- Key: `theme` or `color-mode`
- Values: `light` or `dark`
- Default: System preference (prefers-color-scheme)

### Transition Effect
```css
transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
```

### Implementation Approach

Use CSS variables for easy theme switching:

```css
:root {
  /* Light mode (default) */
  --color-bg-primary: #F5F5F7;
  --color-bg-secondary: #FFFFFF;
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
  /* ... more variables */
}

[data-theme="dark"] {
  /* Dark mode overrides */
  --color-bg-primary: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #CBD5E1;
  --color-border: #334155;
  /* ... more variables */
}
```

---

## Data Sources & Visualizations

### Available Data Sources

The dashboard supports four data source types, each with specific use cases:

| Data Source | Description | Best For | Icon |
|-------------|-------------|----------|------|
| **Logistics API** | Shipment tracking and delivery metrics | Line charts, time series data | 📦 |
| **Server Health DB** | Infrastructure monitoring data | Bar charts, real-time metrics | 🖥️ |
| **Sales Real-time** | Live sales and revenue data | KPI numbers, trend indicators | 💰 |
| **Inventory CSV** | Stock levels and product catalog | Pie charts, category breakdowns | 📊 |

### Visualization Types

| Type | Best For | Data Format | Example Use Case |
|------|----------|-------------|------------------|
| **Line Chart** | Time-series trends | Timestamp + value | Weekly shipments over time |
| **Bar Chart** | Comparative values | Categories + values | Server CPU usage by hour |
| **KPI Number** | Single metric display | Single value + optional trend | Total revenue with % change |
| **Pie Chart** | Part-to-whole relationships | Categories + proportions | Sales by category |
| **Data Table** | Detailed data listing | Rows + columns | Product inventory list |

### Panel Configuration

Each panel can be configured with:
1. **Panel Title** - Customizable text (max ~50 characters recommended)
2. **Data Source** - Select from 4 available sources
3. **Visualization Type** - Choose from 5 visualization options

Configuration is accessed via the ellipsis (⋯) button in the panel header.

---

## Grid Layout

The dashboard uses a responsive grid system:

### Desktop (≥1024px)
- 2 columns
- Gap: 24px
- Container Max Width: 1400px
- Padding: 32px

### Tablet (768px - 1023px)
- 2 columns
- Gap: 20px
- Padding: 24px

### Mobile (<768px)
- 1 column
- Gap: 16px
- Padding: 16px

### Panel Sizing
All panels are equal height in their row, creating a clean grid. Minimum panel height: 300px.

---

## Accessibility Notes

### Color Contrast
All color combinations meet WCAG 2.1 AA standards:
- Text on backgrounds: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

### Focus States
All interactive elements have visible focus indicators:
- Outline: 2px solid `#6366F1`
- Outline Offset: 2px
- Border Radius: Matches element radius

### Theme Considerations
Both light and dark themes maintain proper contrast ratios for accessibility.

---

## Development Guidelines

### CSS Architecture
- Use CSS custom properties (variables) for theme values
- Organize styles by component
- Use utility classes for spacing (based on 8px system)
- Maintain consistent naming conventions (BEM or similar)

### Component Structure
```
component/
  ├── Component.tsx          # Main component
  ├── Component.module.css   # Component styles
  ├── Component.test.tsx     # Unit tests
  └── index.ts              # Export
```

### Responsive Design
- Mobile-first approach
- Use CSS Grid for panel layout
- Breakpoints: 768px (tablet), 1024px (desktop)
- Test on multiple screen sizes

### Performance
- Lazy load chart libraries
- Optimize images and icons
- Use SVG for icons when possible
- Minimize re-renders on theme toggle

---

## Quick Reference

### Most Common Colors
```css
/* Primary Actions */
--primary: #6366F1;
--primary-hover: #4F46E5;

/* Backgrounds */
--bg-light: #F5F5F7;
--bg-dark: #0F172A;

/* Text */
--text-light: #1F2937;
--text-dark: #F8FAFC;

/* Borders */
--border-light: #E5E7EB;
--border-dark: #334155;

/* Semantic */
--success: #10B981;
--error: #EF4444;
--warning: #F59E0B;
```

### Common Spacing
```css
/* Padding */
--card-padding: 24px;
--page-padding: 32px;

/* Gaps */
--grid-gap: 24px;
--button-gap: 12px;

/* Border Radius */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
```

---

## Version History

- **v1.0** - Initial style guide based on Operations Analytics Dashboard design
- Document Created: December 24, 2025

---

## Support & Questions

For questions about implementing these styles or requesting additions to this guide, please contact the development team.

---

**End of Style Guide**

