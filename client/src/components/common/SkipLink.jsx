import React from 'react';
import { Box } from '@mui/material';

const SkipLink = () => (
    <Box
        component="a"
        href="#main-content"
        className="skip-link"
        sx={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 9999,
            padding: '1rem 2rem',
            backgroundColor: 'primary.main',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0 0 8px 8px',
            fontWeight: 600,
            '&:focus': {
                left: '50%',
                transform: 'translateX(-50%)',
                top: '10px'
            }
        }}
    >
        דלג לתוכן הראשי
    </Box>
);

export default SkipLink;
