import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import logoWhite from '../../assets/images/logo-white.png';

/**
 * Logo Component
 * 
 * @param {number} size - גודל הלוגו (ברירת מחדל: 120)
 * @param {string} variant - 'light' או 'dark' (ברירת מחדל: 'dark')
 * @param {boolean} clickable - האם הלוגו ניתן ללחיצה (ברירת מחדל: true)
 * @param {object} sx - MUI sx props נוספים
 */

const Logo = ({ 
    size = 120, 
    variant = 'dark',
    clickable = true,
    sx = {} 
}) => {
    const LogoImage = () => (
        <Box
            component="img"
            src={variant === 'light' ? logoWhite : logo}
            alt="לאה גניש - רפואה משלימה"
            sx={{
                width: size,
                height: 'auto',
                objectFit: 'contain',
                ...sx
            }}
        />
    );

    if (clickable) {
        return (
            <Box
                component={Link}
                to="/"
                sx={{
                    display: 'inline-flex',
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)'
                    }
                }}
            >
                <LogoImage />
            </Box>
        );
    }

    return <LogoImage />;
};

export default Logo;

