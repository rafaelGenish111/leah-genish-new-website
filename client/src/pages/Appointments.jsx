import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Typography,
    Box,
    Card,
    Alert,
    Button
} from '@mui/material';
import { PhoneInTalk as PhoneIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { InlineWidget } from 'react-calendly';
import SEO from '../components/common/SEO.jsx';

const Appointments = () => {
    const { t } = useTranslation();
    
    // Read Calendly config from localStorage (set by admin)
    const [calendlyConfig, setCalendlyConfig] = useState({
        url: localStorage.getItem('calendly_url') || import.meta.env.VITE_CALENDLY_URL || '',
        enabled: localStorage.getItem('calendly_enabled') === 'true',
        primaryColor: localStorage.getItem('calendly_primary_color') || 'D4B5B0',
        textColor: localStorage.getItem('calendly_text_color') || '1A1A1A',
        backgroundColor: localStorage.getItem('calendly_background_color') || 'FFFFFF'
    });

    // Listen for config updates from admin panel
    useEffect(() => {
        const handleConfigUpdate = () => {
            setCalendlyConfig({
                url: localStorage.getItem('calendly_url') || '',
                enabled: localStorage.getItem('calendly_enabled') === 'true',
                primaryColor: localStorage.getItem('calendly_primary_color') || 'D4B5B0',
                textColor: localStorage.getItem('calendly_text_color') || '1A1A1A',
                backgroundColor: localStorage.getItem('calendly_background_color') || 'FFFFFF'
            });
        };

        window.addEventListener('calendly-config-updated', handleConfigUpdate);
        return () => window.removeEventListener('calendly-config-updated', handleConfigUpdate);
    }, []);

    const calendlyUrl = calendlyConfig.enabled ? calendlyConfig.url : '';

    return (
        <>
            <SEO
                title="קביעת תור - Leah Genish"
                description="קבעי תור לטיפול מקצועי ברפואה משלימה, רפלקסולוגיה וטיפול הוליסטי"
            />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 300 }}
                        >
                            קביעת תור
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            בחרי את התאריך והשעה הנוחים לך
                        </Typography>
                    </Box>
                </motion.div>

                {/* Calendly Widget */}
                {calendlyUrl ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card sx={{ p: 0, borderRadius: 0 }}>
                            <Box sx={{ width: '100%', height: '800px' }}>
                                <InlineWidget
                                    url={calendlyUrl}
                                    styles={{
                                        height: '100%',
                                        minWidth: '320px'
                                    }}
                                    pageSettings={{
                                        backgroundColor: calendlyConfig.backgroundColor.replace('#', ''),
                                        hideEventTypeDetails: false,
                                        hideLandingPageDetails: false,
                                        primaryColor: calendlyConfig.primaryColor.replace('#', ''),
                                        textColor: calendlyConfig.textColor.replace('#', '')
                                    }}
                                />
                            </Box>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card sx={{ p: 4, borderRadius: 0 }}>
                            <Alert severity="info" sx={{ borderRadius: 0, mb: 3 }}>
                                מערכת קביעת התורים הדיגיטלית אינה פעילה כרגע
                            </Alert>
                            
                            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                                ניתן לקבוע תור בדרכים הבאות:
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PhoneIcon />}
                                    href="tel:+972-50-123-4567"
                                    sx={{
                                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                                        px: 4
                                    }}
                                >
                                    התקשרי: 050-123-4567
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<WhatsAppIcon />}
                                    href="https://wa.me/972501234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        borderColor: '#25D366',
                                        color: '#25D366',
                                        '&:hover': {
                                            borderColor: '#128C7E',
                                            bgcolor: 'rgba(37, 211, 102, 0.04)'
                                        }
                                    }}
                                >
                                    שלחי הודעת WhatsApp
                                </Button>
                            </Box>
                        </Card>
                    </motion.div>
                )}
            </Container>
        </>
    );
};

export default Appointments;
