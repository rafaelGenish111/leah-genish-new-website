import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

const AdminServices = () => {
    const { t } = useTranslation();

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                {t('admin.sidebar.services')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Services management page - Coming soon...
            </Typography>
        </Box>
    );
};

export default AdminServices;