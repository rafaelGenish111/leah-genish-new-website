import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import Loading from '../components/common/Loading.jsx';

const AdminLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('adminSidebarOpen');
        return saved === null ? !isMobile : saved === 'true';
    });

    // Close sidebar on mobile when route changes
    useEffect(() => {
        if (isMobile) setSidebarOpen(false);
    }, [isMobile]);

    useEffect(() => {
        localStorage.setItem('adminSidebarOpen', String(sidebarOpen));
    }, [sidebarOpen]);

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAFAFA' }}>
            {/* Sidebar */}
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    transition: 'margin 0.3s ease, width 0.3s ease',
                    ml: { md: 0 },
                    width: { md: `calc(100% - ${sidebarOpen ? 280 : 80}px)` }
                }}
            >
                {/* Header */}
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Outlet />
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
};

export default AdminLayout;
