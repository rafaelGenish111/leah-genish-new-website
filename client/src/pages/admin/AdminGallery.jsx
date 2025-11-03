import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    Button,
    Grid,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Typography,
    Checkbox,
    Chip
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../../services/galleryService.js';

const AdminGallery = () => {
    const { t } = useTranslation();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filesToUpload, setFilesToUpload] = useState([]);

    // Fetch images from API
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const data = await galleryService.getImages();
                setImages(data);
            } catch (error) {
                console.error('Failed to fetch images:', error);
                alert('שגיאה בטעינת התמונות');
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            title_he: '',
            title_en: '',
            description_he: '',
            description_en: '',
            category: 'clinic'
        }));
        setFilesToUpload(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        multiple: true
    });

    const handleUpload = async () => {
        try {
            // Prepare files for upload
            const files = filesToUpload.map(f => f.file);
            const uploadData = {};
            
            // If all files have the same metadata, use it; otherwise upload individually
            if (filesToUpload.length === 1) {
                uploadData.title_he = filesToUpload[0].title_he;
                uploadData.title_en = filesToUpload[0].title_en;
                uploadData.description_he = filesToUpload[0].description_he;
                uploadData.description_en = filesToUpload[0].description_en;
                uploadData.category = filesToUpload[0].category;
            }

            const uploadedImages = await galleryService.uploadImages(files, uploadData);
            setImages(prev => [...prev, ...uploadedImages]);
            alert(`הועלו ${uploadedImages.length} תמונות בהצלחה`);
            setUploadDialogOpen(false);
            setFilesToUpload([]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('שגיאה בהעלאת התמונות');
        }
    };

    const handleDelete = async (imageId) => {
        if (window.confirm('האם את בטוחה שברצונך למחוק תמונה זו?')) {
            try {
                await galleryService.deleteImage(imageId);
                setImages(prev => prev.filter(img => img._id !== imageId));
                alert('תמונה נמחקה בהצלחה');
            } catch (error) {
                console.error('Delete failed:', error);
                alert('שגיאה במחיקת התמונה');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`האם את בטוחה שברצונך למחוק ${selectedImages.length} תמונות?`)) {
            try {
                await Promise.all(selectedImages.map(id => galleryService.deleteImage(id)));
                setImages(prev => prev.filter(img => !selectedImages.includes(img._id)));
                setSelectedImages([]);
                alert('התמונות נמחקו בהצלחה');
            } catch (error) {
                console.error('Bulk delete failed:', error);
                alert('שגיאה במחיקת התמונות');
            }
        }
    };

    const toggleSelection = (imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const categories = [
        { value: 'all', label: 'הכל' },
        { value: 'clinic', label: 'הקליניקה' },
        { value: 'treatments', label: 'טיפולים' },
        { value: 'events', label: 'אירועים' },
        { value: 'certificates', label: 'תעודות' }
    ];

    const filteredImages = categoryFilter === 'all'
        ? images
        : images.filter(img => img.category === categoryFilter);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('admin.sidebar.gallery')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {images.length} תמונות בגלריה
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {selectedImages.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleBulkDelete}
                        >
                            מחק {selectedImages.length} תמונות
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => setUploadDialogOpen(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                            borderRadius: '25px',
                            px: 4
                        }}
                    >
                        העלאת תמונות
                    </Button>
                </Box>
            </Box>

            {/* Category Filter */}
            <Card sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {categories.map(cat => (
                        <Chip
                            key={cat.value}
                            label={cat.label}
                            onClick={() => setCategoryFilter(cat.value)}
                            color={categoryFilter === cat.value ? 'primary' : 'default'}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Box>
            </Card>

            {/* Image Grid */}
            {loading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                        טוען תמונות...
                    </Typography>
                </Box>
            ) : filteredImages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                        אין תמונות בגלריה
                    </Typography>
                </Box>
            ) : (
                <ImageList cols={4} gap={16}>
                    <AnimatePresence>
                        {filteredImages.map((image) => (
                        <ImageListItem
                            key={image._id}
                            component={motion.div}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            sx={{
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                '&:hover .overlay': {
                                    opacity: 1
                                }
                            }}
                        >
                            {/* Selection Checkbox */}
                            <Checkbox
                                checked={selectedImages.includes(image._id)}
                                onChange={() => toggleSelection(image._id)}
                                icon={<CheckCircleIcon />}
                                checkedIcon={<CheckCircleIcon />}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    zIndex: 2,
                                    color: 'white',
                                    '&.Mui-checked': {
                                        color: 'primary.main'
                                    }
                                }}
                            />

                            <img
                                src={image.url}
                                alt={image.title_he}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: 250,
                                    objectFit: 'cover'
                                }}
                            />

                            {/* Overlay */}
                            <Box
                                className="overlay"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1
                                }}
                            >
                                <IconButton
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setEditDialogOpen(true);
                                    }}
                                    sx={{ color: 'white' }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleDelete(image._id)}
                                    sx={{ color: 'white' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>

                            <ImageListItemBar
                                title={image.title_he || 'ללא כותרת'}
                                subtitle={
                                    <Chip
                                        label={categories.find(c => c.value === image.category)?.label}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                }
                            />
                        </ImageListItem>
                    ))}
                </AnimatePresence>
            </ImageList>
            )}

            {/* Upload Dialog */}
            <Dialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>העלאת תמונות חדשות</DialogTitle>
                <DialogContent>
                    {filesToUpload.length === 0 ? (
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '3px dashed',
                                borderColor: isDragActive ? 'primary.main' : 'divider',
                                borderRadius: 3,
                                p: 6,
                                textAlign: 'center',
                                cursor: 'pointer',
                                bgcolor: isDragActive ? 'action.hover' : 'transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                {isDragActive ? 'שחררי את התמונות כאן' : 'גררי תמונות או לחצי לבחירה'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ניתן להעלות מספר תמונות בו-זמנית
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {filesToUpload.length} תמונות נבחרו
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {filesToUpload.map((fileObj, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card sx={{ p: 2 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={3}>
                                                    <Box
                                                        component="img"
                                                        src={fileObj.preview}
                                                        alt="Preview"
                                                        sx={{
                                                            width: '100%',
                                                            height: 120,
                                                            objectFit: 'cover',
                                                            borderRadius: 1
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={9}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="כותרת בעברית"
                                                                value={fileObj.title_he}
                                                                onChange={(e) => {
                                                                    const newFiles = [...filesToUpload];
                                                                    newFiles[index].title_he = e.target.value;
                                                                    setFilesToUpload(newFiles);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="Title in English"
                                                                value={fileObj.title_en}
                                                                onChange={(e) => {
                                                                    const newFiles = [...filesToUpload];
                                                                    newFiles[index].title_en = e.target.value;
                                                                    setFilesToUpload(newFiles);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="תיאור בעברית"
                                                                value={fileObj.description_he}
                                                                onChange={(e) => {
                                                                    const newFiles = [...filesToUpload];
                                                                    newFiles[index].description_he = e.target.value;
                                                                    setFilesToUpload(newFiles);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="Description in English"
                                                                value={fileObj.description_en}
                                                                onChange={(e) => {
                                                                    const newFiles = [...filesToUpload];
                                                                    newFiles[index].description_en = e.target.value;
                                                                    setFilesToUpload(newFiles);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth
                                                                select
                                                                size="small"
                                                                label="קטגוריה"
                                                                value={fileObj.category}
                                                                onChange={(e) => {
                                                                    const newFiles = [...filesToUpload];
                                                                    newFiles[index].category = e.target.value;
                                                                    setFilesToUpload(newFiles);
                                                                }}
                                                            >
                                                                <MenuItem value="clinic">הקליניקה</MenuItem>
                                                                <MenuItem value="treatments">טיפולים</MenuItem>
                                                                <MenuItem value="events">אירועים</MenuItem>
                                                                <MenuItem value="certificates">תעודות</MenuItem>
                                                            </TextField>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setFilesToUpload(prev =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                        sx={{ float: 'left' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setUploadDialogOpen(true)}
                                sx={{ mt: 2 }}
                            >
                                הוספת תמונות נוספות
                            </Button>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setUploadDialogOpen(false);
                        setFilesToUpload([]);
                    }}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={filesToUpload.length === 0}
                        sx={{
                            background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)'
                        }}
                    >
                        העלה {filesToUpload.length} תמונות
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>עריכת פרטי תמונה</DialogTitle>
                <DialogContent>
                    {selectedImage && (
                        <Box sx={{ pt: 2 }}>
                            <Box
                                component="img"
                                src={selectedImage.url}
                                alt={selectedImage.title_he}
                                sx={{
                                    width: '100%',
                                    height: 250,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    mb: 3
                                }}
                            />
                            <TextField
                                fullWidth
                                label="כותרת בעברית"
                                value={selectedImage.title_he || ''}
                                onChange={(e) => setSelectedImage({
                                    ...selectedImage,
                                    title_he: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Title in English"
                                value={selectedImage.title_en || ''}
                                onChange={(e) => setSelectedImage({
                                    ...selectedImage,
                                    title_en: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="תיאור בעברית"
                                value={selectedImage.description_he || ''}
                                onChange={(e) => setSelectedImage({
                                    ...selectedImage,
                                    description_he: e.target.value
                                })}
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Description in English"
                                value={selectedImage.description_en || ''}
                                onChange={(e) => setSelectedImage({
                                    ...selectedImage,
                                    description_en: e.target.value
                                })}
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="קטגוריה"
                                value={selectedImage.category}
                                onChange={(e) => setSelectedImage({
                                    ...selectedImage,
                                    category: e.target.value
                                })}
                            >
                                <MenuItem value="clinic">הקליניקה</MenuItem>
                                <MenuItem value="treatments">טיפולים</MenuItem>
                                <MenuItem value="events">אירועים</MenuItem>
                                <MenuItem value="certificates">תעודות</MenuItem>
                            </TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            try {
                                const updated = await galleryService.updateImage(selectedImage._id, {
                                    title_he: selectedImage.title_he,
                                    title_en: selectedImage.title_en,
                                    description_he: selectedImage.description_he,
                                    description_en: selectedImage.description_en,
                                    category: selectedImage.category
                                });
                                setImages(prev =>
                                    prev.map(img =>
                                        img._id === selectedImage._id ? updated : img
                                    )
                                );
                                setEditDialogOpen(false);
                                alert('תמונה עודכנה בהצלחה');
                            } catch (error) {
                                console.error('Update failed:', error);
                                alert('שגיאה בעדכון התמונה');
                            }
                        }}
                    >
                        שמירה
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminGallery;