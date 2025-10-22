import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console or error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ error }) => {
    const { t } = useTranslation();
    let navigate;
    try {
        // useNavigate only works under Router; guard for safety
        navigate = useNavigate();
    } catch (e) {
        navigate = null;
    }

    const handleGoHome = () => {
        if (navigate) navigate('/');
        else window.location.href = '/';
    };

    const handleTryAgain = () => {
        window.location.reload();
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    py: 4
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            backgroundColor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            mx: 'auto'
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'bold'
                            }}
                        >
                            ⚠️
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 2
                        }}
                    >
                        {t('errors.serverError')}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: 500,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        {t('errors.tryAgain')}
                    </Typography>

                    {process.env.NODE_ENV === 'development' && error && (
                        <Box
                            sx={{
                                backgroundColor: 'grey.100',
                                p: 2,
                                borderRadius: 1,
                                mb: 3,
                                textAlign: 'left',
                                maxWidth: 600,
                                mx: 'auto'
                            }}
                        >
                            <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                                {error.toString()}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={handleTryAgain}
                            sx={{ minWidth: 120 }}
                        >
                            {t('errors.tryAgain')}
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleGoHome}
                            sx={{ minWidth: 120 }}
                        >
                            {t('errors.goHome')}
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Container>
    );
};

export default ErrorBoundary;
