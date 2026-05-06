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
    success: 'var(--color-icon)',
    info: 'var(--color-icon)',
    warning: 'var(--color-icon)',
    danger: 'var(--color-icon)',
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
  'var(--color-icon)',
  'var(--color-icon)',
  'var(--color-icon)',
  'var(--color-icon)',
  'var(--color-icon)',
]

export const translucent = (cssColor) => {
  if (!cssColor) return 'rgba(26, 26, 26, 0.08)'
  if (cssColor.startsWith('var(')) {
    return `rgba(216, 185, 138, 0.20)`
  }
  return `${cssColor}26`
}



