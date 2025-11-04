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
    Grid,
    IconButton,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { servicesService } from '../../services/servicesService.js';
import { useDropzone } from 'react-dropzone';

const AdminServices = () => {
    const { t } = useTranslation();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name_he: '',
        name_en: '',
        description_he: '',
        description_en: '',
        duration: '',
        price: '',
        calendlyUrl: '',
        active: true,
        order: 0
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles[0]) {
                const file = acceptedFiles[0];
                setFormData({ ...formData, image: file });
                setImagePreview(URL.createObjectURL(file));
            }
        },
        multiple: false
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await servicesService.getAllServices();
            setServices(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה בטעינת השירותים' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name_he: service.name_he || '',
                name_en: service.name_en || '',
                description_he: service.description_he || '',
                description_en: service.description_en || '',
                duration: service.duration || '',
                price: service.price || '',
                calendlyUrl: service.calendlyUrl || '',
                active: service.active !== false,
                order: service.order || 0
            });
            setImagePreview(service.image || null);
        } else {
            setEditingService(null);
            setFormData({
                name_he: '',
                name_en: '',
                description_he: '',
                description_en: '',
                duration: '',
                price: '',
                calendlyUrl: '',
                active: true,
                order: 0
            });
            setImagePreview(null);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingService(null);
        setFormData({
            name_he: '',
            name_en: '',
            description_he: '',
            description_en: '',
            duration: '',
            price: '',
            calendlyUrl: '',
            active: true,
            order: 0
        });
        setImagePreview(null);
    };

    const handleSave = async () => {
        try {
            if (!formData.name_he || !formData.name_en || !formData.description_he || !formData.description_en) {
                setMessage({ type: 'error', text: 'נא למלא את כל השדות הנדרשים' });
                return;
            }

            const dataToSave = { ...formData };

            if (editingService) {
                await servicesService.updateService(editingService._id, dataToSave);
                setMessage({ type: 'success', text: 'השירות עודכן בהצלחה' });
            } else {
                await servicesService.createService(dataToSave);
                setMessage({ type: 'success', text: 'השירות נוצר בהצלחה' });
            }

            handleCloseDialog();
            fetchServices();
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה בשמירת השירות' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את השירות?')) {
            return;
        }

        try {
            await servicesService.deleteService(id);
            setMessage({ type: 'success', text: 'השירות נמחק בהצלחה' });
            fetchServices();
        } catch (error) {
            setMessage({ type: 'error', text: 'שגיאה במחיקת השירות' });
        }
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
                        {t('admin.sidebar.services')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {services.length} שירותים במערכת
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={async () => {
                            try {
                                const seeded = await servicesService.seedDefaults();
                                setServices(seeded);
                                setMessage({ type: 'success', text: 'נוצרו טיפולי ברירת מחדל' });
                            } catch (e) {
                                setMessage({ type: 'error', text: 'שגיאה ביצירת טיפולי ברירת מחדל' });
                            }
                        }}
                    >
                        הוספת טיפולי ברירת מחדל
                    </Button>
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
                        הוסף שירות
                    </Button>
                </Box>
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

            {/* Services Grid */}
            <Grid container spacing={3}>
                {services.map((service) => (
                    <Grid item xs={12} md={6} lg={4} key={service._id}>
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 0,
                                    border: '1px solid #E8E8E8',
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        borderColor: 'primary.main'
                                    }
                                }}
                            >
                                {/* Image */}
                                {service.image && (
                                    <Box
                                        component="img"
                                        src={service.image}
                                        alt={service.name_he}
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}

                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                        {service.name_he}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                                        {service.description_he?.substring(0, 100)}...
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={`${service.duration} דקות`}
                                            size="small"
                                            sx={{ borderRadius: 0 }}
                                        />
                                        {service.price && (
                                            <Chip
                                                label={`${service.price}₪`}
                                                size="small"
                                                color="primary"
                                                sx={{ borderRadius: 0 }}
                                            />
                                        )}
                                        <Chip
                                            label={service.active ? 'פעיל' : 'לא פעיל'}
                                            size="small"
                                            color={service.active ? 'success' : 'default'}
                                            sx={{ borderRadius: 0 }}
                                        />
                                    </Box>

                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(service)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(service._id)}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingService ? 'ערוך שירות' : 'הוסף שירות'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {/* Image Upload */}
                        <Grid item xs={12}>
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: '2px dashed',
                                    borderColor: isDragActive ? 'primary.main' : 'divider',
                                    borderRadius: 0,
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                <input {...getInputProps()} />
                                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                {imagePreview ? (
                                    <Box
                                        component="img"
                                        src={imagePreview}
                                        alt="Preview"
                                        sx={{ maxWidth: '100%', maxHeight: 200, mt: 2 }}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        {isDragActive
                                            ? 'שחרר את התמונה כאן'
                                            : 'גרור תמונה לכאן או לחצי לבחירה'
                                        }
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        {/* Hebrew Name */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="שם בעברית"
                                value={formData.name_he}
                                onChange={(e) => setFormData({ ...formData, name_he: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* English Name */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="English Name"
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Hebrew Description */}
                        <Grid item xs={12}>
                            <TextField
                                label="תיאור בעברית"
                                value={formData.description_he}
                                onChange={(e) => setFormData({ ...formData, description_he: e.target.value })}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        {/* English Description */}
                        <Grid item xs={12}>
                            <TextField
                                label="English Description"
                                value={formData.description_en}
                                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        {/* Duration */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                type="number"
                                label="משך (דקות)"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                fullWidth
                                required
                                inputProps={{ min: 15, step: 15 }}
                            />
                        </Grid>

                        {/* Price */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                type="number"
                                label="מחיר (₪)"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* Order */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                type="number"
                                label="סדר תצוגה"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* Calendly URL */}
                        <Grid item xs={12}>
                            <TextField
                                label="קישור Calendly (אופציונלי)"
                                placeholder="https://calendly.com/your-username/event-type"
                                value={formData.calendlyUrl}
                                onChange={(e) => setFormData({ ...formData, calendlyUrl: e.target.value })}
                                fullWidth
                                helperText={'אם תוסיפי קישור, יוצג כפתור "קביעת תור" לטיפול הזה'}
                            />
                        </Grid>

                        {/* Active Toggle */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                }
                                label="פעיל"
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

export default AdminServices;
