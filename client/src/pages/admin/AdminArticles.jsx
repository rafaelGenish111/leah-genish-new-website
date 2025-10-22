import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    Button,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    MenuItem as SelectMenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublishIcon from '@mui/icons-material/Publish';
import { motion } from 'framer-motion';

const AdminArticles = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Mock data for now
    useEffect(() => {
        const mockArticles = [
            {
                _id: '1',
                title_he: 'תזונה נכונה לבריאות טובה',
                title_en: 'Proper Nutrition for Good Health',
                category: 'nutrition',
                published: true,
                views: 245,
                createdAt: '2024-10-20T10:00:00Z',
                featuredImage: '/placeholder-image.jpg'
            },
            {
                _id: '2',
                title_he: 'רפלקסולוגיה - טיפול טבעי',
                title_en: 'Reflexology - Natural Treatment',
                category: 'reflexology',
                published: false,
                views: 0,
                createdAt: '2024-10-22T14:30:00Z',
                featuredImage: '/placeholder-image.jpg'
            },
            {
                _id: '3',
                title_he: 'אורח חיים בריא',
                title_en: 'Healthy Lifestyle',
                category: 'lifestyle',
                published: true,
                views: 189,
                createdAt: '2024-10-18T09:15:00Z',
                featuredImage: '/placeholder-image.jpg'
            }
        ];
        setArticles(mockArticles);
        setLoading(false);
    }, [statusFilter, categoryFilter]);

    const handleMenuClick = (event, article) => {
        setAnchorEl(event.currentTarget);
        setSelectedArticle(article);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedArticle(null);
    };

    const handleEdit = () => {
        navigate(`/admin/articles/${selectedArticle._id}/edit`);
        handleMenuClose();
    };

    const handleDelete = async () => {
        // Mock delete - replace with actual API call
        setArticles(prev => prev.filter(article => article._id !== selectedArticle._id));
        setDeleteDialogOpen(false);
        handleMenuClose();
    };

    const handlePublishToggle = async () => {
        // Mock publish toggle - replace with actual API call
        setArticles(prev =>
            prev.map(article =>
                article._id === selectedArticle._id
                    ? { ...article, published: !article.published }
                    : article
            )
        );
        handleMenuClose();
    };

    const columns = [
        {
            field: 'featuredImage',
            headerName: 'תמונה',
            width: 80,
            renderCell: (params) => (
                <Box
                    component="img"
                    src={params.value || '/placeholder-image.jpg'}
                    alt={params.row.title_he}
                    sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 1
                    }}
                />
            )
        },
        {
            field: 'title_he',
            headerName: 'כותרת',
            flex: 1,
            minWidth: 200
        },
        {
            field: 'category',
            headerName: 'קטגוריה',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        {
            field: 'published',
            headerName: 'סטטוס',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'פורסם' : 'טיוטה'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'views',
            headerName: 'צפיות',
            width: 100,
            type: 'number'
        },
        {
            field: 'createdAt',
            headerName: 'נוצר ב',
            width: 150,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString('he-IL')
        },
        {
            field: 'actions',
            headerName: 'פעולות',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={(e) => handleMenuClick(e, params.row)}
                    size="small"
                >
                    <MoreVertIcon />
                </IconButton>
            )
        }
    ];

    const filteredArticles = articles.filter(article =>
        article.title_he.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.title_en.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        {t('admin.sidebar.articles')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        נהלי את כל המאמרים באתר
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/articles/new')}
                    sx={{
                        background: 'linear-gradient(135deg, #D4B5B0 0%, #C9A9A4 100%)',
                        borderRadius: '25px',
                        px: 4,
                        boxShadow: '0 4px 15px rgba(212, 181, 176, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(212, 181, 176, 0.4)'
                        }
                    }}
                >
                    {t('admin.sidebar.newArticle')}
                </Button>
            </Box>

            {/* Filters Card */}
            <Card sx={{ mb: 3, p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {/* Search */}
                    <TextField
                        placeholder="חיפוש מאמרים..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        sx={{ minWidth: 300 }}
                    />

                    {/* Status Filter */}
                    <Tabs
                        value={statusFilter}
                        onChange={(e, newValue) => setStatusFilter(newValue)}
                        sx={{ borderBottom: 'none' }}
                    >
                        <Tab label="הכל" value="all" />
                        <Tab label="פורסמו" value="published" />
                        <Tab label="טיוטות" value="draft" />
                    </Tabs>

                    {/* Category Filter */}
                    <TextField
                        select
                        label="קטגוריה"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <SelectMenuItem value="all">כל הקטגוריות</SelectMenuItem>
                        <SelectMenuItem value="nutrition">תזונה</SelectMenuItem>
                        <SelectMenuItem value="holistic">הוליסטי</SelectMenuItem>
                        <SelectMenuItem value="lifestyle">אורח חיים</SelectMenuItem>
                        <SelectMenuItem value="reflexology">רפלקסולוגיה</SelectMenuItem>
                        <SelectMenuItem value="other">אחר</SelectMenuItem>
                    </TextField>
                </Box>
            </Card>

            {/* Data Grid */}
            <Card>
                <DataGrid
                    rows={filteredArticles}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    checkboxSelection
                    disableSelectionOnClick
                    autoHeight
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        '& .MuiDataGrid-row:hover': {
                            bgcolor: 'action.hover'
                        }
                    }}
                />
            </Card>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => navigate(`/articles/${selectedArticle?._id}`)}>
                    <VisibilityIcon sx={{ mr: 1, fontSize: 20 }} />
                    צפייה
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                    עריכה
                </MenuItem>
                <MenuItem onClick={handlePublishToggle}>
                    <PublishIcon sx={{ mr: 1, fontSize: 20 }} />
                    {selectedArticle?.published ? 'ביטול פרסום' : 'פרסום'}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setDeleteDialogOpen(true);
                        handleMenuClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                    מחיקה
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>אישור מחיקה</DialogTitle>
                <DialogContent>
                    <Typography>
                        האם את בטוחה שברצונך למחוק את המאמר "{selectedArticle?.title_he}"?
                        פעולה זו אינה ניתנת לביטול.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        מחק
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminArticles;