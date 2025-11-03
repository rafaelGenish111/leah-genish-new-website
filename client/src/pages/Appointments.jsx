import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { InlineWidget } from 'react-calendly';
import SEO from '../components/common/SEO.jsx';

const Appointments = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [bookingMethod, setBookingMethod] = useState('internal');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: '',
        date: '',
        time: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: ''
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState('');

    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || '';

    // Mock services - replace with actual API call
    const services = [
        { _id: '1', name_he: 'רפלקסולוגיה', name_en: 'Reflexology', duration: 60, price: 250 },
        { _id: '2', name_he: 'טיפול הוליסטי', name_en: 'Holistic Treatment', duration: 90, price: 350 },
        { _id: '3', name_he: 'ייעוץ תזונתי', name_en: 'Nutrition Consultation', duration: 45, price: 300 }
    ];

    const handleMethodChange = (event, newMethod) => {
        if (newMethod !== null) {
            setBookingMethod(newMethod);
        }
    };

    const handleServiceChange = async (serviceId) => {
        setFormData({ ...formData, serviceType: serviceId, date: '', time: '' });
        setAvailableSlots([]);
    };

    const handleDateChange = async (date) => {
        setFormData({ ...formData, date, time: '' });
        
        if (formData.serviceType && date) {
            try {
                setLoading(true);
                // TODO: Fetch actual available slots from API
                const mockSlots = [
                    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
                ];
                setAvailableSlots(mockSlots);
            } catch (error) {
                setError('שגיאה בטעינת זמנים פנויים');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // TODO: Submit to API
            console.log('Submitting appointment:', formData);
            
            // Show success message
            alert('תודה! התור נקלט בהצלחה. נחזור אליך בהקדם.');
            navigate('/');
        } catch (error) {
            setError('שגיאה בשליחת הבקשה. נא לנסות שוב.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="קביעת תור - Leah Genish"
                description="קבעי תור לטיפול מקצועי ברפואה משלימה, רפלקסולוגיה וטיפול הוליסטי"
            />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            gutterBottom
                            sx={{ fontWeight: 300 }}
                        >
                            קביעת תור
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            בחרי את הדרך הנוחה לך לקביעת תור
                        </Typography>
                    </Box>

                    {/* Booking Method Toggle */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <ToggleButtonGroup
                            value={bookingMethod}
                            exclusive
                            onChange={handleMethodChange}
                            aria-label="בחר דרך קביעת תור"
                            sx={{
                                '& .MuiToggleButton-root': {
                                    borderRadius: 0,
                                    px: 4,
                                    py: 1.5,
                                    textTransform: 'none'
                                }
                            }}
                        >
                            <ToggleButton value="internal" aria-label="טופס פנימי">
                                <Typography>טופס פנימי</Typography>
                            </ToggleButton>
                            <ToggleButton value="calendly" aria-label="Calendly">
                                <Typography>Calendly</Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </motion.div>

                {/* Calendly Widget */}
                {bookingMethod === 'calendly' && calendlyUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card sx={{ p: 0, borderRadius: 0 }}>
                            <Box sx={{ width: '100%', height: '800px' }}>
                                <InlineWidget
                                    url={calendlyUrl}
                                    styles={{
                                        height: '100%',
                                        minWidth: '320px'
                                    }}
                                    pageSettings={{
                                        backgroundColor: 'ffffff',
                                        hideEventTypeDetails: false,
                                        hideLandingPageDetails: false,
                                        primaryColor: 'D4B5B0',
                                        textColor: '1A1A1A'
                                    }}
                                    prefill={{
                                        name: formData.clientName || '',
                                        email: formData.clientEmail || ''
                                    }}
                                />
                            </Box>
                        </Card>
                    </motion.div>
                )}

                {/* Internal Booking Form */}
                {bookingMethod === 'internal' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 0 }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {/* Service Type */}
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel>סוג הטיפול</InputLabel>
                                            <Select
                                                value={formData.serviceType}
                                                onChange={(e) => handleServiceChange(e.target.value)}
                                                label="סוג הטיפול"
                                            >
                                                {services.map((service) => (
                                                    <MenuItem key={service._id} value={service._id}>
                                                        {service.name_he} - {service.duration} דקות ({service.price}₪)
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Date */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="date"
                                            label="תאריך"
                                            value={formData.date}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                        />
                                    </Grid>

                                    {/* Time */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>שעה</InputLabel>
                                            <Select
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                disabled={!formData.date || !formData.serviceType || loading}
                                                label="שעה"
                                            >
                                                {loading ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                                        טוען זמנים...
                                                    </MenuItem>
                                                ) : availableSlots.length > 0 ? (
                                                    availableSlots.map((slot, index) => (
                                                        <MenuItem key={index} value={slot}>
                                                            {slot}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>
                                                        {formData.date 
                                                            ? 'אין זמנים פנויים בתאריך זה' 
                                                            : 'נא לבחור תאריך תחילה'
                                                        }
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Client Name */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="שם מלא"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            fullWidth
                                            required
                                        />
                                    </Grid>

                                    {/* Client Email */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="email"
                                            label="אימייל"
                                            value={formData.clientEmail}
                                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                            fullWidth
                                            required
                                        />
                                    </Grid>

                                    {/* Client Phone */}
                                    <Grid item xs={12}>
                                        <TextField
                                            type="tel"
                                            label="טלפון"
                                            value={formData.clientPhone}
                                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                            fullWidth
                                            required
                                        />
                                    </Grid>

                                    {/* Notes */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="הערות נוספות"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            fullWidth
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>

                                    {/* Error Message */}
                                    {error && (
                                        <Grid item xs={12}>
                                            <Alert severity="error">{error}</Alert>
                                        </Grid>
                                    )}

                                    {/* Submit Button */}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                disabled={loading}
                                                sx={{
                                                    borderRadius: 0,
                                                    px: 6,
                                                    py: 1.5,
                                                    fontSize: '1rem',
                                                    fontWeight: 400,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 2
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <CircularProgress size={24} sx={{ mr: 2 }} />
                                                        שולח...
                                                    </>
                                                ) : (
                                                    'שלח בקשה'
                                                )}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </Container>
        </>
    );
};

export default Appointments;
