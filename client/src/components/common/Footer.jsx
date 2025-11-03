import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider
} from '@mui/material';
import {
    Instagram,
    Facebook,
    WhatsApp,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import logoWhite from '../../assets/images/logo-white.png';

const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isRTL } = useLanguage();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const quickLinks = [
        { key: 'home', path: '/' },
        { key: 'about', path: '/about' },
        { key: 'articles', path: '/articles' },
        { key: 'gallery', path: '/gallery' },
        { key: 'appointments', path: '/appointments' },
        { key: 'contact', path: '/contact' }
    ];

    const socialLinks = [
        {
            icon: <Instagram />,
            url: 'https://instagram.com/leahgenish',
            label: 'Instagram'
        },
        {
            icon: <Facebook />,
            url: 'https://facebook.com/leahgenish',
            label: 'Facebook'
        },
        {
            icon: <WhatsApp />,
            url: 'https://wa.me/972501234567',
            label: 'WhatsApp'
        }
    ];

    const contactInfo = [
        {
            icon: <Phone />,
            text: '+972-50-123-4567',
            url: 'tel:+972501234567'
        },
        {
            icon: <Email />,
            text: 'info@leahgenish.com',
            url: 'mailto:info@leahgenish.com'
        },
        {
            icon: <LocationOn />,
            text: 'רחוב הרפואה 123, תל אביב',
            url: null
        }
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'background.light',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* About Section */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Box
                                component="img"
                                src={logoWhite}
                                alt="לאה גניש"
                                sx={{
                                    height: 80,
                                    width: 'auto',
                                    objectFit: 'contain',
                                    mb: 2,
                                    filter: 'brightness(0.95)'
                                }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2, lineHeight: 1.6 }}
                            >
                                מטפלת מוסמכת ברפואה משלימה המתמחה ברפלקסולוגיה, טיפול הוליסטי ותזונה טבעית.
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2, lineHeight: 1.6 }}
                            >
                                Certified complementary medicine practitioner specializing in reflexology, holistic treatment and natural nutrition.
                            </Typography>
                        </motion.div>
                    </Grid>

                    {/* Quick Links Section */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', color: 'primary.main' }}
                            >
                                {t('footer.quickLinks')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {quickLinks.map((link) => (
                                    <Link
                                        key={link.key}
                                        component="button"
                                        variant="body2"
                                        onClick={() => handleNavigation(link.path)}
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            textAlign: isRTL ? 'right' : 'left',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                color: 'primary.main'
                                            }
                                        }}
                                    >
                                        {t(`nav.${link.key}`)}
                                    </Link>
                                ))}
                            </Box>
                        </motion.div>
                    </Grid>

                    {/* Contact Section */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', color: 'primary.main' }}
                            >
                                {t('footer.contact')}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                {contactInfo.map((info, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        {info.icon}
                                        {info.url ? (
                                            <Link
                                                href={info.url}
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                        color: 'primary.main'
                                                    }
                                                }}
                                            >
                                                {info.text}
                                            </Link>
                                        ) : (
                                            <Typography variant="body2">
                                                {info.text}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            {/* Social Media */}
                            <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
                            >
                                {t('footer.followUs')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {socialLinks.map((social, index) => (
                                    <IconButton
                                        key={index}
                                        component="a"
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        sx={{
                                            color: 'text.secondary',
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'rgba(212, 181, 176, 0.1)'
                                            }
                                        }}
                                    >
                                        {social.icon}
                                    </IconButton>
                                ))}
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Bottom Section */}
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body2" color="text.secondary">
                            © 2024 Leah Genish. {t('footer.copyright')}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleNavigation('/privacy')}
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                {t('footer.privacy')}
                            </Link>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleNavigation('/terms')}
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                {t('footer.terms')}
                            </Link>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleNavigation('/accessibility')}
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                {t('footer.accessibility')}
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
