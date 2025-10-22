import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Spa } from '@mui/icons-material';

const LoadingAnimation = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: '#FAF5F3'
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ marginBottom: '2rem' }}
            >
                <Spa sx={{ fontSize: 60, color: '#D4B5B0' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: '#8B7B7A',
                        fontWeight: 300,
                        letterSpacing: 2
                    }}
                >
                    טוען...
                </Typography>
            </motion.div>
        </Box>
    );
};

export default LoadingAnimation;
