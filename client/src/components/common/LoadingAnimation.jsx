import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Spa } from '@mui/icons-material';

const LoadingAnimation = () => {
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

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
            aria-label="טוען..."
            role="status"
        >
            <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ 
                    duration: prefersReducedMotion ? 0.01 : 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
                style={{ marginBottom: '2rem' }}
                aria-hidden="true"
            >
                <Spa sx={{ fontSize: 60, color: '#D4B5B0' }} />
            </motion.div>

            <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.8 }}
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
