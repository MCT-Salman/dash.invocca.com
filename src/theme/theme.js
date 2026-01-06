// src\theme\theme.js
import { createTheme } from '@mui/material/styles';

const resolveCssColor = (colorString) => {
  try {
    // ... (keep helper if needed, but we can rely on vars)
    return null;
  } catch {
    return null;
  }
};

export const createAppTheme = (mode = 'dark') => createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark', // Enforce dark mode
    primary: {
      light: 'var(--color-primary-400)',
      main: 'var(--color-primary-500)',
      dark: 'var(--color-primary-700)',
      contrastText: '#000000',
    },
    secondary: {
      light: 'var(--color-secondary-300)',
      main: 'var(--color-secondary-500)',
      dark: 'var(--color-secondary-700)',
      contrastText: '#ffffff',
    },
    success: {
      main: 'var(--color-success-500)',
    },
    error: {
      main: 'var(--color-error-500)',
    },
    warning: {
      main: 'var(--color-warning-500)',
    },
    info: {
      main: 'var(--color-info-500)',
    },
    background: {
      default: 'var(--color-bg-dark)',
      paper: 'var(--color-paper-dark)',
    },
    text: {
      primary: 'var(--color-text-primary-dark)',
      secondary: 'var(--color-text-secondary-dark)',
      disabled: 'var(--color-text-muted)',
    },
  },
  typography: {
    fontFamily: [
      'Alexandria',
      'Montserrat',
      'system-ui',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: 'Alexandria, Montserrat',
    },
    h1: { fontFamily: 'Alexandria, Montserrat', fontWeight: 700 },
    h2: { fontFamily: 'Alexandria, Montserrat', fontWeight: 700 },
    h3: { fontFamily: 'Alexandria, Montserrat', fontWeight: 700 },
    h4: { fontFamily: 'Alexandria, Montserrat', fontWeight: 700 },
    h5: { fontFamily: 'Alexandria, Montserrat', fontWeight: 600 },
    h6: { fontFamily: 'Alexandria, Montserrat', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'var(--color-bg-dark)',
          scrollbarColor: 'var(--color-secondary-800) var(--color-bg-dark)',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: 'var(--color-secondary-800)',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: 'var(--color-bg-dark)',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Disable MUI default overlay
          backgroundColor: 'var(--color-paper-dark)',
          borderRadius: 16,
          border: '1px solid var(--color-border-glass)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-surface-dark)',
          backgroundImage: 'none',
          border: '1px solid var(--color-border-glass)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-primary-dark)',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(216, 185, 138, 0.3) !important',
            borderWidth: '1px !important',
            borderRadius: '12px !important',
          },
          '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary-500) !important',
          },
          '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary-500) !important',
            borderWidth: '1px !important',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-error-500) !important',
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-border-dark) !important',
          },
        },
        input: {
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.2) !important',
            WebkitTextFillColor: 'rgba(255, 255, 255, 0.2) !important',
            opacity: 1,
          },
          '&::-webkit-input-placeholder': {
            color: 'rgba(255, 255, 255, 0.2) !important',
            WebkitTextFillColor: 'rgba(255, 255, 255, 0.2) !important',
            opacity: 1,
          },
          '&::-moz-placeholder': {
            color: 'rgba(255, 255, 255, 0.2) !important',
            opacity: 1,
          },
          '&:-ms-input-placeholder': {
            color: 'rgba(255, 255, 255, 0.2) !important',
            opacity: 1,
          },
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-secondary-dark)',
          '&.Mui-focused': {
            color: 'var(--color-primary-500)',
          },
        }
      }
    },
  },
});

const theme = createAppTheme('dark');
export default theme;
