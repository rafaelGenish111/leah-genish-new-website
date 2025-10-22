import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

const Gallery = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {t('nav.gallery')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gallery content will be displayed here
                </Typography>
            </Box>
        </Container>
    );
};

export default Gallery;
