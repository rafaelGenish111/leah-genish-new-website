import React from 'react';
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
    ArrowForward,
    Spa
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import ScrollReveal from '../common/ScrollReveal.jsx';

const AboutPreview = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleReadMore = () => {
        navigate('/about');
    };

    return (
        <Box sx={{
            py: 12,
            backgroundColor: 'white',
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    gap: 8,
                    py: 4,
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center'
                }}>
                    {/* Image Side */}
                    <ScrollReveal direction="right" delay={0}>
                        <Box sx={{
                            flex: 1,
                            position: 'relative',
                            maxWidth: { xs: '100%', md: '450px' }
                        }}>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Leah Genish"
                                    sx={{
                                        width: '100%',
                                        maxWidth: 450,
                                        borderRadius: '50%',
                                        boxShadow: '0 20px 60px rgba(139, 123, 122, 0.3)',
                                        aspectRatio: '1/1',
                                        objectFit: 'cover'
                                    }}
                                />
                            </motion.div>

                            {/* Decorative Element */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                style={{
                                    position: 'absolute',
                                    top: -20,
                                    right: -20,
                                    opacity: 0.6
                                }}
                            >
                                <Spa sx={{ fontSize: 80, color: 'primary.main' }} />
                            </motion.div>
                        </Box>
                    </ScrollReveal>

                    {/* Content Side */}
                    <Box sx={{ flex: 1 }}>
                        <ScrollReveal direction="left" delay={0.2}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: 'primary.main',
                                    letterSpacing: 3,
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    mb: 2,
                                    display: 'block'
                                }}
                            >
                                {t('home.about.smallTitle')}
                            </Typography>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.3}>
                            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                                {t('home.about.title')}
                            </Typography>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.4}>
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                                {t('home.about.subtitle')}
                            </Typography>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.5}>
                            <Typography paragraph sx={{ fontSize: 18, lineHeight: 1.8, mb: 3 }}>
                                {t('home.about.description1')}
                            </Typography>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.6}>
                            <Typography paragraph sx={{ fontSize: 18, lineHeight: 1.8, mb: 4 }}>
                                {t('home.about.description2')}
                            </Typography>
                        </ScrollReveal>

                        {/* Credentials */}
                        <ScrollReveal direction="left" delay={0.7}>
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        mb: 2
                                    }}
                                >
                                    {t('home.about.credentials')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {['רפלקסולוגיה', 'רפואה משלימה', 'טיפול הוליסטי'].map((cred, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                                        >
                                            <Box
                                                sx={{
                                                    px: 2,
                                                    py: 1,
                                                    backgroundColor: 'primary.light',
                                                    borderRadius: '20px',
                                                    color: 'primary.main',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500,
                                                    boxShadow: '0 2px 8px rgba(212, 181, 176, 0.3)'
                                                }}
                                            >
                                                {cred}
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Box>
                            </Box>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.8}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleReadMore}
                                endIcon={<ArrowForward />}
                                component={motion.button}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 8px 20px rgba(139,123,122,0.3)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                    borderRadius: '25px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 16px rgba(212, 181, 176, 0.4)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(212, 181, 176, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {t('home.about.readMore')}
                            </Button>
                        </ScrollReveal>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutPreview;