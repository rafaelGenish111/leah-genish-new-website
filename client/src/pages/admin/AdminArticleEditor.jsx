import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Grid, TextField, Button, Alert, CircularProgress } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articlesService } from '../../services/articlesService.js';

const AdminArticleEditor = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title_he: '',
        title_en: '',
        content_he: '',
        content_en: '',
        excerpt_he: '',
        excerpt_en: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const load = async () => {
            if (!isEdit) return;
            try {
                setLoading(true);
                const article = await articlesService.getArticle(id);
                setForm({
                    title_he: article.title_he || '',
                    title_en: article.title_en || '',
                    content_he: article.content_he || '',
                    content_en: article.content_en || '',
                    excerpt_he: article.excerpt_he || '',
                    excerpt_en: article.excerpt_en || ''
                });
            } catch (e) {
                setMessage({ type: 'error', text: 'שגיאה בטעינת המאמר' });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit]);

    const handleSave = async () => {
        try {
            setLoading(true);
            if (isEdit) {
                await articlesService.updateArticle(id, form);
            } else {
                await articlesService.createArticle(form);
            }
            setMessage({ type: 'success', text: 'המאמר נשמר בהצלחה' });
            navigate('/admin/articles');
        } catch (e) {
            setMessage({ type: 'error', text: 'שגיאה בשמירת המאמר' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Card sx={{ borderRadius: 0 }}>
                <CardContent>
                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
                            {message.text}
                        </Alert>
                    )}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="כותרת בעברית"
                                value={form.title_he}
                                onChange={(e) => setForm({ ...form, title_he: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Title (English)"
                                value={form.title_en}
                                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mb: 1 }}>תוכן בעברית</Box>
                            <ReactQuill value={form.content_he} onChange={(v) => setForm({ ...form, content_he: v })} />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mb: 1 }}>Content (English)</Box>
                            <ReactQuill value={form.content_en} onChange={(v) => setForm({ ...form, content_en: v })} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="תקציר בעברית"
                                value={form.excerpt_he}
                                onChange={(e) => setForm({ ...form, excerpt_he: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Excerpt (English)"
                                value={form.excerpt_en}
                                onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ borderRadius: 0 }}>
                                {loading ? <CircularProgress size={20} /> : 'שמור'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminArticleEditor;


