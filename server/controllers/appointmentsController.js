import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import TherapistAvailability from '../models/TherapistAvailability.js';
import TherapistException from '../models/TherapistException.js';
import { sendEmail, sendAdminNotification, emailTemplates } from '../utils/sendEmail.js';

// Get all appointments (admin)
export const getAppointments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Date range filter
        if (req.query.startDate || req.query.endDate) {
            query.date = {};
            if (req.query.startDate) {
                query.date.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.date.$lte = new Date(req.query.endDate);
            }
        }

        // Status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Service filter
        if (req.query.serviceType) {
            query.serviceType = req.query.serviceType;
        }

        // Search by client name or email
        if (req.query.search) {
            query.$or = [
                { clientName: { $regex: req.query.search, $options: 'i' } },
                { clientEmail: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Sort by date and time
        const sort = { date: 1, time: 1 };

        // Execute query
        const appointments = await Appointment.find(query)
            .populate('serviceType', 'name_he name_en duration price')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Appointment.countDocuments(query);
        const pages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                appointments,
                pagination: {
                    currentPage: page,
                    totalPages: pages,
                    totalAppointments: total,
                    hasNextPage: page < pages,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get available time slots
export const getAvailableSlots = async (req, res, next) => {
    try {
        const { date, serviceType } = req.query;

        if (!date || !serviceType) {
            return res.status(400).json({
                success: false,
                message: 'Date and service type are required'
            });
        }

        // Get service details
        const service = await Service.findById(serviceType);
        if (!service || !service.active) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or inactive'
            });
        }

        // Get day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.getDay();

        // Get therapist availability for this day
        const dayAvailability = await TherapistAvailability.findOne({ dayOfWeek, isActive: true });
        
        // If no availability configured for this day, return empty slots
        if (!dayAvailability) {
            return res.json({
                success: true,
                data: {
                    availableSlots: [],
                    service: {
                        id: service._id,
                        name_he: service.name_he,
                        name_en: service.name_en,
                        duration: service.duration
                    },
                    message: 'No availability configured for this day'
                }
            });
        }

        // Check for exceptions on this date
        const exceptions = await TherapistException.find({ date });

        // Check if there's a full day exception
        const fullDayException = exceptions.find(exc => exc.type === 'unavailable');
        if (fullDayException) {
            return res.json({
                success: true,
                data: {
                    availableSlots: [],
                    service: {
                        id: service._id,
                        name_he: service.name_he,
                        name_en: service.name_en,
                        duration: service.duration
                    },
                    message: fullDayException.reason
                }
            });
        }

        // Check for custom hours exception
        const customHoursException = exceptions.find(exc => exc.type === 'custom_hours');
        const workingHours = customHoursException 
            ? { start: customHoursException.startTime, end: customHoursException.endTime }
            : { start: dayAvailability.startTime, end: dayAvailability.endTime };

        // Parse working hours to numbers
        const [startHour, startMin] = workingHours.start.split(':').map(Number);
        const [endHour, endMin] = workingHours.end.split(':').map(Number);
        const startTimeHours = startHour + startMin / 60;
        const endTimeHours = endHour + endMin / 60;

        // Get existing appointments for the date
        const existingAppointments = await Appointment.find({
            date: {
                $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
                $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
            },
            status: { $nin: ['cancelled'] }
        }).select('time duration');

        // Generate all possible time slots (30-minute intervals)
        const availableSlots = [];
        const serviceDuration = service.duration;

        for (let hour = startTimeHours; hour < endTimeHours; hour += 0.5) {
            const timeString = `${hour.toString().padStart(2, '0')}:${hour % 1 === 0 ? '00' : '30'}`;
            const slotStart = hour;
            const slotEnd = slotStart + (serviceDuration / 60);

            // Check if slot conflicts with existing appointments
            const hasConflict = existingAppointments.some(apt => {
                const aptStart = parseInt(apt.time.split(':')[0]) + (parseInt(apt.time.split(':')[1]) / 60);
                const aptEnd = aptStart + (apt.duration / 60);

                return (slotStart < aptEnd && slotEnd > aptStart);
            });

            // Check if slot conflicts with break times
            const hasBreakConflict = dayAvailability.breakTimes && dayAvailability.breakTimes.some(breakTime => {
                const breakStart = parseInt(breakTime.startTime.split(':')[0]) + (parseInt(breakTime.startTime.split(':')[1]) / 60);
                const breakEnd = parseInt(breakTime.endTime.split(':')[0]) + (parseInt(breakTime.endTime.split(':')[1]) / 60);

                return (slotStart < breakEnd && slotEnd > breakStart);
            });

            // Check if slot doesn't exceed working hours
            if (slotEnd <= endTimeHours && !hasConflict && !hasBreakConflict) {
                availableSlots.push({
                    time: timeString,
                    displayTime: timeString
                });
            }
        }

        res.json({
            success: true,
            data: {
                availableSlots,
                service: {
                    id: service._id,
                    name_he: service.name_he,
                    name_en: service.name_en,
                    duration: service.duration
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single appointment
export const getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('serviceType', 'name_he name_en duration price');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: { appointment }
        });
    } catch (error) {
        next(error);
    }
};

// Create appointment
export const createAppointment = async (req, res, next) => {
    try {
        const { clientName, clientEmail, clientPhone, serviceType, date, time, notes } = req.body;

        // Check if service exists and is active
        const service = await Service.findById(serviceType);
        if (!service || !service.active) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or inactive'
            });
        }

        // Check if slot is available
        const appointmentDate = new Date(date);
        const existingAppointment = await Appointment.findOne({
            date: {
                $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
                $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
            },
            time: time,
            status: { $nin: ['cancelled'] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Time slot is no longer available'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            date: new Date(date),
            time,
            duration: service.duration,
            notes,
            status: 'pending'
        });

        await appointment.populate('serviceType', 'name_he name_en duration price');

        // Send confirmation email to client
        const clientEmailTemplate = emailTemplates.appointmentConfirmation(appointment, service, 'he');
        await sendEmail(appointment.clientEmail, clientEmailTemplate, 'he');

        // Send notification email to admin
        const adminEmailTemplate = emailTemplates.appointmentNotification(appointment, service, 'he');
        await sendAdminNotification(adminEmailTemplate, 'he');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: {
                appointment,
                confirmationToken: appointment.confirmationToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update appointment
export const updateAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if new slot is available (if date/time changed)
        if (req.body.date || req.body.time) {
            const newDate = req.body.date ? new Date(req.body.date) : appointment.date;
            const newTime = req.body.time || appointment.time;

            const existingAppointment = await Appointment.findOne({
                _id: { $ne: appointment._id },
                date: {
                    $gte: new Date(newDate.setHours(0, 0, 0, 0)),
                    $lt: new Date(newDate.setHours(23, 59, 59, 999))
                },
                time: newTime,
                status: { $nin: ['cancelled'] }
            });

            if (existingAppointment) {
                return res.status(400).json({
                    success: false,
                    message: 'New time slot is not available'
                });
            }
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('serviceType', 'name_he name_en duration price');

        // Send update email to client if email changed
        if (req.body.clientEmail || req.body.date || req.body.time) {
            const service = updatedAppointment.serviceType;
            const emailTemplate = emailTemplates.appointmentUpdate(updatedAppointment, service, 'he');
            await sendEmail(updatedAppointment.clientEmail, emailTemplate, 'he');
        }

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: { appointment: updatedAppointment }
        });
    } catch (error) {
        next(error);
    }
};

// Cancel appointment
export const cancelAppointment = async (req, res, next) => {
    try {
        const { token } = req.query;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Verify cancellation token (for public cancellation) or admin access
        if (token && appointment.confirmationToken !== token) {
            return res.status(403).json({
                success: false,
                message: 'Invalid cancellation token'
            });
        }

        // Check if cancellation is allowed (must be >24h before appointment)
        const appointmentDateTime = new Date(appointment.date);
        const [hours, minutes] = appointment.time.split(':');
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

        const now = new Date();
        const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);

        if (hoursUntilAppointment < 24) {
            return res.status(400).json({
                success: false,
                message: 'Cancellation must be made at least 24 hours before appointment'
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        await appointment.populate('serviceType', 'name_he name_en duration price');

        // Send cancellation email
        const service = appointment.serviceType;
        const emailTemplate = emailTemplates.appointmentCancellation(appointment, 'he');
        await sendEmail(appointment.clientEmail, emailTemplate, 'he');

        res.json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Update appointment status
export const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('serviceType', 'name_he name_en duration price');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Send status update email if status changed to confirmed
        if (status === 'confirmed') {
            const service = appointment.serviceType;
            const emailTemplate = emailTemplates.appointmentConfirmed(appointment, service, 'he');
            await sendEmail(appointment.clientEmail, emailTemplate, 'he');
        }

        res.json({
            success: true,
            message: 'Appointment status updated successfully',
            data: { appointment }
        });
    } catch (error) {
        next(error);
    }
};

// Mark appointment as arrived
export const markArrived = async (req, res, next) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { arrived: true },
            { new: true, runValidators: true }
        ).populate('serviceType', 'name_he name_en duration price');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment marked as arrived',
            data: { appointment }
        });
    } catch (error) {
        next(error);
    }
};
