import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    Tabs,
    Tab,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Typography,
    Grid,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/he';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventIcon from '@mui/icons-material/Event';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';

moment.locale('he');
const localizer = momentLocalizer(moment);

const AdminAppointments = () => {
    const { t } = useTranslation();
    const [view, setView] = useState('calendar'); // calendar, list, today
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data for now
    useEffect(() => {
        const mockAppointments = [
            {
                _id: '1',
                clientName: 'שרה כהן',
                clientEmail: 'sarah@example.com',
                clientPhone: '050-123-4567',
                serviceType: { name_he: 'רפלקסולוגיה' },
                date: '2024-10-25',
                time: '10:00',
                duration: 60,
                status: 'confirmed',
                arrived: false,
                notes: 'לקוחה חוזרת',
                createdAt: '2024-10-20T10:00:00Z'
            },
            {
                _id: '2',
                clientName: 'דוד לוי',
                clientEmail: 'david@example.com',
                clientPhone: '052-987-6543',
                serviceType: { name_he: 'טיפול הוליסטי' },
                date: '2024-10-25',
                time: '14:00',
                duration: 90,
                status: 'pending',
                arrived: false,
                notes: '',
                createdAt: '2024-10-22T14:30:00Z'
            },
            {
                _id: '3',
                clientName: 'רחל אברהם',
                clientEmail: 'rachel@example.com',
                clientPhone: '054-555-1234',
                serviceType: { name_he: 'ייעוץ תזונתי' },
                date: '2024-10-26',
                time: '11:30',
                duration: 45,
                status: 'confirmed',
                arrived: true,
                notes: 'מטופלת חדשה',
                createdAt: '2024-10-18T09:15:00Z'
            }
        ];
        setAppointments(mockAppointments);
    }, [statusFilter]);

    const handleSelectEvent = (event) => {
        setSelectedAppointment(event);
        setDetailsDialogOpen(true);
    };

    const handleStatusUpdate = async (newStatus) => {
        // Mock update - replace with actual API call
        setAppointments(prev =>
            prev.map(apt =>
                apt._id === selectedAppointment._id
                    ? { ...apt, status: newStatus }
                    : apt
            )
        );
        setDetailsDialogOpen(false);
    };

    const handleMarkArrived = async () => {
        // Mock update - replace with actual API call
        setAppointments(prev =>
            prev.map(apt =>
                apt._id === selectedAppointment._id
                    ? { ...apt, arrived: true }
                    : apt
            )
        );
        setDetailsDialogOpen(false);
    };

    // Transform appointments for calendar
    const calendarEvents = appointments.map(apt => ({
        ...apt,
        title: `${apt.clientName} - ${apt.serviceType?.name_he}`,
        start: new Date(apt.date + 'T' + apt.time),
        end: new Date(new Date(apt.date + 'T' + apt.time).getTime() + apt.duration * 60000),
        resource: apt
    }));

    const eventStyleGetter = (event) => {
        const statusColors = {
            pending: { backgroundColor: '#FFB74D', borderColor: '#FF9800' },
            confirmed: { backgroundColor: '#81C784', borderColor: '#4CAF50' },
            cancelled: { backgroundColor: '#E57373', borderColor: '#F44336' },
            completed: { backgroundColor: '#90A4AE', borderColor: '#607D8B' }
        };

        return {
            style: {
                ...statusColors[event.status],
                borderRadius: '5px',
                opacity: 0.9,
                color: 'white',
                border: '2px solid',
                display: 'block'
            }
        };
    };

    const todayAppointments = appointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.date === today;
    }).sort((a, b) => a.time.localeCompare(b.time));

    const statusOptions = [
        { value: 'all', label: 'הכל', count: appointments.length },
        { value: 'pending', label: 'ממתין', count: appointments.filter(a => a.status === 'pending').length },
        { value: 'confirmed', label: 'מאושר', count: appointments.filter(a => a.status === 'confirmed').length },
        { value: 'completed', label: 'הושלם', count: appointments.filter(a => a.status === 'completed').length },
        { value: 'cancelled', label: 'בוטל', count: appointments.filter(a => a.status === 'cancelled').length }
    ];

    const columns = [
        {
            field: 'clientName',
            headerName: 'לקוח',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        {params.value[0]}
                    </Avatar>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'serviceType',
            headerName: 'שירות',
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => params.row.serviceType?.name_he || 'לא צוין'
        },
        {
            field: 'date',
            headerName: 'תאריך',
            width: 130,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString('he-IL')
        },
        {
            field: 'time',
            headerName: 'שעה',
            width: 100
        },
        {
            field: 'status',
            headerName: 'סטטוס',
            width: 120,
            renderCell: (params) => {
                const statusConfig = {
                    pending: { label: 'ממתין', color: 'warning' },
                    confirmed: { label: 'מאושר', color: 'success' },
                    cancelled: { label: 'בוטל', color: 'error' },
                    completed: { label: 'הושלם', color: 'default' }
                };
                const config = statusConfig[params.value];
                return <Chip label={config.label} color={config.color} size="small" />;
            }
        },
        {
            field: 'arrived',
            headerName: 'הגיע',
            width: 80,
            renderCell: (params) => (
                params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="disabled" />
            )
        },
        {
            field: 'actions',
            headerName: 'פעולות',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        setSelectedAppointment(params.row);
                        setDetailsDialogOpen(true);
                    }}
                >
                    <MoreVertIcon />
                </IconButton>
            )
        }
    ];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('admin.sidebar.appointments')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {appointments.length} תורים במערכת
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<EventIcon />}
                    sx={{
                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                        borderRadius: '25px',
                        px: 4
                    }}
                >
                    תור חדש
                </Button>
            </Box>

            {/* View Tabs */}
            <Card sx={{ mb: 3 }}>
                <Tabs
                    value={view}
                    onChange={(e, newValue) => setView(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                >
                    <Tab label="לוח שנה" value="calendar" />
                    <Tab label="רשימה" value="list" />
                    <Tab label={`היום (${todayAppointments.length})`} value="today" />
                </Tabs>
            </Card>

            {/* Status Filter */}
            <Card sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statusOptions.map(option => (
                        <Chip
                            key={option.value}
                            label={`${option.label} (${option.count})`}
                            onClick={() => setStatusFilter(option.value)}
                            color={statusFilter === option.value ? 'primary' : 'default'}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Box>
            </Card>

            {/* Calendar View */}
            {view === 'calendar' && (
                <Card sx={{ p: 3 }}>
                    <Box sx={{ height: 600 }}>
                        <BigCalendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={handleSelectEvent}
                            eventPropGetter={eventStyleGetter}
                            messages={{
                                next: 'הבא',
                                previous: 'הקודם',
                                today: 'היום',
                                month: 'חודש',
                                week: 'שבוע',
                                day: 'יום',
                                agenda: 'סדר יום'
                            }}
                            views={['month', 'week', 'day', 'agenda']}
                        />
                    </Box>
                </Card>
            )}

            {/* List View */}
            {view === 'list' && (
                <Card>
                    <DataGrid
                        rows={appointments}
                        columns={columns}
                        getRowId={(row) => row._id}
                        pageSize={25}
                        rowsPerPageOptions={[10, 25, 50]}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-row:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    />
                </Card>
            )}

            {/* Today View */}
            {view === 'today' && (
                <Card>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            תורים להיום - {new Date().toLocaleDateString('he-IL')}
                        </Typography>
                        {todayAppointments.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 8 }}>
                                אין תורים מתוכננים להיום
                            </Typography>
                        ) : (
                            <List>
                                {todayAppointments.map((apt, index) => (
                                    <Box key={apt._id}>
                                        <ListItem
                                            sx={{
                                                py: 2,
                                                '&:hover': { bgcolor: 'action.hover' },
                                                borderRadius: 2
                                            }}
                                            secondaryAction={
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Chip
                                                        label={apt.status === 'pending' ? 'ממתין' : apt.status === 'confirmed' ? 'מאושר' : 'אחר'}
                                                        color={apt.status === 'confirmed' ? 'success' : 'warning'}
                                                        size="small"
                                                    />
                                                    <IconButton
                                                        onClick={() => {
                                                            setSelectedAppointment(apt);
                                                            setDetailsDialogOpen(true);
                                                        }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {apt.clientName[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {apt.time}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {apt.clientName}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {apt.serviceType?.name_he} • {apt.duration} דקות
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        {index < todayAppointments.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Box>
                </Card>
            )}

            {/* Appointment Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">פרטי תור</Typography>
                        <Chip
                            label={
                                selectedAppointment?.status === 'pending' ? 'ממתין' :
                                    selectedAppointment?.status === 'confirmed' ? 'מאושר' :
                                        selectedAppointment?.status === 'completed' ? 'הושלם' : 'בוטל'
                            }
                            color={
                                selectedAppointment?.status === 'confirmed' ? 'success' :
                                    selectedAppointment?.status === 'pending' ? 'warning' :
                                        selectedAppointment?.status === 'completed' ? 'default' : 'error'
                            }
                        />
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedAppointment && (
                        <Grid container spacing={3}>
                            {/* Client Info */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    פרטי לקוח
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                                        {selectedAppointment.clientName[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">
                                            {selectedAppointment.clientName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {selectedAppointment.clientPhone}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {selectedAppointment.clientEmail}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Appointment Details */}
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    שירות
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {selectedAppointment.serviceType?.name_he}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    משך טיפול
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {selectedAppointment.duration} דקות
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    תאריך
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {new Date(selectedAppointment.date).toLocaleDateString('he-IL')}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    שעה
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {selectedAppointment.time}
                                </Typography>
                            </Grid>

                            {selectedAppointment.notes && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            הערות
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedAppointment.notes}
                                        </Typography>
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Status Update */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    עדכון סטטוס
                                </Typography>
                                <TextField
                                    fullWidth
                                    select
                                    value={selectedAppointment.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                >
                                    <MenuItem value="pending">ממתין</MenuItem>
                                    <MenuItem value="confirmed">מאושר</MenuItem>
                                    <MenuItem value="completed">הושלם</MenuItem>
                                    <MenuItem value="cancelled">בוטל</MenuItem>
                                </TextField>
                            </Grid>

                            {/* Arrived Checkbox */}
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant={selectedAppointment.arrived ? 'contained' : 'outlined'}
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleMarkArrived}
                                    disabled={selectedAppointment.arrived}
                                >
                                    {selectedAppointment.arrived ? 'הלקוח הגיע' : 'סמן כהגיע'}
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)}>
                        סגור
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        שלח תזכורת
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminAppointments;