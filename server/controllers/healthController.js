import HealthDeclaration from '../models/HealthDeclaration.js';
import { sendEmail, sendAdminNotification, emailTemplates } from '../utils/sendEmail.js';

// Get all health declarations (admin)
export const getDeclarations = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Search by client name or email
        if (req.query.search) {
            query.$or = [
                { clientName: { $regex: req.query.search, $options: 'i' } },
                { clientEmail: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (req.query.startDate || req.query.endDate) {
            query.createdAt = {};
            if (req.query.startDate) {
                query.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        // Sort by date (newest first)
        const sort = { createdAt: -1 };

        // Execute query
        const declarations = await HealthDeclaration.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await HealthDeclaration.countDocuments(query);
        const pages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                declarations,
                pagination: {
                    currentPage: page,
                    totalPages: pages,
                    totalDeclarations: total,
                    hasNextPage: page < pages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single health declaration
export const getDeclaration = async (req, res, next) => {
    try {
        const declaration = await HealthDeclaration.findById(req.params.id);

        if (!declaration) {
            return res.status(404).json({
                success: false,
                message: 'Health declaration not found'
            });
        }

        res.json({
            success: true,
            data: { declaration }
        });
    } catch (error) {
        next(error);
    }
};

// Submit health declaration (public)
export const submitDeclaration = async (req, res, next) => {
    try {
        const declaration = await HealthDeclaration.create(req.body);

        // Send confirmation email to client
        const clientEmailTemplate = emailTemplates.healthDeclarationConfirmation(declaration, 'he');
        await sendEmail(declaration.clientEmail, clientEmailTemplate, 'he');

        // Send notification email to admin
        const adminEmailTemplate = emailTemplates.healthDeclarationNotification(declaration, 'he');
        await sendAdminNotification(adminEmailTemplate, 'he');

        res.status(201).json({
            success: true,
            message: 'Health declaration submitted successfully',
            data: { declaration }
        });
    } catch (error) {
        next(error);
    }
};

// Delete health declaration
export const deleteDeclaration = async (req, res, next) => {
    try {
        const declaration = await HealthDeclaration.findById(req.params.id);

        if (!declaration) {
            return res.status(404).json({
                success: false,
                message: 'Health declaration not found'
            });
        }

        await HealthDeclaration.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Health declaration deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Export health declaration as PDF
export const exportPDF = async (req, res, next) => {
    try {
        const declaration = await HealthDeclaration.findById(req.params.id);

        if (!declaration) {
            return res.status(404).json({
                success: false,
                message: 'Health declaration not found'
            });
        }

        // For now, return the declaration data in a structured format
        // In a production environment, you would use a PDF library like pdfkit or puppeteer
        res.json({
            success: true,
            data: {
                declaration,
                pdfUrl: `# PDF generation would be implemented here for declaration ${declaration._id}`
            }
        });
    } catch (error) {
        next(error);
    }
};
