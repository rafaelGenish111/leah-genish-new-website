import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Skeleton,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ArrowForward,
    AccessTime,
    Visibility,
    Person
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { articlesService } from '../../services/articlesService.js';
import ScrollReveal from '../common/ScrollReveal.jsx';

const LatestArticle = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLatestArticle();
    }, []);

    const fetchLatestArticle = async () => {
        try {
            setLoading(true);
            const articles = await articlesService.getPublishedArticles({ limit: 1 });
            if (articles && articles.length > 0) {
                setArticle(articles[0]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReadMore = () => {
        if (article) {
            navigate(`/articles/${article._id}`);
        }
    };

    const getArticleTitle = (article) => {
        return language === 'he' ? article.title_he : article.title_en;
    };

    const getArticleExcerpt = (article) => {
        const excerpt = language === 'he' ? article.excerpt_he : article.excerpt_en;
        return excerpt || (language === 'he' ? article.content_he : article.content_en).substring(0, 200) + '...';
    };

    const getCategoryName = (category) => {
        const categories = {
            'nutrition': 'תזונה',
            'holistic': 'הוליסטי',
            'lifestyle': 'אורח חיים',
            'reflexology': 'רפלקסולוגיה',
            'other': 'אחר'
        };
        return categories[category] || category;
    };

    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    if (error) {
        return (
            <Box sx={{ py: 8, backgroundColor: 'white' }}>
                <Container maxWidth="lg">
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 12, backgroundColor: 'white' }}>
            <Container maxWidth="lg">
                <ScrollReveal>
                    <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 'bold', color: 'primary.main' }}>
                        {t('home.latestArticle.title')}
                    </Typography>
                </ScrollReveal>

                {loading ? (
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
                            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="text" height={100} sx={{ mb: 3 }} />
                            <Skeleton variant="rectangular" height={50} width={150} />
                        </Grid>
                    </Grid>
                ) : article ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <Grid container>
                                {/* Image Side */}
                                <Grid item xs={12} md={5}>
                                    <Box sx={{ position: 'relative', height: { xs: 250, md: 400 } }}>
                                        <CardMedia
                                            component="img"
                                            height="100%"
                                            image={article.featuredImage || 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={getArticleTitle(article)}
                                            sx={{
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />

                                        {/* Category Badge */}
                                        <Chip
                                            label={getCategoryName(article.category)}
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                left: 16,
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Content Side */}
                                <Grid item xs={12} md={7}>
                                    <CardContent sx={{ p: 6, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Typography
                                            variant="h4"
                                            component="h2"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                mb: 3,
                                                fontSize: { xs: '1.8rem', md: '2.2rem' },
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {getArticleTitle(article)}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: '1.1rem',
                                                lineHeight: 1.7,
                                                color: 'text.secondary',
                                                mb: 4,
                                                flex: 1
                                            }}
                                        >
                                            {getArticleExcerpt(article)}
                                        </Typography>

                                        {/* Meta Information */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Person sx={{ fontSize: 18, color: 'primary.main' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {article.author?.name || 'ליאה גניש'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTime sx={{ fontSize: 18, color: 'primary.main' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {calculateReadTime(language === 'he' ? article.content_he : article.content_en)} דקות קריאה
                                                </Typography>
                                            </Box>

                                            {article.views > 0 && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Visibility sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {article.views} צפיות
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Read More Button */}
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleReadMore}
                                            endIcon={<ArrowForward />}
                                            component={motion.button}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            sx={{
                                                borderRadius: '25px',
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                textTransform: 'none',
                                                boxShadow: '0 4px 16px rgba(212, 181, 176, 0.4)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px rgba(212, 181, 176, 0.6)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease',
                                                alignSelf: 'flex-start'
                                            }}
                                        >
                                            {t('home.latestArticle.readMore')}
                                        </Button>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </motion.div>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            {t('home.latestArticle.noArticles')}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default LatestArticle;