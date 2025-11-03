import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    Divider,
    Switch,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper
} from '@mui/material';
import {
    Link as LinkIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon,
    Event as EventIcon,
    Settings as SettingsIcon,
    OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdminCalendly = () => {
    const { t } = useTranslation();

    // State for Calendly configuration
    const [config, setConfig] = useState({
        calendlyUrl: localStorage.getItem('calendly_url') || '',
        enabled: localStorage.getItem('calendly_enabled') === 'true',
        primaryColor: localStorage.getItem('calendly_primary_color') || '#D4B5B0',
        textColor: localStorage.getItem('calendly_text_color') || '#1A1A1A',
        backgroundColor: localStorage.getItem('calendly_background_color') || '#FFFFFF'
    });

    const [testDialogOpen, setTestDialogOpen] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Example Calendly URLs for guidance
    const exampleUrls = [
        'https://calendly.com/your-username',
        'https://calendly.com/your-username/30min',
        'https://calendly.com/your-username/consultation'
    ];

    // Validation for Calendly URL
    const isValidCalendlyUrl = (url) => {
        if (!url) return false;
        const trimmed = url.trim();
        // מקבל גם קישור פרופיל וגם קישור סוג אירוע
        const minLen = 'https://calendly.com/'.length + 3; // לפחות שם משתמש בן 3 תווים
        return trimmed.startsWith('https://calendly.com/') && trimmed.length >= minLen;
    };

    const handleSave = async () => {
        const trimmedUrl = (config.calendlyUrl || '').trim();
        if (config.enabled && !isValidCalendlyUrl(trimmedUrl)) {
            setSaveMessage({
                type: 'error',
                text: 'כתובת Calendly לא תקינה. יש להזין כתובת המתחילה ב-https://calendly.com/'
            });
            return;
        }

        setIsSaving(true);

        try {
            // Save to localStorage
            localStorage.setItem('calendly_url', trimmedUrl);
            localStorage.setItem('calendly_enabled', String(config.enabled));
            localStorage.setItem('calendly_primary_color', config.primaryColor);
            localStorage.setItem('calendly_text_color', config.textColor);
            localStorage.setItem('calendly_background_color', config.backgroundColor);

            // Also save to backend via environment/settings API if needed
            // await settingsService.updateCalendlyConfig(config);

            setSaveMessage({
                type: 'success',
                text: 'הגדרות Calendly נשמרו בהצלחה!'
            });

            // Trigger event for other components to refresh
            window.dispatchEvent(new CustomEvent('calendly-config-updated'));
            // Update local state with trimmed url so הסטטוס יתעדכן
            setConfig((prev) => ({ ...prev, calendlyUrl: trimmedUrl }));
        } catch (error) {
            console.error('Failed to save Calendly config:', error);
            setSaveMessage({
                type: 'error',
                text: 'שגיאה בשמירת ההגדרות'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleTest = () => {
        if (!isValidCalendlyUrl(config.calendlyUrl)) {
            setSaveMessage({
                type: 'error',
                text: 'אנא הזיני כתובת Calendly תקינה לפני הבדיקה'
            });
            return;
        }
        setTestDialogOpen(true);
    };

    const openCalendlyDashboard = () => {
        window.open('https://calendly.com/app/scheduled_events/user/me', '_blank');
    };

    const features = [
        { title: 'סנכרון אוטומטי', desc: 'תורים מסונכרנים אוטומטית מ-Calendly', available: true },
        { title: 'התראות', desc: 'התראות על תורים חדשים ומבוטלים', available: true },
        { title: 'עיצוב מותאם', desc: 'התאמת צבעים לעיצוב האתר', available: true },
        { title: 'זמינות דינמית', desc: 'ניהול שעות עבודה וחריגות', available: true }
    ];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    אינטגרציה עם Calendly
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    נהלי את חיבור האתר למערכת Calendly לניהול תורים
                </Typography>
            </Box>

            {/* Save Message */}
            {saveMessage.text && (
                <Alert
                    severity={saveMessage.type}
                    onClose={() => setSaveMessage({ type: '', text: '' })}
                    sx={{ mb: 3 }}
                >
                    {saveMessage.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Main Configuration */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    הגדרות חיבור
                                </Typography>
                            </Box>

                            {/* Enable/Disable Calendly */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={config.enabled}
                                        onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="subtitle2">
                                            הפעלת Calendly באתר
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {config.enabled ? 'לקוחות יכולים לקבוע תורים דרך Calendly' : 'מערכת Calendly כבויה'}
                                        </Typography>
                                    </Box>
                                }
                                sx={{ mb: 3 }}
                            />

                            <Divider sx={{ mb: 3 }} />

                            {/* Calendly URL */}
                            <TextField
                                fullWidth
                                label="כתובת Calendly"
                                placeholder="https://calendly.com/your-username/event-type"
                                value={config.calendlyUrl}
                                onChange={(e) => setConfig({ ...config, calendlyUrl: e.target.value })}
                                disabled={!config.enabled}
                                error={config.enabled && config.calendlyUrl && !isValidCalendlyUrl(config.calendlyUrl)}
                                helperText={
                                    config.enabled && config.calendlyUrl && !isValidCalendlyUrl(config.calendlyUrl)
                                        ? 'כתובת לא תקינה. הכתובת חייבת להתחיל ב-https://calendly.com/'
                                        : 'העתיקי את הקישור לאירוע מ-Calendly שלך'
                                }
                                InputProps={{
                                    endAdornment: config.calendlyUrl && isValidCalendlyUrl(config.calendlyUrl) && (
                                        <CheckIcon sx={{ color: 'success.main' }} />
                                    )
                                }}
                                sx={{ mb: 2 }}
                            />

                            {/* Example URLs */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    דוגמאות לכתובות:
                                </Typography>
                                {exampleUrls.map((url, index) => (
                                    <Chip
                                        key={index}
                                        label={url}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 1, mb: 1, fontSize: '0.75rem' }}
                                    />
                                ))}
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* Color Customization */}
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                התאמת צבעים
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                            צבע ראשי
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={config.primaryColor}
                                                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                                disabled={!config.enabled}
                                                style={{
                                                    width: '50px',
                                                    height: '40px',
                                                    border: '1px solid #E0E0E0',
                                                    borderRadius: '4px',
                                                    cursor: config.enabled ? 'pointer' : 'not-allowed'
                                                }}
                                            />
                                            <TextField
                                                size="small"
                                                value={config.primaryColor}
                                                disabled={!config.enabled}
                                                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                                sx={{ flex: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                            צבע טקסט
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={config.textColor}
                                                onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                                                disabled={!config.enabled}
                                                style={{
                                                    width: '50px',
                                                    height: '40px',
                                                    border: '1px solid #E0E0E0',
                                                    borderRadius: '4px',
                                                    cursor: config.enabled ? 'pointer' : 'not-allowed'
                                                }}
                                            />
                                            <TextField
                                                size="small"
                                                value={config.textColor}
                                                disabled={!config.enabled}
                                                onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                                                sx={{ flex: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                            צבע רקע
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={config.backgroundColor}
                                                onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                                                disabled={!config.enabled}
                                                style={{
                                                    width: '50px',
                                                    height: '40px',
                                                    border: '1px solid #E0E0E0',
                                                    borderRadius: '4px',
                                                    cursor: config.enabled ? 'pointer' : 'not-allowed'
                                                }}
                                            />
                                            <TextField
                                                size="small"
                                                value={config.backgroundColor}
                                                disabled={!config.enabled}
                                                onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                                                sx={{ flex: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    sx={{
                                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                                        px: 4
                                    }}
                                >
                                    {isSaving ? 'שומר...' : 'שמירת שינויים'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleTest}
                                    disabled={!config.enabled || !isValidCalendlyUrl(config.calendlyUrl)}
                                    startIcon={<OpenInNewIcon />}
                                >
                                    בדיקת תצוגה
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={openCalendlyDashboard}
                                    startIcon={<SettingsIcon />}
                                >
                                    פתח Calendly Dashboard
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Instructions Card */}
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                מדריך התקנה
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>שלב 1:</strong> היכנסי לחשבון Calendly שלך ב-https://calendly.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>שלב 2:</strong> בחרי את סוג האירוע שברצונך להטמיע (למשל "תור ייעוץ 30 דקות")
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>שלב 3:</strong> העתיקי את הקישור לאירוע (למשל: https://calendly.com/your-name/consultation)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>שלב 4:</strong> הדביקי את הקישור בשדה "כתובת Calendly" למעלה
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>שלב 5:</strong> התאימי את הצבעים לעיצוב האתר ושמרי את השינויים
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar - Features & Status */}
                <Grid item xs={12} md={4}>
                    {/* Status Card */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    סטטוס
                                </Typography>
                                <Chip
                                    label={config.enabled && isValidCalendlyUrl(config.calendlyUrl) ? 'פעיל' : 'לא פעיל'}
                                    color={config.enabled && isValidCalendlyUrl(config.calendlyUrl) ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        {config.enabled ? (
                                            <CheckIcon sx={{ color: 'success.main' }} />
                                        ) : (
                                            <CloseIcon sx={{ color: 'error.main' }} />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="מערכת מופעלת"
                                        secondary={config.enabled ? 'כן' : 'לא'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        {config.calendlyUrl && isValidCalendlyUrl(config.calendlyUrl) ? (
                                            <CheckIcon sx={{ color: 'success.main' }} />
                                        ) : (
                                            <CloseIcon sx={{ color: 'error.main' }} />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="כתובת מוגדרת"
                                        secondary={config.calendlyUrl ? 'כן' : 'לא'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {/* Features Card */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                תכונות זמינות
                            </Typography>
                            <List dense>
                                {features.map((feature, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            {feature.available ? (
                                                <CheckIcon sx={{ color: 'success.main' }} />
                                            ) : (
                                                <CloseIcon sx={{ color: 'text.disabled' }} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={feature.title}
                                            secondary={feature.desc}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Test Dialog */}
            <Dialog
                open={testDialogOpen}
                onClose={() => setTestDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    תצוגת מקדימה - Calendly
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ minHeight: 600 }}>
                        {config.calendlyUrl && (
                            <iframe
                                src={`${config.calendlyUrl}?embed_domain=localhost&embed_type=Inline&primary_color=${config.primaryColor.replace('#', '')}&text_color=${config.textColor.replace('#', '')}&background_color=${config.backgroundColor.replace('#', '')}`}
                                width="100%"
                                height="600"
                                frameBorder="0"
                                title="Calendly Preview"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTestDialogOpen(false)}>
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCalendly;

