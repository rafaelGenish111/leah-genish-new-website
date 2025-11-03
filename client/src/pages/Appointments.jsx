import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Container,
    Typography,
    Box,
    Card,
    Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { InlineWidget } from 'react-calendly';
import SEO from '../components/common/SEO.jsx';

const Appointments = () => {
    const { t } = useTranslation();
    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || '';

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
                                        backgroundColor: 'ffffff',
                                        hideEventTypeDetails: false,
                                        hideLandingPageDetails: false,
                                        primaryColor: 'D4B5B0',
                                        textColor: '1A1A1A'
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
                            <Alert severity="info" sx={{ borderRadius: 0 }}>
                                Calendly integration לא הוגדר עדיין. אנא צרי קשר טלפונית לקביעת תור.
                            </Alert>
                        </Card>
                    </motion.div>
                )}
            </Container>
        </>
    );
};

export default Appointments;
