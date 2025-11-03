import { createTheme } from '@mui/material/styles';

// Color palette from logo - WCAG 2.1 AA compliant - Enhanced Design System
const colors = {
    // Primary - גוונים של ורוד עתיק
    primary: {
        main: '#D4B5B0',
        light: '#E8D5D2',
        lighter: '#F5EAE8',
        dark: '#B89B97',
        darker: '#A68B87'
    },
    // Secondary - גוונים של חום-אפור
    secondary: {
        main: '#8B7B7A',
        light: '#A69A99',
        dark: '#6B5E5D',
        muted: '#7A6E6D'
    },
    // Accent - צבעי הדגשה
    accent: {
        gold: '#D4A574',
        sage: '#B4C5B0',
        lavender: '#C9B4C5',
        peach: '#E8C5B5'
    },
    // Neutrals - גווני רקע
    neutral: {
        white: '#FFFFFF',
        snow: '#FAF9F8',
        cream: '#FAF5F3',
        sand: '#F5EFED',
        stone: '#E8E3E1',
        slate: '#D5D0CE'
    },
    // Text - צבעי טקסט
    text: {
        primary: '#2C2C2C',
        secondary: '#5A5A5A',
        tertiary: '#7A7A7A',
        disabled: '#999999',
        white: '#FFFFFF',
        muted: '#A0A0A0'
    },
    // Semantic - צבעים סמנטיים
    semantic: {
        success: '#7CAF7C',
        warning: '#E8B865',
        error: '#D68B8B',
        info: '#7CA5C5'
    },
    // Shadows - צללים
    shadow: {
        soft: 'rgba(212, 181, 176, 0.1)',
        medium: 'rgba(212, 181, 176, 0.2)',
        hard: 'rgba(139, 123, 122, 0.3)'
    },
    // Gradients - גרדיאנטים
    gradients: {
        primary: 'linear-gradient(135deg, #FAF5F3 0%, #F5EAE8 100%)',
        warmth: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
        sunset: 'linear-gradient(135deg, #E8C5B5 0%, #D4B5B0 50%, #B89B97 100%)',
        nature: 'linear-gradient(135deg, #B4C5B0 0%, #D4B5B0 100%)',
        overlay: 'linear-gradient(180deg, rgba(44,44,44,0.7) 0%, rgba(44,44,44,0.4) 100%)'
    },
    // Legacy support
    primary_main: '#D4B5B0',
    primaryLighter: '#E8D5D2',
    primaryDarker: '#B89B97',
    secondary_main: '#6B5E5D',
    accent_main: '#C9A9A4',
    background: {
        default: '#FFFFFF',
        paper: '#FAF9F8',
        light: '#FAF5F3'
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
            main: colors.primary.main,
            light: colors.primary.light,
            dark: colors.primary.dark,
            contrastText: '#ffffff'
        },
        secondary: {
            main: colors.secondary.main,
            light: colors.secondary.light,
            dark: colors.secondary.dark,
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
        htmlFontSize: 16,
        fontSize: 16,
        fontFamily: [
            'Assistant',
            '-apple-system',
            'BlinkMacSystemFont',
            'sans-serif'
        ].join(','),
        h1: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            lineHeight: 1.1,
            letterSpacing: '0.02em'
        },
        h2: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.2,
            letterSpacing: '0.01em'
        },
        h3: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.3,
            letterSpacing: '0.01em'
        },
        h4: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            lineHeight: 1.4,
            letterSpacing: '0.01em'
        },
        h5: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            lineHeight: 1.5
        },
        h6: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            lineHeight: 1.5
        },
        body1: {
            fontFamily: "'Assistant', sans-serif",
            fontSize: '1.125rem',
            lineHeight: 2,
            fontWeight: 300,
            letterSpacing: '0.3px'
        },
        body2: {
            fontFamily: "'Assistant', sans-serif",
            fontSize: '1rem',
            lineHeight: 1.8,
            fontWeight: 300,
            letterSpacing: '0.3px'
        },
        button: {
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.875rem'
        },
        caption: {
            fontFamily: "'Assistant', sans-serif",
            fontSize: '0.75rem',
            lineHeight: 1.6,
            fontWeight: 400,
            letterSpacing: '1px'
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
        borderRadius: 0
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    padding: '12px 32px',
                    boxShadow: 'none',
                    border: '1px solid #E8E8E8',
                    transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    '&:hover': {
                        boxShadow: 'none',
                        transform: 'translateY(-2px)',
                        borderColor: colors.primary.main
                    },
                    '&:focus-visible': {
                        outline: '3px solid #D4B5B0',
                        outlineOffset: '3px'
                    }
                },
                contained: {
                    backgroundColor: colors.primary.main,
                    color: '#FFFFFF',
                    borderColor: colors.primary.main,
                    '&:hover': {
                        backgroundColor: colors.primary.dark
                    }
                },
                outlined: {
                    borderColor: '#1A1A1A',
                    color: '#1A1A1A',
                    '&:hover': {
                        borderColor: '#1A1A1A',
                        backgroundColor: '#FAFAFA'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: 'none',
                    border: '1px solid #E8E8E8',
                    transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    '&:hover': {
                        boxShadow: 'none',
                        transform: 'translateY(-8px)'
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        '& fieldset': {
                            borderColor: '#E0E0E0'
                        },
                        '&:hover fieldset': {
                            borderColor: colors.primary.main
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.primary.main
                        }
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
                    borderLeft: `1px solid ${colors.primary.main}20`
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: `${colors.primary.main}10`,
                    color: colors.primary.main,
                    border: `1px solid ${colors.primary.main}30`
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 0
                }
            }
        }
    }
});

// English Theme - Cormorant Garamond
export const englishTheme = createTheme({
    ...theme,
    typography: {
        ...theme.typography,
        fontFamily: [
            'Cormorant Garamond',
            'Georgia',
            'serif'
        ].join(','),
        h1: {
            ...theme.typography.h1,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300
        },
        h2: {
            ...theme.typography.h2,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300
        },
        h3: {
            ...theme.typography.h3,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400
        },
        h4: {
            ...theme.typography.h4,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400
        },
        h5: {
            ...theme.typography.h5,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500
        },
        h6: {
            ...theme.typography.h6,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500
        },
        body1: {
            ...theme.typography.body1,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400
        },
        body2: {
            ...theme.typography.body2,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400
        },
        button: {
            ...theme.typography.button,
            fontFamily: "'Assistant', sans-serif",
            fontWeight: 500
        }
    }
});

export default theme;
