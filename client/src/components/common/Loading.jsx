import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { motion } from 'framer-motion';

const Loading = ({ message = 'טוען...', fullScreen = true }) => {
    return (
        <Fade in={true}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    ...(fullScreen && {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9999
                    }),
                    ...(!fullScreen && {
                        py: 4
                    })
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: 'primary.main',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            }
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                    >
                        {message}
                    </Typography>
                </motion.div>
            </Box>
        </Fade>
    );
};

export default Loading;
