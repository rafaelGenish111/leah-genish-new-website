import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';

// Import components
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Loading from './components/common/Loading.jsx';
import LoadingAnimation from './components/common/LoadingAnimation.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import SkipLink from './components/common/SkipLink.jsx';

// Import pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Articles from './pages/Articles.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Appointments from './pages/Appointments.jsx';
import HealthDeclaration from './pages/HealthDeclaration.jsx';
import Contact from './pages/Contact.jsx';
import Accessibility from './pages/Accessibility.jsx';
import Login from './pages/Login.jsx';

// Import admin pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminArticles from './pages/admin/AdminArticles.jsx';
import AdminGallery from './pages/admin/AdminGallery.jsx';
import AdminAppointments from './pages/admin/AdminAppointments.jsx';
import AdminHealth from './pages/admin/AdminHealth.jsx';
import AdminServices from './pages/admin/AdminServices.jsx';
import AdminAvailability from './pages/admin/AdminAvailability.jsx';
import AdminExceptions from './pages/admin/AdminExceptions.jsx';

// Import layouts
import AdminLayout from './layouts/AdminLayout.jsx';

// Import theme
import theme from './theme/theme.js';
import englishTheme from './theme/theme.js';
import { useLanguage } from './context/LanguageContext.jsx';

// Protected Route component
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

function AppContent() {
    const { language } = useLanguage();
    const currentTheme = language === 'en' ? englishTheme : theme;

    // Update document language and direction
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    }, [language]);

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <ErrorBoundary>
                <Router>
                    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} lang={language}>
                        <SkipLink />
                        <Navbar />

                        <main id="main-content" role="main" tabIndex="-1" style={{ flex: 1 }}>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/articles" element={<Articles />} />
                                <Route path="/articles/:id" element={<ArticleDetail />} />
                                <Route path="/gallery" element={<Gallery />} />
                                <Route path="/appointments" element={<Appointments />} />
                                <Route path="/health-declaration" element={<HealthDeclaration />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/accessibility" element={<Accessibility />} />
                                <Route path="/login" element={<Login />} />

                                {/* Admin Login */}
                                <Route path="/admin/login" element={<AdminLogin />} />

                                {/* Admin routes with layout */}
                                <Route path="/admin" element={
                                    <ProtectedRoute>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }>
                                <Route index element={<AdminDashboard />} />
                                <Route path="articles" element={<AdminArticles />} />
                                <Route path="articles/new" element={<div>Article Editor - Coming Soon</div>} />
                                <Route path="articles/:id/edit" element={<div>Article Editor - Coming Soon</div>} />
                                <Route path="gallery" element={<AdminGallery />} />
                                <Route path="appointments" element={<AdminAppointments />} />
                                <Route path="health" element={<AdminHealth />} />
                                <Route path="services" element={<AdminServices />} />
                                <Route path="availability" element={<AdminAvailability />} />
                                <Route path="exceptions" element={<AdminExceptions />} />
                                </Route>

                                {/* 404 route */}
                                <Route path="*" element={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '50vh',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}>
                                        <h1>404</h1>
                                        <p>Page not found</p>
                                    </div>
                                } />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <HelmetProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </LanguageProvider>
        </HelmetProvider>
    );
}

export default App;
