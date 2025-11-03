import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    InputBase,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Breadcrumbs,
    Link,
    Typography,
    Divider,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    alpha,
    styled
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    MoreVert as MoreVertIcon,
    NavigateNext as NavigateNextIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: alpha(theme.palette.common.black, 0.04),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.06),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    transition: 'all 0.3s ease'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 1, 1.5, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
            '&:focus': {
                width: '40ch',
            },
        },
    },
}));

const AdminHeader = ({ onMenuClick, sidebarOpen }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);

    // Breadcrumb mapping
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbNameMap = {
        admin: t('admin.title'),
        dashboard: t('admin.sidebar.dashboard'),
        articles: t('admin.sidebar.articles'),
        new: t('admin.sidebar.newArticle'),
        edit: 'עריכה',
        gallery: t('admin.sidebar.gallery'),
        appointments: t('admin.sidebar.appointments'),
        health: t('admin.sidebar.healthDeclarations'),
        services: t('admin.sidebar.services'),
        settings: t('admin.sidebar.settings')
    };

    const notifications = [
        {
            id: 1,
            title: 'תור חדש',
            message: 'שרה כהן קבעה תור לרפלקסולוגיה',
            time: 'לפני 5 דקות',
            unread: true
        },
        {
            id: 2,
            title: 'הצהרת בריאות חדשה',
            message: 'דוד לוי מילא הצהרת בריאות',
            time: 'לפני 30 דקות',
            unread: true
        },
        {
            id: 3,
            title: 'מאמר חדש',
            message: 'המאמר "תזונה נכונה" פורסם',
            time: 'לפני שעה',
            unread: false
        }
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenuOpen = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationMenuClose = () => {
        setNotificationAnchor(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'white',
                borderBottom: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                {/* Menu Button */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onMenuClick}
                >
                    <MenuIcon />
                </IconButton>

                {/* Breadcrumbs */}
                <Box sx={{ display: { xs: 'none', sm: 'block' }, flex: 1 }}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                    >
                        {pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1;
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            const label = breadcrumbNameMap[value] || value;

                            return last ? (
                                <Typography
                                    key={to}
                                    color="primary"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {label}
                                </Typography>
                            ) : (
                                <Link
                                    key={to}
                                    underline="hover"
                                    color="text.secondary"
                                    href={to}
                                    sx={{
                                        '&:hover': {
                                            color: 'primary.main'
                                        }
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                </Box>

                {/* Search Bar */}
                <Search sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="חיפוש..."
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>

                {/* Search Icon (Mobile) */}
                <IconButton
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                    <SearchIcon />
                </IconButton>

                {/* Notifications */}
                <IconButton
                    color="inherit"
                    onClick={handleNotificationMenuOpen}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationMenuClose}
                    PaperProps={{
                        sx: {
                            width: 360,
                            maxHeight: 400,
                            mt: 1.5
                        }
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {t('admin.header.notifications')}
                        </Typography>
                    </Box>
                    <Divider />
                    {notifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            sx={{
                                py: 1.5,
                                px: 2,
                                bgcolor: notif.unread ? 'action.hover' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'action.selected'
                                }
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {notif.title}
                                    </Typography>
                                    {notif.unread && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main'
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {notif.message}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    {notif.time}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem sx={{ justifyContent: 'center', py: 1.5 }}>
                        <Typography variant="body2" color="primary">
                            צפה בכל ההתראות
                        </Typography>
                    </MenuItem>
                </Menu>

                {/* User Menu */}
                <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ p: 0 }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor: 'primary.main'
                        }}
                    >
                        {user?.name?.[0] || 'L'}
                    </Avatar>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                        sx: {
                            width: 200,
                            mt: 1.5
                        }
                    }}
                >
                    <MenuItem onClick={() => navigate('/admin/profile')}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('admin.header.profile')} />
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/settings')}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('admin.header.settings')} />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <LogoutIcon sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        <ListItemText primary={t('admin.header.logout')} />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default AdminHeader;