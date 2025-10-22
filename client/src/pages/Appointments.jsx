import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

const Appointments = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {t('appointments.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Appointment booking form will be displayed here
                </Typography>
            </Box>
        </Container>
    );
};

export default Appointments;
