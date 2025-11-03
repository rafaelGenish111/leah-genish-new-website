import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { availabilityService } from '../../services/availabilityService.js';
import { format } from 'date-fns';

const AdminExceptions = () => {
    const { t } = useTranslation();

    const [exceptions, setExceptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingException, setEditingException] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        type: 'unavailable',
        startTime: '',
        endTime: '',
        reason: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchExceptions();
    }, []);

    const fetchExceptions = async () => {
        try {
            setLoading(true);
            const data = await availabilityService.getExceptions();
            setExceptions(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה בטעינת החריגות' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (exception = null) => {
        if (exception) {
            setEditingException(exception);
            setFormData({
                date: format(new Date(exception.date), 'yyyy-MM-dd'),
                type: exception.type,
                startTime: exception.startTime || '',
                endTime: exception.endTime || '',
                reason: exception.reason
            });
        } else {
            setEditingException(null);
            setFormData({
                date: '',
                type: 'unavailable',
                startTime: '',
                endTime: '',
                reason: ''
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingException(null);
        setFormData({
            date: '',
            type: 'unavailable',
            startTime: '',
            endTime: '',
            reason: ''
        });
    };

    const handleSave = async () => {
        try {
            if (!formData.date || !formData.reason) {
                setMessage({ type: 'error', text: 'נא למלא את כל השדות הנדרשים' });
                return;
            }

            if (formData.type === 'custom_hours') {
                if (!formData.startTime || !formData.endTime) {
                    setMessage({ type: 'error', text: 'נא למלא שעות התחלה וסיום' });
                    return;
                }
            }

            const dataToSave = {
                date: formData.date,
                type: formData.type,
                startTime: formData.startTime || undefined,
                endTime: formData.endTime || undefined,
                reason: formData.reason
            };

            if (editingException) {
                await availabilityService.updateException(editingException._id, dataToSave);
                setMessage({ type: 'success', text: 'החריגה עודכנה בהצלחה' });
            } else {
                await availabilityService.createException(dataToSave);
                setMessage({ type: 'success', text: 'החריגה נוצרה בהצלחה' });
            }

            handleCloseDialog();
            fetchExceptions();
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה בשמירת החריגה' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את החריגה?')) {
            return;
        }

        try {
            await availabilityService.deleteException(id);
            setMessage({ type: 'success', text: 'החריגה נמחקה בהצלחה' });
            fetchExceptions();
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה במחיקת החריגה' });
        }
    };

    const getTypeLabel = (type) => {
        return type === 'unavailable' ? 'לא זמין' : 'שעות מותאמות';
    };

    const getTypeColor = (type) => {
        return type === 'unavailable' ? 'error' : 'warning';
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
                        ניהול חריגות
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        הוסף תאריכים מיוחדים עם זמינות שונה
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                        borderRadius: 0,
                        px: 4
                    }}
                >
                    הוסף חריגה
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

            {/* Exceptions List */}
            <Card>
                {exceptions.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            אין חריגות מוגדרות עדיין
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>תאריך</TableCell>
                                    <TableCell>סוג</TableCell>
                                    <TableCell>שעות</TableCell>
                                    <TableCell>סיבה</TableCell>
                                    <TableCell align="right">פעולות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exceptions.map((exception) => (
                                    <TableRow key={exception._id}>
                                        <TableCell>
                                            {format(new Date(exception.date), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={getTypeLabel(exception.type)} 
                                                color={getTypeColor(exception.type)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {exception.type === 'unavailable' 
                                                ? 'כל היום' 
                                                : `${exception.startTime} - ${exception.endTime}`
                                            }
                                        </TableCell>
                                        <TableCell>{exception.reason}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(exception)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(exception._id)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingException ? 'ערוך חריגה' : 'הוסף חריגה'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                type="date"
                                label="תאריך"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>סוג חריגה</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    label="סוג חריגה"
                                >
                                    <MenuItem value="unavailable">לא זמין (כל היום)</MenuItem>
                                    <MenuItem value="custom_hours">שעות מותאמות</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {formData.type === 'custom_hours' && (
                            <>
                                <Grid item xs={6}>
                                    <TextField
                                        type="time"
                                        label="שעת התחלה"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        type="time"
                                        label="שעת סיום"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                label="סיבה"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        ביטול
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained"
                        sx={{ bgcolor: 'primary.main' }}
                    >
                        שמור
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminExceptions;

