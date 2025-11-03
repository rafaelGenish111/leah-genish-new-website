import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Chip, Box, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { servicesService } from '../services/servicesService.js';

const Treatments = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await servicesService.getActiveServices();
                setServices(data);
                setFiltered(data);
            } catch (e) {
                setServices([]);
                setFiltered([]);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) return setFiltered(services);
        setFiltered(
            services.filter(s =>
                (s.name_he || '').toLowerCase().includes(q) ||
                (s.description_he || '').toLowerCase().includes(q)
            )
        );
    }, [query, services]);

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, mb: 1 }}>
                    טיפולים
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    בחרי טיפול והזמיני תור בקלות
                </Typography>
            </Box>

            <Box sx={{ maxWidth: 560, mx: 'auto', mb: 5 }}>
                <TextField
                    fullWidth
                    placeholder="חפשי טיפול..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {filtered.map(service => (
                    <Grid item xs={12} sm={6} md={4} key={service._id}>
                        <Card sx={{ borderRadius: 0, border: '1px solid #E8E8E8' }}>
                            {service.image && (
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={service.image}
                                    alt={service.name_he}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                    {service.name_he}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {service.description_he}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={`${service.duration} דקות`} size="small" sx={{ borderRadius: 0 }} />
                                    {service.price ? (
                                        <Chip label={`${service.price}₪`} size="small" color="primary" sx={{ borderRadius: 0 }} />
                                    ) : null}
                                </Box>

                                {/* Book button */}
                                {service.calendlyUrl ? (
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            href={`/appointments?event=${encodeURIComponent(service.calendlyUrl)}`}
                                            sx={{ borderRadius: 0 }}
                                        >
                                            קביעת תור לטיפול זה
                                        </Button>
                                    </Box>
                                ) : null}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Treatments;


