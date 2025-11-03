import TherapistAvailability from '../models/TherapistAvailability.js';
import TherapistException from '../models/TherapistException.js';

/**
 * @desc    Get all availability
 * @route   GET /api/availability
 * @access  Public
 */
export const getAvailability = async (req, res, next) => {
    try {
        const availability = await TherapistAvailability.find()
            .sort({ dayOfWeek: 1 });

        res.status(200).json({
            success: true,
            data: availability
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create availability
 * @route   POST /api/availability
 * @access  Private/Admin
 */
export const createAvailability = async (req, res, next) => {
    try {
        const { dayOfWeek, startTime, endTime, isActive, breakTimes } = req.body;

        // Check if availability already exists for this day
        const existing = await TherapistAvailability.findOne({ dayOfWeek });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Availability already exists for this day. Use update instead.'
            });
        }

        const availability = await TherapistAvailability.create({
            dayOfWeek,
            startTime,
            endTime,
            isActive: isActive !== undefined ? isActive : true,
            breakTimes: breakTimes || []
        });

        res.status(201).json({
            success: true,
            data: availability
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update availability
 * @route   PUT /api/availability/:id
 * @access  Private/Admin
 */
export const updateAvailability = async (req, res, next) => {
    try {
        const availability = await TherapistAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: 'Availability not found'
            });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                availability[key] = req.body[key];
            }
        });

        await availability.save();

        res.status(200).json({
            success: true,
            data: availability
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete availability
 * @route   DELETE /api/availability/:id
 * @access  Private/Admin
 */
export const deleteAvailability = async (req, res, next) => {
    try {
        const availability = await TherapistAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: 'Availability not found'
            });
        }

        await availability.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Availability deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all exceptions
 * @route   GET /api/availability/exceptions
 * @access  Public
 */
export const getExceptions = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        let query = {};

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.date = { $lte: new Date(endDate) };
        }

        const exceptions = await TherapistException.find(query)
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: exceptions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create exception
 * @route   POST /api/availability/exceptions
 * @access  Private/Admin
 */
export const createException = async (req, res, next) => {
    try {
        const { date, type, startTime, endTime, reason } = req.body;

        // Check if exception already exists for this date
        const existing = await TherapistException.findOne({ date });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Exception already exists for this date. Use update instead.'
            });
        }

        const exception = await TherapistException.create({
            date,
            type,
            startTime,
            endTime,
            reason
        });

        res.status(201).json({
            success: true,
            data: exception
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update exception
 * @route   PUT /api/availability/exceptions/:id
 * @access  Private/Admin
 */
export const updateException = async (req, res, next) => {
    try {
        const exception = await TherapistException.findById(req.params.id);

        if (!exception) {
            return res.status(404).json({
                success: false,
                message: 'Exception not found'
            });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                exception[key] = req.body[key];
            }
        });

        await exception.save();

        res.status(200).json({
            success: true,
            data: exception
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete exception
 * @route   DELETE /api/availability/exceptions/:id
 * @access  Private/Admin
 */
export const deleteException = async (req, res, next) => {
    try {
        const exception = await TherapistException.findById(req.params.id);

        if (!exception) {
            return res.status(404).json({
                success: false,
                message: 'Exception not found'
            });
        }

        await exception.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Exception deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
