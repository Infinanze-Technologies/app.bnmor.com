# Dashboard Color Usage Guide

## Color Scheme Overview

This dashboard uses a carefully selected three-color scheme that provides excellent contrast, accessibility, and visual hierarchy.

### Primary Colors

| Color | Hex Code | Usage | Example |
|-------|----------|-------|---------|
| **Deep Purple** | `#4D4D4D` | Sidebar background, navigation, primary elements | Sidebar with white icons/text |
| **Bright Orange** | `#FF6F3C` | Buttons, active states, highlights | "Create", "Save", "Continue" buttons |
| **Teal Blue** | `#00C2BA` | Charts, info messages, hover effects | Progress bars, chart lines, hover states |

## Implementation Details

### 1. Primary Color – #4D4D4D (Deep Purple)

**Use for:**
- Sidebar background
- Top navigation bar
- Key sections that need to stand out
- Primary brand elements

**Why:** It's dark, rich, and helps other elements (like text and buttons) stand out clearly.

**Implementation:**
```scss
// SCSS Variables
$color-primary: #4D4D4D;

// Usage Examples
.sidebar {
  background: $color-primary;
}

.bg-primary {
  background-color: $color-primary !important;
  color: #ffffff !important;
}
```

### 2. Accent Color – #FF6F3C (Bright Orange)

**Use for:**
- Buttons (Create, Save, Continue)
- Active states
- Highlights and key indicators
- Call-to-action elements

**Why:** It draws attention—perfect for interactive elements and active states.

**Implementation:**
```scss
// SCSS Variables
$color-accent: #FF6F3C;

// Usage Examples
.btn-primary {
  background-color: $color-accent !important;
  border-color: $color-accent !important;
}

.sidebar-menu-item-active {
  background: $color-accent !important;
}
```

### 3. Secondary Color – #00C2BA (Teal Blue)

**Use for:**
- Charts and data visualization
- Info messages and notifications
- Progress bars
- Hover effects
- Secondary actions

**Why:** It complements both purple and orange while adding a modern, refreshing balance.

**Implementation:**
```scss
// SCSS Variables
$color-secondary: #00C2BA;

// Usage Examples
.progress-secondary .progress-bar {
  background-color: $color-secondary !important;
}

.hover-secondary:hover {
  background-color: rgba(0, 194, 186, 0.1) !important;
}
```

## Available Utility Classes

### Background Colors
- `.bg-primary` - Deep purple background
- `.bg-accent` - Bright orange background  
- `.bg-secondary` - Teal blue background
- `.bg-primary-light` - Light purple background
- `.bg-accent-light` - Light orange background
- `.bg-secondary-light` - Light teal background

### Text Colors
- `.text-primary` - Deep purple text
- `.text-accent` - Bright orange text
- `.text-secondary` - Teal blue text

### Button Styles
- `.btn-primary` - Orange accent button
- `.btn-secondary` - Teal blue button
- `.btn-outline-primary` - Orange outline button
- `.btn-outline-secondary` - Teal outline button

### Card Styles
- `.card-primary` - Purple left border
- `.card-accent` - Orange left border
- `.card-secondary` - Teal left border

### Alert Styles
- `.alert-primary` - Purple alert
- `.alert-accent` - Orange alert
- `.alert-secondary` - Teal alert

### Progress Bars
- `.progress-primary` - Purple progress bar
- `.progress-accent` - Orange progress bar
- `.progress-secondary` - Teal progress bar

### Badges
- `.badge-primary` - Purple badge
- `.badge-accent` - Orange badge
- `.badge-secondary` - Teal badge

### Hover Effects
- `.hover-primary:hover` - Purple hover effect
- `.hover-accent:hover` - Orange hover effect
- `.hover-secondary:hover` - Teal hover effect

### Focus States
- `.focus-primary:focus` - Purple focus ring
- `.focus-accent:focus` - Orange focus ring
- `.focus-secondary:focus` - Teal focus ring

### Navigation
- `.nav-link.active` - Orange active navigation
- `.nav-pills .nav-link.active` - Orange active pill

### Tables
- `.table-primary` - Purple table header
- `.table-accent` - Orange table header
- `.table-secondary` - Teal table header

### Status Indicators
- `.status-primary` - Purple status dot
- `.status-accent` - Orange status dot
- `.status-secondary` - Teal status dot

## Color Variations

The system includes automatic light and dark variations:

```scss
// Light variations (10% lighter)
$color-primary-light: lighten($color-primary, 10%);
$color-accent-light: lighten($color-accent, 10%);
$color-secondary-light: lighten($color-secondary, 10%);

// Dark variations (10% darker)
$color-primary-dark: darken($color-primary, 10%);
$color-accent-dark: darken($color-accent, 10%);
$color-secondary-dark: darken($color-secondary, 10%);
```

## Accessibility Considerations

- **Contrast Ratios:** All color combinations meet WCAG AA standards
- **Color Blindness:** The three-color scheme is designed to be distinguishable for users with color vision deficiencies
- **Focus States:** All interactive elements have clear focus indicators
- **Text Readability:** White text on dark backgrounds, dark text on light backgrounds

## Usage Examples

### Sidebar Implementation
```scss
.sidebar {
  background: $color-primary; // Deep purple background
  color: rgba(255, 255, 255, 0.9); // Light text for contrast
}

.sidebar-menu-item-active {
  background: $color-accent; // Orange for active states
  color: #ffffff;
}
```

### Button Implementation
```html
<!-- Primary action button -->
<button class="btn btn-primary">Create New</button>

<!-- Secondary action button -->
<button class="btn btn-secondary">View Details</button>

<!-- Outline button -->
<button class="btn btn-outline-primary">Cancel</button>
```

### Card Implementation
```html
<!-- Primary card with purple accent -->
<div class="card card-primary">
  <div class="card-header">Important Information</div>
  <div class="card-body">Content here</div>
</div>
```

### Alert Implementation
```html
<!-- Orange alert for important messages -->
<div class="alert alert-accent">
  <strong>Warning!</strong> This action cannot be undone.
</div>
```

## Best Practices

1. **Consistency:** Always use the utility classes instead of hardcoded colors
2. **Hierarchy:** Use orange for primary actions, teal for secondary actions
3. **Accessibility:** Ensure sufficient contrast ratios for all text
4. **Hover States:** Use subtle teal hover effects for better UX
5. **Active States:** Use orange to clearly indicate active/selected items

## File Structure

- `src/sass/_variables.scss` - Color variable definitions
- `src/sass/color-utilities.scss` - Utility classes for colors
- `src/sass/sidebar.scss` - Sidebar-specific color implementations
- `src/sass/main.scss` - Main SCSS file that imports all styles

## Migration Notes

The color system is backward compatible. Existing styles will continue to work, but new development should use the utility classes for consistency.
