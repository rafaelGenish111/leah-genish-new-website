import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

    const location = useLocation();

    // Read Calendly config from localStorage (set by admin)
    const [calendlyConfig, setCalendlyConfig] = useState({
        url: localStorage.getItem('calendly_url') || import.meta.env.VITE_CALENDLY_URL || '',
        enabled: localStorage.getItem('calendly_enabled') === 'true',
        primaryColor: localStorage.getItem('calendly_primary_color') || 'D4B5B0',
        textColor: localStorage.getItem('calendly_text_color') || '1A1A1A',
        backgroundColor: localStorage.getItem('calendly_background_color') || 'FFFFFF'
    });

    // Load calendly events list
    const [events, setEvents] = useState(() => {
        try {
            const raw = localStorage.getItem('calendly_events');
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    });
    const [selectedEventIndex, setSelectedEventIndex] = useState(0);

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
            try {
                const raw = localStorage.getItem('calendly_events');
                setEvents(raw ? JSON.parse(raw) : []);
            } catch (_) {}
        };

        window.addEventListener('calendly-config-updated', handleConfigUpdate);
        return () => window.removeEventListener('calendly-config-updated', handleConfigUpdate);
    }, []);

    // If event param is present, it overrides the default URL
    const params = new URLSearchParams(location.search);
    const eventParam = (params.get('event') || '').trim();
    const computeUrl = (u) => {
        if (!u) return '';
        const trimmed = u.trim();
        const pattern = /^https:\/\/calendly\.com\/[a-z0-9_-]+(\/[a-z0-9_-]+)?(\?.*)?$/i;
        const badSegments = ['new-meeting', 'scheduled_events', 'app/'];
        if (!pattern.test(trimmed)) return '';
        if (badSegments.some(seg => trimmed.includes(seg))) {
            // המרה לקישור פרופיל
            const m = trimmed.match(/^https:\/\/calendly\.com\/([a-z0-9_-]+)/i);
            return m ? `https://calendly.com/${m[1]}` : '';
        }
        return trimmed;
    };
    const overrideUrl = computeUrl(eventParam);
    const rawUrl = (calendlyConfig.url || '').trim();
    const fallbackUrl = computeUrl(rawUrl);
    let calendlyUrl = overrideUrl || (calendlyConfig.enabled ? fallbackUrl : '');
    if (!overrideUrl && calendlyConfig.enabled && !calendlyUrl && events && events.length > 0) {
        const chosen = events[selectedEventIndex] || events[0];
        calendlyUrl = (chosen?.url || '').trim();
    }

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

                {/* Event selector (optional) */}
                {(!overrideUrl && calendlyConfig.enabled && events && events.length > 0) && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
                        {events.map((ev, idx) => (
                            <Button
                                key={idx}
                                variant={idx === selectedEventIndex ? 'contained' : 'outlined'}
                                onClick={() => setSelectedEventIndex(idx)}
                                sx={{ borderRadius: 0 }}
                            >
                                {ev.label || `אירוע ${idx + 1}`}
                            </Button>
                        ))}
                    </Box>
                )}

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
