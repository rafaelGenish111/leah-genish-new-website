import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Skeleton,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ArrowForward,
    MedicalServices,
    Spa,
    Psychology,
    Healing
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { servicesService } from '../../services/servicesService.js';
import ScrollReveal from '../common/ScrollReveal.jsx';

const ServicesPreview = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const activeServices = await servicesService.getActiveServices();
            // Take first 4 services for preview
            setServices(activeServices.slice(0, 4));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAllServices = () => {
        navigate('/services');
    };

    const getServiceIcon = (serviceName) => {
        const name = serviceName.toLowerCase();
        if (name.includes('רפלקס') || name.includes('reflex')) return Spa;
        if (name.includes('עיסוי') || name.includes('massage')) return Healing;
        if (name.includes('פסיכ') || name.includes('psych')) return Psychology;
        return MedicalServices;
    };

    const getServiceName = (service) => {
        return language === 'he' ? service.name_he : service.name_en;
    };

    const getServiceDescription = (service) => {
        const desc = language === 'he' ? service.description_he : service.description_en;
        return desc ? desc.substring(0, 100) + '...' : '';
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    if (error) {
        return (
            <Box sx={{ py: 8, backgroundColor: '#FAF5F3' }}>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 12, backgroundColor: '#FAF5F3' }}>
            <Container maxWidth="lg">
                <ScrollReveal>
                    <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 'bold', color: 'primary.main' }}>
                        {t('home.services.title')}
                    </Typography>
                </ScrollReveal>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Grid container spacing={4}>
                        {loading ? (
                            // Loading skeletons
                            Array.from({ length: 4 }).map((_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={300}
                                        sx={{ borderRadius: 4 }}
                                    />
                                </Grid>
                            ))
                        ) : services.length > 0 ? (
                            services.map((service, index) => {
                                const IconComponent = getServiceIcon(getServiceName(service));
                                return (
                                    <Grid item xs={12} sm={6} md={3} key={service._id}>
                                        <motion.div variants={cardVariants}>
                                            <Card
                                                component={motion.div}
                                                whileHover={{
                                                    y: -10,
                                                    boxShadow: '0 20px 40px rgba(139,123,122,0.2)',
                                                    transition: { duration: 0.3 }
                                                }}
                                                sx={{
                                                    height: '100%',
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    background: 'white',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(135deg, rgba(212,181,176,0.1) 0%, rgba(139,123,122,0.1) 100%)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s'
                                                    },
                                                    '&:hover::before': {
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ textAlign: 'center', p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                    {/* Pulsing Icon */}
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.1, 1],
                                                            opacity: [1, 0.8, 1]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                borderRadius: '50%',
                                                                bgcolor: 'primary.light',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mx: 'auto',
                                                                mb: 3,
                                                                boxShadow: '0 4px 16px rgba(212, 181, 176, 0.3)'
                                                            }}
                                                        >
                                                            <IconComponent sx={{ fontSize: 40, color: 'primary.main' }} />
                                                        </Box>
                                                    </motion.div>

                                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary', flex: 1 }}>
                                                        {getServiceName(service)}
                                                    </Typography>

                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                                                        {getServiceDescription(service)}
                                                    </Typography>

                                                    {/* Service Details */}
                                                    <Box sx={{ mb: 3 }}>
                                                        {service.duration && (
                                                            <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                                                                {service.duration} דקות
                                                            </Typography>
                                                        )}
                                                        {service.price && (
                                                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                                                                ₪{service.price}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            borderRadius: '20px',
                                                            px: 3,
                                                            py: 1,
                                                            textTransform: 'none',
                                                            borderColor: 'primary.main',
                                                            color: 'primary.main',
                                                            '&:hover': {
                                                                backgroundColor: 'primary.main',
                                                                color: 'white'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        {t('home.services.readMore')}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" color="text.secondary">
                                    {t('home.services.noServices')}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </motion.div>

                {/* View All Services Button */}
                <ScrollReveal delay={0.5}>
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleViewAllServices}
                            endIcon={<ArrowForward />}
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            sx={{
                                borderRadius: '25px',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
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
                            {t('home.services.viewAll')}
                        </Button>
                    </Box>
                </ScrollReveal>
            </Container>
        </Box>
    );
};

export default ServicesPreview;