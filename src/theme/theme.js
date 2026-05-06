// src\theme\theme.js
import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode = 'light') => createTheme({
  direction: 'rtl',
  palette: {
    mode: mode,
    primary: {
      light: '#D8B98A',
      main: '#D8B98A',
      dark: '#D8B98A',
      contrastText: '#1A1A1A',
    },
    secondary: {
      light: mode === 'dark' ? '#FFF8DA' : '#1A1A1A',
      main: mode === 'dark' ? '#FFF8DA' : '#1A1A1A',
      dark: mode === 'dark' ? '#FFF8DA' : '#1A1A1A',
      contrastText: mode === 'dark' ? '#1A1A1A' : '#FFF8DA',
    },
    success: {
      light: '#D8B98A',
      main: '#D8B98A',
      dark: '#D8B98A',
      contrastText: '#1A1A1A',
    },
    error: {
      light: '#DC2626',
      main: '#DC2626',
      dark: '#B91C1C',
      contrastText: '#FFF8DA',
    },
    warning: {
      light: '#D8B98A',
      main: '#D8B98A',
      dark: '#D8B98A',
      contrastText: '#1A1A1A',
    },
    info: {
      light: '#D8B98A',
      main: '#D8B98A',
      dark: '#D8B98A',
      contrastText: '#1A1A1A',
    },
    background: {
      default: mode === 'dark' ? '#1A1A1A' : '#FFF8DA',
      paper: mode === 'dark' ? '#1A1A1A' : '#FFF8DA',
    },
    text: {
      primary: mode === 'dark' ? '#FFF8DA' : '#1A1A1A',
      secondary: mode === 'dark' ? '#FFF8DA' : '#1A1A1A',
      disabled: mode === 'dark' ? '#FFF8DA' : '#1A1A1A',
    },
    action: {
      active: '#D8B98A',
      hover: mode === 'dark' ? 'rgba(255, 248, 218, 0.10)' : 'rgba(26, 26, 26, 0.10)',
      selected: mode === 'dark' ? 'rgba(255, 248, 218, 0.16)' : 'rgba(26, 26, 26, 0.16)',
      disabled: mode === 'dark' ? 'rgba(255, 248, 218, 0.40)' : 'rgba(26, 26, 26, 0.40)',
      disabledBackground: mode === 'dark' ? 'rgba(255, 248, 218, 0.12)' : 'rgba(26, 26, 26, 0.12)',
    },
  },
  typography: {
    fontFamily: ['Alexandria', 'var(--font-family-base)', 'system-ui', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: 'Alexandria, var(--font-family-base)',
    },
    h1: { fontFamily: 'Alexandria, var(--font-family-base)', fontWeight: 700 },
    h2: { fontFamily: 'Alexandria, var(--font-family-base)', fontWeight: 700 },
    h3: { fontFamily: 'Alexandria, var(--font-family-base)', fontWeight: 700 },
    h4: { fontFamily: 'Alexandria, var(--font-family-base)', fontWeight: 700 },
    h5: { fontFamily: 'Alexandria, var(--font-family-base)', fontWeight: 600 },
    h6: { fontFamily: 'Alexandria, var(--font-family-base)', fontWeight: 600 },
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
        'svg, .lucide, .MuiSvgIcon-root': {
          color: 'var(--color-icon)',
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
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: 'var(--color-icon)',
          color: 'var(--color-dark)',
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
          boxShadow: 'none',
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-paper)',
          backgroundImage: 'none',
          border: '1px solid var(--color-border-glass)',
          boxShadow: 'none',
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
            borderColor: 'var(--color-icon) !important',
          },
          '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-icon) !important',
            borderWidth: '1px !important',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-icon) !important',
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
            color: 'var(--color-icon)',
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
