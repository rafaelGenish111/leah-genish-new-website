import Image from '../models/Image.js';
import cloudinary from '../config/cloudinary.js';

// Get all images (public)
export const getImages = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Sort by date (newest first)
        const sort = { createdAt: -1 };

        // Execute query
        const images = await Image.find(query)
            .populate('uploadedBy', 'name')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Image.countDocuments(query);
        const pages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                images,
                pagination: {
                    currentPage: page,
                    totalPages: pages,
                    totalImages: total,
                    hasNextPage: page < pages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single image
export const getImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id)
            .populate('uploadedBy', 'name');

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            data: { image }
        });
    } catch (error) {
        next(error);
    }
};

// Upload images (admin)
export const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded'
            });
        }

        const { category, title_he, title_en, description_he, description_en } = req.body;
        const uploadedImages = [];

        // Process each uploaded file
        for (const file of req.files) {
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'leah-genish/gallery',
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
                    ]
                });

                // Create image document
                const image = await Image.create({
                    title_he: title_he || '',
                    title_en: title_en || '',
                    description_he: description_he || '',
                    description_en: description_en || '',
                    url: result.secure_url,
                    publicId: result.public_id,
                    category: category || 'clinic',
                    uploadedBy: req.user.id
                });

                await image.populate('uploadedBy', 'name');
                uploadedImages.push(image);
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                // Continue with other images even if one fails
            }
        }

        res.status(201).json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            data: { images: uploadedImages }
        });
    } catch (error) {
        next(error);
    }
};

// Update image details
export const updateImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        const updatedImage = await Image.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('uploadedBy', 'name');

        res.json({
            success: true,
            message: 'Image updated successfully',
            data: { image: updatedImage }
        });
    } catch (error) {
        next(error);
    }
};

// Delete image
export const deleteImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(image.publicId);
        } catch (cloudinaryError) {
            console.error('Error deleting from Cloudinary:', cloudinaryError);
            // Continue with database deletion even if Cloudinary deletion fails
        }

        // Delete from database
        await Image.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
