# SCSS Framework

A simple, elegant, and well-architected SCSS framework inspired by Milligram, designed for black and white themes with dark mode support.

## Structure

```
src/styles/
├── _variables.scss    # Design tokens (colors, spacing, typography, etc.)
├── _reset.scss       # Modern CSS reset
├── _typography.scss  # Typography system (headings, paragraphs, lists, etc.)
├── _components.scss  # UI components (buttons, forms, cards, etc.)
├── _utilities.scss   # Utility classes (spacing, layout, display, etc.)
└── README.md         # This documentation
```

## Features

### 🎨 **Design System**
- **Colors**: Black and white theme with automatic dark mode support
- **Spacing**: 8px grid system with consistent spacing scale
- **Typography**: Geist font family with proper hierarchy
- **Border Radius**: Consistent radius scale
- **Shadows**: Subtle shadow system

### 🔧 **Components**
- **Buttons**: Primary, secondary, outline, and ghost variants
- **Forms**: Complete form styling with validation states
- **Cards**: Flexible card component
- **Alerts**: Contextual alert messages
- **Tables**: Responsive table styling

### 📝 **Typography**
- **Headings**: H1-H6 with proper hierarchy and responsive sizing
- **Text**: Paragraphs, lead text, small text, and large text
- **Lists**: Ordered, unordered, and definition lists
- **Code**: Inline code, code blocks, and syntax highlighting
- **Quotes**: Blockquotes with proper citation styling

### 🛠 **Utilities**
- **Spacing**: Margin and padding utilities (0-8 scale)
- **Display**: Flexbox, grid, and display utilities
- **Layout**: Position, float, and overflow utilities
- **Typography**: Text alignment, weight, and size utilities
- **Borders**: Border utilities with color variants
- **Shadows**: Shadow utilities
- **Responsive**: Mobile-first responsive utilities

### 🌙 **Dark Mode**
- Automatic dark mode detection using `prefers-color-scheme`
- Seamless color switching between light and dark themes
- Proper contrast ratios maintained across all components

## Usage

The framework is automatically imported in `globals.scss` and available throughout your application.

### CSS Custom Properties

The framework uses CSS custom properties for theming, making it easy to customize:

```scss
:root {
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #000000;
  --spacing-md: 1rem;
  // ... and many more
}
```

### Example Components

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>

<!-- Forms -->
<div class="form-group">
  <label class="form-label" for="email">Email</label>
  <input type="email" class="form-control" id="email" placeholder="Enter your email">
</div>

<!-- Cards -->
<div class="card">
  <div class="card-header">Card Header</div>
  <div class="card-body">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Card subtitle</p>
    <p>Card content goes here.</p>
  </div>
</div>

<!-- Typography -->
<h1>Heading 1</h1>
<p class="lead">This is a lead paragraph that stands out.</p>
<blockquote>
  <p>This is a blockquote with proper styling.</p>
  <cite>Author Name</cite>
</blockquote>
```

### Utility Classes

```html
<!-- Spacing -->
<div class="p-3 m-2">Padding and margin</div>

<!-- Flexbox -->
<div class="d-flex justify-content-center align-items-center">
  <span>Centered content</span>
</div>

<!-- Typography -->
<p class="text-center font-bold text-lg">Centered, bold, large text</p>
```

## Customization

### Adding Custom Colors

```scss
// In your custom SCSS file
:root {
  --color-accent: #your-color;
}

// Use in components
.my-component {
  background-color: var(--color-accent);
}
```

### Extending Components

```scss
// Custom button variant
.btn-custom {
  @extend .btn;
  background-color: var(--color-accent);
  color: white;
}
```

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS Custom Properties support
- `prefers-color-scheme` media query support for dark mode

## Performance

- Modular SCSS structure for optimal bundle splitting
- Minimal CSS output with utility-first approach
- No JavaScript dependencies
- Optimized for tree-shaking
