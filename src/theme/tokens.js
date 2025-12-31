// src\theme\tokens.js
/**
 * Central design tokens that mirror the custom CSS variables declared
 * inside `src/index.css`. Keeping them in one place makes it easy to
 * reference the same palette/spacing rules from JavaScript.
 */
export const dashboardTokens = {
  palette: {
    primary: 'var(--color-primary-500)',
    primaryDark: 'var(--color-primary-700)',
    secondary: 'var(--color-secondary-500)',
    accent: 'var(--color-primary-300)',
    paper: 'var(--color-paper-dark)',
    background: 'var(--color-bg-dark)',
    border: 'var(--color-border-dark)',
    textPrimary: 'var(--color-text-primary-dark)',
    textSecondary: 'var(--color-text-secondary)',
    success: 'var(--color-success-500)',
    info: 'var(--color-info-500)',
    warning: 'var(--color-warning-500)',
    danger: 'var(--color-error-500)',
  },
  elevation: {
    card: 'var(--shadow-lg)',
    sheet: 'var(--shadow-md)',
  },
  radius: {
    xl: 'var(--radius-2xl)',
    lg: 'var(--radius-xl)',
    pill: 'var(--radius-full)',
  },
  spacing: {
    xs: 'var(--spacing-2)',
    sm: 'var(--spacing-3)',
    md: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
    xl: 'var(--spacing-8)',
  },
}

export const statPalette = [
  'var(--color-success-500)',
  'var(--color-info-500)',
  'var(--color-warning-500)',
  'var(--color-secondary-500)',
  'var(--color-primary-500)',
]

export const translucent = (cssColor) => {
  if (!cssColor) return 'rgba(0,0,0,0.08)'
  if (cssColor.startsWith('var(')) {
    return `color-mix(in srgb, ${cssColor} 20%, transparent)`
  }
  return `${cssColor}26`
}



