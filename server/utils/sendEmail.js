import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Decide transport according to environment/credentials
// In development, prefer mock transport unless explicitly forced
const useMockTransport = (
    process.env.NODE_ENV !== 'production' &&
    process.env.EMAIL_FORCE !== 'true'
);

// Create transporter (mock in dev without creds)
const transporter = useMockTransport
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

// Verify transporter configuration (only for real transport)
if (!useMockTransport) {
    transporter.verify((error) => {
        if (error) {
            console.error('Email transporter error:', error);
        } else {
            console.log('Email server is ready to take messages');
        }
    });
} else {
    console.log('Email mock transport active (dev mode, no real emails will be sent)');
}

// Email templates
export const emailTemplates = {
    appointmentConfirmation: (appointment, service, language = 'he') => {
        const isHebrew = language === 'he';
        const date = new Date(appointment.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US');

        if (isHebrew) {
            return {
                subject: `אישור תור - ${service.name_he}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${appointment.clientName},</h2>
            <p>תודה רבה על קביעת התור!</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>פרטי התור:</h3>
              <p><strong>שירות:</strong> ${service.name_he}</p>
              <p><strong>תאריך:</strong> ${date}</p>
              <p><strong>שעה:</strong> ${appointment.time}</p>
              <p><strong>משך הטיפול:</strong> ${service.duration} דקות</p>
            </div>
            <p>אם יש צורך בשינוי או ביטול התור, אנא צרי קשר לפחות 24 שעות מראש.</p>
            <p>נשמח לראותך בקליניקה!</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Appointment Confirmation - ${service.name_en}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${appointment.clientName},</h2>
            <p>Thank you for booking your appointment!</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${service.name_en}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Duration:</strong> ${service.duration} minutes</p>
            </div>
            <p>If you need to change or cancel your appointment, please contact us at least 24 hours in advance.</p>
            <p>We look forward to seeing you at the clinic!</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    appointmentReminder: (appointment, service, language = 'he') => {
        const isHebrew = language === 'he';
        const date = new Date(appointment.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US');

        if (isHebrew) {
            return {
                subject: `תזכורת תור - מחר`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${appointment.clientName},</h2>
            <p>זוהי תזכורת לתור שלך מחר:</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>פרטי התור:</h3>
              <p><strong>שירות:</strong> ${service.name_he}</p>
              <p><strong>תאריך:</strong> ${date}</p>
              <p><strong>שעה:</strong> ${appointment.time}</p>
            </div>
            <p>נשמח לראותך בקליניקה!</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Appointment Reminder - Tomorrow`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${appointment.clientName},</h2>
            <p>This is a reminder for your appointment tomorrow:</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${service.name_en}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
            </div>
            <p>We look forward to seeing you at the clinic!</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    appointmentCancellation: (appointment, language = 'he') => {
        const isHebrew = language === 'he';

        if (isHebrew) {
            return {
                subject: `ביטול תור`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${appointment.clientName},</h2>
            <p>התור שלך בוטל בהצלחה.</p>
            <p>אם ברצונך לקבוע תור חדש, אנא צרי קשר איתנו.</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Appointment Cancelled`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">권ello ${appointment.clientName},</h2>
            <p>Your appointment has been successfully cancelled.</p>
            <p>If you would like to book a new appointment, please contact us.</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    healthDeclarationConfirmation: (declaration, language = 'he') => {
        const isHebrew = language === 'he';

        if (isHebrew) {
            return {
                subject: `אישור קבלת הצהרת בריאות`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${declaration.clientName},</h2>
            <p>קיבלנו את הצהרת הבריאות שלך בהצלחה.</p>
            <p>המידע יישמר בצורה בטוחה ויעזור לנו להתאים את הטיפול בצורה הטובה ביותר עבורך.</p>
            <p>תודה על האמון!</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Health Declaration Received`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${declaration.clientName},</h2>
            <p>We have successfully received your health declaration.</p>
            <p>The information will be kept securely and will help us tailor the best treatment for you.</p>
            <p>Thank you for your trust!</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    contactMessage: (contactData, language = 'he') => {
        const isHebrew = language === 'he';

        if (isHebrew) {
            return {
                subject: `הודעה חדשה מאתר - ${contactData.subject}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">הודעה חדשה מהאתר</h2>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>שם:</strong> ${contactData.name}</p>
              <p><strong>אימייל:</strong> ${contactData.email}</p>
              <p><strong>נושא:</strong> ${contactData.subject}</p>
              <p><strong>הודעה:</strong></p>
              <p>${contactData.message}</p>
            </div>
          </div>
        `
            };
        } else {
            return {
                subject: `New Website Message - ${contactData.subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">New Website Message</h2>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${contactData.message}</p>
            </div>
          </div>
        `
            };
        }
    },

    contactAutoReply: (contactData, language = 'he') => {
        const isHebrew = language === 'he';

        if (isHebrew) {
            return {
                subject: `תודה על פנייתך - ${contactData.subject}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${contactData.name},</h2>
            <p>תודה רבה על פנייתך בנושא "${contactData.subject}".</p>
            <p>קיבלנו את ההודעה שלך ונחזור אליך בהקדם האפשרי.</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Thank you for your message - ${contactData.subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${contactData.name},</h2>
            <p>Thank you for your message regarding "${contactData.subject}".</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    appointmentNotification: (appointment, service, language = 'he') => {
        const isHebrew = language === 'he';
        const date = new Date(appointment.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US');

        if (isHebrew) {
            return {
                subject: `תור חדש - ${appointment.clientName}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">תור חדש נקבע</h2>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>פרטי הלקוח:</h3>
              <p><strong>שם:</strong> ${appointment.clientName}</p>
              <p><strong>אימייל:</strong> ${appointment.clientEmail}</p>
              <p><strong>טלפון:</strong> ${appointment.clientPhone}</p>
              <h3>פרטי התור:</h3>
              <p><strong>שירות:</strong> ${service.name_he}</p>
              <p><strong>תאריך:</strong> ${date}</p>
              <p><strong>שעה:</strong> ${appointment.time}</p>
              <p><strong>משך הטיפול:</strong> ${service.duration} דקות</p>
              ${appointment.notes ? `<p><strong>הערות:</strong> ${appointment.notes}</p>` : ''}
            </div>
          </div>
        `
            };
        } else {
            return {
                subject: `New Appointment - ${appointment.clientName}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">New Appointment Booked</h2>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Client Details:</h3>
              <p><strong>Name:</strong> ${appointment.clientName}</p>
              <p><strong>Email:</strong> ${appointment.clientEmail}</p>
              <p><strong>Phone:</strong> ${appointment.clientPhone}</p>
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${service.name_en}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Duration:</strong> ${service.duration} minutes</p>
              ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
            </div>
          </div>
        `
            };
        }
    },

    appointmentUpdate: (appointment, service, language = 'he') => {
        const isHebrew = language === 'he';
        const date = new Date(appointment.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US');

        if (isHebrew) {
            return {
                subject: `עדכון תור - ${service.name_he}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${appointment.clientName},</h2>
            <p>התור שלך עודכן בהצלחה.</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>פרטי התור המעודכנים:</h3>
              <p><strong>שירות:</strong> ${service.name_he}</p>
              <p><strong>תאריך:</strong> ${date}</p>
              <p><strong>שעה:</strong> ${appointment.time}</p>
              <p><strong>משך הטיפול:</strong> ${service.duration} דקות</p>
            </div>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Appointment Updated - ${service.name_en}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${appointment.clientName},</h2>
            <p>Your appointment has been updated successfully.</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Updated Appointment Details:</h3>
              <p><strong>Service:</strong> ${service.name_en}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Duration:</strong> ${service.duration} minutes</p>
            </div>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    appointmentConfirmed: (appointment, service, language = 'he') => {
        const isHebrew = language === 'he';
        const date = new Date(appointment.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US');

        if (isHebrew) {
            return {
                subject: `אישור סופי לתור - ${service.name_he}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${appointment.clientName},</h2>
            <p>התור שלך אושר סופית!</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>פרטי התור:</h3>
              <p><strong>שירות:</strong> ${service.name_he}</p>
              <p><strong>תאריך:</strong> ${date}</p>
              <p><strong>שעה:</strong> ${appointment.time}</p>
              <p><strong>משך הטיפול:</strong> ${service.duration} דקות</p>
            </div>
            <p>נשמח לראותך בקליניקה!</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: `Final Appointment Confirmation - ${service.name_en}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${appointment.clientName},</h2>
            <p>Your appointment has been confirmed!</p>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${service.name_en}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Duration:</strong> ${service.duration} minutes</p>
            </div>
            <p>We look forward to seeing you at the clinic!</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    },

    healthDeclarationNotification: (declaration, language = 'he') => {
        const isHebrew = language === 'he';

        if (isHebrew) {
            return {
                subject: `הצהרת בריאות חדשה - ${declaration.clientName}`,
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">הצהרת בריאות חדשה התקבלה</h2>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>פרטי הלקוח:</h3>
              <p><strong>שם:</strong> ${declaration.clientName}</p>
              <p><strong>אימייל:</strong> ${declaration.clientEmail}</p>
              <p><strong>טלפון:</strong> ${declaration.clientPhone}</p>
              <p><strong>תאריך שליחה:</strong> ${new Date(declaration.createdAt).toLocaleDateString('he-IL')}</p>
            </div>
            <p>נא לבדוק את ההצהרה במערכת הניהול.</p>
          </div>
        `
            };
        } else {
            return {
                subject: `New Health Declaration - ${declaration.clientName}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">New Health Declaration Received</h2>
            <div style="background-color: #FAF5F3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Client Details:</h3>
              <p><strong>Name:</strong> ${declaration.clientName}</p>
              <p><strong>Email:</strong> ${declaration.clientEmail}</p>
              <p><strong>Phone:</strong> ${declaration.clientPhone}</p>
              <p><strong>Submission Date:</strong> ${new Date(declaration.createdAt).toLocaleDateString('en-US')}</p>
            </div>
            <p>Please review the declaration in the admin panel.</p>
          </div>
        `
            };
        }
    },

    passwordChanged: (user, language = 'he') => {
        const isHebrew = language === 'he';

        if (isHebrew) {
            return {
                subject: 'הסיסמה שונתה בהצלחה',
                html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">שלום ${user.name},</h2>
            <p>הסיסמה שלך שונתה בהצלחה.</p>
            <p>אם לא ביצעת את השינוי, אנא צרי קשר איתנו מיד.</p>
            <p>בברכה,<br>ליאה גניש</p>
          </div>
        `
            };
        } else {
            return {
                subject: 'Password Changed Successfully',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4B5B0;">Hello ${user.name},</h2>
            <p>Your password has been changed successfully.</p>
            <p>If you did not make this change, please contact us immediately.</p>
            <p>Best regards,<br>Leah Genish</p>
          </div>
        `
            };
        }
    }
};

// Send email function
export const sendEmail = async (to, template, language = 'he') => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: template.subject,
            html: template.html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send email to admin
export const sendAdminNotification = async (template, language = 'he') => {
    return await sendEmail(process.env.EMAIL_USER, template, language);
};
