import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    Button,
    IconButton,
    Paper,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { availabilityService } from '../../services/availabilityService.js';

const AdminAvailability = () => {
    const { t } = useTranslation();

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [breakDialogOpen, setBreakDialogOpen] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [newBreak, setNewBreak] = useState({ startTime: '', endTime: '' });

    const daysOfWeek = [
        { id: 0, he: 'ראשון', en: 'Sunday' },
        { id: 1, he: 'שני', en: 'Monday' },
        { id: 2, he: 'שלישי', en: 'Tuesday' },
        { id: 3, he: 'רביעי', en: 'Wednesday' },
        { id: 4, he: 'חמישי', en: 'Thursday' },
        { id: 5, he: 'שישי', en: 'Friday' },
        { id: 6, he: 'שבת', en: 'Saturday' }
    ];

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const data = await availabilityService.getAvailability();
            setAvailability(data);
            
            // Initialize empty days if not configured
            const existingDays = data.map(a => a.dayOfWeek);
            const emptyDays = daysOfWeek
                .filter(d => !existingDays.includes(d.id))
                .map(d => ({
                    dayOfWeek: d.id,
                    startTime: '09:00',
                    endTime: '17:00',
                    isActive: false,
                    breakTimes: []
                }));
            
            const allAvailability = [...data, ...emptyDays].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
            setAvailability(allAvailability);
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה בטעינת הזמינות' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            // Save or update each availability
            for (const item of availability) {
                if (item._id) {
                    // Update existing
                    await availabilityService.updateAvailability(item._id, {
                        startTime: item.startTime,
                        endTime: item.endTime,
                        isActive: item.isActive,
                        breakTimes: item.breakTimes
                    });
                } else {
                    // Create new
                    await availabilityService.createAvailability({
                        dayOfWeek: item.dayOfWeek,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        isActive: item.isActive,
                        breakTimes: item.breakTimes
                    });
                }
            }

            setMessage({ type: 'success', text: 'הזמינות נשמרה בהצלחה' });
            fetchAvailability();
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה בשמירת הזמינות' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...availability];
        updated[index][field] = value;
        setAvailability(updated);
    };

    const handleAddBreak = () => {
        if (!newBreak.startTime || !newBreak.endTime) {
            setMessage({ type: 'error', text: 'נא למלא את כל השדות' });
            return;
        }

        const updated = [...availability];
        updated[selectedDayIndex].breakTimes.push({ ...newBreak });
        setAvailability(updated);
        setBreakDialogOpen(false);
        setNewBreak({ startTime: '', endTime: '' });
    };

    const handleDeleteBreak = (dayIndex, breakIndex) => {
        const updated = [...availability];
        updated[dayIndex].breakTimes.splice(breakIndex, 1);
        setAvailability(updated);
    };

    const openBreakDialog = (index) => {
        setSelectedDayIndex(index);
        setBreakDialogOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        ניהול זמינות
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        הגדר את שעות העבודה לכל ימות השבוע
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                        borderRadius: 0,
                        px: 4
                    }}
                >
                    שמור כל השינויים
                </Button>
            </Box>

            {/* Message */}
            {message.text && (
                <Alert 
                    severity={message.type} 
                    onClose={() => setMessage({ type: '', text: '' })}
                    sx={{ mb: 3 }}
                >
                    {message.text}
                </Alert>
            )}

            {/* Availability Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>יום</TableCell>
                                <TableCell align="center">פעיל</TableCell>
                                <TableCell>שעת התחלה</TableCell>
                                <TableCell>שעת סיום</TableCell>
                                <TableCell>הפסקות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {availability.map((item, index) => {
                                const day = daysOfWeek.find(d => d.id === item.dayOfWeek);
                                return (
                                    <TableRow 
                                        key={item.dayOfWeek}
                                        sx={{
                                            opacity: item.isActive ? 1 : 0.6,
                                            bgcolor: item.isActive ? 'background.default' : 'action.hover'
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {day?.he}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={item.isActive}
                                                onChange={(e) => handleChange(index, 'isActive', e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="time"
                                                value={item.startTime}
                                                onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="time"
                                                value={item.endTime}
                                                onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {item.breakTimes?.map((br, brIndex) => (
                                                    <Chip
                                                        key={brIndex}
                                                        label={`${br.startTime}-${br.endTime}`}
                                                        onDelete={() => handleDeleteBreak(index, brIndex)}
                                                        size="small"
                                                    />
                                                ))}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openBreakDialog(index)}
                                                    disabled={!item.isActive}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Break Times Dialog */}
            <Dialog
                open={breakDialogOpen}
                onClose={() => setBreakDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>הוספת הפסקה</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                type="time"
                                label="שעת התחלה"
                                value={newBreak.startTime}
                                onChange={(e) => setNewBreak({ ...newBreak, startTime: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="time"
                                label="שעת סיום"
                                value={newBreak.endTime}
                                onChange={(e) => setNewBreak({ ...newBreak, endTime: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBreakDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button 
                        onClick={handleAddBreak} 
                        variant="contained"
                        sx={{ bgcolor: 'primary.main' }}
                    >
                        הוסף
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminAvailability;

