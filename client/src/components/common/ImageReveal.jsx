import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { motion, useInView } from 'framer-motion';

const ImageReveal = ({ src, alt }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <Box
            ref={ref}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
            }}
        >
            {/* Reveal Overlay */}
            <Box
                component={motion.div}
                initial={{ scaleX: 1 }}
                animate={isInView ? { scaleX: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: '#1A1A1A',
                    transformOrigin: 'right',
                    zIndex: 2,
                }}
            />

            {/* Image */}
            <Box
                component={motion.img}
                src={src}
                alt={alt}
                initial={{ scale: 1.2 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.5 }}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </Box>
    );
};

export default ImageReveal;
