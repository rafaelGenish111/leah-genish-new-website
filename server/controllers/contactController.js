import { sendEmail, sendAdminNotification, emailTemplates } from '../utils/sendEmail.js';

// Send contact message
export const sendContactMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        // Send email to admin
        const adminEmailTemplate = emailTemplates.contactMessage({
            name,
            email,
            subject,
            message
        }, 'he');

        await sendAdminNotification(adminEmailTemplate, 'he');

        // Send auto-reply to client
        const clientEmailTemplate = emailTemplates.contactAutoReply({
            name,
            subject
        }, 'he');

        await sendEmail(email, clientEmailTemplate, 'he');

        res.json({
            success: true,
            message: 'Message sent successfully. We will get back to you soon!'
        });
    } catch (error) {
        next(error);
    }
};
