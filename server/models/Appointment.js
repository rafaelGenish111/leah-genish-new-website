import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        maxlength: [100, 'Client name cannot exceed 100 characters']
    },
    clientEmail: {
        type: String,
        required: [true, 'Client email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    clientPhone: {
        type: String,
        required: [true, 'Client phone is required'],
        trim: true,
        match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
    },
    serviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Service type is required']
    },
    date: {
        type: Date,
        required: [true, 'Appointment date is required'],
        validate: {
            validator: function (date) {
                return date > new Date();
            },
            message: 'Appointment date must be in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Appointment time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    duration: {
        type: Number,
        default: 60,
        min: [15, 'Duration must be at least 15 minutes']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'cancelled', 'completed'],
            message: 'Status must be one of: pending, confirmed, cancelled, completed'
        },
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    arrived: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create compound index for date and time queries
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ status: 1, date: 1 });

// Generate confirmation token before saving
appointmentSchema.pre('save', function (next) {
    if (this.isNew && !this.confirmationToken) {
        this.confirmationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    next();
});

export default mongoose.model('Appointment', appointmentSchema);
