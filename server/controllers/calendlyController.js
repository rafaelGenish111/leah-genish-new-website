import Appointment from '../models/Appointment.js';
import { sendEmail, sendAdminNotification, emailTemplates } from '../utils/sendEmail.js';
import crypto from 'crypto';

/**
 * @desc    Handle Calendly webhook events
 * @route   POST /api/calendly/webhook
 * @access  Public (with signature verification)
 */
export const handleWebhook = async (req, res, next) => {
    try {
        // Verify webhook signature
        const signature = req.headers['calendly-webhook-signature'];
        if (!verifySignature(req.body, signature)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid webhook signature'
            });
        }

        const event = req.body;
        const eventType = event.event;

        console.log(`Received Calendly webhook: ${eventType}`);

        switch (eventType) {
            case 'invitee.created':
                await handleInviteeCreated(event.payload);
                break;
            case 'invitee.canceled':
                await handleInviteeCanceled(event.payload);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Calendly webhook error:', error);
        next(error);
    }
};

/**
 * Handle invitee.created event
 */
const handleInviteeCreated = async (payload) => {
    try {
        const { invitee, event_type, scheduled_event } = payload;

        // Parse Calendly data
        const clientName = invitee.name || invitee.email.split('@')[0];
        const clientEmail = invitee.email;
        const clientPhone = invitee.questions_and_answers?.find(
            q => q.question.toLowerCase().includes('phone')
        )?.answer || '';

        // Parse date and time from scheduled_event
        const startTime = new Date(scheduled_event.start_time);
        const endTime = new Date(scheduled_event.end_time);
        const duration = Math.round((endTime - startTime) / 1000 / 60); // in minutes

        // Create or update appointment in our DB
        const appointment = await Appointment.findOneAndUpdate(
            { clientEmail, date: startTime },
            {
                clientName,
                clientEmail,
                clientPhone,
                serviceType: null, // Will need to map Calendly event type to service
                date: startTime,
                time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
                duration,
                status: 'confirmed',
                notes: `Calendly booking: ${event_type.name}`,
                confirmationToken: null
            },
            { new: true, upsert: true }
        );

        console.log(`Created/updated appointment: ${appointment._id}`);

        // Send notification email to admin
        await sendAdminNotification(
            emailTemplates.calendlyAppointmentNotification(appointment),
            'he'
        );

        console.log('Notification sent to admin');
    } catch (error) {
        console.error('Error handling invitee.created:', error);
        throw error;
    }
};

/**
 * Handle invitee.canceled event
 */
const handleInviteeCanceled = async (payload) => {
    try {
        const { invitee, scheduled_event } = payload;

        // Find and cancel appointment
        const startTime = new Date(scheduled_event.start_time);
        const appointment = await Appointment.findOneAndUpdate(
            { clientEmail: invitee.email, date: startTime },
            { status: 'cancelled' },
            { new: true }
        );

        if (appointment) {
            console.log(`Cancelled appointment: ${appointment._id}`);

            // Send cancellation notification to admin
            await sendAdminNotification(
                emailTemplates.calendlyCancellationNotification(appointment),
                'he'
            );
        }
    } catch (error) {
        console.error('Error handling invitee.canceled:', error);
        throw error;
    }
};

/**
 * Verify Calendly webhook signature
 */
const verifySignature = (payload, signature) => {
    if (!process.env.CALENDLY_WEBHOOK_SECRET) {
        console.warn('CALENDLY_WEBHOOK_SECRET not set, skipping signature verification');
        return true;
    }

    if (!signature) {
        return false;
    }

    try {
        const hmac = crypto.createHmac('sha256', process.env.CALENDLY_WEBHOOK_SECRET);
        const digest = hmac.update(JSON.stringify(payload)).digest('hex');
        const expectedSignature = `sha256=${digest}`;

        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
};

/**
 * @desc    Sync Calendly events to local DB
 * @route   POST /api/calendly/sync
 * @access  Private/Admin
 */
export const syncCalendlyEvents = async (req, res, next) => {
    try {
        // This would fetch events from Calendly API and sync them
        // Implementation depends on Calendly API requirements
        res.status(200).json({
            success: true,
            message: 'Sync completed (not implemented)'
        });
    } catch (error) {
        next(error);
    }
};

