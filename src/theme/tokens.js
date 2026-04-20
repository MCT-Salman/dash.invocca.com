// src\theme\tokens.js
/**
 * Central design tokens that mirror the custom CSS variables declared
 * inside `src/index.css`. Keeping them in one place makes it easy to
 * reference the same palette/spacing rules from JavaScript.
 */
export const dashboardTokens = {
  palette: {
    primary: 'var(--color-icon)',
    primaryDark: 'var(--color-icon)',
    secondary: 'var(--color-text-primary)',
    accent: 'var(--color-icon)',
    paper: 'var(--color-paper)',
    background: 'var(--color-bg)',
    border: 'var(--color-border)',
    textPrimary: 'var(--color-text-primary)',
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



