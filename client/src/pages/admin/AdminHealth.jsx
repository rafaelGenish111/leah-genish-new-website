import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

const AdminHealth = () => {
    const { t } = useTranslation();

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                {t('admin.sidebar.healthDeclarations')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Health declarations management page - Coming soon...
            </Typography>
        </Box>
    );
};

export default AdminHealth;