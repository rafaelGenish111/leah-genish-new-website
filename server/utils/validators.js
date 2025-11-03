import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Auth validation
export const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
];

export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const validatePasswordUpdate = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

// Article validation
export const validateArticle = [
    body('title_he')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Hebrew title is required and must be less than 200 characters'),
    body('title_en')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('English title is required and must be less than 200 characters'),
    body('content_he')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Hebrew content is required'),
    body('content_en')
        .trim()
        .isLength({ min: 1 })
        .withMessage('English content is required'),
    body('category')
        .isIn(['nutrition', 'holistic', 'lifestyle', 'reflexology', 'other'])
        .withMessage('Invalid category'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    body('published')
        .optional()
        .isBoolean()
        .withMessage('Published must be a boolean')
];

// Appointment validation
export const validateAppointment = [
    body('clientName')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Client name is required and must be less than 100 characters'),
    body('clientEmail')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('clientPhone')
        .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('serviceType')
        .isMongoId()
        .withMessage('Invalid service type'),
    body('date')
        .isISO8601()
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Appointment date must be in the future');
            }
            return true;
        }),
    body('time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please provide a valid time format (HH:MM)'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters')
];

// Health declaration validation
export const validateHealthDeclaration = [
    body('clientName')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Client name is required and must be less than 100 characters'),
    body('clientEmail')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('clientPhone')
        .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .custom((value) => {
            if (value && new Date(value) >= new Date()) {
                throw new Error('Date of birth must be in the past');
            }
            return true;
        }),
    body('medicalConditions')
        .optional()
        .isArray()
        .withMessage('Medical conditions must be an array'),
    body('allergies')
        .optional()
        .isArray()
        .withMessage('Allergies must be an array'),
    body('medications')
        .optional()
        .isArray()
        .withMessage('Medications must be an array'),
    body('surgeries')
        .optional()
        .isArray()
        .withMessage('Surgeries must be an array'),
    body('pregnant')
        .optional()
        .isBoolean()
        .withMessage('Pregnant must be a boolean'),
    body('additionalInfo')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Additional info cannot exceed 1000 characters'),
    body('signature')
        .notEmpty()
        .withMessage('Digital signature is required'),
    body('consentGiven')
        .isBoolean()
        .custom((value) => {
            if (value !== true) {
                throw new Error('Consent must be explicitly given');
            }
            return true;
        })
];

// Image validation
export const validateImage = [
    body('title_he')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Hebrew title cannot exceed 100 characters'),
    body('title_en')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('English title cannot exceed 100 characters'),
    body('description_he')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Hebrew description cannot exceed 500 characters'),
    body('description_en')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('English description cannot exceed 500 characters'),
    body('category')
        .isIn(['clinic', 'treatments', 'events', 'certificates'])
        .withMessage('Invalid category')
];

// Service validation
export const validateService = [
    body('name_he')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Hebrew name is required and must be less than 100 characters'),
    body('name_en')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('English name is required and must be less than 100 characters'),
    body('description_he')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Hebrew description is required'),
    body('description_en')
        .trim()
        .isLength({ min: 1 })
        .withMessage('English description is required'),
    body('duration')
        .isInt({ min: 15, max: 300 })
        .withMessage('Duration must be between 15 and 300 minutes'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),
    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
    body('calendlyUrl')
        .optional({ nullable: true })
        .trim()
        .custom((value) => {
            if (!value) return true;
            return value.startsWith('https://calendly.com/');
        })
        .withMessage('Calendly URL must start with https://calendly.com/')
];

// Contact validation
export const validateContact = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name is required and must be less than 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('subject')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Subject is required and must be less than 200 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters')
];

// ID validation
export const validateObjectId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format')
];

// Query validation
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];

export const validateDateRange = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
];
