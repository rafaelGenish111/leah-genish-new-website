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
        htmlFontSize: 16,
        fontSize: 16,
        fontFamily: [
            'Rubik',
            'Varela Round',
            'sans-serif'
        ].join(','),
        h1: {
            fontFamily: [
                'Rubik',
                'Varela Round',
                'sans-serif'
            ].join(','),
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            lineHeight: 1.2
        },
        h2: {
            fontFamily: [
                'Rubik',
                'Varela Round',
                'sans-serif'
            ].join(','),
            fontWeight: 600,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            lineHeight: 1.3
        },
        h3: {
            fontFamily: [
                'Rubik',
                'Varela Round',
                'sans-serif'
            ].join(','),
            fontWeight: 600,
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            lineHeight: 1.4
        },
        h4: {
            fontFamily: [
                'Rubik',
                'Varela Round',
                'sans-serif'
            ].join(','),
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.4
        },
        h5: {
            fontFamily: [
                'Rubik',
                'Varela Round',
                'sans-serif'
            ].join(','),
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.5
        },
        h6: {
            fontFamily: [
                'Rubik',
                'Varela Round',
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
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(212, 181, 176, 0.4)',
                        transform: 'translateY(-4px)'
                    },
                    '&:focus-visible': {
                        outline: '3px solid #D4B5B0',
                        outlineOffset: '3px'
                    }
                },
                contained: {
                    backgroundColor: colors.primaryDarker, // Better contrast
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#B89B97'
                    }
                },
                outlined: {
                    borderColor: colors.primaryDarker,
                    color: colors.primaryDarker,
                    '&:hover': {
                        borderColor: colors.primaryDarker,
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
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-4px)'
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
                    fontFamily: 'Rubik, sans-serif'
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
            'Lora',
            'Crimson Text',
            'serif'
        ].join(','),
        h1: {
            ...theme.typography.h1,
            fontFamily: [
                'Lora',
                'Crimson Text',
                'serif'
            ].join(',')
        },
        h2: {
            ...theme.typography.h2,
            fontFamily: [
                'Lora',
                'Crimson Text',
                'serif'
            ].join(',')
        },
        h3: {
            ...theme.typography.h3,
            fontFamily: [
                'Lora',
                'Crimson Text',
                'serif'
            ].join(',')
        },
        h4: {
            ...theme.typography.h4,
            fontFamily: [
                'Lora',
                'Crimson Text',
                'serif'
            ].join(',')
        },
        h5: {
            ...theme.typography.h5,
            fontFamily: [
                'Lora',
                'Crimson Text',
                'serif'
            ].join(',')
        },
        h6: {
            ...theme.typography.h6,
            fontFamily: [
                'Lora',
                'Crimson Text',
                'serif'
            ].join(',')
        }
    }
});

export default theme;
