import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

const HealthDeclaration = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {t('health.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Health declaration form will be displayed here
                </Typography>
            </Box>
        </Container>
    );
};

export default HealthDeclaration;
