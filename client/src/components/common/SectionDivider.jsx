import React from 'react';
import { Box } from '@mui/material';

const SectionDivider = ({ variant = 'wave' }) => {
    const variants = {
        wave: (
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#FAF5F3"/>
            </svg>
        ),
        curve: (
            <svg viewBox="0 0 1440 100" fill="none">
                <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FAF5F3"/>
            </svg>
        ),
    };
    
    return (
        <Box sx={{ width: '100%', lineHeight: 0, transform: 'translateY(-1px)' }}>
            {variants[variant]}
        </Box>
    );
};

export default SectionDivider;
