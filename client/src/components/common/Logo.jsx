import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Spa } from '@mui/icons-material';

/**
 * Logo Component
 * 
 * כיצד להשתמש:
 * 1. שים את קובץ הלוגו שלך ב: client/src/assets/images/logo.svg
 * 2. הסר את ההערה משורות 15-16 והוסף את הייבוא בשורה 4:
 *    import logo from '../../assets/images/logo.svg';
 * 3. החלף את האייקון MUI בתמונה האמיתית
 * 
 * @param {number} size - גודל הלוגו (ברירת מחדל: 120)
 * @param {string} variant - 'light' או 'dark' (ברירת מחדל: 'light')
 * @param {boolean} clickable - האם הלוגו ניתן ללחיצה (ברירת מחדל: true)
 */

// TODO: כאשר יש לך קובץ לוגו, הסר את ההערה:
// import logo from '../../assets/images/logo.svg';
// import logoWhite from '../../assets/images/logo-white.svg';

const Logo = ({ 
    size = 120, 
    variant = 'light',
    clickable = true,
    sx = {} 
}) => {
    // TODO: כאשר יש לך לוגו אמיתי, החלף את האייקון הזמני
    const LogoImage = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                ...sx
            }}
        >
            {/* אייקון זמני - יוחלף בלוגו אמיתי */}
            <Spa 
                sx={{ 
                    fontSize: size * 0.6,
                    color: variant === 'dark' ? '#1A1A1A' : 'white'
                }} 
            />
        </Box>
    );

    // דוגמה כיצד להשתמש בלוגו אמיתי:
    // const LogoImage = () => (
    //     <Box
    //         component="img"
    //         src={variant === 'dark' ? logo : logoWhite}
    //         alt="לאה גניש - רפואה משלימה"
    //         sx={{
    //             width: size,
    //             height: 'auto',
    //             objectFit: 'contain',
    //             ...sx
    //         }}
    //     />
    // );

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

