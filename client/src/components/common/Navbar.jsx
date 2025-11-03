import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Container,
    Menu,
    MenuItem,
    useScrollTrigger,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Language as LanguageIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    Spa,
    Translate as TranslateIcon
} from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext.jsx';

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { language, changeLanguage } = useLanguage();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [langAnchor, setLangAnchor] = useState(null);

    // Scroll trigger for navbar background
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50
    });

    const navItems = [
        { label: t('nav.home'), path: '/' },
        { label: t('nav.about'), path: '/about' },
        { label: t('nav.articles'), path: '/articles' },
        { label: t('nav.gallery'), path: '/gallery' },
        { label: t('nav.health'), path: '/health-declaration' },
        { label: t('nav.contact'), path: '/contact' }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLanguageClick = (event) => {
        setLangAnchor(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setLangAnchor(null);
    };

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
        handleLanguageClose();
    };

    // Keyboard trap prevention - ESC closes drawer
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileOpen) {
                handleDrawerToggle();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileOpen]);

    // Mobile Drawer
    const drawer = (
        <Box
            sx={{
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                pt: 4
            }}
        >
            {/* Close Button */}
            <Box sx={{ textAlign: 'right', px: 2, mb: 4 }}>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Mobile Links */}
            <List>
                {navItems.map((item, index) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    handleDrawerToggle();
                                }}
                                sx={{
                                    py: 2.5,
                                    px: 4,
                                    borderBottom: '1px solid rgba(212, 181, 176, 0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(212, 181, 176, 0.05)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 500,
                                        color: location.pathname === item.path
                                            ? 'primary.main'
                                            : 'text.primary'
                                    }}
                                >
                                    {item.label}
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    </motion.div>
                ))}
            </List>

            {/* Mobile CTA */}
            <Box sx={{ px: 4, mt: 4 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => {
                        navigate('/appointments');
                        handleDrawerToggle();
                    }}
                    sx={{
                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                        color: 'white',
                        borderRadius: '25px',
                        py: 1.5,
                        fontSize: 16,
                        fontWeight: 500,
                        boxShadow: '0 4px 15px rgba(212, 181, 176, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(212, 181, 176, 0.4)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    {t('nav.appointments')}
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                component="header"
                role="banner"
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: trigger
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'transparent',
                    backdropFilter: trigger ? 'blur(20px)' : 'none',
                    boxShadow: trigger
                        ? '0 2px 20px rgba(0, 0, 0, 0.05)'
                        : 'none',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderBottom: trigger
                        ? '1px solid rgba(212, 181, 176, 0.1)'
                        : 'none'
                }}
            >
                <Container maxWidth="xl">
                    <nav role="navigation" aria-label="תפריט ראשי">
                        <Toolbar
                            sx={{
                                justifyContent: 'space-between',
                                py: 1.5,
                                px: { xs: 2, sm: 4 },
                                minHeight: '64px !important'
                            }}
                        >
                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Box
                                    component={Link}
                                    to="/"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        textDecoration: 'none',
                                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            rotate: trigger ? 0 : [0, 5, -5, 0],
                                            scale: trigger ? 1 : [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: trigger ? 0.5 : 2,
                                            repeat: trigger ? 0 : Infinity,
                                            repeatDelay: 3
                                        }}
                                    >
                                        <Spa
                                            sx={{
                                                fontSize: trigger ? 35 : 40,
                                                color: trigger ? 'primary.main' : 'white',
                                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Box
                                            sx={{
                                                fontSize: trigger ? 20 : 22,
                                                fontWeight: 400,
                                                color: trigger ? 'text.primary' : 'white',
                                                letterSpacing: 1,
                                                fontFamily: '"Cormorant Garamond", serif',
                                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        >
                                            Leah Genish
                                        </Box>
                                    </motion.div>
                                </Box>
                            </motion.div>

                            {/* Desktop Navigation */}
                            {!isMobile && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {/* Nav Links */}
                                    {navItems.map((item, index) => (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <Box
                                                component={Link}
                                                to={item.path}
                                                sx={{
                                                    position: 'relative',
                                                    textDecoration: 'none',
                                                    fontSize: 16,
                                                    fontWeight: 500,
                                                    letterSpacing: 0.5,
                                                    color: location.pathname === item.path
                                                        ? 'primary.main'
                                                        : trigger
                                                            ? '#2C2C2C'
                                                            : 'rgba(255, 255, 255, 0.95)',
                                                    transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    cursor: 'pointer',
                                                    textShadow: trigger ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                                                    '&:hover': {
                                                        color: 'primary.main'
                                                    },
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: -5,
                                                        left: '50%',
                                                        transform: 'translateX(-50%) scaleX(0)',
                                                        width: '80%',
                                                        height: 2,
                                                        bgcolor: 'primary.main',
                                                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        transformOrigin: 'center'
                                                    },
                                                    '&:hover::after': {
                                                        transform: 'translateX(-50%) scaleX(1)'
                                                    },
                                                    ...(location.pathname === item.path && {
                                                        '&::after': {
                                                            transform: 'translateX(-50%) scaleX(1)'
                                                        }
                                                    })
                                                }}
                                            >
                                                {item.label}
                                            </Box>
                                        </motion.div>
                                    ))}

                                    {/* CTA Button */}
                                    <motion.div
                                        whileHover={{
                                            scale: 1.02,
                                            y: -2
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button
                                            onClick={() => navigate('/appointments')}
                                            sx={{
                                                background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                                                color: 'white',
                                                borderRadius: '20px',
                                                px: 3,
                                                py: 1,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                textTransform: 'none',
                                                boxShadow: '0 3px 12px rgba(212, 181, 176, 0.3)',
                                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                minHeight: '40px',
                                                maxHeight: '40px',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '-100%',
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                    transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                                                },
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #C9A9A4 0%, #D4B5B0 100%)',
                                                    boxShadow: '0 4px 16px rgba(212, 181, 176, 0.4)',
                                                    '&::before': {
                                                        left: '100%'
                                                    }
                                                }
                                            }}
                                        >
                                            {t('nav.appointments')}
                                        </Button>
                                    </motion.div>

                                    {/* Language Switcher */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <IconButton
                                            onClick={handleLanguageClick}
                                            component={motion.button}
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 5
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            sx={{
                                                color: trigger
                                                    ? '#2C2C2C'
                                                    : 'rgba(255, 255, 255, 0.95)',
                                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                borderRadius: '50%',
                                                width: 36,
                                                height: 36,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                bgcolor: trigger ? 'rgba(212, 181, 176, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                                                border: trigger ? '1px solid rgba(212, 181, 176, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(45deg, rgba(212, 181, 176, 0.1), rgba(212, 181, 176, 0.05))',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                '&:hover': {
                                                    bgcolor: 'rgba(212, 181, 176, 0.15)',
                                                    color: 'primary.main',
                                                    '&::before': {
                                                        opacity: 1
                                                    }
                                                }
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    rotate: language === 'he' ? 0 : 180
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <TranslateIcon />
                                            </motion.div>
                                        </IconButton>
                                    </motion.div>
                                </Box>
                            )}

                            {/* Mobile Menu Button */}
                            {isMobile && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <IconButton
                                            onClick={handleLanguageClick}
                                            component={motion.button}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            sx={{
                                                color: trigger ? '#2C2C2C' : 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '50%',
                                                width: 36,
                                                height: 36,
                                                bgcolor: trigger ? 'rgba(212, 181, 176, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                                                border: trigger ? '1px solid rgba(212, 181, 176, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(212, 181, 176, 0.15)'
                                                }
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    rotate: language === 'he' ? 0 : 180
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <TranslateIcon />
                                            </motion.div>
                                        </IconButton>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <IconButton
                                            onClick={handleDrawerToggle}
                                            component={motion.button}
                                            whileTap={{ scale: 0.9 }}
                                            whileHover={{ scale: 1.05 }}
                                            sx={{
                                                color: trigger ? '#2C2C2C' : 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '50%',
                                                width: 36,
                                                height: 36,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                bgcolor: trigger ? 'rgba(212, 181, 176, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                                                border: trigger ? '1px solid rgba(212, 181, 176, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(45deg, rgba(212, 181, 176, 0.1), rgba(212, 181, 176, 0.05))',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                '&:hover': {
                                                    bgcolor: 'rgba(212, 181, 176, 0.15)',
                                                    '&::before': {
                                                        opacity: 1
                                                    }
                                                }
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    rotate: mobileOpen ? 180 : 0,
                                                    scale: mobileOpen ? 1.1 : 1
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                                            </motion.div>
                                        </IconButton>
                                    </motion.div>
                                </Box>
                            )}
                        </Toolbar>
                    </nav>
                </Container>
            </AppBar>

            {/* Language Menu */}
            <Menu
                anchorEl={langAnchor}
                open={Boolean(langAnchor)}
                onClose={handleLanguageClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }
                }}
            >
                <MenuItem
                    onClick={() => handleLanguageChange('he')}
                    selected={language === 'he'}
                    sx={{
                        py: 1.5,
                        px: 3,
                        '&:hover': {
                            bgcolor: 'rgba(212, 181, 176, 0.1)'
                        },
                        '&.Mui-selected': {
                            bgcolor: 'rgba(212, 181, 176, 0.15)',
                            '&:hover': {
                                bgcolor: 'rgba(212, 181, 176, 0.2)'
                            }
                        }
                    }}
                >
                    עברית 🇮🇱
                </MenuItem>
                <MenuItem
                    onClick={() => handleLanguageChange('en')}
                    selected={language === 'en'}
                    sx={{
                        py: 1.5,
                        px: 3,
                        '&:hover': {
                            bgcolor: 'rgba(212, 181, 176, 0.1)'
                        },
                        '&.Mui-selected': {
                            bgcolor: 'rgba(212, 181, 176, 0.15)',
                            '&:hover': {
                                bgcolor: 'rgba(212, 181, 176, 0.2)'
                            }
                        }
                    }}
                >
                    English 🇬🇧
                </MenuItem>
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                anchor={language === 'he' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                    disableRestoreFocus: false // Return focus to original element
                }}
                PaperProps={{
                    sx: {
                        width: { xs: '85%', sm: 350 },
                        backdropFilter: 'blur(20px)',
                        bgcolor: 'rgba(255, 255, 255, 0.98)'
                    }
                }}
                transitionDuration={300}
            >
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: language === 'he' ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: language === 'he' ? 50 : -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {drawer}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Drawer>

            {/* Spacer for fixed navbar */}
            <Toolbar />
        </>
    );
};

export default Navbar;