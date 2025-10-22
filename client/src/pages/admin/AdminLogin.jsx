import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Alert,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Spa
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import { useForm } from 'react-hook-form';

const AdminLogin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { login, isAuthenticated } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            await login(data.email, data.password);
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || t('errors.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    const quotes = [
        {
            text: t('admin.login.quotes.quote1.text'),
            author: t('admin.login.quotes.quote1.author')
        },
        {
            text: t('admin.login.quotes.quote2.text'),
            author: t('admin.login.quotes.quote2.author')
        },
        {
            text: t('admin.login.quotes.quote3.text'),
            author: t('admin.login.quotes.quote3.author')
        }
    ];

    const [currentQuote, setCurrentQuote] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Left Side - Visual */}
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    background: 'linear-gradient(135deg, #D4B5B0 0%, #8B7B7A 100%)',
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Animated Background Pattern */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        width: '150%',
                        height: '150%',
                        opacity: 0.1,
                        backgroundImage: 'url(/lotus-pattern.svg)',
                        backgroundSize: '200px'
                    }}
                />

                {/* Floating Lotus Icons */}
                <motion.div
                    animate={{
                        y: [-10, 10, -10],
                        rotate: [0, 360, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '10%',
                        opacity: 0.3
                    }}
                >
                    <Spa sx={{ fontSize: 60, color: 'white' }} />
                </motion.div>

                <motion.div
                    animate={{
                        y: [10, -10, 10],
                        rotate: [360, 0, 360]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '15%',
                        opacity: 0.2
                    }}
                >
                    <Spa sx={{ fontSize: 80, color: 'white' }} />
                </motion.div>

                {/* Quote */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        color: 'white',
                        textAlign: 'center',
                        px: 8
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuote}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontStyle: 'italic',
                                    fontWeight: 300,
                                    mb: 3,
                                    lineHeight: 1.6,
                                    fontSize: { xs: '2rem', md: '3rem' }
                                }}
                            >
                                "{quotes[currentQuote].text}"
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 300,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                                }}
                            >
                                — {quotes[currentQuote].author}
                            </Typography>
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box
                sx={{
                    flex: { xs: 1, md: 0.6 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#FAFAFA',
                    p: 4
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        sx={{
                            maxWidth: 450,
                            width: '100%',
                            p: 5,
                            borderRadius: 4,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                        }}
                    >
                        {/* Logo */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{ display: 'inline-block' }}
                            >
                                <Spa sx={{ fontSize: 60, color: '#D4B5B0', mb: 2 }} />
                            </motion.div>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 300,
                                    mb: 1,
                                    fontSize: { xs: '1.75rem', md: '2.125rem' }
                                }}
                            >
                                {t('admin.login.title')}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                            >
                                {t('admin.login.subtitle')}
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        {error}
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                fullWidth
                                label={t('admin.login.email')}
                                type="email"
                                {...register('email', {
                                    required: t('admin.login.errors.emailRequired'),
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: t('admin.login.errors.emailInvalid')
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label={t('admin.login.password')}
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: t('admin.login.errors.passwordRequired'),
                                    minLength: {
                                        value: 6,
                                        message: t('admin.login.errors.passwordMinLength')
                                    }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 2 }}
                            />

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <FormControlLabel
                                    control={<Checkbox {...register('rememberMe')} />}
                                    label={t('admin.login.rememberMe')}
                                />
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ textTransform: 'none' }}
                                >
                                    {t('admin.login.forgotPassword')}
                                </Button>
                            </Box>

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                                    color: 'white',
                                    py: 1.5,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderRadius: '25px',
                                    boxShadow: '0 4px 15px rgba(212, 181, 176, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(212, 181, 176, 0.4)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                                        opacity: 0.6
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    t('admin.login.loginButton')
                                )}
                            </Button>
                        </form>

                        {/* Back to Site Link */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/')}
                                sx={{
                                    color: 'text.secondary',
                                    textTransform: 'none',
                                    fontSize: 14
                                }}
                            >
                                {t('admin.login.backToSite')}
                            </Button>
                        </Box>
                    </Card>
                </motion.div>
            </Box>
        </Box>
    );
};

export default AdminLogin;
