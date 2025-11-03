import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Paper,
    LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Event as EventIcon,
    Article as ArticleIcon,
    People as PeopleIcon,
    Description as DescriptionIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { adminService } from '../../services/adminService.js';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        appointments: { total: 0 },
        articles: { total: 0 },
        visitors: { total: 0 },
        declarations: { total: 0 }
    });
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [servicesData, setServicesData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await adminService.getStats();

                setStats({
                    appointments: { total: data.counts.appointments },
                    articles: { total: data.counts.articles },
                    visitors: { total: 0 }, // אין כרגע אנליטיקס, נשאיר 0
                    declarations: { total: data.counts.healthDeclarations }
                });

                // timeseries -> recharts data
                const ts = (data.timeseries || []).map(d => ({
                    name: d._id?.substring(5) || '',
                    תורים: d.count
                }));
                setAppointmentsData(ts);

                // top services -> pie data
                const pie = (data.topServices || []).map(s => ({
                    name: s.name_he,
                    value: s.count
                }));
                setServicesData(pie);
            } catch (e) {
                // fallback silent
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const COLORS = ['#D4B5B0', '#8B7B7A', '#C9A9A4', '#A89997'];

    const recentAppointments = [
        {
            id: 1,
            client: 'שרה כהן',
            service: 'רפלקסולוגיה',
            date: '2024-10-25',
            time: '10:00',
            status: 'confirmed'
        },
        {
            id: 2,
            client: 'דוד לוי',
            service: 'טיפול הוליסטי',
            date: '2024-10-25',
            time: '14:00',
            status: 'pending'
        },
        {
            id: 3,
            client: 'רחל אברהם',
            service: 'ייעוץ תזונתי',
            date: '2024-10-26',
            time: '11:30',
            status: 'confirmed'
        }
    ];

    const StatCard = ({ title, value, change, icon, color }) => (
        <Card
            component={motion.div}
            whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: 4,
                    background: `linear-gradient(90deg, ${color}FF 0%, ${color}00 100%)`
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: `${color}20`,
                            color: color,
                            width: 50,
                            height: 50
                        }}
                    >
                        {icon}
                    </Avatar>
                    {change !== undefined && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: change >= 0 ? 'success.main' : 'error.main'
                            }}
                        >
                            {change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            <Typography variant="body2" fontWeight={600}>
                                {Math.abs(change)}%
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );

    const statusColors = {
        confirmed: 'success',
        pending: 'warning',
        cancelled: 'error',
        completed: 'default'
    };

    const statusLabels = {
        confirmed: 'מאושר',
        pending: 'ממתין',
        cancelled: 'בוטל',
        completed: 'הושלם'
    };

    return (
        <Box>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    שלום, לאה 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    הנה מה קורה היום במרפאה שלך
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="תורים החודש"
                        value={stats.appointments.total}
                        change={stats.appointments.change}
                        icon={<EventIcon />}
                        color="#D4B5B0"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="מאמרים פורסמו"
                        value={stats.articles.total}
                        change={stats.articles.change}
                        icon={<ArticleIcon />}
                        color="#8B7B7A"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="מבקרים באתר"
                        value={stats.visitors.total}
                        change={stats.visitors.change}
                        icon={<PeopleIcon />}
                        color="#C9A9A4"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="הצהרות בריאות"
                        value={stats.declarations.total}
                        change={stats.declarations.change}
                        icon={<DescriptionIcon />}
                        color="#A89997"
                    />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Appointments Chart */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    תורים לפי חודש
                                </Typography>
                                <IconButton size="small">
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={appointmentsData}>
                                    <defs>
                                        <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4B5B0" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4B5B0" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="תורים"
                                        stroke="#D4B5B0"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorAppointments)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Services Distribution */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                התפלגות שירותים
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={servicesData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {servicesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Appointments Table */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            תורים אחרונים
                        </Typography>
                        <Button variant="text" color="primary">
                            צפה בכל התורים
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>לקוח</TableCell>
                                    <TableCell>שירות</TableCell>
                                    <TableCell>תאריך</TableCell>
                                    <TableCell>שעה</TableCell>
                                    <TableCell>סטטוס</TableCell>
                                    <TableCell align="left">פעולות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentAppointments.map((appointment) => (
                                    <TableRow
                                        key={appointment.id}
                                        component={motion.tr}
                                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                                    {appointment.client[0]}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {appointment.client}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{appointment.service}</TableCell>
                                        <TableCell>{appointment.date}</TableCell>
                                        <TableCell>{appointment.time}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabels[appointment.status]}
                                                color={statusColors[appointment.status]}
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton size="small">
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ArticleIcon />}
                        sx={{
                            py: 2,
                            borderRadius: 3,
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.lighter'
                            }
                        }}
                    >
                        מאמר חדש
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EventIcon />}
                        sx={{
                            py: 2,
                            borderRadius: 3,
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.lighter'
                            }
                        }}
                    >
                        תור חדש
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PeopleIcon />}
                        sx={{
                            py: 2,
                            borderRadius: 3,
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.lighter'
                            }
                        }}
                    >
                        העלאת תמונות
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DescriptionIcon />}
                        sx={{
                            py: 2,
                            borderRadius: 3,
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.lighter'
                            }
                        }}
                    >
                        צפה בהצהרות
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;