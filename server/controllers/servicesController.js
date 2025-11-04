import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';

// Get all active services (public)
export const getActiveServices = async (req, res, next) => {
    try {
        const services = await Service.find({ active: true })
            .sort({ order: 1, createdAt: 1 });

        res.json({
            success: true,
            data: { services }
        });
    } catch (error) {
        next(error);
    }
};

// Get all services (admin)
export const getAllServices = async (req, res, next) => {
    try {
        const services = await Service.find()
            .sort({ order: 1, createdAt: 1 });

        res.json({
            success: true,
            data: { services }
        });
    } catch (error) {
        next(error);
    }
};

// Get single service
export const getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

// Create service (admin)
export const createService = async (req, res, next) => {
    try {
        const serviceData = { ...req.body };

        // Handle image upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'leah-genish/services',
                transformation: [
                    { width: 800, height: 600, crop: 'limit', quality: 'auto' }
                ]
            });
            serviceData.image = result.secure_url;
        }

        const service = await Service.create(serviceData);

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

// Update service (admin)
export const updateService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            if (service.image) {
                const publicId = service.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`leah-genish/services/${publicId}`);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'leah-genish/services',
                transformation: [
                    { width: 800, height: 600, crop: 'limit', quality: 'auto' }
                ]
            });
            req.body.image = result.secure_url;
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Service updated successfully',
            data: { service: updatedService }
        });
    } catch (error) {
        next(error);
    }
};

// Delete service (admin)
export const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Delete image if exists
        if (service.image) {
            const publicId = service.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`leah-genish/services/${publicId}`);
        }

        // Soft delete by setting active to false
        service.active = false;
        await service.save();

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Seed default services (admin only) - idempotent
export const seedDefaultServices = async (req, res, next) => {
    try {
        const existingCount = await Service.countDocuments();
        if (existingCount > 0) {
            return res.json({ success: true, message: 'Services already exist. No seeding performed.' });
        }

        const defaults = [
            {
                name_he: 'עיסוי שעה',
                name_en: 'Massage 60min',
                description_he: 'עיסוי מלא ומרגיע למשך שעה.',
                description_en: 'Full body relaxing massage for 60 minutes.',
                duration: 60,
                price: 0,
                active: true,
                order: 1,
                calendlyUrl: ''
            },
            {
                name_he: 'עיסוי שעה וחצי',
                name_en: 'Massage 90min',
                description_he: 'עיסוי מעמיק ומקיף למשך שעה וחצי.',
                description_en: 'Deep and comprehensive massage for 90 minutes.',
                duration: 90,
                price: 0,
                active: true,
                order: 2,
                calendlyUrl: ''
            },
            {
                name_he: 'עיסוי שעתיים',
                name_en: 'Massage 120min',
                description_he: 'עיסוי ארוך במיוחד לשחרור מלא של הגוף.',
                description_en: 'Extended massage for full body release (120 minutes).',
                duration: 120,
                price: 0,
                active: true,
                order: 3,
                calendlyUrl: ''
            },
            {
                name_he: 'רפלקסולוגיה שעה',
                name_en: 'Reflexology 60min',
                description_he: 'טיפול רפלקסולוגיה ממוקד למשך שעה.',
                description_en: 'Focused reflexology session for 60 minutes.',
                duration: 60,
                price: 0,
                active: true,
                order: 4,
                calendlyUrl: ''
            },
            {
                name_he: 'נרות הופי',
                name_en: 'Hopi Ear Candles',
                description_he: 'טיפול נרות הופי עדין ומרגיע.',
                description_en: 'Gentle and calming Hopi ear candle treatment.',
                duration: 30,
                price: 0,
                active: true,
                order: 5,
                calendlyUrl: ''
            }
        ];

        await Service.insertMany(defaults);
        const services = await Service.find().sort({ order: 1, createdAt: 1 });
        res.status(201).json({ success: true, message: 'Default services seeded', data: { services } });
    } catch (error) {
        next(error);
    }
};
