import { createTheme } from '@mui/material/styles';

// Color palette from logo
const colors = {
    primary: '#D4B5B0', // Pink
    secondary: '#8B7B7A', // Brown-gray
    background: {
        default: '#FFFFFF',
        paper: '#FAF9F8',
        light: '#FAF5F3'
    },
    text: {
        primary: '#333333',
        secondary: '#666666',
        disabled: '#999999'
    },
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50'
};

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: colors.primary,
            light: '#E8D5D2',
            dark: '#B89B97',
            contrastText: '#ffffff'
        },
        secondary: {
            main: colors.secondary,
            light: '#A69A99',
            dark: '#6B5E5D',
            contrastText: '#ffffff'
        },
        background: {
            default: colors.background.default,
            paper: colors.background.paper
        },
        text: {
            primary: colors.text.primary,
            secondary: colors.text.secondary
        },
        error: {
            main: colors.error
        },
        warning: {
            main: colors.warning
        },
        info: {
            main: colors.info
        },
        success: {
            main: colors.success
        }
    },
    typography: {
        fontFamily: [
            'Heebo',
            'Assistant',
            'sans-serif'
        ].join(','),
        h1: {
            fontFamily: [
                'Heebo',
                'Assistant',
                'sans-serif'
            ].join(','),
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2
        },
        h2: {
            fontFamily: [
                'Heebo',
                'Assistant',
                'sans-serif'
            ].join(','),
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3
        },
        h3: {
            fontFamily: [
                'Heebo',
                'Assistant',
                'sans-serif'
            ].join(','),
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4
        },
        h4: {
            fontFamily: [
                'Heebo',
                'Assistant',
                'sans-serif'
            ].join(','),
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.4
        },
        h5: {
            fontFamily: [
                'Heebo',
                'Assistant',
                'sans-serif'
            ].join(','),
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.5
        },
        h6: {
            fontFamily: [
                'Heebo',
                'Assistant',
                'sans-serif'
            ].join(','),
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.5
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6
        },
        button: {
            fontWeight: 500,
            textTransform: 'none'
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 25,
                    padding: '10px 24px',
                    boxShadow: '0 2px 8px rgba(212, 181, 176, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(212, 181, 176, 0.4)',
                        transform: 'translateY(-2px)'
                    }
                },
                contained: {
                    backgroundColor: colors.primary,
                    '&:hover': {
                        backgroundColor: '#C4A5A0'
                    }
                },
                outlined: {
                    borderColor: colors.primary,
                    color: colors.primary,
                    '&:hover': {
                        borderColor: '#C4A5A0',
                        backgroundColor: 'rgba(212, 181, 176, 0.1)'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-2px)'
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        '& fieldset': {
                            borderColor: '#E0E0E0'
                        },
                        '&:hover fieldset': {
                            borderColor: colors.primary
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.primary
                        }
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontFamily: 'Heebo, sans-serif'
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none'
                    }
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.background.paper,
                    borderLeft: `1px solid ${colors.primary}20`
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                    border: `1px solid ${colors.primary}40`
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12
                }
            }
        }
    }
});

// English theme (LTR)
export const englishTheme = createTheme({
    ...theme,
    typography: {
        ...theme.typography,
        fontFamily: [
            'Montserrat',
            'Cormorant Garamond',
            'serif'
        ].join(','),
        h1: {
            ...theme.typography.h1,
            fontFamily: [
                'Montserrat',
                'Cormorant Garamond',
                'serif'
            ].join(',')
        },
        h2: {
            ...theme.typography.h2,
            fontFamily: [
                'Montserrat',
                'Cormorant Garamond',
                'serif'
            ].join(',')
        },
        h3: {
            ...theme.typography.h3,
            fontFamily: [
                'Montserrat',
                'Cormorant Garamond',
                'serif'
            ].join(',')
        },
        h4: {
            ...theme.typography.h4,
            fontFamily: [
                'Montserrat',
                'Cormorant Garamond',
                'serif'
            ].join(',')
        },
        h5: {
            ...theme.typography.h5,
            fontFamily: [
                'Montserrat',
                'Cormorant Garamond',
                'serif'
            ].join(',')
        },
        h6: {
            ...theme.typography.h6,
            fontFamily: [
                'Montserrat',
                'Cormorant Garamond',
                'serif'
            ].join(',')
        }
    }
});

export default theme;
