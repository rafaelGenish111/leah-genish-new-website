import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const Accessibility = () => {
    const { t } = useTranslation();
    const { format } = require('date-fns');
    const currentDate = format(new Date(), 'dd/MM/yyyy');

    const features = [
        t('accessibility.feature1'),
        t('accessibility.feature2'),
        t('accessibility.feature3'),
        t('accessibility.feature4'),
        t('accessibility.feature5')
    ];

    return (
        <>
            <SEO
                title={t('accessibility.title')}
                description={t('accessibility.commitment')}
            />
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 2 }}>
                    {t('accessibility.title')}
                </Typography>

                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                    {t('accessibility.commitment')}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 2 }}>
                    {t('accessibility.compliance')}
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                    {t('accessibility.complianceText')}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                    {t('accessibility.features')}
                </Typography>
                <List>
                    {features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 1.5 }}>
                            <ListItemText
                                primary={feature}
                                primaryTypographyProps={{ fontSize: '1rem' }}
                            />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 2 }}>
                    {t('accessibility.reportTitle')}
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {t('accessibility.reportText')}
                </Typography>
                <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>{t('accessibility.email')}</strong> accessibility@leahgenish.com
                    </Typography>
                    <Typography variant="body1">
                        <strong>{t('accessibility.phone')}</strong> 050-123-4567
                    </Typography>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('accessibility.lastUpdated')} {currentDate}
                </Typography>
            </Container>
        </>
    );
};

export default Accessibility;
