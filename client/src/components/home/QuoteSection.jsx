import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Container
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal.jsx';

const QuoteSection = () => {
    const { t } = useTranslation();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, -100]);

    return (
        <Box
            component={motion.div}
            style={{ y }}
            sx={{
                position: 'relative',
                minHeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', // Parallax effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(139, 123, 122, 0.75)'
                }
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <ScrollReveal delay={0}>
                    <Box sx={{ textAlign: 'center', px: 4 }}>
                        {/* Decorative Quote Marks */}
                        <Typography
                            sx={{
                                fontSize: { xs: 80, md: 120 },
                                lineHeight: 0.5,
                                color: 'rgba(255,255,255,0.3)',
                                fontFamily: 'Georgia, serif',
                                mb: 2
                            }}
                        >
                            "
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{
                                color: 'white',
                                fontStyle: 'italic',
                                fontWeight: 300,
                                maxWidth: 800,
                                mx: 'auto',
                                mb: 2,
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                lineHeight: 1.4,
                                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
                            }}
                        >
                            {t('home.quote.text')}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 300,
                                fontSize: { xs: '1.1rem', md: '1.3rem' },
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}
                        >
                            — {t('home.quote.author')}
                        </Typography>
                    </Box>
                </ScrollReveal>
            </Container>

            {/* Decorative Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: 60,
                    height: 60,
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    zIndex: 1
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '10%',
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    zIndex: 1
                }}
            />
        </Box>
    );
};

export default QuoteSection;