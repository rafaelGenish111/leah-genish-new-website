import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Avatar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollReveal from '../common/ScrollReveal.jsx';

const TestimonialsCarousel = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Static testimonials data
    const testimonials = [
        {
            id: 1,
            name: 'שרה כהן',
            rating: 5,
            text: 'ליאה היא מטפלת מדהימה! הטיפול שלה עזר לי מאוד עם הכאבים הכרוניים. היא מקצועית, חמה ומבינה.',
            date: '2024-09',
            avatar: null
        },
        {
            id: 2,
            name: 'מיכל לוי',
            rating: 5,
            text: 'הטיפול ברפלקסולוגיה של ליאה שינה לי את החיים. אני מרגישה הרבה יותר רגועה ובריאה.',
            date: '2024-08',
            avatar: null
        },
        {
            id: 3,
            name: 'רחל אברהם',
            rating: 5,
            text: 'ליאה מטפלת מוכשרת וקשובה. היא עוזרת לי להתמודד עם הלחץ והחרדה. מומלץ בחום!',
            date: '2024-07',
            avatar: null
        },
        {
            id: 4,
            name: 'דנה שמש',
            rating: 5,
            text: 'הטיפול ההוליסטי של ליאה עזר לי לחזור לאיזון. היא מבינה את הגוף והנפש בצורה מדהימה.',
            date: '2024-06',
            avatar: null
        },
        {
            id: 5,
            name: 'ענת גולד',
            rating: 5,
            text: 'הקליניקה של ליאה מקום של שלווה ורוגע. הטיפולים שלה יעילים ומרפאים. תודה רבה!',
            date: '2024-05',
            avatar: null
        }
    ];

    return (
        <Box sx={{ py: 12, backgroundColor: '#FAF5F3' }}>
            <Container maxWidth="lg">
                <ScrollReveal>
                    <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 'bold', color: 'primary.main' }}>
                        {t('home.testimonials.title')}
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
                        {t('home.testimonials.subtitle')}
                    </Typography>
                </ScrollReveal>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    style={{ padding: '20px 0 60px' }}
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={testimonial.id}>
                            <Card
                                component={motion.div}
                                whileHover={{ y: -5 }}
                                sx={{
                                    height: 350,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    background: 'white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ textAlign: 'center', mb: 3, flex: 1 }}>
                                        <Avatar
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                mx: 'auto',
                                                mb: 2,
                                                bgcolor: 'primary.light',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {testimonial.name.charAt(0)}
                                        </Avatar>

                                        {/* Animated Stars */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 3 }}>
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                                >
                                                    <StarIcon sx={{ color: '#FFB400', fontSize: 24 }} />
                                                </motion.div>
                                            ))}
                                        </Box>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontStyle: 'italic',
                                                color: 'text.secondary',
                                                mb: 3,
                                                lineHeight: 1.6,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            "{testimonial.text}"
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                                            — {testimonial.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                            {testimonial.date}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </Box>
    );
};

export default TestimonialsCarousel;