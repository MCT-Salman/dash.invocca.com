// src\theme\theme.js
import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode = 'light') => createTheme({
  direction: 'rtl',
  palette: {
    mode: mode,
    primary: {
      light: '#B58463', // var(--color-primary-400)
      main: '#9C6644',  // var(--color-primary-500)
      dark: '#6B4423',  // var(--color-primary-700)
      contrastText: mode === 'dark' ? '#000000' : '#ffffff',
    },
    secondary: {
      light: '#d6d3d1', // var(--color-secondary-300)
      main: '#78716c',  // var(--color-secondary-500)
      dark: '#44403c',  // var(--color-secondary-700)
      contrastText: '#ffffff',
    },
    success: {
      light: '#f0fdf4', // var(--color-success-50)
      main: '#15803d',  // var(--color-success-500)
      dark: '#14532d',  // var(--color-success-700)
      contrastText: '#ffffff',
    },
    error: {
      light: '#fef2f2', // var(--color-error-50)
      main: '#dc2626',  // var(--color-error-500)
      dark: '#991b1b',  // var(--color-error-700)
      contrastText: '#ffffff',
    },
    warning: {
      light: '#fffbeb', // var(--color-warning-50)
      main: '#ca8a04',  // var(--color-warning-500)
      dark: '#854d0e',  // var(--color-warning-700)
      contrastText: '#ffffff',
    },
    info: {
      light: '#eff6ff', // var(--color-info-50)
      main: '#2563eb',  // var(--color-info-500)
      dark: '#1e3a8a',  // var(--color-info-700)
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#050505' : '#FDFCFB',
      paper: mode === 'dark' ? '#0F0F0F' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#EDEDED' : '#2C1810',
      secondary: mode === 'dark' ? '#A1A1AA' : '#582F0E',
      disabled: mode === 'dark' ? '#52525B' : '#82736C',
    },
    action: {
      active: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.54)',
      hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      selected: mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
      disabledBackground: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
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
          backgroundColor: 'var(--color-bg)',
          scrollbarColor: 'var(--color-border) var(--color-bg)',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: 'var(--color-border)',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: 'var(--color-bg)',
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
          backgroundColor: 'var(--color-paper)',
          borderRadius: 16,
          border: '1px solid var(--color-border-glass)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-surface)',
          backgroundImage: 'none',
          border: '1px solid var(--color-border-glass)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-paper)',
          backgroundImage: 'none',
          border: '1px solid var(--color-border-glass)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-primary)',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-border-glass) !important',
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
        },
        input: {
          '&::placeholder': {
            color: 'var(--color-text-muted) !important',
            opacity: 1,
          },
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-text-secondary)',
          position: 'relative',
          transform: 'none',
          marginBottom: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          '&.Mui-focused': {
            color: 'var(--color-primary-500)',
          },
          '&.MuiInputLabel-shrink': {
            transform: 'none',
            position: 'relative',
          },
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '24px !important',
          '& .MuiInputLabel-root': {
            position: 'relative',
            transform: 'none',
            marginBottom: '8px',
          },
        }
      }
    },
  },
});

const theme = createAppTheme('light');
export default theme;
