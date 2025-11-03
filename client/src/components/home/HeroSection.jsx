import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    KeyboardArrowDown
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import logoWhite from '../../assets/images/logo-white.png';

const HeroSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Hero slideshow images - Holistic therapy clinic themed
    const images = [
        // שמן עיסוי על גב של אישה
        // 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        // אבנים חמות על גב של אישה
        // 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        // רקע של משטח עם נרות וצמחים
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        // שמנים אתריים ופרחים על רקע עץ
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',

        // // עלי במבוק ואבנים על רקע מים
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [images.length]);

    const handleBookAppointment = () => {
        navigate('/appointments');
    };

    const handleLearnMore = () => {
        navigate('/about');
    };

    const handleScrollDown = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    // Animation variants - Slower and smoother
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4
            }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8, y: -30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 1.5,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        float: {
            y: [-5, 5, -5],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // Title animation - stagger words
    const titleVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4
            }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 1.2 }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            transition: { duration: 0.4 }
        }
    };

    // Split title into words for stagger animation
    const titleWords = t('home.hero.title').split(' ');

    return (
        <Box
            sx={{
                position: 'relative',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Background Slideshow */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0
                }}
            >
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 2.5,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${images[currentImage]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            willChange: 'opacity'
                        }}
                    />
                </AnimatePresence>
            </Box>

            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(212, 181, 176, 0.3) 0%, rgba(212, 181, 176, 0.6) 100%)',
                    zIndex: 1
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Logo */}
                    <motion.div
                        variants={logoVariants}
                        animate="visible"
                        whileHover="float"
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                component="img"
                                src={logoWhite}
                                alt="לאה גניש"
                                sx={{
                                    width: { xs: 140, md: 180 },
                                    height: 'auto',
                                    objectFit: 'contain',
                                    mx: 'auto',
                                    mb: 3,
                                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                                }}
                            />
                        </Box>
                    </motion.div>

                    {/* Main Title with Stagger Animation */}
                    <motion.div variants={titleVariants}>
                        <Typography
                            variant={isMobile ? 'h3' : 'h2'}
                            component="h1"
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 300,
                                letterSpacing: isMobile ? 1 : 2,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                mb: 3,
                                fontSize: isMobile ? '2.5rem' : '4rem',
                                lineHeight: 1.2
                            }}
                        >
                            {titleWords.map((word, index) => (
                                <motion.span
                                    key={index}
                                    variants={wordVariants}
                                    style={{ display: 'inline-block', marginRight: '0.5em' }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </Typography>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            align="center"
                            sx={{
                                color: 'rgba(255,255,255,0.95)',
                                fontWeight: 300,
                                mb: 6,
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.6,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}
                        >
                            {t('home.hero.subtitle')}
                        </Typography>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div variants={buttonVariants}>
                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            justifyContent: 'center',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: 'center'
                        }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleBookAppointment}
                                component={motion.button}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                    borderRadius: '30px',
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 16px rgba(212, 181, 176, 0.4)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(212, 181, 176, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease',
                                    minWidth: isMobile ? '100%' : '200px'
                                }}
                            >
                                {t('home.hero.bookAppointment')}
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleLearnMore}
                                component={motion.button}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                    borderRadius: '30px',
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease',
                                    minWidth: isMobile ? '100%' : '200px'
                                }}
                            >
                                {t('home.hero.learnMore')}
                            </Button>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Scroll Down Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'pointer',
                    zIndex: 2
                }}
                onClick={handleScrollDown}
            >
                <KeyboardArrowDown sx={{ fontSize: 40, color: 'white' }} />
            </motion.div>

            {/* Image Counter */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    display: 'flex',
                    gap: 1
                }}
            >
                {images.map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: index === currentImage ? 'white' : 'rgba(255,255,255,0.5)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default HeroSection;