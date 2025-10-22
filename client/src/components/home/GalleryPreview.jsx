import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Skeleton,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ArrowForward,
    Search as SearchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { galleryService } from '../../services/galleryService.js';
import ScrollReveal from '../common/ScrollReveal.jsx';

const GalleryPreview = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const galleryImages = await galleryService.getImages({ limit: 6 });
            setImages(galleryImages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewFullGallery = () => {
        navigate('/gallery');
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getImageTitle = (image) => {
        return language === 'he' ? image.title_he : image.title_en;
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
        <>
            <Box sx={{ py: 12, backgroundColor: 'white' }}>
                <Container maxWidth="lg">
                    <ScrollReveal>
                        <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 'bold', color: 'primary.main' }}>
                            {t('home.gallery.title')}
                        </Typography>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 6,
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            {t('home.gallery.subtitle')}
                        </Typography>
                    </ScrollReveal>

                    <Grid container spacing={2}>
                        {loading ? (
                            // Loading skeletons
                            Array.from({ length: 6 }).map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={200}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </Grid>
                            ))
                        ) : images.length > 0 ? (
                            images.map((image, index) => (
                                <Grid item xs={12} sm={6} md={4} key={image._id || index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Box
                                            onClick={() => handleImageClick(index)}
                                            sx={{
                                                position: 'relative',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                                '&:hover .overlay': {
                                                    opacity: 1
                                                },
                                                '&:hover img': {
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={image.url}
                                                alt={getImageTitle(image)}
                                                sx={{
                                                    width: '100%',
                                                    height: 200,
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    transition: 'transform 0.5s ease'
                                                }}
                                            />

                                            {/* Hover Overlay */}
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bgcolor: 'rgba(212, 181, 176, 0.9)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                }}
                                            >
                                                <SearchIcon sx={{ fontSize: 48, color: 'white' }} />
                                            </Box>

                                            {/* Image Title */}
                                            {getImageTitle(image) && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                                        p: 2
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 500,
                                                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                                        }}
                                                    >
                                                        {getImageTitle(image)}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" color="text.secondary">
                                    {t('home.gallery.noImages')}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>

                    {/* View Full Gallery Button */}
                    <ScrollReveal delay={0.4}>
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleViewFullGallery}
                                endIcon={<ArrowForward />}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                    borderRadius: '25px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(212, 181, 176, 0.4)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {t('home.gallery.viewFull')}
                            </Button>
                        </Box>
                    </ScrollReveal>
                </Container>
            </Box>

            {/* Lightbox Modal */}
            {lightboxOpen && images.length > 0 && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={closeLightbox}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <Button
                            onClick={closeLightbox}
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: 0,
                                color: 'white',
                                fontSize: '2rem',
                                minWidth: 'auto',
                                p: 1,
                                zIndex: 10000
                            }}
                        >
                            ×
                        </Button>

                        {/* Previous Button */}
                        <Button
                            onClick={prevImage}
                            sx={{
                                position: 'absolute',
                                left: -50,
                                color: 'white',
                                fontSize: '2rem',
                                minWidth: 'auto',
                                p: 1,
                                zIndex: 10000
                            }}
                        >
                            ‹
                        </Button>

                        {/* Next Button */}
                        <Button
                            onClick={nextImage}
                            sx={{
                                position: 'absolute',
                                right: -50,
                                color: 'white',
                                fontSize: '2rem',
                                minWidth: 'auto',
                                p: 1,
                                zIndex: 10000
                            }}
                        >
                            ›
                        </Button>

                        {/* Image */}
                        <Box
                            component="img"
                            src={images[selectedImageIndex]?.url}
                            alt={getImageTitle(images[selectedImageIndex])}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: 2
                            }}
                        />

                        {/* Image Counter */}
                        <Typography
                            sx={{
                                position: 'absolute',
                                bottom: -50,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        >
                            {selectedImageIndex + 1} / {images.length}
                        </Typography>

                        {/* Image Title */}
                        {getImageTitle(images[selectedImageIndex]) && (
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    bottom: -80,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    textAlign: 'center',
                                    maxWidth: '80%'
                                }}
                            >
                                {getImageTitle(images[selectedImageIndex])}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default GalleryPreview;