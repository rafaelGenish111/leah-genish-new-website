import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Box } from '@mui/material';
import { motion } from 'framer-motion';

// Import home components
import HeroSection from '../components/home/HeroSection.jsx';
import AboutPreview from '../components/home/AboutPreview.jsx';
import ServicesPreview from '../components/home/ServicesPreview.jsx';
import QuoteSection from '../components/home/QuoteSection.jsx';
import GalleryPreview from '../components/home/GalleryPreview.jsx';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel.jsx';
import LatestArticle from '../components/home/LatestArticle.jsx';

// Import SEO component
import SEO from '../components/common/SEO.jsx';

const Home = () => {
    // Page transition animation
    const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    return (
        <>
            <SEO
                title="Leah Genish - רפואה משלימה וטיפול הוליסטי"
                description="ליאה גניש - מטפלת מוסמכת ברפואה משלימה, רפלקסולוגיה וטיפול הוליסטי. קבעו תור לטיפול מקצועי ואישי."
                keywords="רפואה משלימה, רפלקסולוגיה, טיפול הוליסטי, ליאה גניש, מטפלת, בריאות טבעית"
                type="website"
            />

            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                {/* Hero Section */}
                <HeroSection />

                {/* About Preview */}
                <AboutPreview />

                {/* Services Preview */}
                <ServicesPreview />

                {/* Quote Section */}
                <QuoteSection />

                {/* Gallery Preview */}
                <GalleryPreview />

                {/* Testimonials Carousel */}
                <TestimonialsCarousel />

                {/* Latest Article */}
                <LatestArticle />
            </motion.div>
        </>
    );
};

export default Home;