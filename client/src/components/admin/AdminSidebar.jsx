import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
    Divider,
    Collapse,
    Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dashboard as DashboardIcon,
    Article as ArticleIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Event as EventIcon,
    Description as DescriptionIcon,
    MedicalServices as MedicalServicesIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ExpandLess,
    ExpandMore,
    Spa,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminSidebar = ({ open, onClose, isMobile }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [articlesOpen, setArticlesOpen] = useState(false);

    const menuItems = [
        {
            title: t('admin.sidebar.dashboard'),
            icon: <DashboardIcon />,
            path: '/admin/dashboard'
        },
        {
            title: t('admin.sidebar.articles'),
            icon: <ArticleIcon />,
            path: '/admin/articles',
            submenu: [
                { title: t('admin.sidebar.allArticles'), path: '/admin/articles' },
                { title: t('admin.sidebar.newArticle'), path: '/admin/articles/new' }
            ]
        },
        {
            title: t('admin.sidebar.gallery'),
            icon: <PhotoLibraryIcon />,
            path: '/admin/gallery'
        },
        {
            title: t('admin.sidebar.appointments'),
            icon: <EventIcon />,
            path: '/admin/appointments',
            badge: 5 // Number of pending appointments
        },
        {
            title: t('admin.sidebar.healthDeclarations'),
            icon: <DescriptionIcon />,
            path: '/admin/health'
        },
        {
            title: t('admin.sidebar.services'),
            icon: <MedicalServicesIcon />,
            path: '/admin/services'
        },
        {
            title: 'זמינות',
            icon: <ScheduleIcon />,
            path: '/admin/availability'
        },
        {
            title: 'חריגות',
            icon: <WarningIcon />,
            path: '/admin/exceptions'
        },
        {
            title: 'הגדרות Calendly',
            icon: <CalendarMonthIcon />,
            path: '/admin/calendly'
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // רוחב קבוע; בעת סגירה (open=false) ה-Drawer נסתר לגמרי
    const drawerWidth = 280;

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#F7F7F7',
                color: '#1A1A1A'
            }}
        >
            {/* Logo & User Info */}
            <Box sx={{ p: 3, pb: 2 }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            textDecoration: 'none',
                            color: 'inherit',
                            mb: 3
                        }}
                    >
                        <Spa sx={{ fontSize: 32, color: 'primary.main' }} />
                        {open && (
                            <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                Leah Genish
                            </Typography>
                        )}
                    </Box>

                    {/* User Profile */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 45,
                                height: 45,
                                bgcolor: 'primary.main',
                                fontWeight: 600
                            }}
                        >
                            {user?.name?.[0] || 'L'}
                        </Avatar>
                        {open && (
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {user?.name || 'Leah Genish'}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'block'
                                    }}
                                >
                                    {user?.email || 'admin@leahgenish.com'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </motion.div>
            </Box>
            <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

            {/* Navigation Menu */}
            <List sx={{ flex: 1, py: 2, px: 2 }}>
                {menuItems.map((item, index) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Box sx={{ mb: 0.5 }}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={item.submenu ? 'button' : Link}
                                    to={!item.submenu ? item.path : undefined}
                                    onClick={item.submenu ? () => setArticlesOpen(!articlesOpen) : onClose}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        borderRadius: 2,
                                        color: location.pathname === item.path
                                            ? '#D4B5B0'
                                            : '#505050',
                                        bgcolor: location.pathname === item.path
                                            ? 'rgba(212, 181, 176, 0.15)'
                                            : 'transparent',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: location.pathname === item.path
                                                ? 'rgba(212, 181, 176, 0.2)'
                                                : 'rgba(0,0,0,0.04)',
                                            transform: 'translateX(4px)'
                                        },
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(212, 181, 176, 0.15)',
                                            '&:hover': {
                                                bgcolor: 'rgba(212, 181, 176, 0.2)'
                                            }
                                        },
                                        py: 1.5
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: 'inherit',
                                            minWidth: 40
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {open && (
                                        <ListItemText
                                            primary={item.title}
                                            primaryTypographyProps={{
                                                fontSize: 15,
                                                fontWeight: location.pathname === item.path ? 500 : 400
                                            }}
                                        />
                                    )}
                                    {item.badge && (
                                        <Badge
                                            badgeContent={item.badge}
                                            color="error"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.75rem',
                                                    height: '18px',
                                                    minWidth: '18px'
                                                }
                                            }}
                                        />
                                    )}
                                    {open && item.submenu && (
                                        articlesOpen ? <ExpandLess /> : <ExpandMore />
                                    )}
                                </ListItemButton>
                            </ListItem>

                            {/* Submenu */}
                            <AnimatePresence>
                                {open && item.submenu && (
                                    <Collapse in={articlesOpen} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.submenu.map((subItem, subIndex) => (
                                                <motion.div
                                                    key={subItem.path}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ duration: 0.2, delay: subIndex * 0.1 }}
                                                >
                                                    <ListItem key={subItem.path} disablePadding sx={{ pl: 2 }}>
                                                        <ListItemButton
                                                            component={Link}
                                                            to={subItem.path}
                                                            onClick={onClose}
                                                            selected={location.pathname === subItem.path}
                                                            sx={{
                                                                borderRadius: 2,
                                                                py: 1,
                                                                color: location.pathname === subItem.path
                                                                    ? '#D4B5B0'
                                                                    : '#505050',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(0,0,0,0.04)',
                                                                    transform: 'translateX(4px)'
                                                                }
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={subItem.title}
                                                                primaryTypographyProps={{
                                                                    fontSize: 14
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </motion.div>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </AnimatePresence>
                        </Box>
                    </motion.div>
                ))}
            </List>

            <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

            {/* Bottom Actions */}
            <Box sx={{ p: 2 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <ListItemButton
                        sx={{
                            borderRadius: 2,
                            color: 'text.primary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.04)',
                                transform: 'translateX(4px)'
                            },
                            mb: 1
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('admin.sidebar.settings')} />}
                    </ListItemButton>

                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            color: '#F44336',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                transform: 'translateX(4px)'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('admin.sidebar.logout')} />}
                    </ListItemButton>
                </motion.div>
            </Box>

        </Box>
    );

    return (
        <>
            {isMobile ? (
                <Drawer
                    anchor="right"
                    open={open}
                    onClose={onClose}
                    PaperProps={{
                        sx: {
                            width: 280,
                            bgcolor: '#F7F7F7'
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    anchor="right"
                    variant="temporary"
                    open={open}
                    onClose={onClose}
                    PaperProps={{
                        sx: {
                            width: drawerWidth,
                            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                            bgcolor: '#F7F7F7'
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

export default AdminSidebar;
